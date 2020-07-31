<template>
      <Card style="margin:10px;">
        <div slot="title">
         <h1 slot="title" style="margin:10px 0">项目组建</h1>
         <p>您需要对项目参与人员进行配置，部分系统定义职位已分配了固定的权限</p>
        </div>
      <div class="list" style="padding-top:0;max-height:400px;overflow-y:auto;">
        <template v-for="p in positions">
            <Card :key="p.id" class='com-item' style="width:260px;margin-top:0;margin-bottom:10px;height:120px;padding:0;">
                <h3 slot="title">{{p.name}}</h3>
            <a slot="extra" @click="onDeletePosition(p)">删除</a>
                <template v-if="p.task">
                     <Button @click="OpenTask(p)">任务待处理</Button>
                    <Button :disabled="p.task === undefined" @click="RemoveTask(p)">取消</Button>
                </template>
                <template v-else>
                <Select v-model="p.user" style="width:150px" transfer filterable clearable>
                    <OptionGroup label="员工">
                        <template v-for="u in users">
                            <Option :label="u.name" :value="u.id" :key="u.id">{{u.name}}</Option>
                        </template>
                    </OptionGroup>
                </Select>
                <Button @click="CreateTask(p)">任务</Button>
                </template>
            </Card>
        </template>

      <div class='com-item' style="border-style:dashed;padding:20px;border-width:1.5px;width:260px;height:120px;font-size:18px;" @click="modalAddPosition=true;">
       
        <Icon type="md-add" size="20" /> 添加职位
      
      </div>
      </div>
      <div class="flex-wrap" style="width:100%;justify-content:flex-end;margin-top:10px;">
          <Button style='margin-right:10px;' @click="onPrevStep">上一步</Button><Button type='primary' @click="onNextStep">提交</Button>
        </div>
         <Modal v-model="modalAddPosition" title="添加职位" footer-hide>
             <gzForm style="margin:10px;" :form="createForm" @on-submit="onAddPosition" editable/>
     </Modal>
     <Modal v-model="modalAddTask" title="添加任务" footer-hide>
          <gzForm style="margin:10px;" :form="orderForm" :initData="task" @on-submit="onSubmitTask" editable/>
     </Modal>
      </Card>
    
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import gzForm from '@refs/gzUI/form/index'
export default {
    components:{
        gzForm
    },
    data(){
        return {
            modalAddPosition:false,
            modalAddTask:false,
            editingPositionIndex:null,
            task:{
                name:"任务标题",
                stype:'common',
                type_id:"信息采集"
            },
            
            createForm:{
                def:{
                    name:{
                        label:"职位名称",
                        control:"input",
                        option:{
                                                        maxlen:'12'
                        }
                    },
                     role:{
                        label:"权限角色",
                        control:"select",
                        option:{
                            options:[{
                                label:"项目经理",
                                value:"manager"
                            },{
                                label:"前期管理",
                                value:"earlyManager"
                            }]
                        }
                    },

                },
                layout:"<div><Row :gutter='10'><Col :span='12'>{{name}}</Col><Col :span='12'>{{role}}</Col></Row></div>",
                option:{}
            },
            orderForm:{
                def: {
                name: {
                    label: "标题",
                    editable: true,
                    control: "input",
                    
                    option: {
                        required: true
                    }
                },
                stype: {
                    label: "任务类型",
                    editable: true,
                    control: "select",
                    option: {
                        getters: "kernel/taskTypes",
                        text: true,
                        required: true
                    }
                },
                type_id: {
                    label: "子类型",
                    editable: true,
                    control: "select",
                    option: {
                        getters: 'kernel/taskTypes',
                        relMode:"replace",
                        relKey:"stype",
                        relativeGetter: "kernel/getTaskSubTypes",
                        text: true,
                        required: true
                    }
                },
                charger:{
                    label:"负责人",
                    editable:true,
                    control:"select",
                    option:{
                        getters:'kernel/users',
                        idKey: "id",
                        labelKey:"name",
                        required: true
                    }
                },
                startDate:{
                    label:'开始日期',
                    editable:true,
                    control:'time'
                },
                endDate: {
                    label: '结束日期',
                    editable: true,
                    control: 'time'
                },
                content: {
                    label: "内容",
                    editable: true,
                    control: "input",
                    option: {
                        type: 'md',
                        maxlen: 128
                    }
                },


            },
            layout: `<div>
            <Row :gutter='10'>
            <Col span='24'>{{name}}</Col>
            </Row><Row :gutter='10'  style='margin-top:10px;'>
            <Col span='8'>{{stype}}</Col><Col span='8'>{{type_id}}</Col><Col span='8'>{{charger}}</Col>
            </Row>
            <Row :gutter='10' style='margin-top:10px;'>
            <Col span='12'>{{startDate}}</Col><Col span='12'>{{endDate}}</Col>
            </Row>
            <Row :gutter='10' style='margin-top:10px;'>
            <Col style='height:400px;'>{{content}}</Col>
            </Row></div>`,

            option: {}
            }
        }
    },
    computed:{
        ...mapGetters('kernel',['users']),
         ...mapGetters('project',{
            getProject:'get',
            saveProject:'save'
        }),
        ...mapGetters('kernel',{
            getUser:'getUser'
        }),
        id(){
            return this.$route.params.id
        },
        project(){
            return this.getProject(this.id) || {}
        },
        positions(){
            return this.project.positions || []
        }
    },
    watch:{
        "project.installState":{
            handler(v){
                console.log("state-changed:",v)
                this.$forceUpdate()
            },
            deep:true
        }
    },
    methods:{
        ...mapActions('project',['patch','addPositionTask','removePositionTask']),
        ...mapMutations('project',['setProjectInstallState','addPosition','setPositionUser','removePosition']),
        ...mapActions('order',['post']),
        onAddPosition(e){
            let item = e
            this.addPosition({project_id:this.id,item:e})
            this.modalAddPosition = false
        },
        onDeletePosition(e){
            var that = this
            this.$Modal.confirm({
                title:'删除确认',
                content:"确定删除该职位:<span style='color:red'>"+e.name+"</span>",
                onOk(){
                    that.removePosition({project_id:that.id,item:e})
                }
            })
        },
        CreateTask(p){
            this.modalAddTask = true
            this.editingPositionIndex = p.id
        },
        onSubmitTask(e){
            var that = this
            that.addPositionTask({project_id:that.id,task:e,item:{id:that.editingPositionIndex}}).then(res=>{
                  that.$Notice.success({
                    title:"创建成功",
                    desc:"任务创建成功"
                })
                 that.modalAddTask = false
                  that.editingPositionIndex = null
            })
        },
        OpenTask(e){
            let routerUrl = this.$router.resolve({
                path: `/orders/${e.task}`
            });
            window.open(routerUrl.href, "_blank");
        },
        RemoveTask(e){
            var that = this
            this.$Modal.confirm({
                title:'任务取消确认',
                content:"确定取消该职位的选派任务:<span style='color:red'>"+e.name+"</span>",
                onOk(){
                    that.removePositionTask({project_id:that.id,item:e}).then(res=>{
                        that.$Notice.success({title:"操作成功",desc:"任务已移除"})
                    })
                }
            })
        },
        onNextStep(){
            var that = this
            this.$Modal.confirm({
                title:'保存确认',
                content:"确定提交项目组建信息",
                onOk(){
                    that.setProjectInstallState({id:that.id,state:2})
                }
            })
          
        },
        onPrevStep(){
            this.setProjectInstallState({id:this.id,state:0})
        }
    }
}
</script>
<style lang="less" scoped>
</style>