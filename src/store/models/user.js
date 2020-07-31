import moment from 'moment'
import axiosServer from '../libs/axios2'
import U from '../libs/util'

const PERMISSIONS = {
    DASHBOARD:{
        name:'工作台',
        subs:{

        }
    },
    PROJECSTS:{
        name:'项目库'
    },
    ARCHIVES:{
        name:"档案库"
    },
    ADMIN:{
        name:"后台管理"
    },
    PROJECT:{
        name:"项目详情"
    },
    USER:{
        name:'用户详情',
        subs:{
            BASIC:{
                name:'基本信息'
            },
            PROJECTS:{
                name:'项目信息'
            }
        }
    },
    DEP:{
        name:"部门详情"
    }
}
const DumpPermissions = p=>{
    return []
}

const state = {
    userinfo: {
        deps:[]
    },
    profile: {},
    isLogin: false,

    auths: [],
    cosAuthed: true,
    cosAuthing: false,

    users:[],

    deps:[],
    roles:[],
    permissions:DumpPermissions(PERMISSIONS)
}


const getters = {
    authedCOS: state => {
        return state.cosAuthed
    },
    authingCOS: state => {
        return state.cosAuthing
    },
    userinfo: state => {
        return state.userinfo || {}
    },
    auths: state => {
        return state.authMap
    },
    isLogin: state => {
        return state.isLogin
    },
    concerned_projects: state => {
        return state.userinfo.concerned || []
    },
    isConcerned: state => id => {
        if (state.userinfo && state.userinfo.concerned)
            return state.userinfo.concerned.includes(id)
    },
     deps: state => {
         return state.deps
     },
     users:state=>{
         return state.users
     },roles:state=>{
         return state.roles.filter(v => v.type_id == 11)
     },
     projectRoles:state=>{
         return state.roles.filter(v => v.type_id == 12)
     },
     depRoles:state=>{
         return state.roles.filter(v => v.type_id == 13)
     },
     getRoles:state=>type_id=>{
          return state.roles.filter(v => v.type_id == type_id)
     },
     permissions:state=>{
         return {
             PROJECT:true,
             ARCHIVE:true,
             NOTICE:true,
             FILE:true,
             ADMIN:true,
             DEV:true
         }
     }
}


const actions = {
    changePassword:({},{newpass,oldpass})=>{
        return new Promise((resolve,reject)=>{
            return axiosServer.post('sessions/changepwd',{newpass,oldpass}).then(res=>{
                resolve()
            }).catch(reject)
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
    authCOS: ({
        commit
    }) => {
        return new Promise((resolve, reject) => {
            axiosServer.get('sessions/cos').then(res => {
                commit('updateInfo', {
                    coskey: res.data.data
                })
                resolve()
            }).catch(e => {
                reject(e)
            })
        })
    },
    whoami: ({
        commit,
        state
    }) => {
        let skey = state.skey
        if (!skey) {
            skey = localStorage.getItem("kt-token")
            axiosServer.defaults.headers.Authorization = skey
        }
        return new Promise((resolve, reject) => {
            if (state.isLogin && state.userinfo && state.userinfo.id) {
                resolve(state.userinfo)
            } else {
                axiosServer.get('sessions/current').then(res => {
                    let userinfo = res.data.data
                    
                    commit('updateInfo', userinfo)
                    resolve(userinfo)

                }).catch(e => {
                    console.info("[whoami]token is outof date")
                    commit('logout')
                    resolve()
                })
            }

        })
    },
    login: ({
        commit
    }, {
        user,
        password,
        code
    }) => {
         axiosServer.defaults.headers.Authorization = "Bearer " + 'login'
        return new Promise((resolve, reject) => {
            axiosServer.post('sessions', {
                user,
                password,
                code
            }).then(res => {
                let loginInfo = res.data.data
                commit("login", loginInfo)

                resolve(loginInfo)
            }).catch(e => {
                if (e.message == "Network Error")
                    reject("服务器连接失败,请联系管理员")
                reject(e)
            })
        })
    },
    loginDebug({commit},user_id){
         axiosServer.defaults.headers.Authorization = "Bearer " + 'login'
         return new Promise((resolve, reject) => {
             axiosServer.post('sessions?q=debug', user_id).then(res => {
                 let loginInfo = res.data.data
                 commit("login", loginInfo)

                 resolve(loginInfo)
             }).catch(e => {
                 if (e.message == "Network Error")
                     reject("服务器连接失败,请联系管理员")
                 reject(e)
             })
         })
    },
    forgetPassword: ({

    }, phone) => {
        return new Promise((resolve, reject) => {
            axiosServer.post("sessions/forget?phone=" + phone).then(res => {
                resolve()
            }).catch(e => {
                reject(e)
            })
        })
    },
    logout: ({
        commit
    }) => {
        commit('logout')
    },
    update: ({
        commit
    }, updatedUserinfo) => {
        return new Promise((resolve, reject) => {
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
    getProfile: ({
        commit
    }, uid = 'self') => {
        return new Promise((resolve, reject) => {
            axiosServer.get(`users/${uid}?q=profile`).then(profile => {
                commit('updateProfile', profile)
            }).catch(e => {
                reject(e)
            })
        })
    },
    addConcernProject: ({
        commit
    }, project_ids) => {
        return new Promise((resolve, reject) => {
            axiosServer.patch(`settings/add-concern-projects`, project_ids).then(profile => {
                commit('AddConcernProjects', project_ids)
            }).catch(e => {
                reject(e)
            })
        })
    },
    removeConcernProject: ({
        commit
    }, project_ids) => {
        return new Promise((resolve, reject) => {
            axiosServer.patch(`settings/del-concern-projects`, project_ids).then(profile => {
                commit('DelConcernProjects', project_ids)
            }).catch(e => {
                reject(e)
            })
        })
    },
    resetConcernProject: ({
        commit
    }, project_ids) => {
        return new Promise((resolve, reject) => {
            axiosServer.patch(`settings/reset-concern-projects`, project_ids).then(profile => {
                commit('ResetConcernProject', project_ids)
            }).catch(e => {
                reject(e)
            })
        })
    },
    patchDepUsers:({
        commit
    },{dep_id,users})=>{
        return new Promise((resolve,reject)=>{
            axiosServer.post(`deps/${dep_id}/users`,users).then(res=>{
              commit('patchDepUsers',{dep_id,users})
                resolve()
            }).catch(reject)
        })
    },
    delDepUsers:({
        commit
    },{dep_di,user_id})=>{
        return new Promise((resolve, reject) => {
            axiosServer.del(`deps/${dep_id}/users/${user_id}`).then(res => {
                commit('delDepUsers', {
                    dep_id,
                    user_id
                })
                resolve()
            }).catch(reject)
        })
    },
    addUserDep:({commit},dep_id)=>{
         return new Promise((resolve, reject) => {
             axiosServer.post('users/self/deps', {
                 dep_id
             }).then(res => {
                 commit('addUserDep',  dep_id )
                 
                 resolve()
             }).catch(reject)
         })
    },
    removeUserDep:({commit},dep_id)=>{
         return new Promise((resolve, reject) => {
             axiosServer.delete(`users/self/deps/${dep_id}`).then(res => {
                 commit('removeUserDep',   dep_id)
                 resolve()
             }).catch(reject)
         })
    },
    patchUserDeps:({
        commit
    },dep_ids)=>{
        return new Promise((resolve,reject)=>{
            axiosServer.patch('users/self', {
                    deps:dep_ids
                }).then(res => {
                let deps = res.data.data
                commit('updateUserinfo',{deps})
                resolve()
            }).catch(reject)
        })
    },
    // query users
    queryUsers:({
        commit
    })=>{
        return new Promise((resolve,reject)=>{
            axiosServer.get('users').then(res=>{
                let items = res.data.data
                commit('saveUsers',items)
                resolve(items)
            }).catch(e=>{
                reject(e)
            })
        })
    },

    // departments
     queryDeps: ({
             commit
         }) => {
             return new Promise((resolve, reject) => {
                 axiosServer.get(`deps`).then(res => {
                     let items = res.data.data
                     commit('saveDeps', items)
                     resolve()
                 }).catch(e => {
                     reject(e)
                 })
             })
         }
    ,

    // queryRoles
    queryRoles:({
        commit
    })=>{
          return new Promise((resolve, reject) => {
              axiosServer.get(`roles`).then(res => {
                  let items = res.data.data
                  commit('saveRoles', items)
              }).catch(e => {
                  reject(e)
              })
          })

    },
    patchDep: ({commit}, item)=>{
        return new Promise((resolve, reject) => {
            if(item.id){
                return axiosServer.patch(`deps/${id}`,item).then(res=>{
                    commit('saveDep',item)
                    resolve()
                }).catch(reject)
            }else{
                 return axiosServer.post(`deps`, item).then(res => {
                     let updateInfo = res.data.data
                     Object.assign(item, updateInfo)
                     commit('saveDep', item)
                     resolve()
                 }).catch(reject)

            }
           
        })
    },

    patchRole:({commit},item)=>{
       return new Promise((resolve, reject) => {
           let role = {
               icon:item.icon,
               type_id:item.type_id,
               name:item.name,
               color:item.color,
               desc:item.desc
           }
           if (item.id) {
               let id = item.id
               return axiosServer.patch(`roles/${id}`, role).then(res => {
                   commit('saveRole', item)
                   resolve()
               }).catch(reject)
           } else {
               return axiosServer.post(`roles`, role).then(res => {
                   let updateInfo = res.data.data
                   Object.assign(item, updateInfo)
                   commit('saveRole', item)
                   resolve()
               }).catch(reject)

           }

       })
    },

    delRole:({commit},id)=>{
        return new Promise((resolve, reject) => {
            return axiosServer.delete(`roles/` + id).then(res => {
                commit('delRole', id)
                resolve()
            }).catch(reject)

        })
    },

    patchUser:({commit},item)=>{
         return new Promise((resolve, reject) => {
              if (item.id) {
                  let id = item.id
                  delete item.id
                  return axiosServer.patch(`users/${id}`, item).then(res => {
                      item.id = id
                      commit('saveUser', item)
                      resolve()
                  }).catch(reject)
              }else{
                  return axiosServer.post(`users`, item).then(res => {
                    let updateInfo = res.data.data
                    Object.assign(item, updateInfo)
                    commit('saveUser', item)
                    resolve()
                }).catch(reject)
              }
         })
    }
    ,
    deleteUser:({commit},id)=>{
        return new Promise((resolve, reject) => {
            return axiosServer.delete(`users/`+id).then(res => {
                commit('delUser', id)
                resolve()
            }).catch(reject)

        })
    },
     deleteUsers: ({
         commit
     }, ids) => {
         return new Promise((resolve, reject) => {
             return axiosServer.post(`users/delete`,ids).then(res => {
                 ids.forEach(v=>{
                    commit('delUser', v)
                 })
                 resolve()
             }).catch(reject)

         })
     },
    isNameExist:({},name)=>{
        return new Promise((resolve,reject)=>{
            return axiosServer.get(`users/${name}?q=is-name-exist`).then(res=>{
                resolve(res.data.data)
            }).catch(reject)
        })
    },
    resetPassword:({commit},ids = [])=>{
        return new Promise((resolve, reject) => {
            return axiosServer.post(`users/reset-pass`,ids).then(res=>{
                commit('resetPasswords', ids)
                resolve(res.data.data)
                
            }).catch(reject)
        })
    },
    lockUsers:({commit},ids=[])=>{
        return new Promise((resolve,reject)=>{
              return axiosServer.post(`users/lock`, ids).then(res => {
                  commit('lockUsers', ids)
                  resolve(res.data.data)

              }).catch(reject)
        })
    },
    unlockUsers:({commit},ids=[])=>{
        return new Promise((resolve, reject) => {
            return axiosServer.post(`users/unlock`, ids).then(res => {
                commit('unlockUsers', ids)
                resolve(res.data.data)

            }).catch(reject)
        })
    },
    getUserByUser({},user_id) {
        console.log('getUserByUser:', user_id)
         return new Promise((resolve, reject) => {
             return axiosServer.get(`users/` + user_id + '?q=user').then(res => {
                 resolve(res.data.data)
             }).catch(reject)
         })
    }
        
         
}

const mutations = {
    addUserDep(state,dep_id){
        state.userinfo.deps.push(dep_id)
        let user = state.users.find(v => v.id == state.userinfo.id)
        if(user)
            user.deps.push(dep_id)
        state.users.splice(0,1,state.users[0])
    },
    removeUserDep(state,dep_id){
        U.ArrayRemove(state.userinfo.deps,v=> v == dep_id)
        let user = state.users.find(v => v.id == state.userinfo.id)
        if (user)
             U.ArrayRemove(user.deps, v => v == dep_id)
        state.users.splice(0, 1, state.users[0])
    },
    delDepUsers(state,{user_id,dep_id}){
        let dep = state.deps.find(v=>v.id == dep_id)
        let user = state.users.find(v=>v.id == user_id)
        if(dep){
           U.ArrayDelete(dep.users,v=>v.id == user_id)
        if(user)
           U.ArrayDelete(user.deps,v=>v == dep_id)
        }
    },
    saveRole(state,item){
        console.log('save:',item)
         let index = state.roles.findIndex(v => v.id == item.id)
         if (index == -1) {
             state.roles.push(item)
         } else {
             state.roles.splice(index, 1, Object.assign({}, state.roles[index], item))
         }
    },
    delRole(state,id){
         let index = state.roles.findIndex(v => v.id == id)
         if (index != -1)
             state.roles.splice(index, 1)
    },
    delUser(state,id){
         let index = state.users.findIndex(v => v.id == id)
         if (index != -1) 
             state.users.splice(index, 1)
    },
    saveUser(state,item){
       
        let index = state.users.findIndex(v => v.id == item.id)
        if (index == -1) {
            state.users.push(item)
        } else {
            state.users.splice(index, 1, Object.assign({},state.users[index], item))
        }
    },
    saveUserItems(state,items){
        console.log('SAVEUSER_ITEMS:',items)
        items.forEach(v=>{
            mutations.saveUser(state,v)
        })
    },
    resetPasswords(state,ids = []){
        mutations.saveUserItems(state,ids.map(v=>({id:v,passweak:1})))
    },
    lockUsers(state,ids=[]){
        console.log("LOCK",ids)
         mutations.saveUserItems(state, ids.map(v => ({
             id: v,
             state:1
         })))
    },
    unlockUsers(state,ids=[]){
        mutations.saveUserItems(state, ids.map(v => ({
            id: v,
            state:0
        })))
    },

    AddConcernProjects: (state, ids = []) => {
        state.userinfo.concerned = state.userinfo.concerned.concat(ids)
        let userinfo = Object.assign({}, state.userinfo)
        state.userinfo = userinfo
        console.log('AddConcernProjects', ids, state.userinfo.concerned)

    },
    DelConcernProjects: (state, ids = []) => {
        ids.forEach(v => {
            let index = state.userinfo.concerned.findIndex(s => s == v)
            if (index != -1)
                state.userinfo.concerned.splice(index, 1)
        })
        let userinfo = Object.assign({}, state.userinfo)
        state.userinfo = userinfo
        console.log('DelConcernProjects', ids, state.userinfo.concerned)
    },
    ResetConcernProject: (state, ids = []) => {
        state.userinfo.concerned = ids
    },
    updateProfile: (state, profile) => {
        Object.assign(state.profile, profile)
    },
    updateInfo: (state, userinfo) => {
        Object.assign(state.userinfo, userinfo)
        state.isLogin = true
    },
    login: (state,userinfo) => {
        let token = userinfo.token
        localStorage.setItem("kt-token", "Bearer " + token)
        axiosServer.defaults.headers.Authorization = "Bearer " + token
        state.isLogin = true
        state.userinfo = userinfo
        state.skey = token
    },
    logout: (state) => {
        localStorage.removeItem("kt-token")
        axiosServer.defaults.headers.Authorization = "Bearer " + 'login'
        state.isLogin = false
        state.userinfo = null
    },

    patchUserinfo(state, userinfo) {

        state.userinfo = Object.assign({}, state.userinfo, userinfo)
    },

    // departments
    saveDep(state, item) {
        item.users = state.users.filter(v=>v.deps.includes(item.id))

        let index = state.deps.findIndex(v => v.id == item.id)
        if (index == -1) {
            state.deps.push(item)
        } else {
            state.deps.splice(index, 1, Object.assign({}, state.deps[index], item))
        }
    },
    saveUsers(state,items){
        state.users = items
    },
    saveDeps(state, items) {
        items.forEach(v=>{
            v.users = state.users.filter(u=>u.deps.includes(v.id))
            v.count = items.filter(d=>d.parent_id == v.id).length
            if(v.count == 0)
                v.count = v.users.length + '人'
        })
        state.deps = items
    },
    delDep(state, id) {
        let index = state.deps.findIndex(v => v.id == id)
        if (index != -1)
            state.deps.splice(index, 1)
    },
    patchUserDep(state,depid){
        let index = state.userinfo.deps.find(v=>v.id == depid)
        if(index != -1)
            state.userinfo.deps.splice(index,1,depid)
        else
            state.userinfo.deps.splice(0,0,depid)

         state.userinfo = Object.assign({}, state.userinfo, userinfo)
    },
    saveRoles(state,items){
        state.roles = items
    },
    patchDepUsers(state,{dep_id,users}){
          let dep = state.deps.find(v => v.id == dep_id)
          if(dep)
            dep.users = users.map(v=>state.users.find(u=>u.id == v))

          users = users.map(v=>state.users.find(u=>u.id == v))
          users.forEach(v=>{
              U.ArrayAdd(v.deps,dep_id)
          })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}