// Module : Kernel
// Desc   : kernel services for system

import axiosServer from '../libs/axios';

const state = {
    users:[],
    types:[],
    groups:[]
}


const getters = {
   ref(state){
       return state
   },
   users(state){
       return state.users
   },
   getType:(state)=>type_id=>{
       if (state.all_types)
        return state.all_types.find(v=>v.id == type_id) || {}
        else
        return {}
   },
   groups(state){
    return state.groups
   },
   parseFiles:(state)=>(filestr)=>{
    return filestr.split(';').map(v=>{
      let [name,url] = v.split(',')
      return {
          name,
          url:url.includes('http')?url:('https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/files/'+url)
      }
    })
   },
   getDep:(state)=>(id)=>{
    return state.groups.find(v=>v.id == id) 
   },
   worktypes:(state)=>{
        return [{
            name:"任务跟踪/工单",
            id:"order"
        },{
            name:'流程/数据收集',
            id:"workflow00001"
        }]
   },
   getUser:(state)=>(id)=>{
    return state.users.find(v=>v.id == id) || {}
   },
   getCharger:(state)=>(dep_id)=>{
        let dep = state.groups.find(v=>v.id == dep_id)
        if(dep)
            return dep.charger_id
   },
   getDepsCharger:(state)=>(user_id)=>{
        return state.users.slice(0,3).map(v => ({
            value: v.id,
            label: v.name,
            avatar: v.avatar
        }))
   },
   userAsOptions(state){
        return state.users.map(v=>({value:v.id,label:v.name,avatar:v.avatar}))
   },
    types: (state) => (key) => {
        return state.types[key]
    },
   deps(state){
       return state.groups.map(v => ({
           value: v.id,
           label: v.name,
           avatar: v.avatar
       }))
   },
   taskStates(){
        return ['待处理','进行中','暂停','已完成','已结束','已关闭']
   },
   taskStateColors(){
        return ['#aaa','orange','red','green','darkgreen','darkred']
   },
   getProjectTaskTypes(){
    return [{
        label: "项目组建(系统)",
        value: "project_create"
    }, {
        label: "前期工作",
        value: "project_pareparework"
    }, {
        label: "设计工作",
        value: "project_pareparework"
    }]
   },
   getRequiremntTypes(){
    return [{
        label:"业务需求",
        value:"require-business"
    },{
        label:"控件优化",
        value:"require-optimise"
    },{
        label:"界面调整",
        value:"require-interface"
    }]
   },
   taskTypes() {
       return [{
           label: '综合任务',
           value: "common"
       }, {
           label: '项目任务',
           value: "project"
       }, {
           label: "系统需求(开发)",
           value: "requirement"
       }, {
           label: "错误报告(开发)",
           value: "bugreport"
       }]
   },
   getBugReportTypes(){
    return ['页面崩溃', '功能及逻辑性错误', '界面及文字性错误', '其他']
   },
   getTaskSubTypes:()=>(parent_id)=>{
       if(parent_id == 'common'){
           return [{
               label: '综合任务',
               value: "common"
           }]
       }else if(parent_id=='project'){
           return getters.getProjectTaskTypes()
       }else if(parent_id=="requirement"){
           return getters.getRequiremntTypes()
       }else if(parent_id == "bugreport"){
           return getters.getBugReportTypes()
       }
   }
}

const actions = {
    init({
            commit,state
        }) {
        return new Promise((resolve,reject)=>{
            if(state.inited)
                resolve()
              axiosServer.get("settings?q=options").then(res => {
                  let options = res.data.data
                  console.log("KERNEL-init:",options)
                  commit("init", options)
                  resolve()
              }).catch(e=>{
                  reject(e)
              })
        })
    },
    patchGroup(){

    },
    delGroup(){

    }
}

const mutations = {
    init(state, {
            users,
            types,
            groups,
            user2group
        }) {
        state.inited = true
        if(users)
            state.users = users
       if (types) {
           let t = {}
           state.all_types = types
           types.forEach(v => {
               if (t[v.key]) {
                   t[v.key].push(v)
               } else {
                   t[v.key] = [v]
               }
           })
           state.types = t
       }
        if(groups)
            state.groups = groups
        
        user2group.forEach(v=>{
            let user = state.users.find(u=>u.id == v.user_id)
            let group = state.groups.find(g=>g.id == v.group_id)
            if(!user || !group){
                console.error("[Kernel]User2Group relation is invalid:",v)
                return
            }
            if(user.groups){
                user.groups.push(group)
            }else{
                user.groups = [group]
            }

            if(group.users){
                group.users.push(user)
            }else{
                group.users = [user]
            }
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