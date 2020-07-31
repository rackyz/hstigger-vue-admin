<style>
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
<template>
  <div>
    <Top title="员工信息" page />
    <div style="margin-top:50px;">
      <div class="person-header">
          <div class="inner">
            <div class="flex-wrap" style="height:80px;" >
              <template v-if="!loading">
               <gAvatar class="hov-shadowed" :size="60" :avatar="userinfo.avatar || 'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/icon/user.png'" :frame="userinfo.frame"  style="position:relative" />

            <div class="text-button text-button-pro"  style="color:#333;border:none;font-size:30px;margin-left:20px;"> {{userinfo.name}}
              </div>
              </template>
              <template v-else>
            <Spin fix>
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>加载中</div>
            </Spin>
        </Col>
              </template>
            </div>

          </div>
      </div>
      <div class="inner" style="padding:10px 30px;border-left:5px solid yellowgreen;margin-top:10px;" v-if="!loading">
        <pre>
用户名    <span style='color:red'>{{id}}</span>
电话      {{userinfo.phone}}
部门      {{user_deps.map(v=>v.name).join(',') || '无'}}
角色      {{user_roles.map(v=>v.name).join(',') || '无'}}
上次登录  {{userinfo.lastlogin_at}}
创建时间  {{userinfo.created_at}}
账户状态  <span :style="`color:${userinfo.state?'red':'green'}`">{{userinfo.state?'已禁用':'正常'}}</span>

历史项目  <template v-for="(p,i) in projects">
      {{i+1}} - <a :key='p.id' :href="`/projects/${p.id}`">{{p.name}}</a>  {{p.position}}</template>

        </pre>
        </div>
    
    </div>
    
  </div>
</template>

<script>
import Top from './shared/top'
import gAvatar from '@refs/avatar/index'
import { mapGetters } from 'vuex'
export default {
  data(){
    return {
      loading:true,
      userinfo:{}
    }
  },
    components:{
      Top,gAvatar
    },
    mounted(){
      this.loading = true
      console.log('getUser:',this.id)
      this.$store.dispatch('user/getUserByUser',this.id).then(userinfo=>{
        this.userinfo = userinfo
      }).finally(()=>{
        this.loading =false
      })
    },
    computed:{
        id(){
            return this.$route.params.id
        },
        ...mapGetters('user',['deps']),
        user_deps(){
          if(this.userinfo && this.userinfo.deps)
            return this.deps.filter(v=>this.userinfo.deps.includes(v.id))
          else
            return []
        },
        user_roles(){
          return []
        },
        projects(){
          return [{id:1,name:'项目1',position:'项目经理'},{id:2,name:'项目2',position:'项目经理'},{id:2,name:'项目2',position:'项目经理'},]
        }

    },
    methods:{
      
    }
}
</script>

<style lang="less" scoped>
.person-header{
  background:yellowgreen;
  height:100px;
  position: relative;
  padding:10px 0; 
}

.inner{
  margin:0 auto;
  max-width:1200px;
  width:100%;
  overflow: hidden;
}
</style>