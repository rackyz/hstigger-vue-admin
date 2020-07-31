<template>
  <div class="l-work" v-if="work">
    <div class="l-work-header">
        <div class="lwh-status" style="color:orange;">
            {{workProjects}} {{work.dep}}
        </div>
        <h2 style="color:yellowgreen;margin-left:-2px;">{{work.title}}</h2>
        <label>负责人</label><span class="mark"> {{charger}}</span>
        <label style="margin-left:15px;">计划</label> 
        <span class="mark">{{start?start+' / '+end:'无计划'}} </span>
        <span v-if="start" style="margin-left:15px;">
        <template v-if="lastdays >= 0">
            <span class="mark">剩余 {{lastdays}} 天</span>
        </template>
        <template v-else>
            <span class="mark" style="background:darkred">超期 {{-lastdays}} 天</span>
        </template>
        </span>
        <ButtonGroup style="position:absolute;right:40px;bottom:10px;">
            <Button size="small" @click="page=1" :type="page==1?'primary':''">工作详情</Button>
            <Button size="small" @click="page=2" :type="page==2?'primary':''">工作进度</Button>
            <Button size="small" @click="page=3" :type="page==3?'primary':''" :disabled="work.state<3">工作成果</Button>
        </ButtonGroup>
    </div>
    <div class="l-work-content">
        <template v-if="page==1">
            <md :value='work.content' preview style="z-index:0;overflow:hidden;" />
        </template>
        <template v-else-if="page==2">
            <gzFlow :id="work.stype" :db="dataObject" />
        </template>
        <template v-else>
            工作成果：无
        </template>
    </div>

     <div class="l-debug">
        WORK: {{work}} <br />
        FLOW: {{getWorkflow(work.stype)}}
    </div>
  </div>
</template>

<script>
import md from '@refs/editor/md.vue'
import formdef from './forms/f_work_result.js'
import gzForm from '@refs/gzUI/form/index'
import gzFlow from '@refs/gzUI/workflow/workflow'
import { mapGetters } from 'vuex'

export default {
    components:{
        md,gzForm,gzFlow
    },
    data(){
        return {
            page:2,
            formData:{},
            initData:{}
        }
    },
    props:{
        work:{
            type:Object,
            default:{}
        }
    },
    computed:{
        ...mapGetters('workflow',['getWorkflow']),
        ...mapGetters('project',{
            getProject:'get'
        }),
        ...mapGetters('kernel',{
            getDep:"getGroup",
            getUser:"getUser"
        }),
        formdef(){
            return formdef
        },
        workProjects(){
            return this.work.project.map(v=>this.getProject(v).name).join(',')
        },
        depProjects(){
            return this.work.dep.map(v=>this.getDep(v).name).join(',')
        },
        charger(){
            return this.getUser(this.work.charger).name
        },
        start(){
            if(this.work.startTime){
                return moment(this.work.startTime).format("YYYY-MM-DD")
            }else{
                return null
            }
        },
        end(){
            if(this.work.deadline){
                return moment(this.work.deadline).format("YYYY-MM-DD")
            }else{
                return '-'
            }
        },

        lastdays(){
            if(this.work.deadline){
               return Math.floor(moment.duration(moment(this.work.deadline) - moment()).as('days'))
            }
        },
        dataObject(){
            if(this.work.database){
                return JSON.parse(this.work.database)
            }else{
                return {}
            }
        }
    },
    methods:{
        onNextStep(e){
            
        }
    }
}
</script>

<style lang="less" scoped>
.l-work{

    .l-work-header{
    height:95px;

    background:#333;
    color:#ddd;
    padding:10px 20px;
    position: relative;
    overflow: visible;

    label{
        color:#aaa;
        margin-right:5px;
    
    }

    h2{
        font-size:18px;
        text-shadow: -1px -1px 2px #000;
        color:orange;
        margin-bottom:5px;
        font-weight: normal;
    }

    .mark{
        padding:3px 10px;
        font-size:10px;
        color:#fff;
        border-radius: 10px;;
        background:#666;
    }
    .ivu-btn{
        background:#222;
        color:#fff;
        border:none;
    }

    .ivu-btn-primary{
        background:linear-gradient(to bottom right,#555,#777);
        filter:drop-shadow(1px 1px 3px #000);
    }

    .ivu-btn[disabled]{
        color:#777;
    }
    }

    .l-work-content{
        background:#fff;
        position: relative;
        border-radius: 5px;
        filter:drop-shadow(1px 1px 3px #ddd);
        margin:10px;
        z-index:0;
        .v-note-wrapper{
            padding:0;
        }

    }

}

.l-debug{
    font-size:12px;
    padding:20px;
}
</style>
