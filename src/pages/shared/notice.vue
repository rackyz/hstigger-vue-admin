<template>
    <div class="notice">
        <div class="title">
            <h1>{{data.title}}</h1>
            <div class="info">
            <div class="label">发布人<span class="value">{{getUser(data.inputor).name}}</span></div>  
            <div class="label">发布时间<span class="value">{{util.moment(data.inputTime).format("YYYY-MM-DD")}}</span></div>
            </div>
        </div>
        <div class="content">{{data.content || '无'}}
            <div class="attached" v-if="data.files">
附件<template v-for="(f,i) in parseFiles(data.files)">
                <div class="file" :key='i'>{{i+1}} - <a target="_blank" :key='f.name' :href="f.url">{{f.name}}</a></div>
            </template>
        </div>
        </div>
        
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props:['data'],
    computed:{
        ...mapGetters('kernel',['getUser','parseFiles'])
    }
}
</script>

<style lang="less" scoped>
.notice{
    h1{
        font-size:18px;
        font-weight: normal;
        text-align: center;
        padding:0px 30px;
        padding-top:20px;
    }

    .info{
        margin:0 20px;
        padding:10px 20px;
        display: flex;
        justify-content: space-between;

        font-size:12px;
        .value{
            margin-left:10px;
            color:#333;
        }
         border-bottom:1px dashed #aaa;
    }

    .label{
        color:#888;
    }

    .content{
        margin:10px 20px;
        padding:20px;
        padding-top:0;
        white-space:pre-wrap;
        font-size:14px;
    }

    .attached{
        margin-top:10px;
        .file{
            padding-left:20px;
            
        }
    }

}
</style>