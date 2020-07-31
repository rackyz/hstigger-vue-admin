<template>
    <div class="dashboard ma-container">
        <div class="sider">
            <div class="header">
                会议室 {{code}}
            </div>
        </div>
        <div class="appoint-data">
           <div>
                <div class="header">
                    会议室
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as dd from 'dingtalk-jsapi'
export default {
    data(){
        return {
            code:""
        }
    },
    mounted(){
       
       document.title = '会议室预约'
       var that = this
       dd.ready(function() {
            dd.runtime.permission.requestAuthCode({
            corpId: "ding0e8d748fc3a80e7335c2f4657eb6378f", // 企业id
            onSuccess: function (info) {
                if(!info || !info.code){
                    that.Error("failed")
                    return
                }
                    that.code = info.code // 通过该免登授权码可以获取用户身份
                    
            },
            onFail(e){
                that.Error("failed")
            }});
});
    }
}
</script>

<style lang="less" scoped>
.ma-container{
    background:#dfdfdf;
    display: flex;
    justify-content: space-between;
    .sider{
        height:500px;
        min-width:100px;
        width:20%;
        background:linear-gradient(to right,#333,#444);
        color:#ddd;
    }

    .appoint-data{
        width:100%;
    }
}
</style>