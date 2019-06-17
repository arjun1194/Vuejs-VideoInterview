<template>
  <div class="col s12  center" style="position: relative">
    <div class="center" style="position:relative;">
            <span>
                <span style="position:absolute;top:1%;margin-left:5px;color:white;
                     background-color:rgba(0,0,0,0.8)">{{interviewData.participants[currentIndex].username}}'s Screen
                </span>
              <video id="global" autoplay class="video-webcam grey"></video>
              <i class="material-icons white-text " @click="switchScreen" style="position:absolute;top:1%;right:6% ; background:rgba(0,0,0,0.8)">search</i>
              <i class="material-icons white-text " @click="requestFullScreen" style="position:absolute;top:1%;right:1% ; background:rgba(0,0,0,0.8)">fullscreen</i>
            </span>
    </div>
  </div>
</template>

<script>
    export default {
        name: "mainVideo",
      data(){
          return{
            isVideo:true,
            currentID:1,
            currentIndex:0,
            screen_streams:{},
            video_streams:{},
          }
      },
      props:{
          interviewData:{
            required:true
          },
      },
      methods:{
        requestFullScreen: function() {
          var videoEl = document.getElementById('global');
          videoEl.requestFullscreen();
        },
        switchScreen:function(){
          var vm = this;
          vm.isVideo = !vm.isVideo;
          if(vm.isVideo){
            var elem = document.getElementById('global');
            var smallElem = document.getElementById(vm.currentID);
            elem.srcObject = vm.video_streams[vm.currentID];
            smallElem.srcObject = vm.screen_streams[vm.currentID];
          }else{
            var elem = document.getElementById('global');
            var smallElem = document.getElementById(vm.currentID);
            elem.srcObject = vm.screen_streams[vm.currentID];
            smallElem.srcObject = vm.video_streams[vm.currentID];
          }

        },
      }
    }
</script>

<style scoped>
  .candidate-video {
    height: 70vh;
    width: 100%;
    alignment: right;
    background: #f4f4f4;
    padding: 0;
  }
  .video-webcam {
    height: 70vh;
    width: 100%;
    padding-bottom: 1rem;
  }
</style>
