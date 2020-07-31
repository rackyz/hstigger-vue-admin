const PermissionTree = {
    PROJECT:{
        name:"项目管理"
    },
    ARCHIVE:{
        name:"档案管理"
    },
     NOTICE: {
         name: "通知公告"
     },
    STUDY:{
        name:"知识库"
    },
    FILE:{
        name:"文件存储"
    },
    ADMIN:{
        name:"后台管理"
    },
    DEV:{
        name:"开发者模块"
    }
}

const MakePermissionData = pt=>{

}

const state = {
    list:MakePermissionData(PermissionTree)
}

const getters = {
    permissions(state){
        return state.list
    }
}


const actions = {


}


const mutations = {

}
export default {
    namespace:true,
    state,
    getters,
    actions,
    mutations
}