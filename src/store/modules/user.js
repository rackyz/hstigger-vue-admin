import moment from 'moment'
import axiosServer from '../libs/axios2'

const state = {
   userinfo:{},
   profile:{},
   isLogin:false,

   auths:[],
   cosAuthed:true,
   cosAuthing:false,

   deps:[],
   roles:[]
}


const getters = {
    authedCOS: state => {
        return state.cosAuthed
    },
    authingCOS: state=>{
        return state.cosAuthing
    },
    userinfo:state=>{
        return state.userinfo || {}
    },
    auths:state=>{
        return state.authMap
    },
    isLogin:state=>{
        return state.isLogin
    },
    concerned_projects:state=>{
        return state.userinfo.concerned || []
    },
    isConcerned:state=>id=>{
        if(state.userinfo && state.userinfo.concerned)
            return state.userinfo.concerned.includes(id)
    },
    deps:state=>{
        return state.deps
    }
}


const actions = {
    

    authCOS:({commit})=>{
        return new Promise((resolve,reject)=>{
         axiosServer.get('sessions/coshttp').then(res => {
             commit('updateInfo',{coskey:res.data.data})
             resolve()
         }).catch(e=>{
             reject(e)
         })
         })
    },
    whoami:({commit,state})=>{
        let skey = state.skey 
        if (!skey){
            skey = localStorage.getItem("gy-token")
            axiosServer.defaults.headers.authentication = skey
        }
        return new Promise((resolve,reject)=>{
            if (state.isLogin && state.userinfo && state.userinfo.id) {
                resolve(state.userinfo)
            }else{
                axiosServer.get('sessions/current').then(res => {
                    let userinfo = res.data.data
                    commit('updateInfo', userinfo)
                    resolve(userinfo)
                    
                }).catch(e => {
                    console.error("[whoami]token is outof date")
                    commit('logout')
                })
            }
            
        })
    },
    login:({commit},{user,password,code})=>{
        return new Promise((resolve,reject)=>{
                axiosServer.post('sessions', {
                user,
                password,
                code
            }).then(res => {
                let loginInfo = res.data.data
                commit("login",loginInfo)
              
                resolve(loginInfo)
            }).catch(e=>{
                if(e.message == "Network Error")
                    reject("服务器连接失败,请联系管理员")
                reject(e)
            })
        })
    },
    forgetPassword:({
        
    },phone)=>{
        return new Promise((resolve,reject)=>{
             axiosServer.post("sessions/forget?phone="+phone).then(res => {
                 resolve()
             }).catch(e=>{
                 reject(e)
             })
        })
    },
    logout: ({
            commit
        }) => {
        commit('logout')
        },
    update:({commit},updatedUserinfo)=>{
        return new Promise((resolve,reject)=>{
            // axiosServer.patch(
            //     `users/self`,
            //     updatedUserinfo
            // ).then(res=>{
            //     commit('updateInfo', updatedUserinfo)
            //     resolve()
            // }).catch(e=>{
            //     reject(e)
            // })
            

        })
    },
    delDep: ({
        commit
    }, id) => {
        return new Promise((resolve, reject) => {
            return axiosServer.delete(`deps/` + id).then(res => {
                commit('delDep', id)
                resolve()
            }).catch(reject)
        })
    },
    getProfile:({commit},uid='self')=>{
        return new Promise((resolve,reject)=>{
            axiosServer.get(`users/${uid}?q=profile`).then(profile=>{
                commit('updateProfile', profile)
                resolve()
            }).catch(e=>{
                reject(e)
            })
        })
    },
    addConcernProject:({commit},project_ids)=>{
         return new Promise((resolve, reject) => {
             axiosServer.patch(`settings/add-concern-projects`,project_ids).then(profile => {
                 commit('AddConcernProjects',project_ids)
             }).catch(e => {
                 reject(e)
             })
         })
    },
    removeConcernProject:({commit},project_ids)=>{
        return new Promise((resolve, reject) => {
            axiosServer.patch(`settings/del-concern-projects`, project_ids).then(profile => {
                commit('DelConcernProjects', project_ids)
            }).catch(e => {
                reject(e)
            })
        })
    },
    resetConcernProject:({commit},project_ids)=>{
        return new Promise((resolve, reject) => {
            axiosServer.patch(`settings/reset-concern-projects`, project_ids).then(profile => {
                commit('ResetConcernProject', project_ids)
            }).catch(e => {
                reject(e)
            })
        })
    },
    queryDeps:({commit},()=>{
        return new Promise((resolve,reject)=>{
            axiosServer.get(`deps`).then(res=>{
                let items = res.data.data
                commit('saveDeps',items)
                resolve()
            }).catch(e=>{
                reject(e)
            })
        })
    }),
    patchDep:({commit},(item)=>{
        return new Promise((resovle,reject)=>{
            if(item.id)
                return axiosServer.patch(`deps/`+item.id,item).then(res=>{
                    commit('saveDep', item)
                    resolve()

                }).catch(reject)
            else{
                return axiosServer.post(`deps`,item).then(res=>{
                    let updateInfo = res.data.data
                    Object.assign(item,updateInfo)
                      commit('saveDep', item)
                    resolve()
                }).catch(reject)
            }
          
        })
    })
}

const mutations = {
    saveDep(state,item){
        let index = state.deps.findIndx(v=>v.id == item.id)
        if(index == -1){
            state.deps.push(item)
        }else{
            state.deps.splice(index,1,Object.assign({},state.deps[index],item))
        }
    },
    delDep(state,id){
         let index = state.deps.findIndx(v => v.id == id)
         if(index != -1)
            state.deps.splice(index, 1)
    },
    saveDeps(state,items){
        state.deps = items
    },
    AddConcernProjects:(state,ids = [])=>{
        state.userinfo.concerned = state.userinfo.concerned.concat(ids)
        let userinfo = Object.assign({},state.userinfo)
        state.userinfo = userinfo
        console.log('AddConcernProjects',ids, state.userinfo.concerned)
       
    },
    DelConcernProjects:(state,ids = [])=>{
        ids.forEach(v=>{
           let index = state.userinfo.concerned.findIndex(s=>s==v)
           if(index != -1)
                state.userinfo.concerned.splice(index,1)
        })
         let userinfo = Object.assign({}, state.userinfo)
         state.userinfo = userinfo
         console.log('DelConcernProjects', ids,state.userinfo.concerned)
    },
    ResetConcernProject:(state,ids = [])=>{
        state.userinfo.concerned = ids
    },
    updateProfile:(state,profile)=>{
        Object.assign(state.profile,profile)
    },
    updateInfo:(state,userinfo)=>{
         if (userinfo.role == "dev" || userinfo.role == "admin") {
             userinfo.admin = true
         }
         Object.assign(state.userinfo,userinfo)
         state.isLogin = true
    },
   login:(state,{userinfo,skey})=>{
       localStorage.setItem("gy-token", skey)
       axiosServer.defaults.headers['gy-token'] = skey
       state.isLogin = true
       if(userinfo.role == "dev" || userinfo.role == "admin"){
           userinfo.admin = true
       }
       state.userinfo = userinfo
       state.skey = skey
   },
   logout:(state)=>{
        localStorage.removeItem("gy-token")
        axiosServer.defaults.headers['gy-token'] = 'login'
        state.isLogin = false
        state.userinfo = null
   },
   
   patchUserinfo(state, userinfo) {
       
       state.userinfo = Object.assign({}, state.userinfo, userinfo)
   }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}