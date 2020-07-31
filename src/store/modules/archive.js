import axiosServer from '../libs/axios'
import moment from 'moment'


const state = {
  list:[]
}

const getters = {
    list:(state)=>{
        return state.list
    },
    get:(state)=>(id)=>{
        return state.list.find(v=>v.id == id)
    }
}


const actions = {
    list:({commit})=>{
         return new Promise((resolve, reject) => {
             let service = `archives`
             axiosServer.get(service).then(res => {
                 let list = res.data.data
                 list.sort((a,b)=>moment(a.inputTime).isBefore(moment(b.inputTime))?1:-1)
                 commit('saveList',list)
                 resolve(res.data.data)
             }).catch(e => {
                 reject(e)
             })
         })
    },
    patch: ({
            commit
        }, item) => {
        return new Promise((resolve, reject) => {
            let service = `archives`
            if(undefined == item.id)
                axiosServer.post(service,item).then(res => {
                    let info = res.data.data
                    Object.assign(item, info)
                    commit('saveItem',item)
                    resolve(res.data.data)
                }).catch(e=>{
                    reject(e)
                })
            else
                axiosServer.patch(service+'/'+item.id, item).then(res => {
                    let info = res.data.data
                    Object.assign(item, info)
                    commit('saveItem', item)
                    resolve(res.data.data)
                }).catch(e => {
                    reject(e)
                })
        })
    },
    del:({commit},id)=>{
        return new Promise((resolve, reject) => {
            let service = `archives/`+id
            axiosServer.delete(service).then(res => {
                commit('delItem', id)
                resolve(res.data.data)
            }).catch(e => {
                reject(e)
            })
        })
    }
}

const mutations = {
    saveList(state,list){
        Vue.set(state,'list',list)
    },
    saveItem(state,item){
        let index = state.list.findIndex(v=>v.id == item.id)
        if(index == -1)
            state.list.push(item)
        else
            state.list.splice(index,1,Object.assign(state.list[index],item))
    },
    delItem(state,id){
       let index = state.list.findIndex(v => v.id == id)
       if(index != -1)
        state.list.splice(index,1)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}