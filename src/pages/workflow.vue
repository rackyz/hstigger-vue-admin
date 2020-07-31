<template>
  <div class="fullfil">
    <Top title="流程系统" />
        
       
    <div class="container">
        <div class="page">
       <Row :gutter="10">
           <Col :span="16">
           <div class="panel header" style="height:100px;">
               <div class="id">
                   流程ID <span style="color:yellowgreen">{{flow.id}}</span>
               </div>
               <div class="name">
                   {{flow.name}}
               </div>
               <div class="desc">
                   {{flow.desc}}
               </div>
           </div>
           <div class="panel state" style="marign-top:10px;">
               <template v-if="instance">
                    <span class="label">实例ID</span> {{instance.id}}  <span class="label">发起人</span> {{instance.inputor}} <span class="label">发起时间</span> {{instance.inputTime}}
                </template>
                <template v-else>
                    创建流程
                </template>
           </div>
          
                   <template v-for="v in flow.views">
                    <div  :key='v.id' class="panel" style="min-height:300px;margin-top:10px;">
                        <div class="caption">{{v.name}}</div>
                        <div class="content">
                        <template v-if="v.type=='custom'">
                                CUSTOM COMPONENT
                        </template>
                        <template v-else> 
                            <gzForm :ref="'form'+v.id" :form="makeForm(flow,v)" :data="data" :static="instance" :store="store"  @submit="onPreSubmit" />
                        </template>
                        </div>
                        <div class="action">
                            <template v-for="a in getFlowActions(v.node)">
                                <Button type='primary' :key="a.id" @click="invokeAction(v,a.type)">{{a.name}}</Button>
                            </template>
                        </div>
                    </div>
                </template>
               
           
           <div class="panel" style="height:100px;margin-top:10px;">
                <div class="caption">留言</div>
           </div>

           </Col>
           <Col :span="8">
            <div class="panel">
               <div class="caption" style='margin:0;'>流程图</div>
               <div class='content' style="height:200px;">
               <gzDGraph   ref='Dagre'
                :nodes='flow.nodes'
                :actions='flow.actions'
                :state='flow.state'
                />
                </div>
           </div>
           <div class="panel" style="margin-top:10px;">
               <div class="caption">节点数据</div>
               <div class="content" style="background:#444">
                   <Row :gutter="5">
                       <template v-for="cn in curnodes">
                       <Col :key='cn.id' :span="cn.state=='current'?10:7">
                        <div :key='cn.id' class="node-block" :class="`node-block-${cn.state || 'next'}`">
                            <div class="name">
                                {{cn.name}}
                            </div>
                            <div class="executor flex-wrap">
                               <gzAvatar :userinfo="cn.executor" size="20" style='margin-right:5px;' /> {{cn.executor.name}}
                            </div>
                            <div class="node-state">
                                {{cn.stateText}}
                            </div>
                            
                        </div>
                       </Col>
                       </template>
                   </Row>
                   <Row :gutter="10" >
                       <Col  :span="6"  style='margin-top:10px;'>
                       <Button long>撤回</Button>
                       </Col>
                        <Col  :span="6"  style='margin-top:10px;'>
                          <Button long>下一步</Button>
                       </Col>
                        <Col  :span="6" style='margin-top:10px;'>
                          <Button long>下一步</Button>
                       </Col>
                   </Row>
               </div>
           </div>
           <div class="panel" style="height:100px;margin-top:10px;">
                <div class="caption">操作记录</div>
           </div>
           </Col>
       </Row>
    </div>
    </div>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import Top from "./shared/top"
import gzForm from "@refs/gzUI/form/index"
import gzDGraph from '@refs/gzUI/dg/index'
import gzAvatar from '@refs/avatar/index'
import moment from 'moment'
export default {
    data(){
        return {
            selected_view:null,
            loading:false,
            data:{}
        }
    },
    computed:{
        store(){
            console.log('STORE:',this.$store)
            return this.$store.getters
        },
        flow(){
            return {
                    id:"W001",
                    name:"建设项目前期申报程序",
                    desc:"",
                    views:[{
                        id:"V001",
                        type:"render",
                        name:"报销申请单",
                        layout:"<div class='a-form'><Row class='a-title'>事业部标准报销申请表</Row><Row :gutter='10' style='margin-top:10px'><Col :span='6'>{{date}}</Col><Col :span='8'>{{type}}</Col><Col :span='10'>{{amount}}</Col></Row><Row style='margin-top:10px'><Col>{{inputor}}</Col></Row><Row style='margin-top:10px;'><Col style='height:150px'>{{desc}}</Col></Row><Row style='margin-top:10px'><Col style='height:150px'>{{bills}}</Col></Row><Row style='margin-top:10px'><Col style='height:150px'>{{files}}</Col></Row><Row style='margin-top:10px'><Col :span='8'>{{checkor}}</Col></Row><Row style='margin-top:10px'><Col :span='8'>{{cc}}</Col></Row></div>",
                        data:['inputor','desc','type','files','date','amount','bills','checkor','cc'],
                        node:"N001"
                    }],
                    nodes:[{
                        id:"N001",
                        type:"create",
                        name:"选址/用地预审",
                        label:"区规划局",
                        view:"V001",
                    },{
                        id:"N002",
                        type:"authorise",
                        name:"项目建议书(慈城经发局)",
                        label:"慈城经发局"
                    },{
                        id:"N003",
                        type:"authorise",
                        name:"建设用地规划许可证",
                        label:"区管理局",
                        data:['note2']
                    },{
                        id:"N004",
                        type:"authorise",
                        name:"勘察设计费100万以上共公开招标;招标公告发布至中标通知发出置一个月",
                        label:"事业部"
                    },{
                         id:"N005",
                        type:"authorise",
                        name:"初步设计会审",
                        label:"慈城经发局"
                        },{
                        id:"N006",
                        type:"authorise",
                        name:"环保（区环保局）/水务(区水务局)",
                        label:"区资规划局土地勘察室"
                    },{
                        id:"N007",
                        type:"authorise",
                        name:"工程设计方案（区规划局）",
                        label:"区资规划局土地勘察室"
                    },{
                        id:"N008",
                        type:"authorise",
                        name:"委托施工图设计",
                        label:"委托施工图设计"
                    },{
                        id:"N009",
                        type:"authorise",
                        name:"建筑节能、人防、消防、照明等专项审核",
                        label:"节能、人防、消防、照明"
                    },{
                        id:"N0010",
                        type:"authorise",
                        name:"审图中心施工图审查",
                        label:"审图中心施工图审查"
                    },
                    {
                        id:"N0011",
                        type:"authorise",
                        name:"放线（市测绘院）",
                        label:"放线"
                    },{
                        id:"N0010",
                        type:"authorise",
                        name:"委托初验（区规划局）",
                        label:"委托初验"
                    },{
                        id:"N0013",
                        type:"authorise",
                        name:"土地勘测（区规划局土地勘察室）",
                        label:"土地勘测"
                    },
                    
                    
                    
                    
                    {
                        id:"N0014",
                       type:"authorise",
                        name:"签订委托拆迁协议",
                        label:"拆迁办",
                        api:"tasks"
                    },{
                        id:"N0015",
                       type:"authorise",
                        name:"供地",
                        label:"区规划局",
                        api:"tasks"
                    },{
                        id:"N0016",
                       type:"authorise",
                        name:"拆迁许可证",
                        label:"拆迁办",
                        api:"tasks"
                    },{
                        id:"N0017",
                       type:"authorise",
                        name:"拆迁完毕申办土地证",
                        label:"拆迁办",
                        api:"tasks"
                    },{
                        id:"N0018",
                       type:"authorise",
                        name:"建设工程规划许可证",
                        label:"区资规局",
                        api:"tasks"
                    },{
                        id:"N0019",
                       type:"authorise",
                        name:"工程施工图招标",
                        label:"工程施工图招标",
                        api:"tasks"
                    },{
                        id:"N0020",
                       type:"authorise",
                        name:"质、变登记，办理施工许可证",
                        label:"办理施工许可证",
                        api:"tasks"
                    },{
                        id:"N0021",
                       type:"authorise",
                        name:"建筑工程复验",
                        label:"建筑工程复验",
                        api:"tasks"
                    },{
                        id:"N0022",
                       type:"authorise",
                        name:"施工规划核实测量(市测绘院)",
                        label:"施工规划核实测量",
                        api:"tasks"
                    },{
                        id:"N0023",
                       type:"authorise",
                        name:"施工规划条件复核(区规划局)",
                        label:"施工规划条件复核",
                        api:"tasks"
                    },{
                        id:"N0024",
                       type:"authorise",
                        name:"施工规划核实",
                        label:"施工规划核实",
                        api:"tasks"
                    }],
                    actions:[{
                        type:"submit",
                        name:"提交",
                        from:"N001",
                        to:"N002"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N002",
                        to:"N004"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N002",
                        to:"N003"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N003",
                        to:"N005"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N004",
                        to:"N005"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N005",
                        to:"N006"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N005",
                        to:"N007"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N007",
                        to:"N008"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N008",
                        to:"N009"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N009",
                        to:"N0010"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0010",
                        to:"N0011"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0011",
                        to:"N0012"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0012",
                        to:"N0018"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N003",
                        to:"N0018"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N003",
                        to:"N0013"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N003",
                        to:"N0014"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0013",
                        to:"N0015"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0014",
                        to:"N0015"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0015",
                        to:"N0016"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0016",
                        to:"N0017"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0017",
                        to:"N0018"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0018",
                        to:"N0019"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0019",
                        to:"N0020"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0020",
                        to:"N0021"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0021",
                        to:"N0022"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0022",
                        to:"N0023"
                    },{
                        type:"submit",
                        name:"提交",
                        from:"N0023",
                        to:"N0024"
                    },{
                        type:"execute",
                        name:"结束",
                        from:"N0024",
                        to:"end"
                    }],
                    data:{
                        inputor:{
                            label:"申请人",
                            control:"select",
                            option:{
                                multiple:true,
                                getters:"kernel/userAsOptions"
                            }
                        },
                        inputorDep:{
                            label:"所在部门",
                            control:"input"
                        },
                        type:{
                            label:"申请类型",
                            control:"select",
                            option:{
                                options:["差旅费","办公费","购买商品及服务费用"]
                            }
                        },
                        date:{
                            label:"申请日期",
                            control:"time"
                        },
                        bills:{
                            label:'发票信息',
                            control:"files",
                            option:{
                                type:"image",
                                size:"big"
                            }
                        },
                        files:{
                            label:'附件',
                            control:"files"
                        },
                        amount:{
                            label:"报销金额",
                            control:"input",
                            option:{
                                type:"amount",
                                required: "true"
                            }
                        },
                        desc:{
                            label:"申请说明",
                            control:"input",
                            option:{
                                type:"textarea",
                                maxlen:"128",
                                rows:4
                            }
                        },
                        accquiredTime:{
                            control:"time"
                        },
                        checkor:{
                            label:"审核部门",
                            control:"select",
                            option:{
                                getters:"kernel/deps",
                                relKey:"inputor",
                                relativeGetter:"kernel/getDepsCharger",
                                relMode:"replace"
                            }
                        },
                        cc:{
                            label:"抄送部门",
                            control:"select",
                            option:{
                                getters:"kernel/deps",
                                defaultValue:"dep0000000000KT1"
                            }
                        }

                    }
            }
        },
        curnodes(){
            return [{
                id:"n001",
                name:"填写报销申请",
                stateText:"已提交",
                 executor:{
                    id:"U010",
                    name:"胡佳翰"},
                state:"apply",
                date:"2020-3-12 3:00:00",
                smartdate:moment().fromNow()
            },{
                id:"n002",
                name:"事业部经理审核",
                stateText:"待审核",
                 executor:{
                    id:"U010",
                    name:"郑工"},
                state:"current",
                current:true
            },{
                id:"n002",
                name:"总公司审核",
                stateText:"待审核",
                executor:{
                    id:"U010",
                    name:"付总"},
                current:true
            }]
        },
        instance(){
            return {
                id:"I001",
                inputor:"胡佳翰",
                date:"2020-03-12"
            }
        },
        data(){
            return {

            }
        },
        activeNodes(){
            return []
        }
    
    },
    components:{
        Top,gzForm,gzDGraph,gzAvatar
    },
    mounted(){

        addEventListener('beforeunload',function(){return'您将不关闭本页面,相关数据不会被保存,是否继续?';});
        this.loading = true
        this.$store.dispatch("kernel/init")
        this.$nextTick(()=>{
             this.$refs.Dagre.render()
        })
       
        
        this.selected_view = this.flow.views[0].id
    },
    methods:{
        ...mapActions('workflow',{
            get:"get",
            patch:"patch"
        }),
        getFlowActions(node_id){
            let a = this.flow.actions.filter(v=>v.from == node_id)
            console.log("FLOWACTION",a)
            return a
        },
        getNode(id){
            return this.flow.nodes.find(v=>v.id == id)
        },  
        invokeAction(view,action){
            console.log("(this.$refs['form'+view.id]):",(this.$refs['form'+view.id][0]))
            let data = (this.$refs['form'+view.id][0]).submit()
            if(data){
               console.log("submit data:",data)
               this.loading = true
               this.patch({id:this.instance.id,node_id:view.node,action_id:action.id,data}).then(res=>{
                   this.loading = false
               }).catch(e=>{
                    this.$Modal.error({
                        title:"流程处理错误",
                        content:e
                    })
               })
            }else{
                this.$Modal.error({
                    title:"错误",
                    content:"表单未填写完整"
                })
                this.$refs['form'+view.id][0].$el.scrollIntoView()
            }
        },
        makeForm(flow,view){
            let form = Object.assign({},view)
            form.def = {}
            
            view.data.forEach(v=>{
                form.def[v] = flow.data[v]
            })
            
            form.option = {hideAction:true,editable:true}
            console.log("FORM:",form)
            return form
        },
        onPreSubmit(e){
            let segs = Object.keys(e).map(v=>this.flow.data[v]?this.flow.data[v].label:v)
            this.$Modal.confirm({
                title:"提交确认",
                content:"确认提交如下信息?<br /><span>"+JSON.stringify(e) +`</span><br />包含字段:<span style='font-weight:bold;color:darkred;'>${segs.join(',')}</span>`
            })
        }
    }
}
</script>

<style lang="less" scoped>
@bg:linear-gradient(to bottom right,rgb(29, 96, 190),rgb(5, 64, 146));

.container{
    position: absolute;
    top:50px;
    padding:10px;
    left:0;
    bottom:0;
    right:0;
    overflow: hidden;
    overflow-y:auto;
    
    .panel{
        background:#eee;
        .caption{
            height:40px;
            background:@bg;
            color:#fff;
            padding:0 20px;
        }

        .content{
            padding:20px;
            position: relative;
        }
    }

    .header{
        background:@bg;
        padding:10px 20px;
        .id{
            font-size:14px;
            font-weight: bold;
            color:#ddd;
            text-shadow: 0 0 1px #000;
        }
        .name{
            font-size:20px;
            color:white;
            text-shadow: 1px 1px 1px #333;
            font-weight: bold;
        }

        .desc{
            color:#ddd;
            font-size:14px;
        }
    }

    .state{
        background:#ddd;
        padding:10px 15px;
        

        .label{
            font-weight: bold;
            color:#666;
            text-shadow: 0px 0px 1px #aaa;
            margin-right:5px;
            margin-left:20px;
        }
        .label:first-child{
            margin-left:0;
        }
    }

    .view{
        padding:20px;
    }

    

}



</style>