<style lang="less">
.title-input{
  width:auto;
  overflow: hidden;
  
  input{
      width:100px;
  }
  
       input:focus{
      transition: all 0.3s;
      width:200px !important;
    }
    
  }
</style>
<template>
  <div class="dashboard" style="background:#eed;">
    
    <Row :gutter="15" style="max-width:1360px;margin:15px auto;" >
      <Col :lg="{span:8}" :md="{span:12}" :xs="{span:24}">
       <Card dis-hover padding="0">
         
        <div class="userinfo-board">
           <gAvatar class="avatar" :size="80" :avatar="userinfo.avatar || 'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/icon/user.png'" :frame="userinfo.frame"  style="position:relative" />
            <div class="info" style="margin-right:5px;">
               <div class="name"> {{userinfo.name}}</div>
               <div class="deps">{{userinfo.deps}}</div>
               <div class="deps">上次登录:{{util.moment(userinfo.lastlogin_at).fromNow()}}</div>
            </div>
        </div>
      </Card>
      <Card dis-hover padding="0" style="margin-top:10px;">
         <div class='flex-between' slot="title">
          <div class="flex-wrap">
            <Icon type="ios-apps" size="15" style='margin-right:5px;'></Icon>
            通知公告
          </div>
          <div class="flex-wrap">
            <a @click="routeTo('/self/notice',false)">更多<Icon type="ios-arrow-forward" /></a>
          </div>
        </div>
        <div class="content">
          <template v-for="n in notices.slice(0,5)">
            <div :key="n.id" class="notice" @click="openNotice(n)">
              <div class="flex-wrap flex-between" style="height:100%;width:100%;">
             
              <div class="title">{{n.title}}  <img class='new' src="https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/kt/new.gif" v-if="util.isNew(n.inputTime)" /></div>
                <div class="date">{{util.moment(n.inputTime).format('YYYY-MM-DD')}} 
              </div>
             
              </div>
             
            </div>
          </template>
        </div>
      </Card>

<div class="panel" v-if="userinfo.role == 'admin' || userinfo.role == 'dev'">
          <div class="list" style="margin-top:10px;">
            <template v-for="m in actions">
            <div class="action-button" :class="m.type?'main-button-selected':''" :key="m.label" @click="onEvent(m.event)">
              <div class="label" >{{m.label}}
              </div>
              <div class="sub">{{m.sub}}</div>
              <div class="new_count" v-if="m.new_count">+{{m.new_count}}</div>
              <div class="count" v-if="m.new_count">{{m.count}}</div>
             <Icon class="add-icon" type="md-add" />
              <Icon class="bg-icon" :type="m.icon" />

              </div>
              
            </template>
          </div>
          
        </div>

      <Upload
        multiple
        style="margin-top:10px;"
        type="drag"
        :show-upload-list='false'
        :before-upload="onUploadFile">
        <div style="padding: 20px 0;">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或拖拽文件到此处上传个人临时文件</p>
        </div>
    </Upload>

    

    <Card dis-hover style="margin-top:10px;" padding="0" v-if="uploadingFiles.length != 0">
        上传中...<br />
        {{uploadingFiles.map(v=>`${v.name}(${v.percent})`).join(',')}}
      </Card>
     
      <Card dis-hover style="margin-top:10px;" padding="0">
         <div class='flex-between' slot="title">
          <div class="flex-wrap">
            <Icon type="ios-apps" size="15" style='margin-right:5px;'></Icon>
            我的文件
          </div>
           <div class="flex-wrap">
            <a @click="routeTo('/self/file',false)">更多<Icon type="ios-arrow-forward" /></a>
          </div>
        </div>
        <div class="content">
            <template v-for="f in files.slice(files.length-5,files.length).reverse()">
            <div :key="f.id" class="notice">
               <div class="flex-wrap" style="height:100%;">
                  <div class="date">{{util.moment(f.inputTime).format('YYYY-MM-DD')}} </div>
                  <div class="ext" style="margin-left:20px;">{{f.ext}}</div>
                  <div class="title">{{f.name}} <img class='new' src="https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/kt/new.gif" v-if="util.isNew(f.inputTime)" /></div>
              </div>
              

               <a :href="util.getFullFileURL(f.url)" target="blank">下载</a>

            </div>
          </template>
         
        </div>
      </Card>
      </Col>
      <Col :lg="{span:16}" :md="{span:12}" :xs="{span:24}">
        <Card dis-hover padding="5" >
        <div class='flex-between' slot="title">
          <div class="flex-wrap" style="padding-left:150px;">
            <Icon type="ios-apps" size="15" style='position:absolute;left:5px;'></Icon>
            <span :class="worktype=='todo'?'head-active':'head-inactive'" @click="worktype='todo'">待办工作 (3)</span> <span style="margin-left:10px;" :class="worktype=='create'?'head-active':'head-inactive'"  @click="worktype='create'">我发起的 (15)</span> <span style="margin-left:10px;" :class="worktype=='done'?'head-active':'head-inactive'"  @click="worktype='done'">已处理 (15)</span>
          </div>
           <div class="flex-wrap">
            <a @click="routeTo('/self/work',false)">所有工作<Icon type="ios-arrow-forward" /></a>
          </div>
        </div>
        <div class="content">
          <div class="list">
            <div class="work">
              <span style='color:#333;font-size:10px;line-height:10px;'>测试项目/前期工作</span>
              <br />申请土地许可证 - 等待审核
             <div class="type"  style="background:#aaa">抄送</div>
             <div class="state-info">
                 <span style='color:#333;font-size:10px;line-height:10px;'>2012-06-17 更新 已超期3天</span><br/>
                马骍
              </div>
            </div>
           <div class="work">
              <span style='color:#333;font-size:10px;line-height:10px;'>测试项目/前期工作</span>
              <br />申请土地许可证 - 等待审核
             <div class="type" style="background:orange">上传</div>
             <div class="state-info">
                 <span style='color:#333;font-size:10px;line-height:10px;'>已超期3天</span><br/>
                马骍
              </div>
            </div><div class="work">
              <span style='color:#888;font-size:10px;line-height:10px;'>测试项目/前期工作</span>
              <br />申请土地许可证 - <span style='background:orange;font-size:10px;padding:2px 5px;margin:0 10px;'>当前阶段</span>等待审核 <span style='background:skyblue;font-size:10px;padding:2px 5px;margin:0 10px;'>下一阶段</span>结束
             <div class="type" style="background:skyblue">办理</div>
             <div class="state-info">
                <span style='color:#333;font-size:10px;line-height:10px;'>已超期3天</span><br/>
                马骍
              </div>
            </div> <div class="work">
              <span style='color:#333;font-size:10px;line-height:10px;'>测试项目/前期工作</span>
              <br />申请土地许可证 - 等待审核
             <div class="type">审核</div>
             <div class="state-info">
                 <span style='color:#333;font-size:10px;line-height:10px;'>已超期3天</span><br/>
                马骍
              </div>
            </div>
           <div class="work">
              <span style='color:#333;font-size:10px;line-height:10px;'>测试项目/前期工作</span>
              <br />申请土地许可证 - 等待审核
             <div class="type" style="background:orange">上传</div>
             <div class="state-info">
                 <span style='color:#333;font-size:10px;line-height:10px;'>已超期3天</span><br/>
                马骍
              </div>
            </div><div class="work">
              <span style='color:#888;font-size:10px;line-height:10px;'>测试项目/前期工作</span>
              <br />申请土地许可证 - 等待审核
             <div class="type" style="background:skyblue">办理</div>
             <div class="state-info">
                <span style='color:#333;font-size:10px;line-height:10px;'>已超期3天</span><br/>
                马骍
              </div>
            </div> <div class="work">
              <span style='color:#333;font-size:10px;line-height:10px;'>测试项目/前期工作</span>
              <br />申请土地许可证 - 等待审核
             <div class="type">审核</div>
             <div class="state-info">
                 <span style='color:#333;font-size:10px;line-height:10px;'>已超期3天</span><br/>
                马骍
              </div>
            </div>
           <div class="work">
              <span style='color:#333;font-size:10px;line-height:10px;'>测试项目/前期工作</span>
              <br />申请土地许可证 - 等待审核
             <div class="type" style="background:orange">上传</div>
             <div class="state-info">
                 <span style='color:#333;font-size:10px;line-height:10px;'>已超期3天</span><br/>
                马骍
              </div>
            </div><div class="work">
              <span style='color:#888;font-size:10px;line-height:10px;'>测试项目/前期工作</span>
              <br />申请土地许可证 - 等待审核
             <div class="type" style="background:skyblue">办理</div>
             <div class="state-info">
                <span style='color:#333;font-size:10px;line-height:10px;'>已超期3天</span><br/>
                马骍
              </div>
            </div>
            </div>
        </div>
        </Card>
      
<Card  dis-hover  padding="5" style="margin-top:10px;">
         <div class='flex-between' slot="title">
          <div class="flex-wrap">
            <Icon type="ios-apps" size="15" style='margin-right:5px;'></Icon>
            我的项目
          </div>
          <div class="flex-wrap">
            <a @click="routeTo('/self/project',false)">所有项目<Icon type="ios-arrow-forward" /></a>
          </div>
        </div>
       <div class="panel">
         
            <div class="list">
                <template v-for="p in myProjects">
                  <div class="action-button" style="padding:5px;width:24%;margin-right:1%;" :key="p.id" @click="openProject(p.id)" :style="`background:url(${p.avatar||'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/sanjiangkou.jpg'})`">
                      <div class="title">{{p.name}} <img class='new' src="https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/kt/new.gif" v-if="util.isNew(p.inputTime)" /></div>
                     
                     
                    <div class="type" :style="`background:${util.mapColor(getType(p.managetype).name?getType(p.managetype).name[0]:'无')}`">{{getType(p.managetype).name|| '未分类'}}</div>
                    <div class="position">项目经理</div>
                      <div class="state" :style="`background-color:${getStateColor(p.state)}`">{{getStateText(p.state)}}</div>
                      
                  </div>
                </template>
          </div>
        </div>
      </Card>

       

       <Card dis-hover padding="0" style="margin-top:10px;" v-if="userinfo.role != 'member'">
        <div class='flex-between' slot="title">
          <div class="flex-wrap">
            <Icon type="ios-apps" size="15" style='margin-right:5px;'></Icon>
            关注项目
          </div>
          <div class="flex-wrap">
            <a href="/self/project">调整<Icon type="ios-arrow-forward" /></a>
          </div>
        </div>
       <div class="panel">
         
          <div class="content" style="position:relative;overflow:hidden;padding:0;">
                      
             <div class="list" style="padding:5px;">
                <template v-for="p in ConcernedProjects">
                  <div class="preview-project-item" :key="p.id" @click="openProject(p.id)">
                      <img class="bg" :src="p.avatar || 'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/sanjiangkou.jpg'" />
                      <div class="info">
                      <div class="id"><span style="color:red">{{p.code}}</span> / {{p.name}} <img class='new' src="https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/kt/new.gif" v-if="util.isNew(p.inputTime)" /></div>
                     
                      <div class="charger">
                        <span style="font-size:10px;color:#aaa;">负责人</span><br />
                        {{p.charger || "无"}}
                      </div>
                     
                      </div>
                       <div class="state-image" style="padding:0;position:absolute;bottom:10px;left:10px;right:10px;">
                        <div class="block" :class="'s'+b" v-for="b in '1002311'" :key='b'>
                          23/24
                        </div>
                      </div>
                      
                       <div class="type" :style="`background:${util.mapColor(getType(p.managetype).name?getType(p.managetype).name[0]:'无')}`">{{getType(p.managetype).name || '未分类'}}</div>
                      <div class=""
                  </div>
                </template>
            </div>
          </div>
        </div>
      </Card>
      </Col>
      
    </Row>
    <Modal title="任务" width="900" v-model="showTask" footer-hide>
        
    </Modal>


    <Modal title="项目" width="700" v-model="showProjectCreater" footer-hide @on-cancel="projectCreateState=0">
       <div class='full-fill' style='position:relative'>
      <template v-if="projectCreateState==2">
         <div class='flex-wrap' style="padding:30px;font-size:20px;"><Icon type="ios-checkmark-circle-outline" size="50" color="green" style='margin-right:10px;' /> 创建成功 <a style='margin-left:10px;' @click="routeTo('projects/'+currentProjectId)">[ {{currentProjectId}} ] {{getProject(currentProjectId)?getProject(currentProjectId).name:"--"}} (点击进入项目)</a></div>
      </template>
      <template v-else>
        <template v-if="projectCreateState==1">
       
        <Spin fix>
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
        项目空间创建中..请稍后
        
      </template>
        <gzForm style="margin:10px;" :form="formProject" editable @on-submit="onSubmit" />
     
      </template>
         </div>
  </Modal>

  <Modal title="工作" width="700" v-model="showTaskCreater" footer-hide>
     <gzForm style="margin:10px;" :form="formTask" editable @on-submit="onSubmitTask" />
  </Modal>


  <Modal title="通知" width="700" v-model="showNoticeCreater" footer-hide>
     <gzForm style="margin:10px;" :form="formNotice" editable @on-submit="onSubmitNotice" />
  </Modal>

  <Modal title="通知" width="700" v-model="showNoticeViewer" footer-hide>
     <notice style="margin:10px;"  :data="selectedNotice" />
  </Modal>

  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Calender from "@refs/calender/index"
import gzForm from '@refs/gzUI/form/index'
import formProject from './project/form.js'
import formNotice from './shared/notice_form.js'
import formTask from './shared/work_form.js'
import notice from './shared/notice'
import gantt from '@refs/gzUI/gantt/gantt'
import DDD from './shared/3d'
import gAvatar from '@refs/avatar/index'
export default {
  data(){
    return {
      worktype:'todo',
      showProjectCreater:false,
      showNoticeCreater:false,
      showTaskCreater:false,
      item:{
        back:false
      },
      showNoticeViewer:false,
      actions:[{
      id:1,
      label:"新增项目",
      icon:"md-apps",
      event:"create-project"
    },{
      id:2,
      label:"工作安排",
      icon:"ios-bookmarks",
      event:"create-task"
    },{
      id:3,
      label:"发布通知",
      icon:"ios-git-network",
      event:"create-notice"
    },{
      id:3,
      label:"上传资料",
      icon:"ios-git-network",
      event:"create-archieve"
    }],
     }
  },
  methods: {
    
    onEvent(e){
      if(e == 'create-project'){
        this.showProjectCreater = true
      }else if(e == 'create-notice'){
        this.showNoticeCreater = true
      }else if(e == 'create-task'){
        this.showTaskCreater = true
      }
    },
    openProject(id) {
      let routerUrl = this.$router.resolve({
        path: `/projects/${id}`
      });
      window.open(routerUrl.href, "_blank");
    },
    openOrder(id){
       let routerUrl = this.$router.resolve({
        path: `/orders/${id}`
      });
      window.open(routerUrl.href, "_blank");
    },
    
    getOrderColor(s){
      const stypesColor = {
        requirement:'darkblue',
        bugreport:'darkred'
      }
      return stypesColor[s] || '#333'
    },
    getOrderType(s,t){
      const stypes = {
        requirement:"开发需求",
        bugreport:"错误报告"
      }
      return (stypes[s] || '其他') +(t?(' / ' + t):'')
    },
    getData(){
       this.$store.dispatch('project/getList')
       this.$store.dispatch('tables/list',{key:'orders'})
    },
    routeTo(path,newBlank=true){
      if(path == 'createProject'){
        this.showProjectCreater = true
        return
      }

      if(newBlank){
      let routerUrl = this.$router.resolve({
        path
      });
      window.open(routerUrl.href, "_blank");
      }else{
        this.$router.push(path)
      }
    },
    onSubmitNotice(e){
      var that = this
      this.$store.dispatch('notice/patch',e).then(res=>{
        this.showNoticeCreater = false
        that.$Modal.success({
          title:"操作完成",
          content:"发布成功"
        })
      })
    },
    onUploadFile(e){
      
      this.$store.dispatch('file/upload',{files:e}).then(res=>{
        this.$Notice.success({
          title:'上传成功',
          desc:"文件已上传完毕"
        })
      }).catch(e=>{
         this.$Notice.error({
          title:'上传失败',
          desc:e
        })
      })
      return false
    },
    onSubmit(e){
      this.projectCreateState = 1
      var that =this
      this.$store.dispatch('project/create',e).then(id=>{
          this.currentProjectId = id
      }).finally(e=>{
          that.projectCreateState = 2
      })
    },
    openNotice(n){
      this.showNoticeViewer = true
      this.selectedNotice = n
    }
  },
  computed: {
    ...mapGetters("project", {
      getStateText:"getStateText",
      getStateColor:"getStateColor",
      listByUser: "listByUser",
      getByIds:"getByIds",
      getProject:"get",
      patch:"patch"
    }),
    ...mapGetters("user", {
      userinfo: "userinfo",
      concerned_projects:"concerned_projects"
     
    }),
    ...mapGetters("notice",{
      notices:"list"
    }),
    ...mapGetters("tables",{
      getList:"getList"
    }),
    ...mapGetters("messages",{
        list:'list'
    }),
    ...mapGetters("kernel",{
       getUserById:"getUser",
        getType:"getType"

    }),
    ...mapGetters("file",{
       files:"list",
       uploadingFiles:"uploadingFiles"
    }),
    ConcernedProjects(){
      return this.getByIds(this.userinfo.concerned)
    },
    formProject(){
      return formProject
    },
    formNotice(){
      return formNotice
    },
    formTask(){
      return formTask
    },  
    orders(){
      return this.getList('orders') || []
    },
    myProjects() {
      return this.listByUser(this.userinfo.id);
    }
  },
  components:{
    gzForm,notice,gantt,DDD,gAvatar
  }
};
</script>
<style lang="less" scoped>
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
  
   
   .userinfo-board{
     padding:10px;
       background:linear-gradient(to bottom right,rgba(4, 144, 243, 0.5),#03528a80),url('https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/black.jpg');
       border:5px solid #333;
       border-radius: 5px;
      background-blend-mode:lighten;
      color:#fff;
      display: flex;

    .info{
      margin-left:10px;
      .name{
        font-size:20px;
        font-weight: bold;
        color:#fff;
      }
    }
   }


</style>