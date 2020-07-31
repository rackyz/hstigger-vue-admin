<template>
  <div class="full-fill" style="background:#dfdfdf;padding:10px;">
     
      <Card>
        <div slot="title">
         <h1 slot="title">项目组建</h1>
         <p>您需要对项目参与人员进行配置，部分系统定义职位已分配了固定的权限</p>
        </div>
      <div class="list" style="padding-top:0;max-height:400px;overflow-y:auto;">
      <Card class='com-item' style="width:260px;margin-top:0;margin-bottom:10px;height:120px;padding:0;"><h3 slot="title">项目经理</h3>
         <Select style="width:150px" transfer>

         </Select>
         <Button>任务</Button>
      </Card>

      <Card class='com-item' style="width:260px;height:120px;font-size:18px;">
        <Icon type="md-add" size="20" /> 添加职位
      
      </Card>
      </div>
      </Card>

  </div>
</template>

<script>
export default {

}
</script>
<style lang="less" scoped>
</style>