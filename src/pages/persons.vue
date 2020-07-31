<template>
  <div>
    个人页面
    <pre>
        {{userinfo}}

        {{getPersonProjects(id)}}
        {{getPersonDuration(id)}}

        {{getPersonElus(id)}}
    </pre>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed:{
        id(){
            return this.$route.param.id
        },
        ...mapGetters('user',['userinfo']),
        ...mapGetters('oa',['getPersonProjects','getPersonDuration']),
        ...mapGetters('elu',['getPersonElus'])
    }
}
</script>

<style>

</style>