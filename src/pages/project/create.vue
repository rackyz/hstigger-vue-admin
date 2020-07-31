<template>
  <Modal title="新建项目" v-model="show">
      <gzForm :form="form" editable @on-submit="onSubmit" />
  </Modal>
</template>

<script>
export default {
    data(){
        return {
            form:{
                def:{
                    code:{
                        label:"项目编号",
                        control:"input",
                        option:{
                            required:true,
                            maxlen:12
                        }
                    },
                    name:{
                        label:"项目名称",
                        control:"input",
                        option:{
                            required:true,
                            maxlen:64
                        }
                    }
                }
            },
            layout:"<Row :gutter='10><Col :span='6'>{{code}}</Col><Col :span='18'>{{name}}</Col></Row>"
        }
    },
    props:{
        show:{
            type:Boolean
        }
    }
}
</script>

<style>

</style>