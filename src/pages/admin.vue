<template>
  <div class="container-page">
      <Menu theme="dark" :active-name="activeNode"  style="width:200px;height:100%;" @on-select="routeTo($event)" transfer>

          <template v-for="m in menus">
              <template v-if="m.type == 'group'">
                  <MenuGroup :key='m.title' :title="m.title">
                      <template v-for="sm in m.subs">
                          <MenuItem :key="sm.route" :name="sm.route" class="flex-wrap">
                        <Icon :type="sm.icon" size="20" style="margin-right:10px;" /> 
                        {{sm.title}}
                    </MenuItem>
                      </template>
                  </MenuGroup>
              </template>
              <template v-else>
            <MenuItem :key="m.route" :name="m.route" class="flex-wrap">
                <Icon :type="m.icon" size="20" style="margin-right:10px;" /> 
                {{m.title}}
            </MenuItem>
              </template>
          </template>
       
    </Menu>

    <div class="l-container">
         <keep-alive>
        <router-view></router-view>
         </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            menus:[
                 {
                title:"账号管理",
                type:'group',
                subs:[
                    {
                title:"用户管理",
                icon:"ios-person-outline",
                route:'admin/user'
            },
            {
                title:"部门管理",
                icon:"ios-flag-outline",
                route:'admin/dep'
            },
            {
                title:"角色权限",
                icon:"ios-person-add",
                route:'admin/role'
            }
                ]},{
                 title:"信息管理",
                type:'group',
                subs:[
                    {
                title:"内容管理",
                icon:"ios-bookmarks-outline",
                route:'admin/notice'
            },
            {
                title:"工作管理",
                icon:"ios-clipboard-outline",
                route:'admin/work'
            },
            {
                title:"流程管理",
                icon:"ios-git-network",
                route:'admin/workflow'
            },
            {
                title:"文档管理",
                icon:"ios-folder-open-outline",
                route:'admin/document'
            },
            {
                title:"文件管理",
                icon:"ios-document-outline",
                route:'admin/file'
            },{
                title:"消息管理",
                icon:"ios-mail-outline",
                route:'admin/msg'
            },
                ]},
           
            
            {
                title:"系统维护",
                type:'group',
                subs:[ {
                title:"类型管理",
                icon:"ios-pricetag-outline",
                route:'admin/type'
            },{
                  title:"系统日志",
                icon:"ios-information-circle-outline",
                route:'admin/log'
            },{
                  title:"系统信息",
                icon:"ios-settings-outline",
                route:'admin/maintain'
            }]
            },
            
            
            
            ]
        }
    },
    ready(){
        if(!this.$store.getters['user/permissions'].ADMIN)
            this.$router.replace('/403')
    },
    methods:{
          routeTo(t){
             let path = "/" + t
            if(this.$route.path != path)
                this.$router.push(path)
            }
    },
    computed:{
        
        activeNode(){
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
    background:#dfdfdf;
}
</style>