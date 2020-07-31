
<style lang="less" scoped>
.l-container{
    position: absolute;
    left:240px;
    right:0;
    top:0;
    bottom:0;
    overflow: hidden;
     padding:20px;

     .l-list{
         position: absolute;
    left:20px;
    right:0;
    top:70px;
    bottom:0;
    overflow: hidden;
     overflow-y: auto;
     padding-bottom:20px;
     }
}

.l-project-item{
    width:240px;
    height:160px;
    border:1px solid #dfdfdf;
    margin-left:20px;
    margin-top:20px;
    position: relative;
    overflow: hidden;

    .l-project-title{
        position: absolute;
        left:20px;
        top:30px;
        z-index:10;
        color:#fff;
        font-size:14px;
        
    }

    .l-project-state{
        position: absolute;
        right:10px;
        top:10px;
        z-index:10;
        width:15px;
        height:15px;
        color:#fff;
        background:linear-gradient(to bottom right,rgb(9, 255, 46),green);
        border-radius: 50%;
        font-size:12px;
        filter:drop-shadow(-1px -1px  1px #333);
        
    }
    .l-project-id{
        position: absolute;
        left:10px;
        top:10px;
        z-index:10;
        color:#fff;
        background:#000;
        padding:0 10px;
        border-radius: 5px;
        font-size:12px;
        
    }

    img{
        filter:brightness(0.7);
        height:100%;
    }

    transition:all 0.3s;
    background:#fff;
}

.l-project-item:hover{
    filter:drop-shadow(1px 1px 1px #333);
    cursor: pointer;
}

.l-search{
    margin:0 20px;
}
</style>
<template>
    <div class="l-page">
       
        <div class="l-menu">
            <div class="l-group">
                 <div class="l-group-title"><Icon type="ios-folder" />项目库</div>
                <div class="l-item">
                    所有项目 (234)
                   
                </div>
            </div>
            <div class="l-group">
                <div class="l-group-title"><Icon type="ios-bookmark" />建筑类型</div>
                <div class="l-item">
                    学校 (12)
                   
                </div>
                 <div class="l-item">
                    道路 (15)
                   
                </div>

 <div class="l-item">
                     桥梁 (1)
                   
                </div>

 <div class="l-item">
                     厂房 (0)
                   
                </div>


                
                  
                   
            </div>
            <div class="l-group">
                <div class="l-group-title"><Icon type="ios-bookmark" />状态</div>
                <div class="l-item">
                   项目准备  (12)
                   
                </div>
                 <div class="l-item">
                    施工中 (15)
                   
                </div>

 <div class="l-item">
                     审计中 (1)
                   
                </div>

 <div class="l-item">
                     已结束 (131)
                   
                </div>


                
                  
                   
            </div>
             <div class="l-group">
                <div class="l-group-title"><Icon type="md-clock" />工期</div>
                <div class="l-item">
                    1年内 (14)
                   
                </div>
                 <div class="l-item">
                    1-2年 (15)
                   
                </div>

 <div class="l-item">
                     3-5年 (1)
                   
                </div>

 <div class="l-item">
                     5年以上 (0)
                   
                </div>


                
                  
                   
            </div>
            <div class="l-group">
                <div class="l-group-title"><Icon type="ios-bookmark" />标签</div>
                <div class="l-item">
                    学校 (12)
                   
                </div>
                 <div class="l-item">
                    道路 (15)
                   
                </div>

 <div class="l-item">
                     桥梁 (1)
                   
                </div>

 <div class="l-item">
                     厂房 (0)
                   
                </div>


                
                  
                   
            </div>
           
        </div>
        <div class="l-container">
            <div class="l-search">
                <Input placeholder="输入项目名称/编号" icon="md-search" style="width:400px" />
            </div>
            <div class="list" style="padding:20px;">
                <template v-for="p in list">
                <div class="item" style="width:200px;" :key="p.id" @click="openProject(p.id)">
                      <img class="bg" :src="p.avatar || 'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/sanjiangkou.jpg'" />
                      <div class="id">{{p.code}}</div>
                      <div class="title">{{p.name}} <img class='new' src="https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/kt/new.gif" /></div>
                      <div class="new"></div>
                     
                      <div class="inputor">胡佳翰</div>
                      <div class="type" :style="`background:${util.mapColor(p.managetype?p.managetype[0]:'无')}`">{{p.managetype}}</div>
                      <div class="state">组建中</div>
                  </div>
                </template>
            </div>
        </div>
     
      
    </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'

export default {
    data(){
        return {
            loading:false,
            cols:[{
                key:"id",
                title:"序号",
                type:"index",
                
                width:60
            },{
                key:"code",
                title:"项目编号",
                align:"center"
            },{
                key:"name",
                title:"项目名称",
                align:"center"
            }]
        }
    },
    mounted(){
        this.getData()
    },
    computed:{
        ...mapGetters("project",{
            list:"list"
        })
    },
    methods:{
        ...mapActions('project',{
            getList:"getList"
        }),
        getData(){
            this.loading = true;
            this.getList().then().finally(()=>{
                this.loading = false
            })
        },
        openProject(id) {
      let routerUrl = this.$router.resolve({
        path: `/projects/${id}`
      });
      window.open(routerUrl.href, "_blank");
    }
    }
}
</script>
