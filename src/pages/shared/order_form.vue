<template>
  <div class="task">
      <Row :gutter="10">
          <Col :span="24"> <div class="panel" style="min-height:200px;">
          <div class="title">{{task.name}}</div>
          <md style="margin-top:10px" :value="task.content" preview />
      </div>
     <div class="panel panel-active">
          
          
         <div class="editor-wrapper" style="padding:10px;">
                <gzForm ref="vReplyForm" :form="replyForm" editable />
          
                    </div>
                    <div
                        class="caption caption-reply flex-wrap flex-end"
                        style="padding:10px;height:auto;"
                    >
                        <div />
                        
                        <div class="flex-wrap" >
                           
                            <Dropdown @on-click="state=$event" placement="top-end">
                                <Button size='small' style="height:30px;border-radius:0;margin-right:10px;">{{state==task.state?"状态变更":getOrderStateText(state)}}
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
                                     <DropdownItem
                                        v-show='(task.state != state)'                                       :name="task.state"
                                    >取消</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Button
                                type="primary"
                                 size='small'
                                style="height:30px;width:100px;border-radius:0;"
                                @click="onSubmitReply"
                            >提交</Button>
                        </div>

                    </div>
     </div>
      <div class="panel" v-if="comments.length">
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
                            <div class="content">{{cmt.content || "无内容"}}</div>
                            
                            <div class="list" v-if="cmt.images" style="align-items:flex-start;">
                                <template v-for="img in cmt.images">
                                    <img :key="img.url" :src="getFullURL(img.url)">
                                </template>
                            </div>
                           
                            <div class="attach" v-if="cmt.files">
                                 附件:
                                 <template v-for="file in cmt.files">
                                    <a :key="file.id" :href="img.url">{{file.name}}</a>
                                </template>
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
import gzForm from '@refs/gzUI/form/index.vue'
import gzAvatar from '@refs/avatar/index'
import gzDGraph from '@refs/gzUI/dg/index'
import md from '@refs/editor/md.vue'
import {mapGetters,mapActions} from 'vuex'
const cosService = "https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com"
export default {
    data(){
        return {
            replyData:"",
            state:0,
              activeReplyState: 0,
            forming: false,
            loading: false,
            rloading: [],
            replyForm:{
                def:{
                    "content":{"label":"回复内容","control":"input","option":{"type":"textarea","height":"200","required":"true"}},
"images":{"label":"图片","control":"files","option":{"type":"image"}},
"files":{"label":"附件","control":"files","option":{"max":1}}
                    
                },
                layout:
                    "<div><Row :gutter='10'><Col :span='24'>{{content}}</Col></Row><Row :gutter='10' style='margin-top:10px'><Col :span='12'>{{images}}</Col><Col :span='12'>{{files}}</Col></Row></div>"
                ,
                option:{
                    hideAction:true
                }
            }
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
                            if(that.$refs.replyForm)
                                that.$refs.replyForm.reset()
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
        images(){
            return ['https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/upload/20200425/image.png','https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/upload/20200425/image.png','https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/upload/20200425/image.png']
        }
    },
    components:{
        gzForm,md,gzDGraph,gzAvatar
    },
    methods:{
          ...mapActions('order', {
            getOrder: 'get',
            patchComment: 'patchComment',
            deleteComment: "deleteComment"
        }),
         getFullURL(key){
            return cosService + '/files/' + key
        },
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
            let reply = this.$refs.vReplyForm.submit()
            if(!reply){
                this.$Modal.warning({
                    title: "提交失败",
                    content:"请勿回复空内容"
                })
                return
            }

            console.log("REPLY:",reply)
            let cmt = {
                content: reply.content,
                files:reply.files,
                images:reply.images,
                state: this.state,
                order_id: this.id
            }

            this.loading = true
            if(!cmt.content || cmt.content.trim()==""){
                this.$Modal.error({
                    title:"提交失败",
                    content:"请输入回复内容再提交"
                })
                return
            }
            this.patchComment(cmt).then(() => {
                this.$Notice.success({
                    title: "评论成功"
                })
                this.$refs.vReplyForm.reset()

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