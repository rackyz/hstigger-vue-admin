<template>
  <div class="container-page">
       <div class="userinfo">
      <img :src="userinfo.ps_avatar" />
      <h1 class="name">{{userinfo.gy_name}}</h1>
      <div class="attrlist">
            <div class="attr">  
               <Icon type="ios-call" /> {{userinfo.gy_phone}}
            </div>
            <div class="attr">
                <Icon type="ios-at" /> 行政管理部
            </div>
            <div class="attr">
                <Icon type="ios-basketball" /> 系统管理员
            </div>
            {{userinfo}}
        </div>
        </div>
      <Menu theme="dark" :active-name="activeNode"  style="top:120px;width:300px;height:100%;" @on-select="routeTo($event)">
        <MenuItem name="self/notice" class="flex-wrap"><Icon type="ios-shirt-outline" size="20"  style="margin-right:10px;" /> 我的通知</MenuItem>
        <MenuItem name="self/project" class="flex-wrap"><Icon type="ios-list-box-outline" size="20"  style="margin-right:10px;" /> 我的项目</MenuItem>
        <MenuItem name="self/work" class="flex-wrap"><Icon type="ios-clipboard-outline" size="20"  style="margin-right:10px;" /> 我的工作</MenuItem>
        <MenuItem name="self/file" class="flex-wrap"><Icon type="ios-folder-open-outline" size="20"  style="margin-right:10px;" /> 我的文件</MenuItem>
    </Menu>

    <div class="l-container">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    methods:{
          routeTo(t){
             let path = "/" + t
            if(this.$route.path != path)
                this.$router.push(path)
            }
    },
    watch:{
        userinfo:{
            handler(v){
                console.log('watch:',v)
                this.$forceUpdate()
            }
        }
    },
    mounted(){
    },
    computed:{
        activeNode(){
            return this.$route.path.substr(1)
        },
        ...mapGetters('user',['userinfo'])
    
    }

}
</script>

<style lang="less" scoped>
.l-container{
    position: absolute;
    left:300px;
    top:0;
    bottom:0;
    right:0;
    overflow:hidden;
    overflow-y:auto;
    background:#dfdfdf;
}

.userinfo{
    background:linear-gradient(#333,#222);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding:10px 20px;
    position: absolute;
    left:0;
    top:0;
    width:300px;
    height:200px;

    img{
        border-radius: 50%;
        width
        
        :60px;height:60px;
    }
    .name{
        font-size:22px;
        font-weight: normal;
        margin-top:10px;
    }

    .attrlist{
        margin-top:20px;
        width:100%;
        color:#777;
    }
}
</style>