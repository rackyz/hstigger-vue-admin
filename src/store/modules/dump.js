import axiosServer from '../libs/axios2'
import moment from 'moment'

const state = {
    list: []
}

const getters = {
    list:(state)=>{
        return state.list
    }
}


const actions = {
    list:({commit})=>{
        return new Promise((resolve, reject) => {
            let service = `backups`
            axiosServer.get(service).then(res => {
                let list = res.data.data
                commit('saveList', list)
                resolve(list)
            }).catch(e => {
                reject(e)
            })
        })
    },
    dump:({dispatch})=>{
        return new Promise((resolve, reject) => {
            let service = `tools/mysqldump`
            axiosServer.get(service).then(res => {
                dispatch('list')
                resolve()
            }).catch(e => {
                reject(e)
            })
        })
    }
}

const mutations = {
        saveList(state, list) {
            list.sort((a, b) => a > b ? -1 : 1)
            let dumps = list.map(v=>{
                let matches = v.match(/dump([0-9]{14}).*/)
                let [,timestamp] = matches
                return {
                   date: moment(timestamp,'YYYYMMDDHHmms').toString(),
                   file:v
                }
            })
            
            Vue.set(state, 'list', dumps)
        }
    }


    export default {
        namespaced: true,
        state,
        getters,
        actions,
        mutations
    }