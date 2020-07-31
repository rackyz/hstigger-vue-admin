import axiosServer from '../libs/axios'
const state = {
   members:[],
   organizeTree : {
       name: '宁波高专建设监理有限公司',
       image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group.png",
       children: [{

               name: '董事会',
               image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
           }, {

               name: '顾问委员会',
               image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
           }, {

               name: '职能部门',
               image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png",
               children: [{
                   name: 'children2',
                   image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
               }, {
                   name: 'children2',
                   image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
               }, {
                   name: 'children2',
                   image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
               }, {
                   name: 'children2',
                   image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
               }, {
                   name: 'children2',
                   image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
               }, {
                   name: 'children2',
                   image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
               }]
           }, {

               name: '事业部',
               image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
           }, {

               name: 'children1',
               image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group.png",
               children: [{
                       name: 'children2',
                       image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png",
                       mate: {
                           name: 'mate',
                           image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
                       },
                       children: [{
                               name: 'grandchild',
                               image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
                           },
                           {
                               name: 'grandchild2',
                               image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
                           },
                           {
                               name: 'grandchild3',
                               image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group2.png"
                           }
                       ]
                   },
                   {
                       name: 'children3',
                       image_url: "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/system/group.png"
                   }
               ]
           }

       ]
   }
   
}


const getters = {
    getDepartments:state=>{
        return [state.organizeTree]
    },
    deps:state=>{
        return state.deps
    },
    getMembersByDepId:(state,depId)=>{
        return state.members.filter(v=>v.dep_id == depId)
    },
    getMembers:state=>{
        return state.members
    }
}

const actions = {
    init:({commit})=>{
        return new Promise((resolve,reject)=>{
            axiosServer.get('members').then(res=>{
                let members = res.data.data
                commit('init',members)
                resolve()
            }).catch(e=>{
                reject(e)
            })
        })
    },
    add:({commit},data)=>{
       return new Promise((resolve, reject) => {
           axiosServer.post('members',data).then(res => {
               data.id = res.data.data
               commit('add', data)
               resolve()
           }).catch(e => {
               reject(e)
           })
       })
    },
    del:({commit},dataId)=>{
        return new Promise((resolve,reject)=>{
            axiosServer.delete('members/'+dataId).then(res=>{
                commit('del',dataId)
                resolve()
            }).catch(e=>{
                reject(e)
            })
        })
    },
    update:({commit},data)=>{
          return new Promise((resolve, reject) => {
              axiosServer.patch('members/' + data.id,data).then(() => {
                  commit('update', data)
                  resolve()
              }).catch(e => {
                  reject(e)
              })
          })
    }
}

const mutations = {
    init:(state,data)=>{
        state.members = data
    },
    add:(state,data)=>{
        state.members.push(data)
    },
    del:(state,dataId)=>{
        state.members.splice(state.members.findIndex(v=>v.id == dataId))
    },
    update:(state,data)=>{
        Object.assign(state.members[data.id],data)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}