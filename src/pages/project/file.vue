
  <!-- <Card class='full-fill' style="background:#fff;margin:10px;">
     
        <div class="flex-between gz-card-style" style="margin-bottom:10px">
           <div class="flex-wrap">
          <Input search enter-button="搜索" v-model="search_text" placeholder="输入编号/名称/类别..." style='width:300px;' />
           </div>
           <div class="flex-wrap" style="margin:0;">
               <Button icon="md-add" @click="onAdd">上传资料</Button>
              
            </div>
          </div>
         <gzTable style="top:50px;border:1px solid #888;left:10px;right:10px;bottom:10px;" :columns="cols" :data="Filter(list,search_text)" :option="{stripe:true}" :onEvent="onEvent" /> -->
   <template>
  <Card class='full-fill' style="margin:10px;margin-bottom:0;">
      <h2 slot="title">项目资料</h2>
    <div class="flex-between gz-card-style" style="margin:0;">
           <div class="flex-wrap">
          <Input search enter-button="搜索" v-model="search_text" placeholder="输入编号/名称/类别..." style='width:300px;' />
           </div>
           <div class="flex-wrap" style="margin:0;">
               <Button icon="md-add" @click="onAdd">新增工作</Button>
              
            </div>
          </div>
          <gzTable style="top:95px;border:1px solid #888;" :columns="cols" :data="Filter(list,search_text)" :option="{stripe:true}" :onEvent="onEvent" />
       

    <!-- Dialog: add archive -->
    <Modal v-model="showFormAddArchieve" title="新增资料" footer-hide width="700">
      <gzForm style="margin:10px;" :form="form" :data="formAddArchiveData" @on-submit="onSubmit" editable />
    </Modal>

    <Modal v-model="showFormShowArchieve" title="档案资料" footer-hide width="700">
      <keep-alive>
      <gzForm style="margin:10px;" :form="form" :data="formAddArchiveData" :editable="false" />
      </keep-alive>
    </Modal>
  </Card>

 
</template>

<script>
import gzTable from '@refs/gzUI/tableframe/table.vue'
import gzForm from '@refs/gzUI/form/index.vue'
import {mapGetters} from 'vuex'
export default {
  data(){
    return {
      selectedKey:"all",
      files:[],
      formEditable:true,
      search_text:"",
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
      formAddArchiveData:{},
       form:{
                title:'项目基本情况',
                layout:`<div><Row :gutter='10'>
                <Col :span='8'>{{code}}</Col>
                <Col :span='16'>{{name}}</Col>
                </Row>
                <Row :gutter='10' style='margin-top:10px'>
                <Col :span='7'>{{date}}</Col>
                <Col :span='10'>{{type}}</Col>
                <Col :span='7'>{{type2}}</Col>
                </Row>
                <Row :gutter='10' style='margin-top:10px'>
                <Col :span='24'>{{note}}</Col>
                </Row>
                <Row :gutter='10' style='margin-top:10px'>
                <Col :span='24' style='height:200px' >{{files}}</Col></Row></div>`,
                def:{
                    code:{
                        label:"档案编号",
                        control:'input',
                        option:{
                          required:true
                        }
                    },
                    name:{
                        label:"档案名称",
                        control:'input',
                        
                        option:{
                          required:true
                        }
                    },
                    date:{
                      label:"档案日期",
                      control:"time",
                      option:{
                        type:'date'
                      }
                    },
                    type:{
                         label:"档案分类",
                        control:'select',
                        option:{
                            required:true,
                            getters:"kernel/types",
                            key:"archive_type"
                        }
                    },
                    type2:{
                        label:"档案类型",
                        control:'select',
                        option:{
                            required:true,
                             getters:"kernel/types",
                            key:"archive_type2"
                        }
                    },note:{
                        label:"备注",
                        control:'input',
                        option:{
                            type:"textarea",
                            height:100
                        }
                    },
                    files:{
                        label:"附件",
                        control:"files",
                        option:{
                          required:true,
                          list:true
                        }
                    }
                },
                option:{
                    editable:true
                }
            },
      folders:[{
        key:'all',
        name:'所有资料'
      },{
        key:"early",
        name:"前期资料"
      },{
        key:"design",
        name:"设计资料"
      },{
        key:"contract",
        name:"合约资料"
      },{
        key:"bid",
        name:"招投标"
      },{
        key:"site",
        name:"现场资料"
      },{
        key:"costcontrol",
        name:"投资控制"
      },{
        key:"plans",
        name:"项目计划"
      },{
        key:"temp",
        name:"临时文件"
      }],
    cols:[{key:"id",title:"编号",
        align:"center",type:"index",width:60},{
          key:"inputTime",title:"日期",type:'time',width:120,
        align:"center",
        option:{
          type:'date'
        }
        },
        {key:"type",title:"档案分类",type:"type",
       width:120,
        option:{
           align:"center",
          getters:"kernel/types",
          getters_key:'archive_type'
        }},{
          key:"type2",title:"档案类型",type:"type",
        width:120,
        option:{
          align:"center",
          getters:"kernel/types",
          getters_key:'archive_type2'
        }
        },{
          key:"name",title:"名称",type:'link',
          minWidth:200,
        align:"center",
        event:"open"
        },{
          key:"note",title:"备注",type:'text',
        align:"center"
        },{
          key:"inputor",title:"上传人",
          type:"user",width:140,
        align:"center"
        },{
          key:"inputTime",title:"上传时间",
          type:"time",width:120,
        option:{
          align:"center",
          type:"date"
        }
        },{
          type:"tool",
          fixed:"right",
          maxWidth:250,
          title:"操作",
          align:"center",
          buttons:[{label:"下载",
         
          event:"download"},
          
          {label:"编辑",auth:(user,item)=>(item.state==0 && (user.id == item.inputor || user.roles.includes('admin'))),event:"edit"},{label:"删除",auth:(user,item)=>(item.state==0 && (user.id == item.inputor || user.roles.includes('admin'))),event:"delete"}]
        }]
    }
  },
  components:{
    gzTable,gzForm
  },
  computed:{
    ...mapGetters('archive',['list','get']),
    selected(){
      return this.folders.find(v=>v.key == this.selectedKey)
    },
    filterClasses(){
      let classes = []
      this.filter_keys.forEach(f=>{
        let key = f.key
        f.mapValue = item=>f.type=='year'?moment(item[key]).year():item[key]
        f.values = {}
        this.list.forEach(v=>{
          let value = v[key]

          if(f.type == 'year')
            value = moment(value).year()
         
          if(f.values[value]){
            f.values[value].list.push(v)
          }else{
            f.values[value] = {key:value,list:[v]}
          }

           if(f.type == 'type' && this.$store.getters[f.getters](f.getters_key)){
             let type = this.$store.getters[f.getters](f.getters_key).find(v=>v.id == value)
             if(type)
                f.values[value].name = type.name
           }
        })

        f.values = Object.values(f.values)
      })

      return this.filter_keys
     
    }
  },
  methods:{
    onAdd(){
      this.formEditable = true;
      this.formAddArchiveData={};
      this.showFormAddArchieve = true
    },
    isSelectFilter(f,v){
        return this.selected_filter.find(s=>s[0]==f&&s[1]==v)
    },
    selectFilter(f,v){
      if(this.switchAssciate){
        let index = -1
        if((index = this.selected_filter.findIndex(s=>s[0]==f&&s[1]==v)) == -1)
          this.selected_filter.push([f,v])
        else
          this.selected_filter.splice(index,1)
      }else{
        this.selected_filter = [[f,v]]
      }
    },
    Filter(items,search_text){
      return items.filter(item=>{
        if(search_text && !item.code.includes(search_text) && !item.name.includes(search_text))
          return false

        if(this.selected_filter.length > 0){
          for(let i = 0;i<this.selected_filter.length;i++){
            let [f,v] = this.selected_filter[i]
            if(f.mapValue(item) == v)
              return true
          }

          return false
        }else{
          return true
        }
      })
      
    },
    onSubmit(e){
       var that =this
      if(e.id && Object.values(e).filter(v=>v!==undefined).length == 0)
      {
        that.showFormAddArchieve = false
        return
      }
     
      this.$store.dispatch('archive/patch',e).then(id=>{
          that.$Modal.success({
            title:"操作成功",
            content:"档案已上传，等待管理员审核"
          })
          that.showFormAddArchieve = false
      })
    },
     onEvent(e,params){
       var that = this
      if(e == 'open'){
        this.formAddArchiveData = params
        this.showFormShowArchieve = true
      }else if(e=="edit"){
        this.formAddArchiveData = params
        this.showFormAddArchieve = true
      }else if(e=='approve'){
        console.log('state:',params.state)
      }else if(e=="delete"){
        this.$Modal.confirm({
          title:"操作确认",
          content:`确定删除该档案<span style="color:red;margin:0 5px;">${params.name}</span>,是否继续?`,
          onOk:()=>{
            that.$store.dispatch('archive/del',params.id).then(res=>{
              that.$Notice.success({title:"操作成功",desc:"成功删除档案"})
            }).catch(e=>{
              that.$Notice.error({title:"操作失败",desc:e})
            })
          }
        })
      }else if(e=='download'){
        console.log('downlaod:',params.files)
      }
    },
  },
 
}
</script>
<style lang="less" scoped>
.l-page{
  position: absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
   background:#ddd;
}

.l-container{
  left:240px;
  right:0;
  bottom:0;
  top:0;

  position: absolute;
  overflow: hidden;
  background:#fff;
}

.l-filter{
  height:40px;
  border:1px solid #aaa;
  padding:10px;
  margin-top:10px;
  
}


.l-table{
  position: absolute;
  bottom:16px;
  top:16px;
  left:16px;
  right:16px;
  border:1px solid #ddd;
}
</style>