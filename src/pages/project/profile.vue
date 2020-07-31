<template>
  <div class="full-fill" style="overflow-y:auto">
      <img class="bg-mark" :src="project.avatar || 'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/timg.jpg'" />
      
      <Row :gutter="10" style="margin:10px;">
          <Col :span="6">
        
          <Card>
             <div slot="title">
              <h2>{{project.name}}</h2>
              <div style="margin-top:15px;"><Tag>学校</Tag><Tag>监理</Tag><Tag>鄞州</Tag></div>
            </div>
             
              <p>{{project.desc || "无"}}</p>
          </Card>
         
         <Card style='margin-top:10px;'>
              <Carousel :autoplay="images.length > 1" v-model="value2" loop>
                  <template v-for="img in images">
        <CarouselItem :key="img">
             <img style="width:100%" :src="img || 'https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/timg.jpg'" />
        </CarouselItem>
        </template>
       
    </Carousel>
         </Card>
          <Card style="margin-top:10px;">
          <h2 slot="title">项目大事</h2>
          <div class="l-content">
          <Timeline>
        <TimelineItem>
            <p class="time">1976年</p>
            <p class="content">Apple I 问世</p>
        </TimelineItem>
        <TimelineItem>
            <p class="time">1984年</p>
            <p class="content">发布 Macintosh</p>
        </TimelineItem>
          </Timeline>
          </div>
      </Card>
      </Col>
       <Col :span="18">
        <Card>
          <h2 slot="title">项目组建</h2>
          <div class="l-position-list">
              <template v-for='(n,i) in members'>
              <Card class="l-node" :key="n.name">
                  <gzAvatar class="avatar" :userinfo="getUser(n.user)" size="40" />
                  <div class="info">
                   {{getUser(n.user)?getUser(n.user).name:""}} <br />
                   {{n.position}} <br />
                   
                   </div>
              </Card>
              </template>
          </div>
      </Card>
          <Card style='margin-top:10px;'>
          <h2 slot="title">项目节点</h2>
          <div class="l-node-list">
              <template v-for='(n,i) in nodes'>
              <Card class="l-node" :key="n.name">
                  {{i+1}} - {{n.name}} <br />
                  {{n.dep}} <br />
                  {{n.position}}
              </Card>
              </template>
          </div>
      </Card>
        <Card style="margin-top:10px;">
          <h2 slot="title">形象进度</h2>
          
          <div class="l-progress-list">
              <Card class="l-progress" style="background:url(https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/sanjiangkou.jpg)">
              </Card>
              <Card class="l-progress" style="background:url(https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/sanjiangkou.jpg)">
              </Card>
              <Card class="l-progress" style="background:url(https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/sanjiangkou.jpg)">
              </Card>
              <Card class="l-progress" style="background:url(https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/sanjiangkou.jpg)">
              </Card>
          </div>
      </Card>
     
      
       </Col>
      </Row>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import gzAvatar from '@refs/avatar'
export default {
 data(){
        return {
            loading:false,
            members:[{
                user:"UID00000001",
                position:"项目经理",

            },
            {
                user:"UID00000001",
                position:"前期管理",
                
            },
            {
               user:"UID00000001",
                position:"设计管理",
                
            }, {
                user:"UID00000001",
                position:"机电管理",
                
            },{
                  user:"UID00000001",
                position:"合约管理",
            },{
                 user:"UID00000001",
                position:"造价管理",
            }],
            nodes:[{
                name:'项目开始',
                dep:"项目部",
                position:"项目经理",

            },
            {
                name:'扩初批复',
                dep:"项目部",
                position:"项目经理",
                
            },
            {
                name:'施工许可证',
                dep:"项目部",
                position:"项目经理",
                
            }, {
                name:'开工准备',
                dep:"项目部",
                position:"项目经理",
                
            }, {
                name:'桩基基础',
                dep:"项目部",
                position:"项目经理",
                
            }, {
                name:'地下室顶板(±0)',
                dep:"项目部",
                position:"项目经理",
                
            }, {
                name:'主体结顶',
                dep:"项目部",
                position:"项目经理",
                
            }, {
                name:'二次结构',
                dep:"项目部",
                position:"项目经理",
                
            }, {
                name:'外装饰(含内墙抹灰)',
                dep:"项目部",
                position:"项目经理",
                
            },{
                name:'室内精装',
                dep:"项目部",
                position:"项目经理",
                
            },{
                name:'地下室管线',
                dep:"项目部",
                position:"项目经理",
                
            },{
                name:'室外道路',
                dep:"项目部",
                position:"项目经理",
                
            },{
                name:'室内绿化',
                dep:"项目部",
                position:"项目经理",
                
            },{
                name:'竣工验收',
                dep:"项目部",
                position:"项目经理",
                
            },{
                name:'后期办证及资料',
                dep:"项目部",
                position:"项目经理",
                
            },{
                name:'保修审计',
                dep:"项目部",
                position:"项目经理",
                
            }]
        }
    },
    components:{
        gzAvatar
    },
    computed:{
        ...mapGetters('project',{
            getProject:'get'
        }),
        ...mapGetters('kernel',{
            getUser:'getUser'
        }),
        id(){
            return this.$route.params.id
        },
        project(){
            return this.getProject(this.id) || {}
        },
        images(){
            if(this.project._images)
                return this.project._images
            else
                return []
        }
    },
    mounted(){
        
    },
    methods:{

    }
}
</script>

<style lang="less" scoped>
.l-page{
    .l-board{
    width:100%;
    margin-top:10px;
    .l-attrs{
        width:100%;
        
        border:1px solid #333;
        filter:drop-shadow(1px 1px 1px #333);
        z-index:1200;
        .l-logo{
            background:#aaa;
            width:100%;
            height:230px;
            overflow: hidden;
            position: relative;
            img{
                width:100%;
                height:100%;
            }
        }
    }
    

    .l-desc{
        width:100%;
        margin:20px;
        overflow: hidden;
        margin-left:380px;
        padding-top:20px;
        h1{
            width:100%;
        }

        p{
        }
        
    }

    
}

.l-panel{
        min-height:100px;
        margin-top:10px;
        width:100%;
    }

    .l-content{
        margin:20px 0;
    }
}

.l-attr-item{
    
    background:#fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    position: relative;
    background:rgb(7, 74, 136);

    .l-attr-label{
        width:100px;
        position: absolute;
        left:0;
        top:0;
        bottom:0;
        
        color:#ddd;
        display: flex;
        justify-content: center;
        align-items: flex-start;

        font-size:14px;
    }

    .l-attr-value{
        display: flex;
        align-items: center;
        padding:0 10px;
        font-size:14px;
        background:#dfdfdf;
        width:100%;
        margin-left:100px;
    }
}

.l-attr-item:nth-child(odd){
    filter:brightness(1.2)
}

.l-node-list{
    display: flex;
    flex-wrap: wrap;
   
    padding-left:10px;
    padding-top:10px;
    .l-node{
        margin-right:10px;
        margin-bottom:10px;
        height:100px;
        width:150px;
        border:1px solid #dfdffd;
    }
}


.l-progress-list{
    display: flex;
    flex-wrap: wrap;
    padding-left:10px;
    padding-top:10px;
    .l-progress{
        margin-right:10px;
        margin-bottom:10px;
        height:180px;
        width:250px;
        border:1px solid #dfdffd;
    }
}


.bg-mark{
    position: fixed;
    opacity:0.2;
    width:100%;
    filter:brightness(0.6);
}


.l-position-list{
     display: flex;
    flex-wrap: wrap;
    padding-left:10px;
    padding-top:10px;

    .l-node{
        margin-right:30px;
        margin-bottom:10px;
        width:150px;
        padding-left:30px;
        border:1px solid #dfdffd;
        position: relative;
        .avatar{
            position: absolute;
            left:-10px;
        }
    }
}


</style>