<template>
    <div class="full-fill drawer-list blue-tigger">
        <div class="head">
            <ButtonGroup>
                <Button :type="dataMode==1?'primary':''" @click="dataMode==1?dataMode=0:dataMode=1">流程</Button>
                <Button :type="dataMode==1?'primary':''" @click="dataMode==1?dataMode=0:dataMode=2">数据</Button> <Button  :type="dataMode==2?'primary':''" @click="dataMode==2?dataMode=0:dataMode=3">跟踪</Button>
            </ButtonGroup>
             <ButtonGroup>
                <Button>已处理</Button>
            </ButtonGroup>
        </div>
        <div class="list">
            <template v-for="m in filteredOrders">
                <div :key="m.id" class="msg-item" style="padding-left:50px;"  :class="m.readed?'msg-item-readed':''" @click="openMsg(m)">
                    
                        <gzAvatar  class="avatar" :userinfo="getUser(m.inputor)" size="35"/>
                    
                    <div class="info">
                        <div class="flex-wrap"><span class="msg-state" :style="`background:${getOrderStateColor(m.state)}`">
                    </span><span :style="`color:${getOrderColor(m.stype)}`">{{getOrderType(m.stype)}} / {{m.type_id}} <Icon type="md-flash" v-if="m.form_id" /></span></div> <span class="time">{{formatTime(m.endDate)}}</span>
                    </div>
                    <div class="content">
                    {{m.name}}
                    </div>

                    
                </div>
            </template>
            <div class="msg-item msg-item-readed" style="background:#444;color:#aaa;" v-if="filteredOrders.length > 30">
                <div class="content" style="text-align:center;">
                    更多历史任务请前往 <a>个人中心</a> 查看
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import gzAvatar from '@refs/avatar/index'
export default {
    data(){
        return {
            dataMode:0
        }
    },
    computed:{
        ...mapGetters('kernel',['getUser']),
        ...mapGetters("tables",{
            getList:"getList"
        }),
        ...mapGetters('user',['userinfo']),
        ...mapGetters("order",['getOrderColor','getOrderType','getOrderStateText','getOrderStateColor']),
        orders(){
            return this.getList('orders') || []
        },
        filteredOrders(){
            let filterFunc = v=>{
                if(v.executor != this.userinfo.id){
                    return false
                }
                if(this.dateMode == 2){
                    if(v.form_id){
                        return false
                    }
                }else if(this.dataMode == 1){
                    if(!v.form_id)
                        return false
                }
                return true
            }
            return this.orders.filter(filterFunc).sort((a,b)=>a.state < b.state?-1:1)
        }
    },
    components:{
        gzAvatar
    },
    methods:{
        openMsg(m){
            this.$emit('opentask',m)
        },
        formatTime(t){
            if(t)
                return moment(t).fromNow()
        }
    }
}
</script>

<style>

</style>