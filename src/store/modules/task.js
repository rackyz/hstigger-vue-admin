
import axiosServer from '../libs/axios'
import moment from 'moment'
const state = {
    list:[
       
    ],
    templist: []
}


const getters = {
    list:state=>{
        return state.list
    },
    listByProject:state=>id=>{
        return state.list.filter(v=>v.project.includes(id))
    },
    listByCategory:state=>id=>{
        return state.list.filter(v => v.type_id == id)
    },
    listByUser:state=>id=>{
        return state.list.filter(v=>v.participants && v.participants.find(v=>v.id == id))
    },
    listByProjectAndCategory:state=>(project,cat)=>{
        return state.list.filter(v => v.project.includes(project) && v.type_id == cat)
    },


    listTemp:state=>{
        return state.templist
    },
    listTempByCategory: state => id => {
        return state.templist.filter(v => v.type_id == id)
    }
}

// formatter
// 0 - 未开始
// 1 - 进行中
// 2 - 已超期
// 3 - 已完成
// 4 - 超期完成
const ProcessData = (item)=>{
    try{
        let state = 0
        if(item.startTime){
            state = 1
            if(item.endTime){
                state = 3
                if(item.deadline && moment.isAfter(item.deadline)){
                    state = 4
                }
            }else{
                if (item.deadline && moment().isAfter(item.deadline)) {
                    state = 2
                }
            }
        }
        item.state = state

        if(item.data){
            item.data = JSON.parse(item.data)

        }

        if(item.config){
            item.data = JSON.parse(item.config)
        }
    }catch(e){
        item.error = 1
    }
}

const actions = {
    post:({commit},items)=>{
         return new Promise((resolve, reject) => {
          return axiosServer.post('tasks?q=list', items).then(res => {
                items.forEach((v,i,a)=>Object.assign(a[i],res.data.data[i]))
                commit('post',items)
              resolve()
          })
        })
    },
    list:({commit})=>{
        return new Promise((resolve,reject)=>{
            Promise.all([axiosServer.get('tasks'), axiosServer.get('tasktemps')]).then(([res1,res2])=>{
                commit('saveList', res1.data.data)
                commit('saveTempList', res2.data.data)
                resolve()
            }).catch(e=>{
                reject(e)
            })
           
        })
    },
    patchTemp:({commit},item)=>{
          return new Promise((resolve, reject) => {
              if (item.id) {
                  // patch
                  return axiosServer.patch('tasktemps/' + item.id, item).then(res => {
                      let task = {
                          ...item,
                          ...res.data.data
                      }
                      commit('patchTemp', task)
                      resolve(task)
                  })
              } else {
                  return axiosServer.post('tasktemps', item).then(res => {
                      let task = {
                          ...item,
                          ...res.data.data
                      }
                      commit('addTemp', task)
                      resolve(task)
                  })
              }

          })
    },
    delTemp:({commit},id)=>{
          if (!id)
              return
          return new Promise((resolve, reject) => {
              return axiosServer.del('tasktemps/' + id).then(res => {
                  commit('delTemp', id)
                  resolve()
              })

          })
    },

    patch:({commit},item)=>{
        return new Promise((resolve,reject)=>{
            if (item.id) {
                // patch
                return axiosServer.patch('tasks/' + item.id, item).then(res => {
                    let task = {...item,...res.data.data}
                    commit('patch',task)
                    resolve(task)
                })
            } else {
               return axiosServer.post('tasks', item).then(res => {
                   let task = {
                       ...item,
                       ...res.data.data
                   }
                    commit('add',task)
                    resolve(task)
               })
            }

        })
    },
    del:({commit},id)=>{
        if(!id)
            return
        return new Promise((resolve,reject)=>{
            return axiosServer.delete('tasks/'+id).then(res=>{
                 commit('del', id)
                 resolve()
            })
           
        })
    }
}

const mutations = {
    post:(state,list)=>{
         list.forEach(v => {
             ProcessData(v)
         })
         state.list = state.list.concat(list)
    },
    saveList:(state,list)=>{
        list.forEach(v=>{
            ProcessData(v)
        })
        state.list = list
    },
    saveTempList:(state,list)=>{
        state.templist = list
    },
    add:(state,item)=>{
        item.state = 0
        ProcessData(item)
        state.list.push(item)
    },
    patch:(state,item)=>{
      
        if(item.id){
           let index = state.list.findIndex(v=>v.id == item.id)
           if(index != -1){
                Object.assign(state.list[index],item)
                ProcessData(state.list[index])
            }
        }
    },
    del:(state,id)=>{
         let index = state.list.findIndex(v => v.id == id)
         if(index != -1)
            state.list.splice(index,1)
    },
     addTemp: (state, item) => {
             state.templist.push(item)
         },
         patchTemp: (state, item) => {
             if (item.id) {
                 let index = state.templist.findIndex(v => v.id == item.id)
                 if (index != -1)
                     Object.assign(state.templist[index], item)
             }
         },
         delTemp: (state, id) => {
             let index = state.templist.findIndex(v => v.id == id)
             if (index != -1)
                 state.templist.splice(index, 1)
         }

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}