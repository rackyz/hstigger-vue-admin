import Vue from 'vue'
import Vuex from 'vuex'
// import layout from './modules/layout'
// import members from './modules/members'
// import deps from './modules/deps'
import user from './models/user'
import type from './models/type'



/////////////////////////////////
import form from './modules/form'
import order from './modules/order'
import kernel from './modules/kernel'

import project from './modules/project'
import tables from './modules/tables'
import file from './modules/file'
import archive from './modules/archive'
import notice from './modules/notice'
import task from './modules/task'
import workflow from './modules/workflow'
import log from './modules/log'
import dump from './modules/dump'
import permission from './models/permission'
import article from './models/article'

Vue.use(Vuex)
let state = {}
let getters = {}
let actions = {}
let mutations = {}

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    // state,
    // getters,
    // actions,
    // mutations,
    modules: {
        kernel,
        article,
        permission,
        user,
        type,
        project,
        order,
        tables,
        file,
        form,
        archive,
        notice,
        task,
        workflow,
        log,
        dump
        // projects
        // members,
        // layout,
        // log,
        // deps,
        // positions,
    },
    strict: debug
})