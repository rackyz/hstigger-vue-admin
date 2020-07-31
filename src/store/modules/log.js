import axiosServer from '../libs/axios2'

const state = {
    list: []
}

const getters = {
    list: (state) => {
        return state.list
    },
    get: (state) => (id) => {
        return state.list.find(v => v.id == id)
    }
}


const actions = {
    list: ({
        commit
    }) => {
        return new Promise((resolve, reject) => {
            let service = `logs`
            axiosServer.get(service).then(res => {
                let list = res.data.data
                commit('saveList', list)
                resolve(list)
            }).catch(e => {
                reject(e)
            })
        })
    },
    get:({
        commit
    },id)=>{
        return new Promise((resolve, reject) => {
            let service = `logs/${id}`
            axiosServer.get(service).then(res=>{
                let data = res.data.data
                commit('saveItem',{id,data})
                resolve(data)
            }).catch(reject)
        })
    }
}

const mutations = {
    saveList(state, list) {
        list.sort((a,b)=>a>b?1:-1)
        list.forEach(v=>{
            if(['user.log','req.log','application.log'].includes(v.name)){
                v.parent_id = 1
            }else{
                v.parent_id = 2
            }
            v.file = v.name
            if(v.name){
                let matches = v.name.match(/(.*)\.log-(.*)\.log/)
                if(matches){
                    let [, type, date] = matches
                    v.name = type + '.' + date
                }
                
            }
        })

        let count = list.filter(v => v.parent_id == 2).length
        list =  [{
            id: 1,
            name: '当前日志'
        }, {
            id: 2,
            name: `历史日志(${count})`,
            fold: true
        }].concat(list)

        Vue.set(state, 'list', list)
    },
    saveItem(state, item) {
        
        let index = state.list.findIndex(v => v.file == item.id)
        if (index != -1){
            state.list.splice(index, 1, Object.assign({},state.list[index],{data:item.data}))
            console.log(state.list[index])
        }
        
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}