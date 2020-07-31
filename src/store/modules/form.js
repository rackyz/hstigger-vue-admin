import axiosServer from '../libs/axios'


const state = {
  
}

const getters = {
  getFormById:(state)=>(id)=>{
    let form = state[id]
    return form
  }
    
}


const actions = {
    get: ({commit},id) => {
        return new Promise((resolve, reject) => {
            let service = `forms/${id}`
            axiosServer.get(service).then(res => {
                commit('saveItem',res.data.data)
                resolve(res.data.data)
            }).catch(e=>{
                reject(e)
            })
        })
    }
}

const mutations = {
    saveItem(state,item){
        item.option = item.option || ""
        Vue.set(state,item.id,item)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}