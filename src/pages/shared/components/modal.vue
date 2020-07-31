<template>
  <Modal v-model="showModal" footer-hide :class="formError?'l-modal-error':''" :width="width || 400" :title="title" @on-cancel="onCancel">
      <gzForm :form="form" @on-submit="onSubmit" @on-error="onError" on-cancel="" />
  </Modal>
</template>

<script>
import gzForm from '@refs/gzUI/form/index'
export default {
    data(){
        return {
            error:false,
        }
    },
    props:{
        showModal:{
            type:Boolean,
        },
        title:{
            type:String
        },
        width:{
            type:Number
        },
        form:{
            type:Object
        },
    },
    components:{
        gzForm
    },
    methods:{
        onSubmit(e){
            this.$emit('on-submit',e)
        },
        onError(){
            this.error = true
        },onCancel(){
            this.error = false
        }
    }
}
</script>

<style>

</style>