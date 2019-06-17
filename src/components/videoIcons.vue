<template>
  <div class="col  s12  candidate-icons ">
    <div class="scrollmenu center" style="position:relative;">
            <span v-for="(p,index) in interviewData.participants">
                <span :style="(index==0)?'margin-left:0':'margin-left:5px'"
                      style="position:absolute;top:1%;margin-left:5px;
                             color:white;background-color:rgba(0,0,0,0.8)">{{p.username}}
                </span>
                  <video :id="p.accountId" @click="videoIconCLick(p.accountId,p.index)" :style="(currentIndex==p.index)?'border:4px solid green':''" autoplay class=" grey video-icons"
                         style="padding:0;"
                         v-if="p.accountId!=p">
                  </video>
            </span>
    </div>
  </div>
</template>

<script>
    export default {
        name: "videoIcons",
      data() {
        return {
          currentID:1,
          currentIndex:0,
        }
      },
      props:{
          interviewData:{
            required:true,
          },

      },
      methods:{
        videoIconCLick:function(account_id,index){
          this.currentID=account_id;
          this.currentIndex=index;
          var element = document.getElementById('global');
          if(this.screen_streams.hasOwnProperty(account_id)) {
            element.srcObject = this.screen_streams[account_id];
            console.log(element.srcObject);
          }else{
            element.srcObject = null;
          }
        },
      },
    }
</script>

<style scoped>

  .candidate-icons{
    height: 20vh;
    padding: 0;
    top: 0;
  }
  .video-icons {
    top: 0 !important;
    height: 20vh;
  }
  div.scrollmenu {
    width: 100%;
    overflow-x: scroll;
    white-space: nowrap;
  }

  div.scrollmenu video {
    display: inline-block;
    color: white;
    text-align: center;
    padding: 14px;
    text-decoration: none;
  }

  div.scrollmenu a:hover {

  }
</style>
