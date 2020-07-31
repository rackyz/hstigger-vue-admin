<template>
  <div class="dashboard" style="">
    <Card style="margin:10px;font-size:25px;">
        系统与维护
        <div style="font-size:14px">项目管理平台v1.0.0</div>
      </Card>
      <Card style="margin:10px" padding="0">
         <Tabs :value="tabname">
            <TabPane style="padding:10px 20px;" label="系统信息" name="name1">
                <Row :gutter="15">
                  <Col :span="12" style="margin-bottom:12px;">
                <Card dis-hover title="设备信息" style="filter:none;border:1px solid #dfdfdf;">
                    服务器: CentOS 7.2 <br />

                </Card>
                </Col>
                 <Col :span="12">
                <Card dis-hover icon="md-list" title="数据库信息"  style="margin-bottom:12px;filter:none;border:1px solid #dfdfdf;">
                    服务器: CentOS 7.2 <br />

                </Card>
                </Col>
                </Row><Row :gutter="15">
                   <Col :span="12">
                 <Card dis-hover title="软件版本" style="margin-bottom:12px;filter:none;border:1px solid #dfdfdf;">
                    服务器: CentOS 7.2 <br />

                </Card>
                </Col>
                </Row>
                

            </TabPane>
            <TabPane style="padding:10px 30px;" label="升级维护" name="name4">
               <Timeline style="border:1px solid #dfdfdf;padding:10px;">
                  <TimelineItem>
                    <p class="time">2020/07/31 </p>
                    <p class="content">初始版本发布</p>
                </TimelineItem>
                 <TimelineItem>
                    <p class="time">2020/03/12 </p>
                    <p class="content">项目启动</p>
                </TimelineItem>
               
              </Timeline>
              <div class="date"></div>

            </TabPane>
            <TabPane  style="padding:10px 30px;"  label="备份与恢复" name="name3">
                <Card dis-hover style="background:#FFEEEE;color:darkred;filter:none;border:1px solid #dfdfdf;">
                  请谨慎使用该功能，操作不当可能会导致数据丢失！<br />
                  测试版本暂未开通数据回复功能.
                </Card>
                <div class="flex-right project-tools" style="margin-top:20px;width:100%;">
                  <Button @click="$store.dispatch('dump/dump')">新增备份</Button>
                </div>
                <gzTable style="margin:10px;" :columns="cols" :data="dumps" /> 
            </TabPane>
            
        </Tabs>
      </Card>
  </div>
</template>

<script>
import gzTable from '@refs/gzUI/tableframe/table'
import { mapGetters } from 'vuex'
export default {
  components:{
    gzTable
  },
  mounted(){
    this.getData()
  },
  computed:{
    ...mapGetters('dump',{dumps:'list'})
  },
  data(){
    return {
      tabname:"name1",
       cols: [{
            key: 'id',
            title: '序号',
            type: 'index',
            width: 60
        },  {
            key: 'date',
            title: '备份日期',
            type: 'time',
            width:120,
            option:{
                align:"center",
                type:'time'
            }
        }, {
            key: 'file',
            title: '文件名称',
            type: 'text',
            option:{
            }
        }, {
            key: 'state',
            title: '状态',
            type: 'state',
            width:100,
            event:'open',
            option: {
                align: "center"
                ,states:['已保存'],
                colors:['darkgreen']
            }
        }]
    }
  },
  methods:{
    getData(){
      this.$store.dispatch('dump/list')
    }
  }
}
</script>

<style>

</style>