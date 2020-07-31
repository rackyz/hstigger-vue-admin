<template>
    <div class="full-fill drawer-list blue-tigger">
        <div class="head">
            <Button>全部已读</Button>
        </div>
        <div class="list">
            <template v-for="m in msgs">
                <div :key="m.id" class="msg-item" :class="m.readed?'msg-item-readed':''" @click="openMsg(m)">
                    <div class="info">
                        <span>系统消息 <Icon type="md-phone-portrait" /><Icon type="md-attach" /></span> <span class="time">{{m.time}}</span>
                    </div>
                    <div class="content">
                    {{m.detail}}
                    </div>
                </div>
            </template>
            <div class="msg-item msg-item-readed" style="background:#444;color:#aaa;border:none;">
                <div class="content" style="text-align:center;">
                    更多历史消息请前往 <a>个人中心</a> 查看
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data(){
        return {
            msgs:[{
                id:"MSG1",
                detail:"您的项目Z0001-奉化中学已创建成功",
                time:"2020/13/4 17:00:00"
            },{
                id:"MSG2",
                detail:"系统维护通知: 2020/4/23晚12点 至 2020/4/24早9点进行系统维护,维护期间无法登录,很抱歉为您带来不便"
            },{
                id:"MSG3",
                detail:"您创建/关注的任务[办理'执行计划书']有新的动态,请点击查看",
                readed:true
            },{
                id:"MSG1",
                detail:"您的项目Z0001-奉化中学已创建成功",
                time:"2020/13/4 17:00:00",
                 readed:true
            },{
                id:"MSG2",
                detail:"系统维护通知: 2020/4/23晚12点 至 2020/4/24早9点进行系统维护,维护期间无法登录,很抱歉为您带来不便",
                 readed:true
            },{
                id:"MSG3",
                detail:"您创建/关注的任务[办理'执行计划书']有新的动态,请点击查看",
                readed:true
            },{
                id:"MSG1",
                detail:"您的项目Z0001-奉化中学已创建成功",
                time:"2020/13/4 17:00:00"
            },{
                id:"MSG2",
                detail:"系统维护通知: 2020/4/23晚12点 至 2020/4/24早9点进行系统维护,维护期间无法登录,很抱歉为您带来不便"
            },{
                id:"MSG3",
                detail:"您创建/关注的任务[办理'执行计划书']有新的动态,请点击查看",
                readed:true
            },{
                id:"MSG1",
                detail:"您的项目Z0001-奉化中学已创建成功",
                time:"2020/13/4 17:00:00"
            },{
                id:"MSG2",
                detail:"系统维护通知: 2020/4/23晚12点 至 2020/4/24早9点进行系统维护,维护期间无法登录,很抱歉为您带来不便"
            },{
                id:"MSG3",
                detail:"您创建/关注的任务[办理'执行计划书']有新的动态,请点击查看",
                readed:true
            },{
                id:"MSG1",
                detail:"您的项目Z0001-奉化中学已创建成功",
                time:"2020/13/4 17:00:00"
            },{
                id:"MSG2",
                detail:"系统维护通知: 2020/4/23晚12点 至 2020/4/24早9点进行系统维护,维护期间无法登录,很抱歉为您带来不便"
            },{
                id:"MSG3",
                detail:"您创建/关注的任务[办理'执行计划书']有新的动态,请点击查看",
                readed:true
            },{
                id:"MSG1",
                detail:"您的项目Z0001-奉化中学已创建成功",
                time:"2020/13/4 17:00:00"
            },{
                id:"MSG2",
                detail:"系统维护通知: 2020/4/23晚12点 至 2020/4/24早9点进行系统维护,维护期间无法登录,很抱歉为您带来不便"
            },{
                id:"MSG3",
                detail:"您创建/关注的任务[办理'执行计划书']有新的动态,请点击查看",
                readed:true
            }]
        }
    },
    computed:{
        ...mapGetters('kernel',['getUser'])
    },
    methods:{
        openMsg(m){
            this.$emit('open',m)
        }
    }
}
</script>

<style>

</style>