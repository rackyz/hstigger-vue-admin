import Tree from '../libs/tree'
import axiosServer from '../libs/axios'
const state = {
    ready:false,
    changed:false,
    treeObject:{
        dataNodeMap:{},
        treeNodeMap:{},
        tree:[],
        v:0
    }
}


const getters = {
    getTree: state=>{
        return state.treeObject
    },
    getDeps: state => {
        return state.treeObject.tree
    },
    getPathById: state => id => {
        let pathIds = Tree.GetPath(state.treeObject, id)
        pathIds.reverse()
        console.log('paths:',pathIds)
        return pathIds.map(v => state.treeObject.dataNodeMap[v])
    },
    getDepById:state=>id=>{
        return state.treeObject.dataNodeMap[id]
    },
    getDepCount:state=>{
        return Object.keys(state.treeObject.treeNodeMap).length
    }
}

const actions = {
    init:({commit})=>{
        return new Promise((resolve,reject)=>{
              axiosServer.get('deps').then(res => {
                commit('init',Tree.makeTree(res.data.data))
                resolve()
              }).catch(e => {
                  reject(e)
              })
        })
    },
    updateDep:({commit,state},depData)=>{
          return new Promise((resolve, reject) => {
             axiosServer.patch('deps/'+depData.id,depData).then(res=>{
                  commit('updateDep', depData)
                  resolve()
             }).catch(e=>{
                 reject(e)
             })
          })
    },
    addDep:({commit,state},depData)=>{
        // promise=>
        //    local:
        //        commit('createDep',depData)
        return new Promise((resolve,reject)=>{
              axiosServer.post('deps', depData).then(res => {
                  depData.id = res.data.data
                  commit('addDep', depData)
                  resolve()
              }).catch(e=>{
                  reject(e)
              })
        })
      
    },
    delDep:({commit},depId)=>{
         return new Promise((resolve, reject) => {
             axiosServer.delete('deps/'+depId).then(res=>{
                 commit('delDep', depId)
                 resolve()
             }).catch(e=>{
                reject(e)
             })
         })
    }
}

const mutations = {
    init: (state, treeObject) => {
         state.treeObject = treeObject
    },
    fold:(state,depId,foldState = true)=>{
        state.treeNodeMap[depId].fold = foldState
    },
    addDep:(state,depData)=>{
        console.log('[mutations]addDep:',depData)
        Tree.AddTreeNode(state.treeObject, depData.parent_id, depData)
        state.treeObject.v++
    },
    delDep:(state,depId)=>{
        Tree.DeleteTreeNode(state.treeObject, depId)
        state.treeObject.v++
    },
    updateDep:(state,depData)=>{
        Tree.UpdateTreeNode(state.treeObject, depData.id, depData)
        state.treeObject.v++
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}