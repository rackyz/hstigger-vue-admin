<template>
  <Card style="margin:10px;">
      <h2 slot="title">前期工作</h2>
    <div class="flex-between gz-card-style" style="margin-bottom:10px">
           <div class="flex-wrap">
          <Input search enter-button="搜索" v-model="search_text" placeholder="输入编号/名称/类别..." style='width:300px;' />
            <Button @click="search_text=''" style='margin-left:10px;' v-if="search_text">取消检索</Button>
           </div>
           <div class="flex-wrap" style="margin:0;">
             
              <Button icon="md-add" @click="onAddTemplate" style='margin-right:10px;'>批量增加</Button>
               <Button icon="md-add" @click="onAdd">新增工作</Button>
              
            </div>
          </div>
          <gzTable style="top:50px;border:1px solid #888;left:10px;right:10px;bottom:10px;" :columns="tableDef" :data="onFilter(listBy(id,type))" :option="{stripe:true}" :onEvent="onEvent" />

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

         <Modal v-model="showFormAddTemplate" title="批量添加" footer-hide width="500">
           <div class='l-form' style="padding:10px 20px;">
              <div class="l-form-layout">
                 <div class='l-form-action' style="justify-content:flex-start;">
                 <div class='g-button l-button' @click='onSelectAll' style='margin-right:5px;'>
                      全选 ({{listTempByType(type).length}})
                  </div><div class='g-button l-button' @click='onClearSelection'>
                      清空 ({{selection.length}} 已选)
                  </div>
                  </div>
                  <div style="padding:20px;border:1px solid #aaa;background:#fff;margin-top:10px;max-height:300px;overflow-y:auto;">
                    <template v-for="w in listTempByType(type)">
                      <div :key="w.id">
                      <Checkbox :value="selection.includes(w.id)" :disabled="listBy(id,type).find(v=>v.title ==w.sequence+'-'+w.title)" :key="w.id" @on-change="handleSelectionChange(w.id)">{{w.sequence}} {{w.title}}<span v-if="listBy(id,type).find(v=>v.title == (w.sequence+'-'+w.title))" style="margin-left:20px;color:green;">已添加</span></Checkbox> 
                      </div>
                    </template>
                  </div>
              </div>
              <div class='l-form-action'>
                  <div class='g-button l-button l-button-primay' @click='onSubmitAddTemplate' :loading="loading">
                      提交
                  </div>
              </div>
          </div>
          
        </Modal>                                 
         </Card>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import gzAvatar from '@refs/avatar'
import gzTable from '@refs/gzUI/tableframe/table.vue'
import gzForm from '@refs/gzUI/form/index.vue'

import formDef from '../shared/forms/f_work'
import tableDef from '../shared/tables/t_work'
import gzWorkDetail from '../shared/work'
export default {
  data(){
    return {
      loading:false,
      model:{},
      selection:[],
      showProcessor:false,
      activeWork:null,
      search_text:"",
      formAddData:{
      },
      showFormAdd:false,
      showFormAddTemplate:false
    }
  },
   components:{
        gzAvatar,gzTable,gzForm,gzWorkDetail
    },
    computed:{
      tableDef(){
        return tableDef
      },
      type(){
        return this.$route.meta.key
      },
      formdef(){
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
      ...mapGetters('user',['userinfo']),
       ...mapGetters('project',{
            getProject:'get'
        }),
        
        ...mapGetters('kernel',{
            getUser:'getUser'
        }),
        ...mapGetters('task',{
          tasks:'list',
          listTempByType:'listTempByCategory',
          listBy:'listByProjectAndCategory'
        }),
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
        },
      initData(){
        var that = this
        return {
          name:"新增任务",project:[this.project.id],type_id:"type000000003000",
          startTime:moment().format('YYYY-MM-DD'),
          stype:"order",charger:that.userinfo.gy_id
        }
      }
    },
    methods:{
      onFilter(items,search_text){
        if(items && this.search_text)
          return items.filter(v=>v.title && v.title.includes(this.search_text))
        else
          return items
      },
      onSelectAll(){
        let task_titles = this.listBy(this.id,this.type).map(v=>v.title)
        this.selection = this.listTempByType(this.type).filter(v=>!task_titles.includes(v.title)).map(v=>v.id)
      },
      onClearSelection(){
        this.selection = []
      },
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
      onAdd(){
        this.showFormAdd = true
      },
      onAddTemplate(){
        this.showFormAddTemplate = true
      },
      onSubmitAddTemplate(){
        var that = this
        let items = this.listTempByType(this.type).filter(v=>this.selection.includes(v.id)).map(v=>({
          title:v.sequence +'-' + v.title,
          charger:that.userinfo.gy_id,
          type_id:that.type,
          project:[that.id],
          stype:'order',
          content:v.content,
          files:v.files
        }))

        this.loading = true
        this.$store.dispatch('task/post',items).then(res=>{
          that.$Modal.success({
            title:"操作成功",
            content:"工作已添加完成"
          })
          that.showFormAddTemplate = false
        }).finally(()=>{
          this.loading = false
        })
        
      },
       handleSelectionChange(id,e){
          let index = this.selection.findIndex(v=>v == id)
          if(index == -1){
            this.selection.push(id)
          }else{
            this.selection.splice(index,1)
          }
        },
      onSubmit(e){
        console.log("form-submit:",e)
        e.project = [this.project.id]
        this.$store.dispatch('task/patch',e).then(res=>{
          this.$Modal.success({
            title:'操作完成',
            content:e.id?"任务已修改":"任务添加成功"
          })
          this.showFormAdd = false
          this.formAddData = {}
        }).catch(e=>{
           this.$Modal.error({
            title:'添加失败',
            content:e
          })
        })
      }
    }
   
}
</script>

<style>

</style>