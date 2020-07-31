<template>
  <Card style="margin:10px;">
      <h2 slot="title">通知公告</h2>

       <div class="flex-between gz-card-style" style="margin-bottom:10px">
           <div class="flex-wrap">
          <Input  enter-button="搜索" v-model="search_text" placeholder="输入关键字查询..." style='width:300px;' />
           </div>
           <div class="flex-wrap" style="margin:0;">
                <Button @click="onAdd" style="marign-right:10px">我创建的</Button><Button @click="onAdd">全部标为已读</Button>
            </div>
          </div>
          <gzTable style="position:relative;height:100%;" :columns="cols" :data="list" :option="{stripe:true}" :onEvent="onEvent" />
       <Modal title="通知" width="700" v-model="showNoticeViewer" footer-hide>
     <notice style="margin:10px;"  :data="selectedNotice" />
  </Modal>
  </Card>
 
</template>

<script>
import gzTable from '@refs/gzUI/tableframe/table'

import notice from '@pages/shared/notice'
import { mapGetters } from 'vuex'
export default {
  components:{
    gzTable,notice
  },
  data(){
    return {
      search_text:"",
      showNoticeViewer:false,
      cols:[{
        key:"id",
        title:"序号",
        type:"index",
        width:60
      },{
        title:"标题",
        key:"title",
        type:"link",
        event:"open"
      },{key:'inputTime',type:"time",title:"时间",
      width:120,

      option:{
        type:'date'
      }},{
        key:"inputor",type:"user",title:"发布人",width:120
        }]
    }
  },
  computed:{
    ...mapGetters('notice',['list'])
  },
  methods:{

    onEvent(e,data){
      if(e == 'open'){
        this.showNoticeViewer = true
        this.selectedNotice = data
      }
    }
  }
}
</script>

<style>

</style>