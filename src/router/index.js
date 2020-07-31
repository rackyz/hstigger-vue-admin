import Vue from 'vue';
import Router from 'vue-router';
import iView from 'iview'

Vue.use(Router);
Vue.use(iView);


let router = new Router({

    mode:'history',
    routes: [
        {
            path: '/',
            component: resolve => require(['@pages/login.vue'], resolve),
        },
        {
            path: '/index',
            component: resolve => require(['@pages/index.vue'], resolve),
            children:[
                {
                    path: '/dev',
                    component: resolve => require(['@pages/dev.vue'], resolve),
                        meta: {
                            color: 'dark'
                        },
                    children:[
                        
                    ]
                }
            ]
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})


router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});

router.afterEach(route => {
    iView.LoadingBar.finish()
    if(route.path != '/')
        localStorage.setItem('last-route-path', route.path)
});

export default router