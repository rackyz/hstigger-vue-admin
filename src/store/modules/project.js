import axiosServer from '../libs/axios'
const cosService = 'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/files/'
const state = {
    list:[]
}

const getters = {
    list(state){
        return state.list
    },
    listByUser:(state)=>(id,positionId)=>{
        let mylist = state.list

        return mylist
    },
    get:(state)=>(id)=>{
        return state[id]
    },
    getByIds:(state)=>(ids=[])=>{
        console.log('getBYIDS:',ids)
        return state.list.filter(v=>ids.includes(v.id))
    },
    getStateText:(state)=>(s=0)=>{
        const stateTexts = ['组建中','进行中','已竣工','已归档']
        return stateTexts[s]
    },
    getStateColor:(state)=>(s=0)=>{
        const colors = ['#00000077', '#ffa70475', '#034a03b3', '#33556696']
        return colors[s]
    }
}

const actions = {
    get:({commit},id)=>{
        return new Promise((resolve,reject)=>{
            axiosServer.get(`projects/${id}?q=full`).then(res=>{
                let item = res.data.data

                item.positions = [{
                    id: 1,
                    name: '项目经理',
                    role: "charger",
                    type: "system",
                    user: 'UID00000001',

                }, {
                    id: 2,
                    name: '前期管理',
                    type: "system",
                    user: 'UID00000001',

                }, {
                    id: 3,
                    name: '技术管理',
                    type: "system",
                    user: 'UID00000001',

                }, {
                    id: 4,
                    name: '设计管理',
                    type: "system",
                    user: 'UID00000001',

                }, {
                    id: 5,
                    name: '合约管理',
                    type: "system",
                    user: 'UID00000001',

                }, {
                    id: 6,
                    name: '招投标管理',
                    type: "system",
                    user: 'UID00000001',
                    task: 'TASK'

                }, {
                    id: 7,
                    name: '机电管理',
                    type: "system",
                    user: 'UID00000001',
                    task: 'TASK'

                }, {
                    id: 8,
                    name: '造价管理',
                    type: "system",
                    user: 'UID00000001',
                    task: 'TASK'

                }],
                commit('save',item)
                resolve(item)
            })
        })
    },
    getList({commit}){
        return new Promise((resolve,reject)=>{
            axiosServer.get("projects").then(res=>{
                commit("saveList",res.data.data)
                resolve(res.data.data)
            })
        })
    },
    create({commit,dispatch},projectItem){
        return new Promise((resolve,reject)=>{
            axiosServer.post("projects",projectItem).then(res=>{
                let id = res.data.data
                projectItem.id = id
                dispatch('user/addConcernProject', [id], {
                    root: true
                })
                commit("save", projectItem)
                resolve(id)
            })
        })
    },
    patch({commit},projectItem){
        return new Promise((resolve, reject) => {
            axiosServer.patch("projects/"+projectItem.id, projectItem).then(res => {
                commit("save", projectItem)
                resolve()
            })
        })
    }
  
}

const mutations = {
    saveList(state,list){
        // preprocesser
        list.forEach(v=>{
            let item = v
            if (item.images) {
                item._images = item.images.split(';').map(v => v.split(',')).map(v =>
                    cosService + v[1]
                )
                if (item._images && item.images.length > 1)
                    item.avatar = item._images[0]
            }
        })
        state.list = list
    },
    save(state,item){
         if (item.images) {
             item._images = item.images.split(';').map(v => v.split(',')).map(v => 
                 cosService + v[1]
             )
             if (item._images && item.images.length > 1)
                 item.avatar = item._images[0]
         }
        let index = state.list.findIndex(v=>v.id == item.id)
        let fullItem = index != -1 ?Object.assign({}, state.list[index], item):item
        if(index != -1)
            Vue.set(state.list, index, fullItem)
        else
            state.list.push(fullItem)

        if(state[item.id])
            Vue.set(state, item.id, fullItem)
        else
            Vue.set(state, item.id, fullItem)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}