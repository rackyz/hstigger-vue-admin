<template>
 <div class="l-page dashboard" >
     <Card style="margin:10px;font-size:25px;">
        内容管理
        <div style="font-size:14px;color:#888;">所有的文章、通知、公告、新闻等</div>
      </Card>
      <Tabs type="card" style="margin:10px;" :animated="false">
          
        <template v-for="t in getTypes('ArticleType')">
          <TabPane :label="t.name+' 0'" :key='t.id' style="background:#fff">
               <hToolbar :data="tools" @event='onEvent'  />
            <Card>
       
       <div class="l-list">
         <div class="l-list-item l-article-item" :class="{'l-list-item-selected':true}" >
              <div class="title">2020年7月招标通知</div>
              <gzAvatar class="avatar" size="30" />
              <div class="abstract">摘要信息</div>
              <div class="flex-wrap" style="position:absolute;bottom:10px;left:10px;right:10px;justify-content:space-around;background:yellow;">
                <div class="value"><Icon type="ios-clock-outline" />3天前</div><span class="seperator" style="height:20px;border-color:#aaa;border-left-color:#fff;margin:0 3px;" /> <div class="value"><Icon type="ios-attach" />附件</div><span class="seperator" style="height:20px;border-color:#aaa;border-left-color:#fff;margin:0 3px;" /><div class="value"><Icon type="ios-eye-outline" size="15" />全员</div> <span class="seperator" style="height:20px;border-color:#aaa;border-left-color:#fff;margin:0 3px;" /><div class="value">已发布</div>
               </div>

              

          </div>
          <div class="l-list-item l-article-item" :class="{'l-list-item-selected':true}" >
              <div class="title">关于国庆放假安排的通知</div>
              <gzAvatar class="avatar" size="30" />
               <div><span class='label'>时间</span><span class="value">2020/13/14 15:00:00</span></div>
              <div><span class='label'>可见</span><span class="value">全员</span></div>
              <div><span class='label'>状态</span><span class="value">已发布</span></div>

              

          </div>

          <div class="l-list-item l-article-item" :class="{'l-list-item-selected':true}" >
              <div class="title">近期系统维护通知</div>
              <gzAvatar class="avatar" size="30" />
               <div><span class='label'>时间</span><span class="value">2020/13/14 15:00:00</span></div>
              <div><span class='label'>可见</span><span class="value">全员</span></div>
              <div><span class='label'>状态</span><span class="value">未发布</span></div>

              

          </div>
            <div class="l-list-item l-article-item" :class="{'l-list-item-selected':false}" >
              <div class="title title-small">标题很长很长很长很长测试标题很长很长很长很长测试</div>
              <gzAvatar class="avatar" size="30" />
              <div><span class='label'>时间</span><span class="value">2020/13/14 15:00:00</span></div>
              <div><span class='label'>可见</span><span class="value">全员</span></div>
              <div><span class='label'>状态</span><span class="value">未发布</span></div>

              

          </div>

           <div class="l-list-item l-article-item" :class="{'l-list-item-selected':false}" >
              <div class="title title-small">标题很长很长很长很长测试标题很长很长很长很长测试标题很长很长很长很长测试标题很长很长很长很长测试标题很长很长很长很长测试标题很长很长很长很长测试</div>
              <gzAvatar class="avatar" size="30" />
               <div><span class='label'>时间</span><span class="value">2020/13/14 15:00:00</span></div>
              <div><span class='label'>可见</span><span class="value">全员</span></div>
              <div><span class='label'>状态</span><span class="value">未发布</span></div>

              

          </div>
        </div>

            
            
          </Card>
          </TabPane>
        </template>
                  <Input slot="extra"   v-model="search_text" search placeholder="输入关键字查询..." style='width:200px;border:1px solid #ccc;filter:drop-shadow(1px 1px 1px 2px #333);' size="small" />
      </Tabs>
    
    <Modal title="通知" width="700" v-model="showNoticeViewer" footer-hide>
      <template v-if="model.id && editingText"> 
        <notice style="margin:10px;"  :data="model" />
      </template><template v-else>
          <gzForm style="margin:5px;" editable :form="notice_form" :data="model" @on-submit="Patch" />
      </template>
  </Modal>
 </div>
</template>

<script>
import gzAvatar from '@refs/avatar/index'
import gzTable from '@refs/gzUI/tableframe/table'
import gzForm from '@refs/gzUI/form/index'
import notice_form from '@pages/shared/notice_form'
import hToolbar from '@refs/gzUI/Toolbar/toolbar'
import notice from '@pages/shared/notice'
import { mapGetters } from 'vuex'
export default {
  components:{
    gzTable,notice,hToolbar,gzForm,gzAvatar
  },
  data(){
    return {
      selected_type:{},
      model:{},
      search_text:"",
      showNoticeViewer:false,
       tools:[{
                key:'add',
                name:'添加',
                icon:'md-add'
            },{
                key:'delete',
                name:'删除',
                icon:"md-trash"
            },{
                key:'edit',
                name:'编辑',
                icon:"md-create"
            },{
                key:'user',
                name:'可见范围',
                icon:"ios-person"
            },{
                key:'remove-user',
                name:'发布',
                icon:"ios-remove"
            }
        ],
      cols:[
        {
        key:"id",
        title:"序号",
        type:"index",
        width:60 },{
        title:"标题",
        key:"title",
        type:"link",
        event:"open"
      },{
        title:"摘要",
        key:"abstract",
        type:"text"
      },{
        key:"file_type",
        title:"文件类型",
        type:"text",
        width:120
        
      },{key:'inputTime',type:"time",title:"发布时间",
      width:120,

      option:{
        type:'date'
      }},{
        key:"inputor",type:"user",title:"发布人",width:120
        }
      ]
    }
  },
  computed:{
    ...mapGetters('type',['getTypes']),
    ...mapGetters('article',['notices']),
    notice_form(){
      return notice_form
    }
  },
  mounted(){
    this.$store.dispatch('article/List')
    this.selected_type = this.getTypes('ArticleType')[0]
   
    
  },
  methods:{
    Patch(e){
      e.file_type = 'TEXT'
      e.type_id = 62
      this.$store.dispatch('article/Patch',e).then(res=>{
        this.Success('创建成功')
      }).catch(e=>{
        this.Error(e)
      })
    },
    onEvent(e,data){
      if(e == 'add'){
        this.showNoticeViewer = true
      }else if(e == 'open'){
        this.showNoticeViewer = true
        this.selectedNotice = data
      }
    }
  }
}
</script>
<style lang="less" scoped>
.l-tab-item{
  min-width:120px;
  cursor:pointer;
  margin-right:10px;
  background:none;
}

.l-article-item{
  width:300px;
  height:150px;
  margin-right:15px;
  margin-bottom:15px;
 
  filter:drop-shadow(1px 1px 1px 2px #333);
  border:1px solid #dfdfdf;
  padding:10px;
  padding-top:5px;
  flex-direction: column;
  .title{
    font-size:20px;
    line-height:40px;
    margin-left:40px;
    position: relative;
    color:#56a;

  }

  .title-small{
    font-size: 15px;
    line-height:20px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .abstract{
  
    color:#aaa;
    font-size:14px;
  }

  .avatar{
    position: absolute;
    left:10px;
    top:10px;

  }
  .abstract{
    width:100%;
    height:60px;
    background:#aaa;
    overflow: hidden;
  
    
  }


  .value{
    font-size:14px;
    display: flex;
    align-items: center;
    color:#888;
    i {
      margin-right:5px;
    }
    font-size:12px;
  }
}
</style>