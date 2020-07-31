<template>
  <div class="task">
      <Row :gutter="10">
          <Col :span="16"> <div class="panel" style="min-height:200px;">
          <div class="title">{{task.name}}</div>
          <md style="margin-top:10px" :value="task.content" preview />
      </div>
      <div class="panel" :v-if="task.form_id" v-show="task.form_id">
          <div class="title">填报数据</div>
          <aForm style="margin:10px;padding-bottom:10px;" :footer-hide="true" :id="task.form_id" />
     </div>
     <div class="panel">
          <div class="title">留言</div>
          <md
                        :value="replyData"
                        @change="replyData=$event"
                    />
                    <div class="attached-file">
                    </div>
                    <div
                        class="caption caption-reply flex-wrap flex-end"
                        style="padding:10px;height:auto;"
                    >
                        <div />
                        
                        <div class="flex-wrap" >
                            <Button
                                icon="md-attach"
                                 size='small'
                                style="height:30px;border-radius:0;margin-right:10px;"
                                @click="onSubmitReply"
                            >附件</Button>
                            <Dropdown @on-click="state=$event" placement="top-end">
                                <Button size='small' style="height:30px;width:100px;border-radius:0;margin-right:10px;">状态变更
                                    <Icon type="ios-arrow-down" /></Button>
                                <DropdownMenu slot="list">
                                    <DropdownItem
                                        v-show='state!=1 && task.state!=1'
                                        :name="1"
                                    >任务进行</DropdownItem>
                                    <DropdownItem
                                        v-show='state!=2 && task.state!=2'
                                        :name="2"
                                    >任务暂停</DropdownItem>
                                    <DropdownItem
                                        v-show='state!=3 && task.state!=3'
                                        :name="3"
                                    >申请完成</DropdownItem>
                                    <DropdownItem
                                        v-show='(state!=4 && task.state==3) && isInputor'
                                        :name="4"
                                    >申请中止</DropdownItem>
                                    <DropdownItem
                                        v-show='(state!=5 && task.state!=1) && isInputor'
                                        :name="5"
                                    >任务完成</DropdownItem>
                                     <DropdownItem
                                        v-show='(state!=6 && task.state!=1) && isInputor'
                                        :name="5"
                                    >任务中止</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Button
                                type="success"
                                 size='small'
                                style="height:30px;width:100px;border-radius:0;"
                                @click="onSubmitReply"
                            >提交</Button>
                        </div>

                    </div>
     </div></Col>
            <Col :span="8">
                <div class="panel" style="padding:10px;height:200px;position:relative;">
                   
                     <gzDGraph    ref='Dagre'
                        :nodes='flow.nodes'
                        :actions='flow.actions'
                        :state='flow.state'
                        />
                </div>
                <div class="panel">
                    <div class="title">处理记录</div>
                    <div>
                     <Timeline style="margin:10px;">
                   
                      
                    <template v-for="cmt in comments">
                         <TimelineItem :key="cmt.id"> 
                             <div class="flex-between">
                              <div class="time" style="font-size:12px;color:#888;">{{formatTime(cmt.inputTime)}}</div>
                              <span :style="`font-size:12px;color:${getOrderStateColor(cmt.state)}`">{{getOrderStateText(cmt.state)}}</span>
                              </div>
                             
                        <div
                            :key="cmt.id"
                            class="comment"
                        >
                             <div class='inputor'>
                                    <gzAvatar
                                            size="40"
                                            slot="dot"
                                            :userinfo="getUser(cmt.inputor)"
        
                                        />
                                    <div class="name-wrapper">
                                        <div class="name">{{getUser(cmt.inputor).name}} </div>
                                        <div class="sub">合约部</div>
                                    </div>
                                     
                                   
                            </div>
                            <div class="content">
                            <md
                            
                                :value="cmt.content || '无内容'"
                                preview
                            />
                            </div>
                            <div class="attach">
                                <a>file1.docx</a>
                            </div>
                        </div>
                    </TimelineItem>
                    </template>
                     </Timeline>
                </div>
                </div>
            </Col>
      </Row>
     
  </div>
</template>

<script>
import aForm from '@refs/gzUI/form/aForm.vue'

import gzAvatar from '@refs/avatar/index'
import gzDGraph from '@refs/gzUI/dg/index'
import md from '@refs/editor/md.vue'
import {mapGetters,mapActions} from 'vuex'
export default {
    data(){
        return {
            replyData:"",
            state:0,
              activeReplyState: 0,
            forming: false,
            loading: false,
            rloading: []
        }
    },
    props:{
        id:{
            type:String
        }
    },
    watch:{
        id:{
            handler(v){
                var that = this
                    if(that.id){
                        that.getOrder(that.id).then(res=>{
                            console.log("GetORder:",res)
                            that.$forceUpdate()
                        })
                    }
            },
            immediate:true,
            deep:true
        }
    
       
    },
    computed:{
        ...mapGetters("user",['userinfo']),
        ...mapGetters("kernel",['getUser']),
        ...mapGetters("order",['get','getOrderColor','getOrderType','getOrderStateText','getOrderStateColor']),
        task() {
            return this.get(this.id) || {}

        },comments(){
              return (this.task.comments || [])
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
                        id:"N0012",
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
        }
    },
    components:{
        aForm,md,gzDGraph,gzAvatar
    },
    methods:{
          ...mapActions('order', {
            getOrder: 'get',
            patchComment: 'patchComment',
            deleteComment: "deleteComment"
        }),
         onDeleteCmt(e) {
            this.rloading[e] = true
            var that = this
            this.$Modal.confirm({
                title: "删除确认",
                content: "确定删除该回复内容"
                , onOk() {
                    that.deleteComment({ order_id: that.id, id: e }).then(() => {
                        that.$Notice.success({
                            title: "删除成功"
                        })
                    }).finally(s => {
                        that.rloading[e] = false
                    })
                }
            })
        },
        onSubmitValue(e){
            let data = this.order.form_data || {}
            data = JSON.stringify(Object.assign(data,e))
            var that = this
            this.submitValue(e).then(res=>{
                that.$Modal.success({
                    title:"操作完成",
                    content:"数据已提交"
                })
            })

        },
         formatTime(e) {
            let t = moment(e)
            return t.fromNow() + ' ( ' + t.format("YYYY-MM-DD HH:mm:ss") + ' )'
        },
        onCancelSubmitValue(){
            this.cancelSubmitValue().then(res=>{
                that.$Modal.success({
                    title:"操作完成",
                    content:"数据已撤销"
                })
            })
        },
        onSubmitReply() {
            let cmt = {
                content: this.replyData,
                state: this.state,
                order_id: this.id
            }
            this.loading = true
            this.patchComment(cmt).then(() => {
                this.$Notice.success({
                    title: "评论成功"
                })
                this.replyData = ""

            }).catch(e => {
                this.$Modal.error({
                    title: "发送失败",
                    content: e
                })
            }).finally(e => {
                this.loading = false
            })
        }
    }
    
}
</script>

<style lang="less" scoped>

</style>