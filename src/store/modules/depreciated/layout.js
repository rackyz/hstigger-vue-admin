
const state = {
    clientHeight:600
}


const getters = {
    getClientHeight(){
        return state.clientHeight
    }
}

const actions = {

}

const mutations = { 
       set(state,h){
        state.clientHeight = h
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}