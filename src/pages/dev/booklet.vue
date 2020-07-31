<template>
  <div class="l-page">
      <div class="l-menu-wrap">
          <h1>
              目录
          </h1>
          <template v-for="m in contents">
          
          <div class="l-menu-item" :class="selectedId==m.id?'l-menu-item-selected':''" @click="selectedId=m.id" :key="m.id">
              {{m.name}}
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
            selectedId:"articleCPMISE01",
            editing:false,
            contents:[{
                id:"articleCPMISE01",
                name:"1 - 用户操作"
                
            },{
                 id:"articleCPMISE02",
                name:"2 - 管理员操作"
            },{
                 id:"articleCPMISE03",
                name:"3 - 系统常见疑难问题汇总"
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