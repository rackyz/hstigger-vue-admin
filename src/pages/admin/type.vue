<template>
  <div class="l-page dashboard" >
     <Card style="margin:10px;font-size:25px;">
        类型管理
        <div style="font-size:14px;color:#888;">系统基础的类型数据都在此页进行配置,您可以对非系统类型进行修改并制定标识颜色</div>
      </Card>
       <Row :gutter="10" style="margin:5px;">
        <Col :span="5">
       <Card title="类型列表" icon='md-list'>
          <hList :data="keys" v-model="selectedKey" @click='selectedKey={}' />
        </Card>
        </Col>

        <Col :span='19'>
      <Card :padding="0">
            <div slot="title" style='padding:4px 2px;color:#083964;font-size:16px;'><Icon type='ios-pricetag' style='margin-right:5px' /> {{selectedKey.name}} ({{selectedKey.count}})</div>
            <hToolbar v-if="ToolEnabled" :data="tools" :enabled="ToolEnabled" @event="onEvent" />
           
             <div class="l-list" style="padding:20px;">
                <template v-for="r in getTypes(selectedKey.id)">
                <div class="l-list-item l-list-item-type" :class="{'l-system':r.system,'l-list-item-selected':selection.includes(r)}" :key="r.id" @click='Select(r)'>
                    <Icon type="ios-pricetag" size='20' :color="r.color" />
                    <div class="name">{{r.name}}</div>
                </div>
                </template>
                    
                    
            </div>
            
      </Card>
      </Col>
      </Row>

      <!-- Modal -->
       <gzForm ref="form" v-model="showModal" :width="420" :title="current && current.id?'修改信息':'新增类型'" style="margin:10px" :form="typeForm" :data="model"  editable  @on-submit="Patch" @on-event='handleEvent' />
  </div>
</template>

<script>
import tableDef from './t_user'
import gzForm from '@refs/gzUI/form/modalForm'
import gzTable from '@refs/gzUI/tableframe/table'
import hList from '@refs/List'
import hToolbar from '@refs/gzUI/Toolbar/toolbar'
import { mapActions, mapGetters } from 'vuex'
export default {
    
    data(){
        return {
            loading:false,
            showModal:false,
            current:undefined,
            selection:[],
            model:{},
            multiple:false,


            editingItem:{},
            selectedKey:{},
            tools:[{
                key:'add',
                name:'添加',
                icon:'md-add'
            },{
                key:'delete',
                name:'删除',
                icon:"md-trash"
            },{
                key:'edit',
                name:'修改',
                icon:"md-create"
            },
            // {
            //     key:'select-all',
            //     name:'全选',
            //     icon:'md-checkmark-circle'
            // },{
            //     key:'clear-all',
            //     name:'清除',
            //     icon:'md-checkmark-circle-outline'
            // }
            ],
            type_col:[{
                type:'index',
                title:'序号',
                width:60
            },{
                type:'text',
                key:'name',
                title:"名称",
                width:200
            },{
                type:'color',
                title:"标识色",
                key:'color',
                width:80
            }
                
            ],
            typeForm:{
              layout:`<Row  :gutter="10"><Col :span="18">{{name}}</Col><Col :span="6">{{color}}</Col></Row>`,
              def:{
                name:{
                  label:"类型名称",
                  control:"input",
                  option:{
                    maxlen:16,
                    required:true
                  }
                },
                color:{
                  label:"颜色",
                  control:"color",
                  option:{
                    defaultValue:"#333333"
                  }
                }
              
            }
            }
        }
    },
    mounted(){
        this.$store.dispatch('type/getData').then(items=>{
            this.selectedKey = items[0]
        })
    
    },
    computed:{
        ...mapGetters("type",['types','keys','getTypes']),
        ToolEnabled(){
            if(this.selectedKey.data == null){
                return false
            }
            let selection = this.selection
            let add = this.selectedKey.add
            let del = this.selectedKey.del
            let edit = this.selectedKey.edit
            let permit = []
            if(selection && selection.length > 0)
            {
                edit = selection[0].edit
                del = selection[0].del
                permit =  [add,del,edit]
            }else{
                permit =  [add,0,0]
            }
            console.log(permit.join(''))
            if(permit.join('').includes('1'))
                return permit
        }
    },
    components:{
        gzForm,gzTable,hList,hToolbar
    },
    methods:{
        Select(r){
            const multiple = false
            if(multiple){
                if(this.selection.includes(r))
                {
                    this.selection.splice(this.selection.findIndex(v=>r==v),1)
                }else{
                    this.selection.push(r)
                }
            }else{
                if(this.selection && this.selection[0] == r)
                    this.selection = []
                else
                    this.selection = [r]
            }
        },
        Patch(e){
             if(!e.id){
                 e.parent_id = this.selectedKey.id
             }
             this.$store.dispatch('type/Patch',e).then(item=>{
                this.Success(e.id?'类型已修改':'类型已创建')
                this.showModal = false
            }).catch(e=>{
                this.Error(e)
            })
        },
        onEvent(e){
            var that = this
            if(e == 'add'){
                this.showModal = true
                this.model = {}
            }else  if(e == 'delete'){
                this.Confirm(`确定要删除<span style='color:red;margin:0 5px;'>${this.selection.map(v=>v.name).join(',')}</span>共${this.selection.length}个类型?`,()=>{
                    that.$store.dispatch('type/Delete',this.selection.map(v=>v.id)).then(res=>{
                        this.Success("删除成功")
                    }).catch(e=>{
                        this.Error(e)
                    })
                })
            }else if(e == 'select-all'){
                this.selection = this.getTypes(this.selectedKey.id)
            }else if(e == 'clear-all'){
                this.selection = []
            }else if(e == 'edit'){
                this.model = this.selection[0]
                this.showModal = true
            }
        }
    }
}
</script>
<style lang="less" scoped>
.l-list-item-type{
    min-width:120px;
    height:40px;
    margin:5px;
    padding:10px;
    display: flex;
    align-items: center;
    border:1px solid #dfdfdf;
    i{
        max-width: 20px;
        width:20px;
        margin-right:10px;
    }
}

.l-system{
    border-color:#aaa;
    background:#cef;
}
</style>