<template>
<div class="home">
    <Top :menus="menus">
        <div class="flex-wrap" style="margin-left:0px;height:100%;">
                <template v-for="m in menus">
                <div :key="m.name" class="text-button menu-item" :class="routedPage.includes(m.route)?'menu-item-selected':''" @click="routeTo(m.route)" v-if="m.ACCESS_KEY == undefined || P[m.ACCESS_KEY]">
                {{m.name}} 
                </div>
                </template>
        </div> 
    </Top>  
    <div class="container">    
        <keep-alive>
        <router-view></router-view>
        </keep-alive>
    </div>
    </div>
</template>
<script>
//import Contracts from '../progress/console.vue'
import Top from './shared/top'
import { mapGetters } from 'vuex'
export default {
    data(){
        return {
            menus:[{
                name:"工作台",
                route:"dashboard",
                icon:"ios-home",
                count:"+12"
            },{
                name:"项目库",
                icon:"ios-keypad",
                route:"projects",
                ACCESS_KEY:'PROJECT'
            },{
                name:"资料库",
                icon:"ios-folder-open",
                route:"archives",
                 ACCESS_KEY:'ARCHIVE'
            },{
                name:"个人中心",
                icon:"ios-man",
                route:"self"
            },{
                name:"后台管理",
                icon:"ios-settings",
                route:"admin",
                 ACCESS_KEY:'ADMIN'
            },{
                name:"开发",
                icon:"ios-settings",
                route:"dev",
                 ACCESS_KEY:'DEV'
            }]
        }
    },
    computed:{
        ...mapGetters('user',{
            'P':'permissions'
        }),
        routedPage(){
            let path = this.$route.path
            return path.substr(1)
        }
    },
    components:{
        Top
    },
    methods:{
         routeTo(t){
            // remove all model
            this.$Modal.remove()
            let path = "/" + t
            if(this.$route.path != path)
                this.$router.push(path)
            }
        ,
    }
}
</script>
<style lang="less" scoped>

.menu-item{
    height:30px;
    margin-right:10px;
    border:none;
    display: flex;
    align-items: center;
    padding:0 15px;
    padding-left:10px;
    font-size:15px;
    color:#aaa !important;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 5px;
    
}

.menu-item:hover{
    
   
    color:yellowgreen;
}

.menu-item-selected{
    //color:rgb(8, 143, 239);
    background:rgba(11,11,11,1);
   
     border:1px solid #333;
     border-top-color: #000;
      border-left-color: #000;
    color:yellowgreen !important;
    i{
    color:yellowgreen;
    }
}

.menu-item-selected:hover{
  
    color:yellowgreen;
}


</style>