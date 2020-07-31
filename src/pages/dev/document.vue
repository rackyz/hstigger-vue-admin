<template>
  <div class="l-page">
      <div class="l-menu-wrap">
          <h1>
              目录
          </h1>
          <template v-for="m in contents">
          
          <div class="l-menu-item" :class="selectedId==m.id?'l-menu-item-selected':''" @click="selectedId=m.id" :key="m.id">
              {{m.name}} <span class="l-new" v-show="m.new">新</span>
          </div>
          </template>
      </div>
      <xArticle class="l-article" :id="selectedId" />
  </div>
  
</template>

<script>
import xArticle from "@refs/editor/article"
export default {
    data(){
        return{
            article:"# Class",
            original:"",
            selectedId:"articleCPMISD01",
            editing:false,
            contents:[{
                id:"articleCPMISD01",
                name:"1 - 总体设计",
                new:true
                
            },{
                 id:"articleCPMISD06",
                name:"2 - 前端数据模块",
                new:true
            },{
                 id:"articleCPMISD07",
                name:"2.1 - 文件模块",
                new:true
            },{
                 id:"articleCPMISD02",
                name:"3 - 前端业务模块",
                new:true
            },{
                 id:"articleCPMISD03",
                name:"3.1 - 登录模块",
                new:true
            },{
                 id:"articleCPMISD04",
                name:" 3.2 - 用户管理模块",
                new:true
            },{
                 id:"articleCPMISD05",
                name:" 3-3 - 部门模块",
                new:true
            },{
                 id:"articleCPMISD0X",
                name:" A. - 参考文档",
                new:true
            },{
                 id:"articleCPMISD0Y",
                name:" B. - UI设计",
                new:true
            }]
        }
    },
    components:{
        xArticle
    }
}
</script>

<style lang="less" scoped>
td{
    padding:10px;
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

        .l-new{
            color:red;
            margin-left:10px;
            font-size:12px;
            font-weight: normal;
            
        }
    }

    .l-article{
        position: absolute;
        left:220px;
    }
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