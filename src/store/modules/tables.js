import axiosServer from '../libs/axios'
import Vue from 'vue'

/**
 * STATE:
 *      use [key + state] mode
 *      list : table list items cached
 *      map  : item list
 *      editingID : object editing
 */
const state = {
}

const getters = {
    getList:(state)=>(key)=>{
         return state[key + "list"]
    },
    getFilterVisibility: (state) => (key) => {
         return state[key + "isFiltering"]
    },
    getEditorVisibility: (state) => (key) => {
        return state[key + "isEditorShow"]
    },
    getEditingItem: (state) => (key) => {
           return state[key + "editingItem"]
    },
    getLoading:(state)=>(key,id = "")=>{
        return state[key+id+"isLoading"]
    },
    getFilter:(state)=>(key)=>{
        return state[key+"filter"]
    },
    getItem:(state)=>(key,id,restful={})=>{
        if (state[key + "list"]){
            let idkey = restful ? (restful.idkey || "id") : "id"
            return state[key+"list"].find(v=>v[idkey]==id)
        }

       
    }

}


const actions = {
    list: ({
        commit,
        state
    },{key,restful,localItems}) => {
        return new Promise((resolve, reject) => {
            let service = restful?(restful.key+"?t="+restful.stype) : key
            if (state.cachedTime) {
                service += `?cachedtime=${state.cachedTime}`
            }
            axiosServer.get(service).then(res => {
                if (res.data && res.data.data != "cached")
                    commit('list', {
                        key,
                        list: res.data.data,
                        localItems
                    })
                else
                    console.debug("Cached no update")
                resolve(state[key+"list"])
            }).catch(e => {
                reject(e)
            })
        })
    },
    get:({commit,state},{key,restful,id})=>{
         return new Promise((resolve, reject) => {
             let service = restful ? (restful.key + "/" + id) : (key +"/" + id)
             axiosServer.get(service).then(res => {
                
                commit('openEditor', {
                    key,
                    list: res.data.data
                })
              
                 resolve(state[key + "list"])
             }).catch(e => {
                 reject(e)
             })
         })
    },
    patch: ({
        commit
    },{key,item = {},restful}) => {
        let service = restful?restful.key:key
        let idkey = restful?(restful.idkey || "id"):"id"
        return new Promise((resolve, reject) => {
            let updateItem = Object.assign({}, item)
           
            delete updateItem[idkey]
            if (!item[idkey]) {
                 if (restful)
                     updateItem.stype = restful.stype
                axiosServer.post(service, updateItem).then(res => {
                    let sign = res.data.data
                    item[idkey] = sign[idkey]
                     item.inputor = sign.inputor
                     item.inputTime = sign.inputTime
                     item.updator = sign.updator
                     item.updateTime = sign.updateTime
                     console.log("post:",item)
                    commit("patch", {
                        key,
                        item,
                        restful
                    })
                    resolve(item)
                }).catch(e => {
                    reject(e)
                })

            } else {
                axiosServer.patch(service + '/' + item.id, updateItem).then(res => {
                    let sign = res.data.data
                    item.updator = sign.updator
                    item.updateTime = sign.updateTime
                    console.log("patch:", item)
                    commit("patch", {
                        key,
                        item,
                        restful
                    })
                    resolve(item)
                }).catch(e => {
                    reject(e)
                })
            }
        })
    },
    del: ({
        commit
    },{key,id,restful}) => {
        let service = restful ? restful.key : key
        return new Promise((resolve, reject) => {
            axiosServer.delete(service + '/' + id).then(res => {
                commit("del", {key,id})
                resolve()
            }).catch(e => {
                reject(e)
            })
        })
    }
}

const mutations = {
    list: (state, {
            key,
            list,
            localItems
        }) => {
        if (localItems){
            let items = []
            localItems.forEach(v=>{
                let item = list.find(t=>t.name == v.name)
                if (item) {
                    Object.assign(v, item)
                    v.local = item.local = true
                }
                if(!v.id){
                    v.id = v.code
                }
                items.push(v)
            })

            list.forEach(v=>{
                if(!v.local)
                    items.push(v)
            })

            items.sort((a,b)=>(a.id>b.id?1:-1))
            Vue.set(state, key + "list", items || [])
            console.log("LOCAL ITEMS:",items)
        }else
            Vue.set(state,key+"list",list || [])
    },
    patch:(state,{key,item,restful})=>{
        
        let idkey = restful ? (restful.idkey || "id") : "id"
        
        if (!state[key + 'list'])
            return

        let index = state[key+'list'].findIndex(v=>v[idkey] == item[idkey])
        if(index != -1){
             state[key+'list'][index] = item
        }else{
             state[key + 'list'].push(item)
        }
    },
    del: (state, {
        key,
        id
    }) => {
        let index = state[key + "list"].findIndex(v => v.id == id)
        if (index != -1)
            state[key + "list"].splice(index, 1)
    },
    switchFilter: (state,key) => {
        Vue.set(state,key+"isFiltering",!state[key+"isFiltering"])
    },
    openEditor: (state,{key, item}) => {
        console.log('[TF-store]openEditor:',item)
        Vue.set(state, key + "editingItem", item || {})
        Vue.set(state, key + "isEditorShow", true)
    },
    setLoading:(state,{key,value})=>{
        Vue.set(state,key+"isLoading",value)
    },
    submitEditor:(state,key)=>{
         Vue.set(state, key + "isEditorShow", false)
         let itemIndex = state[key + "list"].findIndex(v => v.id == item.id)
         if (itemIndex != -1) {
             Object.assign(state[key + "list"][itemIndex], item)
         } else {
             state[key + "list"] = [item].concat(state[key + "list"])
         }
         Vue.set(state, key + "editingItem", {})
    },
    cancelEditor: (state,{key}) => {
         Vue.set(state, key + "isEditorShow", false)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}