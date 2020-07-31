<template>
  <div class='gyui-avatar' :style='`width:${size}px;height:${size}px;`'>
     
          
      <img class='l-frame' :src="`https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/icon/${_frame}.png`" />
      
      <img class='l-avatar' :src="_avatar || ''" />
  </div>
</template>

<script>
export default {
    props:{
        userinfo:{
            type:Object
        },
        avatar:{
            type:String,
            default:"https://nbgz-pmis-1257839135.cos.ap-shanghai.myqcloud.com/icon/guest.png"
        },
        frame:{
            type:String,
            default:"1"
        },
        size:{
            type:Number,
            default:20
        }
    },
    computed:{
        _avatar(){
            if(this.userinfo)
                return this.userinfo.ps_avatar || this.userinfo.avatar || this.avatar
            else
                return this.avatar
        },
        _frame(){
            if(this.userinfo)
                return this.userinfo.ps_frame || this.userinfo.frame || this.frame
            else
                return this.frame
        }
    }
}
</script>

<style lang="less" scoped>


.gyui-avatar{
    overflow: hidden;
    position: relative;

    .l-frame{
        z-index:2;
        position: absolute;
        left:0;
        right:0;
        bottom:0;
        top:0;
        width:100%;
        height:100%;
    }

    .l-avatar{
        margin:5%;
        width:90%;
        height:90%;
    }
}




</style>