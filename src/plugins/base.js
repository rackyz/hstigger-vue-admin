// BASE SETTING to VUE


// Imports
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import gzUtil from './utils/utils.js';
import iView from 'iview'
import PuzzleVerification from 'vue-puzzle-verification'


// Automatically loads and bootstraps files
// in the "./src/components/base" folder.
const requireComponent = require.context('@/components/base', true, /\.vue$/)

for (const file of requireComponent.keys()) {
    const componentConfig = requireComponent(file)
    const name = file
        .replace(/index.js/, '')
        .replace(/^\.\//, '')
        .replace(/\.\w+$/, '')
    const componentName = upperFirst(camelCase(name))

    Vue.component(`Base${componentName}`, componentConfig.default || componentConfig)
}

// Setup iVIew UI
Vue.use(iView)

// Setup gzUtil user-defined utilities
Vue.use(gzUtil)

// Setup PuzzleVerification plugins
Vue.use(PuzzleVerification)

// Predefined Some Easy Prompt Methods based on iview
Vue.prototype.Confirm = function (content, cb) {
    this.$Modal.confirm({
        title: '操作确认',
        content,
        onOk: cb
    })
}

Vue.prototype.Success = function (content) {
        this.$Notice.success({
            title: '操作成功',
            desc: content
        })
    },

Vue.prototype.Error = function (content) {
    var that = this
    setTimeout(() => {
        that.$Modal.error({
            title: "错误",
            content
        })
    }, 1000)
}

Vue.prototype.RouteTo = function (path, newtab = false) {
    if (newtab) {
        let routerUrl = this.$router.resolve({
            path
        });
        window.open(routerUrl.href, "_blank");
    } else {
        this.$route.push(path)
    }


}