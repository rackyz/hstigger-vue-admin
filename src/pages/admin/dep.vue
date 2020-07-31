<template>

    <div class="full-fill dashboard">
         <Card style="margin:10px;font-size:25px;">
        部门管理
        <div style="font-size:14px">部门作为用户组，对组织结构进行整体的描述。根目录为公司内和外部组不可跟外，其余均可进行修改</div>
      </Card>
        <Row
            :gutter="10"
            style="margin:10px 5px;height:800px"
        >
            <Col
                :span='5'
                style="height:100%;"
            >
            <Card icon="md-list" title="部门列表" padding="5">
                
                <div class="content">
                    <hList
                        :data="deps"
                        v-model='selected'
                        @input='onSelectDep'
                    />
                </div>
            </Card>
            </Col>
            <Col :span='19'>
             <Card
            icon="md-list" :title="selected?`${selected.name} (${selected.users.length}人)`:'选择部门'"
                style="overflow:hidden;"
                padding="0"
            >
               <hToolbar :data="dep_tools" @event='onEvent' :enabled="ToolEnabled"  v-if="ToolEnabled" />
                <template v-if="selected && selected.users">
                <div class="l-list" style="padding:20px;">
                <template v-for="r in selected.users">
                <div class="l-list-item l-list-item-user" :class="{'l-system':r.system,'l-list-item-selected':selection.includes(r)}" :key="r.id" @click='Select(r)' style="margin:5px;">
                    <gzAvatar :userinfo ='r' size="40" style='margin-right:10px;min-width:40px;' />
                    <div>
                    <div class="name">{{r.name}}</div>
                    <div class="dep" style="font-size:10px;color:#aaa;white-space:nowrap;">{{r.deps.map(v=>deps.find(d=>d.id==v).name).join(',')}}</div>
                    </div>
                </div>
                </template>
                </div>
                </template>
            </Card>
         
            </Col>
        </Row>

       
        <Modal ref='formModal' :class="formError?'l-modal-error':''" v-model="showModal" :title="dataDep.id?'编辑部门':'新增部门'" footer-hide width="400">
      
          <gzForm ref="form" style="margin:10px;" :form="formDep" editable :data="dataDep" @on-submit="Patch" v-on:error-submit="shake"  @on-reset="formError=false" />

        </Modal>
        <Modal ref='userModal' v-model="showUserModel" title="人员调整"
        footer-hide width="445">
        <template v-if="selected">
        <Transfer
        :data="transferData"
        style="margin:10px"
        :target-keys="selected_dep_users"
        :list-style="listStyle"
        :titles="['所有人员',selected.name]"
        :operations="['','']"
        filterable
        @on-change="onTransfer">
    </Transfer>
    <div class="project-tools flex-row flex-end" style="margin:10px;justify-content:flex-end">
        <Button type="primary" style="margin:0;" @click="onSaveDepUsers" :loading="onSaveDepUsersLoading">保存</Button>
        </div>
        </template>
        </Modal>
    </div>
</template>

<script>
import gzForm from '@refs/gzUI/form/index'
import gzAvatar from '@refs/avatar/index'
import hToolbar from '@refs/gzUI/Toolbar/toolbar'
import hList from '@refs/List'
import gzTable from '@refs/gzUI/tableframe/table'
import { mapActions, mapGetters } from 'vuex'
import tableUserDef from './t_user'
export default {
    data() {
        return {
            selected: {
                users:[]
            },
            formError:false,
            showUserModel:false,
            selected_dep_users:[],
            onSaveDepUsersLoading:false,
            showModal:false,
            model:{},
            selection:[],
            dataDep:{},
             dep_tools:[{
                key:'add',
                name:'添加下级',
                icon:'md-add'
            },{
                key:'delete',
                name:'删除部门',
                icon:"md-trash"
            },{
                key:'edit',
                name:'编辑部门',
                icon:"md-create"
            },{
                key:'user',
                name:'调整人员',
                icon:"ios-person"
            },{
                key:'remove-user',
                name:'删除人员',
                icon:"ios-remove"
            }],
           
        }
    },
    components: {
        hList, gzForm,hToolbar,gzAvatar
    },
    computed: {
        ...mapGetters('user', ['deps','users']),
         formDep(){
           let deps = this.deps || []
           console.log("DEPS-changes:",deps)
           return {
              layout:`<Row  :gutter="10"><Col :span="18">{{name}}</Col><Col :span="6">{{color}}</Col></Row>`,
            //   option:{
            //       hideAction:true
            //   },
              def:{
                parent_id:{
                  label:"上级部门",
                  control:"select",
                  option:{
                    editable:false,
                    getters:"user/deps",
                    defaultValue:0
                  }
                },
                name:{
                  label:"部门名称",
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
         },
         ToolEnabled(){
            if(!this.selected.id)
                return false
            
            let selectedDep = this.selected
            let selectionUser = this.selection
            let permit = [0,0,0,0,0]
            if(selectedDep && selectedDep.id)
            {
                let edit = selectedDep > 100
                let del = selectedDep.id > 500
                if(selectionUser &&selectionUser.length > 0)
                    permit =  [1,del,1,1,1]
                else
                    permit = [1,del,1,1,0]
            }

            if(permit.join('').includes('1'))
                return permit
        },
        transferData(){
            return this.users.map(v=>({
                key:v.id,
                label:v.name
            }))
        }
    },
    mounted(){
      this.getData()
    },
    methods: {
        onSelectDep(e){
            this.model = {}
            this.selected_dep_users = e.users.map(v=>v.id)
        },
        onTransfer(e){
         //    this.selected.users = e
         //this.selected_dep_users = e
            console.log('tranfer',e)
            this.selected_dep_users = e
        },
        onSaveDepUsers(){
            this.onSaveDepUsersLoading = true
            this.$store.dispatch('user/patchDepUsers',{dep_id:this.selected.id,users:this.selected_dep_users}).then(res=>{
                this.Success('人员变更成功')
                this.showUserModel = false
                 this.onSaveDepUsersLoading = false
            }).catch(e=>{
                this.Error(e)
                 this.onSaveDepUsersLoading = false
            }).finally(e=>{
                this.onSaveDepUsersLoading = false
            })
        },
        shake(e){
            if(Object.keys(e).length > 0)
                this.formError = true
            else
                this.formError = false
        },
       
        getData() {
          this.$store.dispatch('user/queryUsers')
          this.$store.dispatch('user/queryDeps').then(()=>{
              this.selected = this.deps[0]
          })

        },
        //  Select(r){
        //     const multiple = false
        //     if(multiple){
        //         if(this.selection.includes(r))
        //         {
        //             this.selection.splice(this.selection.findIndex(v=>r==v),1)
        //         }else{
        //             this.selection.push(r)
        //         }
        //     }else{
        //         if(this.selection && this.selection[0] == r)
        //             this.selection = []
        //         else
        //             this.selection = [r]
        //     }
        // },
        Patch(e){
             if(!e.id){
                 e.parent_id = this.selected.id
             }
             this.$store.dispatch('user/patchDep',Object.assign(this.dataDep,e)).then(res=>{
                 this.Success(e.id?"部门已修改":"部门已添加")
                this.showModal = false
                this.model = {}
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
            }else if(e == 'user'){
                this.showUserModel = true
            }
        },
        edit(data){
            console.log("EDiting:",data)
            this.editingNode = data
            this.dataDep = { id:data.id,
                parent_id:data.parent_id,
                name:data.title,
                color:data.color}
            this.modelEditDep = true
        },

        remove(root, node, data) {
            var that = this
            this.$Modal.confirm({
                title:"操作确认",
                content:`${data.children && data.children.length > 0?'该部门含有下级部门!':''}将要删除部门 <span style='color:red;font-weight:bold'>${data.title}</span>,是否继续?`,
                onOk(){
                    that.$store.dispatch('user/delDep',data.id).then(res=>{
                        that.$Notice.success({
                        title:"操作成功",
                        desc:"部门已删除"
                        })
                        const parentKey = root.find(el => el === node).parent;
                        const parent = root.find(el => el.nodeKey === parentKey).node;
                        const index = parent.children.indexOf(data);
                        parent.children.splice(index, 1);
                    })
                }
            })
        }
    }
}
</script>

<style lang="less">
.demo-tree-render,
.ivu-tree-title {
    width: 100%;
}
.l-list-item-user{
    width:300px;
    height:60px;
    display: flex;
    align-items: center;
    padding:10px;
    border:1px solid #dfdfdf;
}
</style>