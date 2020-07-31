<template>
  <div class="l-page">
      <Card style="margin:10px;width:450px;">
         
      {{userinfo}}
      </div>
      </Card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed:{
        ...mapGetters('user',['userinfo'])
    }
}
</script>

<style lang="less" scoped>


</style>