<style lang="less">
.ll-content{
    .ivu-tabs-content{
            position: absolute;
            top:38px;
            bottom:0;
            left:0;
            right:0;
            .ivu-tabs-tabpane{
                position: relative;
                height:100%;
                width:100%;
                overflow: hidden;
                overflow-y:auto;
            }
        }
}
</style>
<template>
     <div class="l-page" style='background:#222;'>
           <Top title="任务系统" @ready="onReady" />
       <gzFormEditor ref='formEditor' style="margin-top:50px;" :formdef="form"  />
       <div class="l-tools">
           <div>ID<span style='color:#fff;margin-left:10px;margin-right:10px;'>{{formData.id}}</span> 名称<span style="color:#fff;margin-left:10px;margin-right:10px;">{{formData.name}}</span> 描述<span style="color:#fff;margin-left:10px;margin-right:10px;">{{formData.desc}}</span></div>
           <Button @click="onSave">保存表单</Button>
        </div>
  </div>
</template>


<script>
import Top from './shared/top'
import gzFormEditor from '@refs/gzUI/form-editor/editor'
import {mapGetters, mapActions} from 'vuex'
import axiosServer from '../store/libs/axios'
export default {
    
    data(){
        return{
           formData:{}
        }
    },
    computed:{
        ...mapGetters('tables',['getItem']),
        form(){
            let formData = this.formData
            return formData
        },
         id() {
            return this.$route.params.id
        }
    },
    mounted(){
        this.$bus.$on('login',this.getData())
    },
    methods:{
        ...mapActions('tables',['get','patch']),
        getData(){
            var that= relativeTimeThreshold
            axiosServer.get('forms/'+this.id).then(res=>{
               
                that.formData = res.data.data
                that.$forceUpdate()
            })
        },
        onSave(){
            this.patch({key:'forms',item:this.formData}).then(res=>{
                this.$Notice.success({
                    title:"保存成功"
                })
            })
        }
    },
    components:{
       gzFormEditor,Top
    }
}
</script>

<style lang="less" scoped>
td{
    padding:10px;
}
.editor-wrapper{
   position: relative;
   height:800px;
   width:100%;
}
.l-page{
    position: absolute;
    left:0;
    right:0;
    bottom:0;
    top:0;
    .l-menu-wrap{
        position: absolute;
        left:0;
        top:0;
        bottom:0;
        width:220px;
        overflow-y:auto;
        border-right:1px solid #dfdfdf;
        h1{
            padding:20px;
            padding-bottom:10px;
        }
        .l-menu-item{
            width:100%;
            padding:5px 20px;
            display: flex;
            align-items: center;
            font-size:16px;
        }
        .l-menu-item-selected{
            color:rgb(11, 147, 245);
            font-weight: bold;
        }

        .l-menu-item:hover{
            cursor: pointer;
            color:#aaa;
        }
    }

    .ll-content{
        position: absolute;
        left:220px;
        right:0;
        bottom:0;
        top:0;
        overflow: hidden;
        overflow-y: auto;

        
    }
}

.l-tools{
    padding:10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom:0;
    left:0;
    right:0;
    background:#111;
}

.l-title{
    display: flex;
    align-items: center;
    font-size:12px;
    font-family: consolas;
    justify-content: space-between;
    padding:10px;
    background:linear-gradient(to bottom,#fff,#eee,#fff);
}
</style>