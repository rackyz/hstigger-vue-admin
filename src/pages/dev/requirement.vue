<template>
  <div class="l-page">
     
      <div class="l-content" style="margin-top:10px;">
        <gTableFrame :def="tableDef" :attach="{users}" />
      </div>
  </div>
</template>

<script>
import gTableFrame from '@refs/gzUI/tableframe/tableframe'
import tableDef from './t_requirement'
import {mapGetters} from 'vuex'
export default {
    
    data(){
        return {
        }
    },
    computed:{
        ...mapGetters("kernel",{
            users:"users" 
        }),
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