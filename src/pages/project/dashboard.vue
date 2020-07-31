<template>
  <div class="full-fill dashboard">
      <img class="bg-mark" :src="project.avatar || 'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/timg.jpg'" />
      
      <Row :gutter="10" style="margin:10px;">
          <Col :span="6">
 

            <Card  style="background:#fff;">
                
             <div class='flex-between' slot="title">
          <div class="flex-wrap">
            <Icon type="ios-apps" size="15" style='margin-right:5px;'></Icon>
            项目信息
          </div>
          <div class="flex-wrap">
            <a @click="showModalProjectInfo = true">修改<Icon type="ios-arrow-forward" /></a>
          </div>
        </div>
                <div class="project-info">
             <Row :gutter="10">
                <Col :span='12'> 
                <label>项目类型</label> {{getType(project.managetype).name}}</Col>
                <Col :span='12'> <label>建筑类型</label> {{getType(project.buildtype).name}}</Col>
             </Row>
             <Row :gutter="10">
                <Col :span='12'> 
                <label>项目状态</label> {{mapState(project.state)}}</Col>
                <Col :span='12'> <label>项目金额</label> {{util.formatSalary(project.amount)}}</Col>
             </Row>
             
             <Row :gutter="10">
                <Col :span='12'> 
                <label>用地面积(m<sup>2</sup>)</label> {{util.formatSalary(project.area)}}</Col>
                <Col :span='12'> <label>建筑面积(m<sup>2</sup>)</label> {{util.formatSalary(project.buildingArea)}}</Col>
             </Row>
             
             <Row :gutter="10">
                <Col :span='24'> 
                <label>投资单位</label>   {{project.investionSide}}</Col>
             </Row>
             <Row :gutter="10">
                <Col :span='24'> 
                <label>监理单位</label>    {{project.supervisorSide}}</Col>
             </Row>
              <Row :gutter="10">
                <Col :span='24'> 
                <label>建设单位</label>   {{project.constructionSide}}</Col>
             </Row>
             <Row :gutter="10">
                <Col :span='24'> 
                <label>项目地址</label>   {{project.address}}</Col>
             </Row>
             
             
              
            </div>
              <Carousel style="margin-bottom:10px;" :autoplay="images.length > 1" v-model="value2" loop>
                        <template v-for="img in images">
                <CarouselItem :key="img">
                    <img style="width:100%" :src="img || 'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/timg.jpg'" />
                </CarouselItem>
                </template>
            
            </Carousel>
              <p>{{project.desc || "无简介"}}</p>
          </Card>
         <Card  style="margin-top:10px;background:#fff;">
          <div class='flex-between' slot="title">
          <div class="flex-wrap">
            <Icon type="ios-apps" size="15" style='margin-right:5px;'></Icon>
            项目信息
          </div>
          <div class="flex-wrap">
            <a @click="showModalProjectInfo = true">修改<Icon type="ios-arrow-forward" /></a>
          </div>
        </div>
          <div>
               
              <template v-for='(n,i) in members'>
                <Row :key='n.name'>
                  <Col :span='8' class="position">
                   {{n.position}} 

                  </Col>
                  <Col :span='8'>
                  <div class="flex-wrap">
                  <gzAvatar class="avatar" :userinfo="getUser(n.user)" size="20" style="margin-right:5px" /> {{getUser(n.user)?getUser(n.user).name:""}} 
                  </div>
                  </Col>
                  <Col :span='8'>
                  <a style="width:100%;text-align:right">更换</a>
                  </Col>
              </Row>
              </template>
          </div>
      </Card>
        
         
      </Col>
       <Col :span="18">
        <Row :gutter="10">
            <Col :span="12">
           <Card  style="background:#fff;height:200px;" >
          <div class='flex-between' slot="title">
          <div class="flex-wrap">
            <Icon type="ios-apps" size="15" style='margin-right:5px;'></Icon>
            项目公告
          </div>
          <div class="flex-wrap">
            <a @click="showModalProjectNote = true">修改<Icon type="ios-arrow-forward" /></a>
          </div>
        </div>
          <div style="white-space:pre-wrap;">{{project.note || '欢迎使用宁波江北开投信息平台项目管理'}}</div>
      </Card>
            </Col>
            <Col :span="12">
             <Card  style="background:#fff;height:200px;">
          <div class='flex-between' slot="title">
          <div class="flex-wrap">
            <Icon type="ios-apps" size="15" style='margin-right:5px;'></Icon>
            项目通知
          </div>
          <div class="flex-wrap">
            <a @click="addNotice">添加<Icon type="ios-arrow-forward" /></a>
          </div>
        </div>
          <div>
              <template v-for='(n,i) in notices.slice(0,6)'>
                <Row :key='n.name'>
                  <Col :span='6' class="position">
                   {{util.formatSmartTime(n.inputTime)}} 

                  </Col>
                  <Col :span='18'>
                  <a  @click="openNotice(n)">{{n.title}}  <img class='new' src="https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/kt/new.gif" v-if="util.isNew(n.inputTime)" /></a>
                  </Col>
              </Row>
              </template>
          </div>
      </Card>
            </Col>
        </Row>

        <Card style="margin-top:10px;min-height:600px;">
          <h2 slot="title">我的工作</h2>
          
          <div class="flex-between gz-card-style" style="margin-bottom:10px">
           <div class="flex-wrap">
          <Input search enter-button="搜索" size="small" v-model="search_text" placeholder="输入编号/名称/类别..." style='width:300px;' />
          
          <div class="type-filter-box" style="margin-left:10px;">
           <Button icon="ios-pricetag" size="small" @click="onAdd">新增工作</Button>
           </div>
           </div>
           <div class="flex-wrap" style="margin:0;">
               <Button icon="md-add" size="small" @click="onAdd">新增工作</Button>
              
            </div>
          </div>
          <gzTable style="top:50px;border:1px solid #888;left:10px;right:10px;bottom:10px;" :columns="tableWork" :data="listByProject(id)" :option="{stripe:true}" :onEvent="onEvent" />
         
      </Card>
       </Col>
      </Row>

      <Modal title="修改项目信息" width="800" v-model="showModalProjectInfo" footer-hide>
          <gzForm style='margin:10px;' :form="projectForm" editable :data="project" @submit="onSubmit" />
      </Modal>

       <Modal title="修改项目信息" width="800" v-model="showModalProjectNote" footer-hide>
          <gzForm style='margin:10px;' :form="projectNote" editable :data="project" @submit="onSubmit" />
      </Modal>

      
    <Modal title="通知" width="700" v-model="showNoticeCreater" footer-hide>
        <gzForm style="margin:10px;" :form="noticeForm" editable @on-submit="onSubmitNotice" />
    </Modal>

      <Modal title="通知" width="700" v-model="showNoticeViewer" footer-hide>
     <notice style="margin:10px;"  :data="selectedNotice" />
  </Modal>

    <!-- Dialog: add archive -->
        <Modal v-model="showFormAdd" title="新增工作" footer-hide width="700">
          <gzForm style="margin:10px;" :form="formdef" :data="formAddData"  @submit="onSubmit" :initData="initData" editable @change="model = $event">
            <fieldset style="margin-top:20px;" v-if="model.stype != undefined?model.stype:formAddData.stype">
              <legend style='margin-left:10px'>流程配置</legend>
              <gzForm style="margin:10px;" :form="formConfig" :data="model.config?model.config:formAddData.config"  @submit="onSubmit" :initData="initData" editable @change="model.config == $event" />
            </fieldset>
          </gzForm>
          
        </Modal>

        <Modal v-model="showProcessor" footer-hide width="1200">
          <gzWorkDetail :work='activeWork' />

        </Modal>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import gzAvatar from '@refs/avatar'
import gzTable from '@refs/gzUI/tableframe/table.vue'
import gzForm from '@refs/gzUI/form/index.vue'
import projectForm from '../shared/forms/f_project'
import notice from '../shared/notice'
import tableDef from '../shared/tables/t_work'
import  projectNote from '../shared/forms/f_project_note.js'
import noticeForm from '../shared/notice_form.js'

import formDef from '../shared/forms/f_work'
import gzWorkDetail from '../shared/work'
export default {
 data(){
        return {
            loading:false,
             selectedKey:"all",
      files:[],
      formEditable:true,
      formNotice:{},

       model:{},
      selection:[],
      showProcessor:false,
      activeWork:null,
      selectedNotice:null,
      showNoticeCreater:false,
      showNoticeViewer:false,
      showModalProjectNote:false,
      search_text:"",
      projectFormData:{},
        formAddData:{
      },
      showFormAdd:false,
      showModalProjectInfo:false,
      selected_filter:[],
      switchAssciate:false,
      filter_keys:[
        {key:'type',
          type:'type',
          name:'档案分类',
          getters:'kernel/types',
          getters_key:'archive_type'
        },{key:'type2',
        type:'type',
          name:"档案类型",getters:'kernel/types',
          getters_key:'archive_type2'

        },{key:'date',
        type:'year',
        name:'档案年份'}
      ],
      showFormAddArchieve:false,
      showFormShowArchieve:false,
      formAddArchiveData:{}
    }},
    components:{
        gzAvatar,gzTable,gzForm,notice,gzWorkDetail
    },
    computed:{
        ...mapGetters('project',{
            getProject:'get'
        }),
        ...mapGetters('kernel',{
            getUser:'getUser',
            getType:"getType"
        }),
        ...mapGetters("notice",{
            notices:"list"
        }),
         ...mapGetters('task',{
          tasks:'list',
          listByProject:"listByProject"
         }),
           tableWork(){
               const removed = ['stype','tools']
              return tableDef.filter(v=>!removed.includes(v.key))
       
      }, projectForm(){
            return projectForm
        }, formdef(){
        let form = {...formDef}
        form.layout = `<div><Row :gutter='10'>
        <Col span='24'>{{title}}</Col>
        </Row><Row :gutter='10'  style='margin-top:10px;'>
        <Col span='8'>{{type_id}}</Col><Col span='8'>{{charger}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col span='12'>{{startTime}}</Col><Col span='12'>{{deadline}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col>{{content}}</Col>
        </Row> <Row :gutter='10' style='margin-top:10px;'>
        <Col>{{files}}</Col></Row>
        <Row :gutter='10'  style='margin-top:10px;'>
        <Col span='8'>{{stype}}</Col>
        </Row></div>`
        return form
      },
      formConfig(){
         let form = {...this.formdef}
        console.log('form:',form,formDef)
        form.layout = `<div><Row :gutter='10'>
        <Col span='24'>{{title}}</Col>
        </Row><Row :gutter='10'  style='margin-top:10px;'>
        <Col span='8'>{{type_id}}</Col><Col span='8'>{{charger}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col span='12'>{{startTime}}</Col><Col span='12'>{{deadline}}</Col>
        </Row>
        <Row :gutter='10' style='margin-top:10px;'>
        <Col>{{content}}</Col>
        </Row> <Row :gutter='10' style='margin-top:10px;'>
        <Col>{{files}}</Col></Row>
        <Row :gutter='10'  style='margin-top:10px;'>
        <Col span='8'>{{stype}}</Col>
        </Row></div>`
        form.option = {hideAction:true}
        return form
      },
        noticeForm(){
            return noticeForm
        },
        projectNote(){
            return projectNote
        },
      formAddWork(){
        return formDef
      },
        id(){
            return this.$route.params.id
        },
        project(){
            return this.getProject(this.id) || {}
        },
        images(){
            if(this.project._images)
                return this.project._images
            else
                return []
        }
    },
    watch:{
        id:{
          handler(v){
            this.$forceUpdate()
          },
            immediate:true
        },
      
    },
    mounted(){
        
    },
    methods:{
        onEvent(e,param){
        var that = this
        if(e == 'process'){
        this.activeWork = param
        this.showProcessor = true
        }else if(e == 'edit'){
          this.formAddData = param
          this.showFormAdd = true
        }else if(e == 'delete'){
          this.$Modal.confirm({
            title:"操作确认",
            content:`将删除任务<span style='color:red;margin:0 3px;font-weight:bold'>${param.title}</span>,及其相关所有数据,是否继续?`,
            onOk(){
              that.$store.dispatch('task/del',param.id).then(res=>{
                that.$Notice.success({
                  title:"操作完成",
                  desc:"任务已删除"
                })
              }).catch(e=>{
                setTimeout(() => {
                      that.$Modal.error({
                  title:'删除失败',
                  content:e})
                }, 500);
              })
            }
          })
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
        addNotice(){
            this.showNoticeCreater = true
        },
         openNotice(n){
      this.showNoticeViewer = true
      this.selectedNotice = n
    },mapState(s){
      const states = ['准备中','进行中','已竣工','已结束','已中止']
      return states[s]
    },
        onSubmit(e){
        var that =this
        this.$store.dispatch('project/patch',e).then(id=>{
            this.$Notice.success({
                title:"操作完成",
                notice:"项目信息修改完成"
            })
        }).catch(e=>{
            this.$Model.error({
                title:"错误",
                content:e
            })
        }).finally(e=>{
            this.showModalProjectInfo = false
            this.showModalProjecNote = false
        })
        },
    }
}
</script>

<style lang="less" scoped>
.l-page{
  

    .l-board{
    width:100%;
    margin-top:10px;
    .l-attrs{
        width:100%;
        
        border:1px solid #333;
        filter:drop-shadow(1px 1px 1px #333);
        z-index:1200;
        .l-logo{
            background:#aaa;
            width:100%;
            height:230px;
            overflow: hidden;
            position: relative;
            img{
                width:100%;
                height:100%;
            }
        }
    }
    

    .l-desc{
        width:100%;
        margin:20px;
        overflow: hidden;
        margin-left:380px;
        padding-top:20px;
        h1{
            width:100%;
        }

        p{
        }
        
    }

    
}

.l-panel{
        min-height:100px;
        margin-top:10px;
        width:100%;
    }

    .l-content{
        margin:20px 0;
    }
}

.l-attr-item{
    
    background:#fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    position: relative;
    background:rgb(7, 74, 136);

    .l-attr-label{
        width:100px;
        position: absolute;
        left:0;
        top:0;
        bottom:0;
        
        color:#ddd;
        display: flex;
        justify-content: center;
        align-items: flex-start;

        font-size:14px;
    }

    .l-attr-value{
        display: flex;
        align-items: center;
        padding:0 10px;
        font-size:14px;
        background:#dfdfdf;
        width:100%;
        margin-left:100px;
    }
}

.l-attr-item:nth-child(odd){
    filter:brightness(1.2)
}

.l-node-list{
    display: flex;
    flex-wrap: wrap;
   
    padding-left:10px;
    padding-top:10px;
    .l-node{
        margin-right:10px;
        margin-bottom:10px;
        height:100px;
        width:150px;
        border:1px solid #dfdffd;
    }
}


.l-progress-list{
    display: flex;
    flex-wrap: wrap;
    padding-left:10px;
    padding-top:10px;
    .l-progress{
        margin-right:10px;
        margin-bottom:10px;
        height:180px;
        width:250px;
        border:1px solid #dfdffd;
    }
}


.bg-mark{
    position: fixed;
    opacity:0.2;
    width:100%;
    filter:brightness(0.6);
}


.l-position-list{
     display: flex;
    flex-wrap: wrap;
    padding-left:10px;
    padding-top:10px;

    .l-node{
        margin-right:30px;
        margin-bottom:10px;
        width:150px;
        padding-left:30px;
        border:1px solid #dfdffd;
        position: relative;
        .avatar{
            position: absolute;
            left:-10px;
        }
    }

}

.position{
  color:rgb(7, 100, 134);
  font-weight: bold;
}


.project-info{
    background:linear-gradient(to bottom right,rgb(1, 93, 158),rgb(13, 81, 129));
    padding:10px;
    margin-bottom:10px;
    border-radius: 5px;
    label{
        color:orange;
        text-shadow: 1px 1px 1px #333;
        font-weight: bold;
        margin-right:5px;
    }

    color:#fff;
    font-size:14px;
}

</style>