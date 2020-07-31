import axiosServer from "./axios";

const CreateStore = (WEB_SERVICE_KEY, extendedStore) => {
    let state = {
        list: []
    }

    let getters = {
        list: (state) => {
            return state.list
        },
        get: (state) => (id) => {
            return state.list.find(v => v.id == id)
        }
    }

    let actions = {
        init: ({
            commit
        }) => {
            return new Promise((resolve, reject) => {
                axiosServer.get(WEB_SERVICE_KEY).then(res => {
                    commit('init', res.data.data)
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
        },
        update: ({
            commit,
            state
        }, dataItem) => {
            return new Promise((resolve, reject) => {
                axiosServer.patch(WEB_SERVICE_KEY + '/' + dataItem.id, dataItem).then(() => {
                    commit('update', dataItem)
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
        },
        add: ({
            commit
        }, dataItem) => {
            // promise=>
            //    local:
            //        commit('createDep',depData)
            return new Promise((resolve, reject) => {
                axiosServer.post(WEB_SERVICE_KEY, dataItem).then(res => {
                    dataItem.id = res.data.data
                    commit('add', dataItem)
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })

        },
        del: ({
            commit
        }, dataId) => {
            return new Promise((resolve, reject) => {
                axiosServer.delete(WEB_SERVICE_KEY + '/' + dataId).then(() => {
                    commit('del', dataId)
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
        }
    }

    let mutations = {
        init: (state, dataList) => {
            state.list = dataList
        },
        add: (state, dataItem) => {
            state.list.push(dataItem)
        },
        del: (state, dataId) => {
            let index = state.list.findIndex(v => v.id == dataId)
            if(index != -1)
                state.list.splice(index,1)
        },
        updateDep: (state, depData) => {
            Tree.UpdateTreeNode(state.treeObject, depData.id, depData)
            state.treeObject.v++
        }
    }

    let store = {
        namespaced: true,
        state,
        getters,
        actions,
        mutations
    }

    if(typeof extendStore == 'Object'){
        const mods = ['state','getters','actions','mutations']
        mods.forEach(v=>{
            if (extendStore[v])
                Object.assign(store[v], extendedStore[v])
        })
        
    }

    return store
}




export default CreateStore