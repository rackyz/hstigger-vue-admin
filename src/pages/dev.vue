<template>
  <div class="container-page">
      <Menu theme="dark" :open-names="['2']" :active-name="activeNode" style="width:200px;height:100%;" @on-select="routeTo($event)" >
        
        <MenuItem name="dev/requirement">需求沟通</MenuItem>
        <MenuItem name="dev/bugreport">问题反馈</MenuItem>
        <MenuItem name="dev/progress">开发进度</MenuItem>
        <MenuItem name="dev/document">设计文档</MenuItem>
        <MenuItem name="dev/booklet">操作手册</MenuItem>
        <Submenu name="2">
            <template slot="title">
                        开发控件
                    </template>
        <MenuItem name="dev/tableframe">数据管理框架 - gzTableframe
            
         </MenuItem>
         <MenuItem name="dev/form">动态表单 - gzForm
            
         </MenuItem>
         <MenuItem name="dev/flow">流程 - gzWorkflow
            
         </MenuItem>
         </Submenu>
    </Menu>
    <div class="l-container">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
    methods:{
          routeTo(t){
             let path = "/" + t
            if(this.$route.path != path)
                this.$router.push(path)
            }
    },
    computed:{
        
        activeNode(){
            console.log(this.$route)
            return this.$route.path.substr(1)
        }
    }

}
</script>

<style lang="less" scoped>
.l-container{
    position: absolute;
    left:200px;
    top:0;
    bottom:0;
    right:0;
    overflow:hidden;
    overflow-y:auto;
}
</style>