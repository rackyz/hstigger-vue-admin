import axiosServer from "../libs/axios2"

const state = {
    list: []

}

const TYPE_ARTICLE_NOTICE = 10

const getters = {
    notices(state){
        return state.list.filter(v => v.type_id == TYPE_ARTICLE_NOTICE)
    }
}

const actions = {
    List({
        commit
    }) {
        console.log("LIST:")
        return new Promise((resolve, reject) => {
            
            return axiosServer.get('articles?type=61&page=1').then(res => {
                let data = res.data.data
                commit('List', data)
                resolve(data)
            }).catch(reject)
        })
    },
    Patch({
        commit
    }, item) {
        return new Promise((resolve, reject) => {
            if (item.id) {
                return axiosServer.patch('articles/' + item.id, item).then(res => {
                    let udpateInfo = res.data.data
                    if (udpateInfo)
                        Object.assign(item, udpateInfo)
                    commit('Patch', item)
                    resolve(item)
                }).catch(reject)
            } else {
                return axiosServer.post('articles', item).then(res => {
                    let udpateInfo = res.data.data
                    Object.assign(item, udpateInfo)
                    commit('Patch', item)
                    resolve(item)
                }).catch(reject)
            }
        })
    },
    Delete({
        commit
    }, ids) {
        let idlist = ids.join(',')
        return new Promise((resolve, reject) => {
            return axiosServer.delete('types/' + idlist).then(res => {
                commit('localDelete', ids)
                resolve(ids)
            }).catch(reject)
        })
    }
}

const mutations = {
    List(state,list){
        state.list = list
    },
    Patch(state,item){
        let index = state.list.findIndex(v=>v.id == item.id)
        if(index != -1)
            state.list.splice(index,1,Object.assign(state.list[index],item))
        else
            state.list.push(item)
    },
    Delete(state,ids = []){
        ids.forEach(v=>{
            let index = state.list.findIndex(a=>a.id == v)
            if(index != -1)
                state.list.splice(index,1)
        })
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
