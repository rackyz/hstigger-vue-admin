<style>
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
<template>
<div class="dashboard">
  <Card  style="margin:10px">
      <h2 slot="title">系统日志</h2>
      <div class="flex">
          <HList v-model="selected" title="日志列表" :data='list || []' :width='300' @input="getLogData" />
          <div class="l-content" style="margin-left:10px;border:1px solid #ddd;padding:10px;width:100%;">
               <Spin fix v-show="loading">
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>加载中</div>
               </Spin>
               <div class="h-title">
            <Icon type="ios-list" /> 日志内容 <span style='color:darkred' v-if="selected && log &&log.data">[{{selected}}] [{{log.data.length}}条记录]</span> 
            </div>
               <template v-if="log && log.data">
               <template v-for="l in log.data">
                   <Row type="flex" :key="l.id" class-name='log-item' align="middle">
                       <Col :span="3" class="date">
                       [{{util.moment(l.date).format('YYYY-MM-DD HH:mm:ss')}}]
                       </Col>
                        <Col :span='1' class="type">
                        {{mapType(l.type)}}
                        </col>
                        <Col :span='1' class="level" :class="'level-'+l.level">
                        {{mapLevel(l.level)}}
                        </col>
                       
                        <Col :span='19' class="message">
                        {{l.message}}
                        </Col>

                   </Row>
               </template>
               </template>
          </div>
      </div>

  </Card>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import HList from '@refs/List' 
export default {
    data(){
        return {
            loading:false,
            selected:null,
            logs:""
        }
    },
    watch:{
        selected:{
            handler(v){
                this.getLogData(v)
            }
        }
    },
    components:{
        HList
    },
    mounted(){
        this.getData()
    },
    computed:{
        ...mapGetters('log',['list','get']),
        log(){
            return this.get(this.selected) || {}
        }
    },
    methods:{
        mapType(t){
            const mapper = {
                app:"服务器",
                user:"用户",
                req:"请求"
            }
            return mapper[t]
        },
        mapLevel(t){
            const mapper = {
                INFO:"记录",
                WARNING:"警告",
                ERROR:"错误"
            }

            return mapper[t]
        },
        getData(){
            this.$store.dispatch('log/list').then(list=>{
                console.log('list:',list)
                this.selected = list[0].id
                this.getLogData(list[0].file)
            })
        },
        getLogData(id){
            if(id){
                this.loading = true
                 this.$store.dispatch('log/get',id).then(data=>{
                     
                 }).finally(()=>{
                     this.loading = false
                 })
            }
           
        }
    }
}
</script>
<style lang="less" scoped>

    .h-title{
      font-weight: bold;
      color:rgb(8, 57, 100);
      margin:0;
      i{
        font-size:17px;
          font-weight: bold;
        color:rgb(8, 57, 100);
  
      }
      margin-bottom:10px;
    }

.l-content{
    min-height:800px;
    position: relative;
   

    .log-item{
        font-size:12px;
        background:#dfdfdf;
        margin-bottom:2px;
        align-items: center;
        padding:2px 5px;
        .date{
            color:darkgreen;
        }

        .level{
            font-size:10px;
            font-weight: bold;
        }

        .level-ERROR{
            color:darkred;
           
        }

        .type{
            color:#555;
            font-weight: bold;
        }

        .level-INFO{
            color:rgb(14, 64, 126);
        }

        .message{
            color:#888;
        }
    }
}
</style>