<template>
  <div class="full-fill">
      确认提交审核内容？

       已提交，审核中
         <div class="flex-wrap" style="width:100%;justify-content:flex-end;margin-top:10px;">
          <Button style='margin-right:10px;' @click="onPrevStep">上一步</Button><Button type='primary' @click="onNextStep">提交</Button>
        </div>

  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    computed:{
         id(){
            return this.$route.params.id
        }
    },
    methods:{
         ...mapMutations('project',['setProjectInstallState','addPosition','setPositionUser','removePosition']),
          onNextStep(){
            var that = this
            this.$Modal.confirm({
                title:'保存确认',
                content:"确定提交项目组建信息",
                onOk(){
                    that.setProjectInstallState({id:that.id,state:4})
                }
            })
          
        },
        onPrevStep(){
            this.setProjectInstallState({id:this.id,state:0})
        }
    }

}
</script>

<style>

</style>