<template>
  <Card style="margin:10px;">
      <h2 slot="title">预设工作模板</h2>
      <div style="width:190px;position:absolute;left:16px;top:64px;bottom:16px;border:1px solid #aaa;padding:10px;">
          <template v-for="t in typeSelections">
              <div class="selectable" :class="selected_type==t.id?'selectable-selected':''" @click="selected_type=t.id" :key='t.id'><Icon type="ios-pricetag" style="margin-right:5px;" /> {{t.name}} ({{count(t.id,tasks)}})</div>
          </template>
        </div>
    <div class="flex-between gz-card-style" style="margin-bottom:10px;margin-left:200px;">
           <div class="flex-wrap">
          <Input search enter-button="搜索" v-model="search_text" placeholder="输入编号/名称/类别..." style='width:300px;' />
           </div>
           <div class="flex-wrap" style="margin:0;">
             
               <Button icon="md-add" @click="onAdd">新增工作模板</Button>
              
            </div>
          </div>
          <gzTable style="top:50px;border:1px solid #888;margin-left:200px;right:10px;bottom:10px;" :columns="cols" :data="filterByType(selected_type,tasks)" :option="{stripe:true}" :onEvent="onEvent" />

           <!-- Dialog: add archive -->
        <Modal v-model="showFormAdd" title="新增工作模板" footer-hide width="700">
          <gzForm style="margin:10px;" :form="formdef" :data="formAddData"  @on-submit="onSubmit" :initData="initData" editable />
          
        </Modal>
                              
         </Card>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import gzAvatar from '@refs/avatar'
import gzTable from '@refs/gzUI/tableframe/table.vue'
import gzForm from '@refs/gzUI/form/index.vue'

import formDef from './form_task'
export default {
  data(){
    return {
      selected_type:null,
      formAddData:{
      },
      showFormAdd:false,
      showFormAddTemplate:false,
      cols:[{key:"id",title:"序号",
        align:"center",type:"index",width:60},
        {key:"type_id",title:"工作分类",type:"type",
       width:120,
        option:{
           align:"center",
          getters:"kernel/types",
          getters_key:'task_type'
        },
        },{
          key:"title",title:"工作内容",type:'text',
          minWidth:200,
        align:"center",
        event:"open"
        },{
          key:"duratin",title:"计划时间",type:'time',width:120,
        align:"center",
        option:{
          type:'date'
        }
        },{
          key:"state",title:"状态",type:"state",
        align:"center",width:120,
        option:{
          states:['未启用','启用']
        }
        },{
          key:"stype",title:"工作类型",
          type:"type",width:140,
          align:"center",
          option:{
            getters:'kernel/worktypes'
          }
        },{
          key:"files",title:"操作",
          type:"tool",width:140,
          align:"center",
          buttons:['edit','delete']
        }]
    }
  },
   components:{
        gzAvatar,gzTable,gzForm
    },
    computed:{
      formdef(){
        return formDef
      },
      ...mapGetters('user',['userinfo']),
       ...mapGetters('project',{
            getProject:'get'
        }),
        ...mapGetters('kernel',{
            getUser:'getUser',
            types:'types'
        }),
        ...mapGetters('task',{
          tasks:'listTemp',
          listBy:'listTempByCategory'
        }),
        typeSelections(){
          let types = this.types('task_type')
          if(types)
            return [{name:"所有类别"},...types]
          else
            return [{name:"所有类别"}]
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
        },
      initData(){
        var that = this
        return {
          title:"新增任务",project:[this.project.id],type_id:"type000000003000",
          startTime:moment().format('YYYY-MM-DD'),
          stype:"order",charger:that.userinfo.gy_id
        }
      }
    },
    mounted(){
      console.log(this.userinfo)
    },
    methods:{
        filterByType(type_id,tasks){
            if(!type_id)
                return tasks
            return tasks.filter(v=>v.type_id == type_id)
        },
        count(type_id,tasks){
            if(!type_id)
                return tasks.length
            return tasks.filter(v=>v.type_id == type_id).length
        },
        onEvent(e){
            return true
        },
      onAdd(){
        this.showFormAdd = true
      },
      onAddTemplate(){
        this.showFormAddTemplate = true
      },
      onSubmit(e){
        this.$store.dispatch('task/patchTemp',e).then(res=>{
          this.$Modal.success({
            title:'操作完成',
            content:"任务添加成功"
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