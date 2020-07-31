<template>
  <div class="container-page project">
    <Top :title="project.name" @ready="getData">
        <div class="switch-project-button" @click="showProjects=!showProjects">切换 <Icon type='ios-arrow-down' size="14" style="margin-left:0px" /></div>
        <div class="switch-project-button" :class="isConcerned(project.id)?'switch-project-button-active':''" @click="concern(project.id)">{{isConcerned(project.id)?'已关注':'关注'}} <Icon type='md-eye' size="14" style="margin-left:0px" /></div>
    </Top>
        
        <Menu class="l-project-menu" accordion theme="dark" :active-name="activeNode"   @on-select="routeTo($event)" style="top:50px;bottom:0;height:100%;width:200px;">
            <MenuItem name="dashboard">
        
                    <Icon type="ios-construct-outline" />
                        工作台
                    </MenuItem>
                    <MenuItem name="monitor">
                        <Icon type="ios-laptop" />
                        项目监控
                    </MenuItem>
                    <MenuItem name="file">
                        <Icon type="ios-folder-open-outline" />
                        项目资料
                    </MenuItem>
                    
        <Submenu name="1" >
            <template slot="title">
                        <Icon type="ios-apps" />
                        前期管理
                    </template>
        <MenuItem name="earlyWork"><Icon type="md-clipboard" />前期工作</MenuItem>
        <MenuItem name="earlyWorkAfter"><Icon type="md-clipboard" /> 后期工作</MenuItem>
        <MenuItem name="earlyFile"><Icon type="ios-folder" /> 前期资料</MenuItem>
        </Submenu>
        <Submenu name="2" >
            <template slot="title">
                        <Icon type="ios-apps" />
                        设计管理
                    </template>
        <MenuItem name="empty"><Icon type="md-clipboard" /> 踏勘记录</MenuItem>
         <MenuItem name="designWork"><Icon type="md-clipboard" /> 设计工作</MenuItem>
          <MenuItem name="designFile"><Icon type="md-clipboard" /> 设计任务书</MenuItem>
           <MenuItem name="drawFile"><Icon type="ios-folder" /> 图纸成果</MenuItem>
        </Submenu>
        <Submenu name="3" >
            <template slot="title">
                        <Icon type="ios-apps" />
                        合约管理
                    </template>
         <MenuItem name="contractWork"><Icon type="md-clipboard" /> 合同管理</MenuItem>
         <MenuItem name="contractFile"><Icon type="ios-folder" /> 合约资料</MenuItem>
        </Submenu>
        <Submenu name="4" >
            <template slot="title">
                        <Icon type="ios-apps" />
                        招投标管理
                    </template>
         <MenuItem name="empty"><Icon type="md-clipboard" /> 招标管理</MenuItem>
        </Submenu>
        <Submenu name="5" >
            <template slot="title">
                        <Icon type="ios-apps" />
                        现场管理
                    </template>
         <MenuItem name="empty"><Icon type="md-clipboard" /> 形象进度</MenuItem>
         <MenuItem name="empty"><Icon type="md-clipboard" /> 照片巡检</MenuItem>
        </Submenu>
        <Submenu name="6" >
            <template slot="title">
                        <Icon type="ios-apps" />
                        投资控制
                    </template>
         <MenuItem name="empty"><Icon type="ios-folder" /> 咨询成果</MenuItem>
         <MenuItem name="empty"><Icon type="md-clipboard" /> 预算委托</MenuItem>
        </Submenu>
    </Menu>
      <Drawer  class="container-drawer"  styles="background:#333;border-left:5px solid #2c79ff;padding:0;" :closable="false" v-model="showProjects"  placement="left">
        <template v-for="p in projectList">
             <div class="projectLabelItem"  :key="p.id" @click="switchProject(p.id)">{{p.name}} <Icon type="ios-arrow-forward" color="orange" style="float:right;margin-right:5px;" /></div>
        </template>
           
        </Drawer>
    <div class="l-container  dashboard" style="left:200px;">
       <router-view></router-view>
    </div>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'

import Top from './shared/top'
export default {
    data(){
        return {
            loading:false,
            showProjects:false,
        }
    },
    computed:{
        ...mapGetters('project',{
            getProject:'get',
            projectList:"list"
        }),
        ...mapGetters('user',{
            userinfo:'userinfo',
            concerned_projects:'concerned_projects',
            isConcerned:"isConcerned"
        }),
        id(){
            return this.$route.params.id
        },
        project(){
            return this.getProject(this.id) || {}
        },
        activeNode(){
            let path = this.$route.path
            return path.slice(path.lastIndexOf('/')+1)
        }
    },
    watch:{
        "project.state":{
            handler(v){
                if(v == 0)
                     this.showInstaller = true
            },
            deep:true,
            immediate:true
           
        }
    },
    methods:{
        ...mapActions('user',{
            _whoami:'whoami',
            _logout:"logout"
        }),
        ...mapActions('project',{
            get:'get',
            getList:"getList"
        }),
        concern(id){
            var that = this
            if(this.isConcerned(id)){
                 this.$store.dispatch('user/removeConcernProject',[id]).then(res=>{
                     that.$message.success("取消关注成功")
                 })
            }else{
                 this.$store.dispatch('user/addConcernProject',[id]).then(res=>{
                     that.$message.success("关注成功")
                 })
            }
           
        },
        switchProject(id){
            this.$router.push('/projects/'+id)
            this.showProjects = false
            this.getData()
            this.$forceUpdate()
        },
        getData(){
            this.loading = true
            this.get(this.id).finally(e=>{
                this.loading=false
            })

            this.getList().then()
        },
        logout(){
            this._logout().then(res=>{
                this.$router.push("/")
            })
        },
        routeTo(target){
            if(this.activeNode != target)
                this.$router.push(this.$route.matched[0].path.replace(':id',this.id) +'/' + target)
        },
        routeToProject(project_id){
             if(project_id != this.id)
                this.$router.push(this.$route.matched[1].path.replace(':id',this.id))
        }
    },
    components:{
        Top
    }
}
</script>

<style lang="less" scoped>

.project-header{
    height:50px;
    background:#333;
    
    border-bottom:1px solid #222;
    width:100%;
    position: fixed;
    z-index:2000;
    top:50px;
}
.l-console{
     position: fixed;
        left:0;
        height:50px;
        top:0;
        right:0;
        z-index:1000;
        background:#333;
        
       
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 1px 1px 2px #000;

        .l-console-group{
            display: flex;
            align-items: center;
        }
}

.switch-project-button{
    font-size:14px;
    margin-left:10px;
    position: relative;
    bottom:-5px;
    color:yellowgreen;
    cursor: pointer;
    border:1px solid #333;
    padding:0px 5px;
}

.l-container{
    position: fixed;
    top:50px;
    bottom:0;
    left:240px;
    right:0;
    overflow: hidden;
}

.icon-button{
    padding:10px;
}

.text-button{
    padding:10px;
    color:#eee;
    font-size:15px;
}

.icon-button:hover,.text-button:hover{
    filter:brightness(1.5);
    cursor: pointer;
}

.icon-button:active,.text-button:active{
    position: relative;
    top:1px;
}

.seperator{
    height:30px;
    width:0;
    border-left:1px solid #666;
    border-right:1px solid #333;
    
}

.l-title{
    font-size:18px;
    color:#eee;
}

.menu-item{
    height:50px;
    display: flex;
    align-items: center;
    padding:0 20px;
    font-size:14px;
    color:#eee;
    border-bottom:2px solid #333;
}

.menu-item-selected{
    border-bottom:2px solid rgb(15, 112, 204);
}


.projectLabelItem{
    background:#333;color:#ddf;border-bottom:1px solid #222;width:100%;padding:10px;
    .code{
        font-weight: bold;
        font-size:10px;
        color:#aaa;
    }
}
.projectLabelItem:hover{
    filter:brightness(1.2);
    cursor: pointer;
}

.switch-project-button-active{
    color:orange;
     border:1px solid #333;
}

</style>