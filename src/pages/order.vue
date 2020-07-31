<template>
    <div class="container-page blue-tigger">
        <Top
            title="任务系统"
            @ready="onReady"
        />
        <div class="sub-top">
            <div
                class="flex-wrap project-tools"
                style="margin-left:10px;"
            >
                <Button @click="showProjects=!showProjects">任务<span style='color:#fff;margin-left:10px;'>{{order.name}}</span>
                    <Icon
                        type='ios-arrow-down'
                        size="14"
                        style="margin-left:5px"
                    /> </Button>
                    <Button>类型<span :style='`color:#fff;margin-left:10px;`'>{{getOrderTypeText(order.stype) || '未设置'}}</span></Button>
                      <Button><span :style='`color:orange`'>数据采集</span></Button>
                     <Button style='margin-left:20px;'>状态<span :style='`color:${getStateColor(order.state)};margin-left:10px;`'>{{getStateText(order.state)}}</span></Button>
                     <Button>时限<span :style='`color:#fff;margin-left:10px;`'>{{deadline || '未设置'}}</span></Button>
                   
            </div>
            <div class="flex-wrap  project-tools">
                <Button
                    icon="md-refresh"
                    @click='getData'
                    :loading="loading"
                >刷新</Button>
                <Button icon="md-eye">关注</Button>
            </div>

        </div>

        <div class="container">
            <Row :gutter="10">
                <Col :span="16">
                <Card padding="0">
                    <div
                        slot="title"
                        class="title"
                    >

                        <Icon
                            type='md-paper'
                            class="logo"
                        />
                         {{order.type_id}}
                    </div>
                    <div class="extra" slot="extra">
                        {{inputDateSmart}} 发布
                    </div>
                    <div class="content-title">
                        {{order.name}}
                    </div>
                    <MD
                        :value="order.content"
                        preview
                    />
                   
                </Card>
                <Card
                    style='margin-top:10px;'
                    padding="0"
                     v-if="order.form_id"
                >
                    <div
                    slot="title"
                     
                    >
                        <div class="title" slot="title">
                            <Icon
                                type='md-list-box'
                            />
                            数据采集
                            
                        </div>
                    </div>
                    <aForm
                        :id="order.form_id"
                        style="margin:10px"
                        :data="order.form_data"
                        @submit="onSubmitForm"
                    />
                </Card>
                <Card
                    style='margin-top:10px;'
                    padding="0"
                >
                    <div slot="title"
                    class="title"
                    >
                            <Icon
                                type='md-chatboxes'
                            />信息回复
                    </div>
                    <MD
                        :value="replyData"
                        @change="replyData=$event"
                    />
                    <div
                        class="caption caption-reply flex-wrap flex-end"
                        style="padding:10px;height:auto;"
                    >
                        <div />
                        <div class="flex-wrap">
                            <Dropdown @on-click="state=$event">
                                <Button style="height:40px;border-radius:0;margin-right:10px;">状态变更<span
                                        :style='`color:${getStateColor(state)}`'
                                        v-show="state != undefined"
                                    > {{getStateText(state)}}</span>
                                    <Icon type="ios-arrow-down" /></Button>
                                <DropdownMenu slot="list">
                                    <DropdownItem
                                        v-show='state!=1 && order.state!=1'
                                        :name="1"
                                    >任务进行</DropdownItem>
                                    <DropdownItem
                                        v-show='state!=2 && order.state!=2'
                                        :name="2"
                                    >任务暂停</DropdownItem>
                                    <DropdownItem
                                        v-show='state!=3 && order.state!=3'
                                        :name="3"
                                    >任务完成</DropdownItem>
                                    <DropdownItem
                                        v-show='(state!=4 && order.state==3) && isInputor'
                                        :name="4"
                                    >完成确认</DropdownItem>
                                    <DropdownItem
                                        v-show='(state!=5 && order.state!=1) && isInputor'
                                        :name="5"
                                    >任务关闭</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Button
                                type="success"
                                style="height:40px;width:100px;border-radius:0;"
                                @click="onSubmitReply"
                            >提交</Button>
                        </div>

                    </div>
                </Card>

                <div style="width:100%;padding-bottom:100px;">
                </div>
                </Col>
                <Col :span="8">
                <Row :gutter="10">
                    <Col :span='6'>
                    <Card :padding="0">
                         <div class="card-state">
                                    <div class="label"><Icon type="ios-contact" size="18" /> 发起人</div>
                                    <div class="flex-wrap value">
                                         <gzAvatar
                                            size="40"
                                            
                                            :userinfo="charger"
                                            style='display:inline-block;margin-right:5px;'
                                        />
                                        <div class="name">{{charger.name}}
                                        <br /><span class="sub">BIM中心</span>
                                        </div>

                                    </div>
                                </div>
                    </Card>
                    </Col>
                    <Col :span='6'>
                     <Card :padding="0">
                         
                                <div class='card-state'>
                                    <div class="label"><Icon type="ios-contact" size="18" /> 负责人</div>
                                    <div class="flex-wrap value">
                                        <gzAvatar
                                            size="40"
                                            
                                            :userinfo="charger"
                                            style='display:inline-block;margin-right:5px;'
                                        />
                                        <div class="name">{{charger.name}}
                                        <br /><span class="sub">BIM中心</span>
                                        </div>

                                    </div>
                                </div>
                    </Card>
                    </Col>
                    <Col :span='12'>
                     <Card :padding="0">
                           <div class='card-state'>
                                    <div class="label"><Icon type="ios-contact" size="18" /> 协助人(共3人)</div>
                                    <div class="flex-wrap value">

                                        <gzAvatar
                                            size="40"
                                            
                                            :userinfo="charger"
                                            style='display:inline-block;margin-right:5px;'
                                        />
                                        <div class="name">{{charger.name}}
                                        <br /><span class="sub">BIM中心</span>
                                        </div>

                                            <gzAvatar
                                            size="40"
                                            
                                            :userinfo="charger"
                                            style='display:inline-block;margin-right:5px;margin-left:10px;'
                                        />
                                        <div class="name">{{charger.name}}
                                        <br /><span class="sub">BIM中心</span>
                                        </div>


                                        
                                        
                                    </div>
                                </div>
                    </Card>
                    </Col>
                </Row>
                <Row :gutter="10" style="margin-top:10px">
                    <Col :span='12'>
                    <Card :padding="0">
                       <div class="card-state">
                                    <div class="label"><Icon type="ios-clock-outline" size="18" /> 开始日期</div>
                                    <div class="value">{{startDate || '未设置'}}</div>
                                </div>
                    </Card>
                    </Col>
                    <Col :span='12'>
                     <Card :padding="0">
                         
                                <div class="card-state">
                                    <div class="label"><Icon type="ios-clock-outline" size="18" /> 完成期限 </div>
                                    <div class="value">{{endDate || '未设置'}}</div>
                                </div>
                    </Card>
                    </Col>
                   
                </Row>
                <Card style='margin-top:10px;' :padding="0">
                    <div slot="title" class="title">
                        <Icon
                                type='md-list-box'
                            /> 回复 ({{comments.length}}条)
                    </div>
                    <template v-for="cmt in comments">
                        <div
                            :key="cmt.id"
                            class="comment"
                        >
                            <div
                                class="caption flex-between"
                                style="height:auto;padding:10px;background:#222;"
                            >
                                <div class='replier-info'>
                                     <gzAvatar
                                            size="40"
                                            
                                            :userinfo="getUser(cmt.inputor)"
                                            style='display:inline-block;margin-right:5px;'
                                        />
                                   
                                    <div class="ri-info-wrapper">
                                        <div class="name">{{getUser(cmt.inputor).name}} <span class="sub">(合约部)</span></div>
                                        <div class="time">{{formatTime(cmt.inputTime)}}</div>
                                    </div>
                                </div>
                                <div class="tools">
                                    <Button
                                        :loading="rloading[cmt.id]"
                                        style="height:30px;width:60px;border-radius:0;background:#333;color:#fff;"
                                        @click="onDeleteCmt(cmt.id)"
                                        v-show="userinfo.admin ||(userinfo.gy_id == cmt.inputor)"
                                    >删除</Button>
                                </div>
                            </div>
                            <MD
                                :value="cmt.content"
                                preview
                            />
                            <div
                                class="reply-state"
                                v-show="cmt.state"
                            >状态为<span :style="`margin-left:5px;color:${getStateColor(cmt.state)}`">{{getStateText(cmt.state)}}</span></div>
                        </div>
                    </template>
                </Card>
                </Col>
            </Row>

        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Top from './shared/top'
import MD from '@refs/editor/md.vue'
import aForm from '@refs/gzUI/form/aForm'
import gzAvatar from '@refs/avatar/index'
export default {
    data() {
        return {
            activeReplyState: 0,
            forming: false,
            loading: false,
            rloading: [],
            state: 1,
            replyData: ""
        }
    },
    components: {
        Top, MD, aForm,gzAvatar
    },
    created() {
        this.$bus.$on('login', this.getData)
    },
    computed: {
        ...mapGetters('order',
            { getItem: "get" }
        ),
        ...mapGetters('user', ['userinfo']),
        ...mapGetters('kernel', ['getUser', 'taskStates', 'taskStateColors']),
        id() {
            return this.$route.params.id
        },
        short_id() {
            if (this.order.id)
                return this.order.id.substr(this.order.id.length - 6, 6);
        },
        charger() {
            return this.getUser(this.order.charger) || {}
        },
        isInputor() {
            if (this.userinfo.gy_id == this.order.id)
                return true
        },
        inputDateSmart(){
            return moment(this.order.inputTime).format("YYYY年MM月DD日")
        },
        content() {
            return "# " + this.order.name + "\n" + this.order.content
        },
        startDate() {
            return this.order.startDate
        },
        endDate() {
            return this.order.endDate
        },
        deadline(){
            if(this.endDate){
               return moment(this.endDate).fromNow()
            }
        },
        order() {
            return this.getItem(this.id) || {}

        },
        comments() {
            return (this.order.comments || [])
        }
    },
    methods: {

        ...mapActions('order', {
            get: 'get',
            patchComment: 'patchComment',
            deleteComment: "deleteComment"
        }),
        getStateText(state) {
            if (state != undefined || state != -1)
                return this.taskStates[state]
            else
                return ""
        },
        getStateColor(state) {
            if (state != undefined || state != -1)
                return this.taskStateColors[state]
            else
                return "#333"
        },
        getOrderTypeText(type){
            const typemap={
                bugreport:"错误报告",
                requirements:"需求联系单",
                system:"配套任务",
                common:"普通任务",
                project:"项目任务"
            }

            return typemap[type]
        },
        formatTime(e) {
            let t = moment(e)
            return t.fromNow() + ' ( ' + t.format("YYYY-MM-DD HH:mm:ss") + ' )'
        },
        getData() {
            this.loading = true
            this.get(this.id).then(res => {
                console.log("load success:", res)
            }).finally(e => {
                this.loading = false
            })
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
            console.log("submit:", this.replyData, this.state)
        }
    }
}
</script>

<style lang="less" scoped>
@bg: #222;
@bg-active: linear-gradient(to bottom right, rgb(29, 96, 190), rgb(5, 64, 146));
.container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;

    .panel {
        background: #eee;
        max-width: 1200px;
        margin: 0 auto;
        .caption {
            height: 40px;
            background: @bg;
            color: #fff;
            padding: 0 20px;
            font-weight: normal;
            align-items: flex-start;

            margin: 0;
            overflow: hidden;

            .caption-header {
                width: 100%;
                overflow: hidden;
            }

            .caption-states {
                display: flex;
                justify-content: space-between;
                width: 100%;
                background: #000;
                font-size: 12px;
                .state {
                    background: none;
                    width: 100%;
                    .label {
                        color: #aaa;
                        font-weight: normal;
                    }

                    .value {
                    }
                }
                border-bottom: 1px solid #333;
            }

            .title {
                position: relative;
                font-size: 15px;
                padding: 15px;
                padding-left: 60px;

                .label {
                    color: #aaa;
                }

                .logo {
                    position: absolute;
                    left: 10px;
                    top: 15px;
                    text-shadow: 1px 1px 1px #000;
                }
            }

            .sub {
                font-size: 12px;
                color: #ddd;
            }
        }

        .content {
            padding: 20px;
            position: relative;
        }

        .caption-active {
            background: @bg-active;
        }

        .caption-reply {
            background: #fff;
            border-bottom: 1px solid #ddd;
            color: #333;
            .time {
                color: #aaa;
            }
        }
    }

    .header {
        background: @bg;
        padding: 10px 20px;
        .id {
            font-size: 14px;
            font-weight: bold;
            color: #ddd;
            text-shadow: 0 0 1px #000;
        }
        .name {
            font-size: 20px;
            color: white;
            text-shadow: 1px 1px 1px #333;
            font-weight: bold;
        }

        .desc {
            color: #ddd;
            font-size: 14px;
        }
    }

  
    .view {
        padding: 20px;
        display: flex;
        align-items: center;
    }

    .a-state {
        font-size: 12px;
        display: flex;
        .label {
            color: #aaa;
            margin-right: 10px;
        }

        .value {
            color: #fff;
            color: rgb(94, 155, 4);
        }
    }

    .replier-info {
        display: flex;
        .ri-info-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 5px;
        }
        .name {
        }
        .time {
            color: greenyellow;
            font-size: 12px;
        }
    }

    .reply-state {
        background: #fff;
        padding: 10px;
        font-size: 12px;
    }
}
</style>