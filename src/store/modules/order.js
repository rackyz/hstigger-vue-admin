// Module : Kernel
// Desc   : kernel services for system

import axiosServer from '../libs/axios';
const state = {
    map:{}
}


const getters = {
    get:(state)=>(id)=>{
        return state[id] || {}
    },
    getByProjectId:(state)=>(project_id)=>{
        return 
    },
    getOrderColor:(state)=>(s)=> {
        const stypesColor = {
            requirement: 'darkblue',
            bugreport: 'darkred'
        }
        return stypesColor[s] || '#333'
    },
    getOrderType:state=>(s)=> {
        const stypes = {
            common:"综合任务",
            project:"项目任务",
            requirement: "开发需求",
            bugreport: "错误报告"
        }
        return (stypes[s] || '其他')
    },
    getOrderStateText:state=>(s=0)=>{
        const states=["待处理","进行中","暂停中","申请完成","已完成","申请中止","已中止"]
        return states[s]
    },
    getOrderStateColor:state=>(s)=>{
        const colors = ["#0f5bc7", "orange", "purple", "rgb(121, 177, 60)", "rgb(3, 74, 3)", "rgb(188, 3, 3)", "darkred"]
        return colors[s]
    }

}

const actions = {
   get: ({
           commit,
           dispatch
       }, id) => {
        return new Promise((resolve,reject)=>{
            axiosServer.get(`orders/${id}`).then(res=>{
                let item = res.data.data
                item.id = id
                commit("save",item)
                dispatch('getComments', id)
                resolve(item)
            }).catch(e=>{
                reject(e)
            })
        })
   },
   post:({
       commit
   },item)=>{
    return new Promise((resolve, reject) => {
        axiosServer.post(`orders`,item).then(res => {
            let itemReturn = res.data.data
            console.log('post:',item,itemReturn)
            Object.assign(item,itemReturn)
            commit("save", item)
            resolve(item)
        }).catch(e => {
            reject(e)
        })
    })
   },
   del:({
    commit
   },id)=>{
        return new Promise((resolve, reject) => {
            axiosServer.delete(`orders`, id).then(res => {
                commit("del", id)
                resolve(item)
            }).catch(e => {
                reject(e)
            })
        })
   },
   getComments:({commit},id)=>{
     return new Promise((resolve, reject) => {
         axiosServer.get(`orders/${id}/comments`).then(res => {
             let item = res.data.data
             item.reverse()
             commit("saveComments", {id,cmts:item})
             resolve()
         }).catch(e => {
             reject(e)
         })
     })
   },
   patchComment: ({
           dispatch,commit
       }, cmt) => {
       return new Promise((resolve,reject)=>{
           axiosServer.post(`orders/${cmt.order_id}/comments`,cmt).then(res=>{
               let item = res.data.data
               Object.assign(cmt,item)
               dispatch("getComments", cmt.order_id)
               if(item.state)
                commit('saveItemState', {
                    id: cmt.order_id,
                    state: cmt.state
                })
               resolve(cmt)
           })
       })
   },
   deleteComment:({
       dispatch
   },{order_id,id})=>{
     return new Promise((resolve, reject) => {
         axiosServer.delete(`orders/${order_id}/comments/${id}`).then(res => {
             dispatch("getComments", order_id)
             resolve()
         })
     })
   }
}

const mutations = {
    save(state,item){
        console.log("save:",item.id,item)
        Vue.set(state,item.id,item)
    },
    del(state,item){
        delete state[item.id]
    },
    saveItemState(state,item){
        state[item.id].state = item.state
        Object.assign(item, state[item.id])
        Vue.set(state, item.id, item)
    },
    saveComments(state,{id,cmts}){
        console.log("save comemnts:",id,cmts)
        cmts = cmts.map(v=>{
            if(v.images && v.images.includes(',')){
                v.images = v.images.split(';').map(item=>{
                    let [name,url] = item.split(',')
                    return {name,url}
                })
            }

            if (v.files && v.files.includes(',')) {
                v.files = v.files.split(';').map(item => {
                    let [name, url] = item.split(',')
                    return {
                        name,
                        url
                    }
                })
            }

            return v
        })
        Vue.set(state[id],'comments',cmts)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}