<template>
    <div id="container"></div>
</template>

<script>
const PhotoSphereViewer = require('photo-sphere-viewer')
    import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
  export default {
    name: 'ThreeTest',
    data () {
        return {}
    },
    methods: {
      initPhotoSphere() {
            this.PSV = new PhotoSphereViewer.Viewer({
            container: document.getElementById("container"),
            panorama:"static/img/qj01X.jpg",
            fisheye:true
            })
        }

    },
    mounted () {
      this.initPhotoSphere()
    }
  }
</script>
<style scoped>
  #container {
    height: 100%;
    width:100%;
  }
</style>