import Vue from 'vue';
import App from './App';
import router from './router';
import gzUtil from './utils/utils.js';
import iView from 'iview'
import moment from './utils/moment-zh.js'
import store from './store'
import PuzzleVerification from 'vue-puzzle-verification'


// Plugins
 
Vue.use(moment)
Vue.use(iView)
Vue.use(gzUtil)
Vue.use(PuzzleVerification)
console.log(PuzzleVerification)
Vue.prototype.$bus = new Vue()
Vue.prototype.Confirm = function(content, cb){
    this.$Modal.confirm({
        title:'操作确认',
        content,
        onOk:cb
    })
}

Vue.prototype.Success = function(content){
    this.$Notice.success({
        title:'操作成功',
        desc:content
    })
},
Vue.prototype.Error = function(content){
    var that = this
    setTimeout(()=>{
        that.$Modal.error({
            title: "错误",
            content
        })
    },1000)
}

Vue.prototype.RouteTo = function(path,newtab = false){
    if(newtab){
         let routerUrl = this.$router.resolve({
             path
         });
         window.open(routerUrl.href, "_blank");
    }else{
         this.$route.push(path)
    }
   

}
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
