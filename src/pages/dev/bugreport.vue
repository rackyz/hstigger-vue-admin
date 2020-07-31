<template>
  <div class="l-page">
     
      <div class="l-content" style="margin-top:10px;">
        <gTableFrame :def="tableDef" />
      </div>
  </div>
</template>

<script>
import gTableFrame from '@refs/gzUI/tableframe/tableframe'
import tableDef from './t_bugreport'
export default {
    data(){
        return {
            columns:[{
                key:"id",
                type:"index",
                align:"center",
                width:60,
                title:"序号"
            },{
                key:"type_id",
                title:"类型",
                align:"center",
                width:100
            },{
                key:"name",
                title:"标题",
                minWidth:300,
                align:"center"
            },{
                key:"inputor",
                title:"创建人",
                align:"center",
                width:120
            },{
                key:"updateTime",
                title:"更新时间",
                align:"center",
                width:120

            },{
                key:"updator",
                title:"回复人",
                align:"center",
                width:120
            }]
        }
    },
    computed:{
        tableDef(){
            return tableDef
        }
    },
    components:{
        gTableFrame
    }
}
</script>

<style lang="less" scoped>
.l-page{
    
    
}

.l-board{
    margin:20px;
        padding:20px;
        height:200px;
        background:rgb(32, 123, 184);
        width:100%;
        border-radius: 10px;
        color:#fff;
        h1{
            font-weight: normal;
        }

    }

    .l-content{
        position: relative;
         margin:20px;
    }
</style>