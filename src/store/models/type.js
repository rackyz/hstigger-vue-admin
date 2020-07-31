import axiosServer from "../libs/axios2"

const state = {
    types:[]
}

const getters = {
    getTypes:(state)=>key=>{
        let typeRoot = state.types.find(v=>v.key == key)
        if(typeRoot)
            return state.types.filter(v=>v.parent_id == typeRoot.id)
        else
            throw(`KEY=${key} 不存在`)
    },
    types(state){
        return state.types
    },
    keys(state){
        return state.types.filter(v=>v.key)
    }
}

const actions = {
    getData({commit}){
        return new Promise((resolve,reject)=>{
            return axiosServer.get('types').then(res=>{
                let data = res.data.data
                commit('getData',data)
                resolve(data)
            }).catch(reject)
        })
    },
    Patch({commit},item){
        return new Promise((resolve,reject)=>{
            if(item.id){
                  return axiosServer.patch('types/' + item.id, item).then(res => {
                      let udpateInfo = res.data.data
                      if (udpateInfo)
                          Object.assign(item, udpateInfo)
                      commit('localPatch', item)
                      resolve(item)
                  }).catch(reject)
            }else{
                 return axiosServer.post('types', item).then(res => {
                     let udpateInfo = res.data.data
                     Object.assign(item, udpateInfo)
                     commit('localPatch', item)
                     resolve(item)
                 }).catch(reject)
            }
        })
    },
    Delete({commit},ids){
        let idlist = ids.join(',')
        return new Promise((resolve,reject)=>{
            return axiosServer.delete('types/' + idlist).then(res => {
                commit('localDelete', ids)
                resolve(ids)
            }).catch(reject)
        })
    }
}

const mutations = {
    getData(state,data){
        data.forEach(v=>{
            v.count = 0
        })
        data.forEach(v=>{
            if(v.parent_id){
               let t = data.find(x=>x.id == v.parent_id)
               if(t)
                    t.count++
            }
        })
        state.types = data
    },
    localPatch(state,item){
       

        let index = state.types.findIndex(v=>v.id == item.id)
        if(index != -1){
            item = Object.assign({}, state.types[index], item)
            state.types.splice(index, 1, item)
        }
        else{
            state.types.splice(state.types.length - 1, 0, item)
            if (item && item.parent_id) {
                let index = state.types.findIndex(v => v.id == item.parent_id)
                if (index != -1) {
                    state.types[index].count++
                }
            }
        }
    },
    localDelete(state,ids){
        ids.forEach(id=>{
             let index = state.types.findIndex(v => v.id == id)
             if (index != -1)
                 state.types.splice(index, 1)
        })
       
    }
}


export default {
    namespaced:true,
    state,
    getters,
    actions,
    mutations
}

