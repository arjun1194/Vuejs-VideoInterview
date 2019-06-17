<template>
    <div>
      <!-- main row-->
      <!--main row is divided into 2 partitions -->
      <div class="row container-fluid">

        <nav class="black">
          <div class="row">
            <div class="col l1"><i @click="sidebarShow=!sidebarShow" class="material-icons left">menu</i>
            </div>
            <div class="col l9">
              <i class="material-icons left hide-on-large-only" style="vertical-align: middle">menu</i>
              <div>Navbar Title</div>
            </div>
          </div>
        </nav>
        <!--partition1-->
        <div class="col s12 l10 main-body">
          <div class="row">
            <!--main-video-->
            <div class="col s12 l12 candidate-video center" style="position: relative">
              <div class="center" style="position:relative;">
            <span>
                <span style="position:absolute;top:1%;margin-left:5px;color:white;
                           background-color:rgba(0,0,0,0.8)">{{interviewData.participants[currentIndex].username}}'s Screen
                </span>
              <video autoplay class="video-webcam grey" id="global"></video>
              <i @click="switchScreen" class="material-icons white-text "
                 style="position:absolute;top:1%;right:6% ; background:rgba(0,0,0,0.8)">search</i>
              <i @click="requestFullScreen" class="material-icons white-text "
                 style="position:absolute;top:1%;right:1% ; background:rgba(0,0,0,0.8)">fullscreen</i>
            </span>
              </div>
            </div>
            <!--video icons-->
            <div class="col  s12 l12 candidate-icons ">
              <div class="scrollmenu center" style="position:relative;">
            <span v-for="(p,index) in interviewData.participants">
                <span :style="(index==0)?'margin-left:0':'margin-left:5px'"
                      style="position:absolute;top:1%;margin-left:5px;
                             color:white;background-color:rgba(0,0,0,0.8)">{{p.username}}
                </span>
                  <video :id="p.accountId" :style="(currentIndex==p.index)?'border:4px solid green':''"
                         @click="videoIconCLick(p.accountId,p.index)" autoplay class=" grey video-icons"
                         style="padding:0;"
                         v-if="p.accountId!=p">
                  </video>
            </span>
              </div>
            </div>


          </div>
        </div>

        <!--partition2-->
        <div :class="(sidebarShow)?'m2':'hide'" class="col s3 l2 side-bar hide-on-med-and-down "
             style="margin-top: 0;margin-bottom:0 ">
          <div class="row">
            <div class="col s12 center" style="font-size: large;margin-top: 1rem">Participants</div>
            <div class="col s12" v-for="p in interviewData.participants">{{p.username}}
              <i :id="p.accountId+'video'" @click="muteVideo(p.accountId)" class="material-icons right">videocam</i>
              <i :id="p.accountId+'audio'" @click="muteAudio(p.accountId)" class="material-icons right">mic</i>
            </div>
          </div>
        </div>
      </div>

    </div>
  </template>

  <script>


    export default {
      name: 'HelloWorld',
      components: {},
      async mounted() {
        M.AutoInit();
        var vm = this;
        //get a new peer
        var vm = this;
        var peer = new Peer({host: 'peerserver.herokuapp.com', secure: true});
        this.peer = peer;
        peer.on('open', function (id) {
          vm.peer = peer;
          console.log('Your peer id = ' + id);
          vm.peer_id = id;

        });
        this.f();
        this.sf().then(() => {
          var elem = document.getElementById(this.peer_id);
          elem.srcObject = vm.stream;
          vm.currentID = vm.peer_id;

        });


        peer.on('connection', function (conn) {
          console.log('connection established!');
          peer.on('data', function (data) {
            console.log(data);
          });
          this.conn = conn;


        });
        peer.on('call', function (call) {

          if (call.metadata.type == 'screen') {
            vm.answer_screen(call);
          } else if (call.metadata.type == 'video') {
            console.log(call);
            vm.answer_video(call);
          }

        });


      },
      data() {
        return {
          count: 1,
          peer: null,
          peer_id: null,
          conn: null,
          stream: null,
          sstream: null,
          screen_streams: {},
          video_streams: {},
          myId: '',
          isVideo: true,
          sidebarShow: true,
          currentID: 1,
          currentIndex: 0,
          classActive: {
            1: false,
            3: false,
            48: false,
            32: false
          },

          interviewData: {
            meta: {id: 1, title: 'basic program', timestamp: 192034},
            participants: [
              {
                accountId: 1,
                username: 'shailab',
                role: 'c',
                index: 0,
                userInfo: "Hello my name is shailab i am a software dev"
              },
              {
                accountId: 3,
                username: 'kamal',
                role: 'r',
                index: 1,
                userInfo: "Hello my name is kamal i am a software dev"
              },
              {
                accountId: 48,
                username: 'arjun',
                role: 'c',
                index: 2,
                userInfo: "Hello my name is arjun i am a software dev"
              },
              {
                accountId: 32,
                username: 'avirias',
                role: 'c',
                index: 3,
                userInfo: "Hello my name is avirias i am a software dev"
              },
            ],
            type: 'coding',
            reachingTime: '2:30',
            startTime: '3:00',
            endTime: '3:30',

          },
          activeParticipants: [],
          connections: [],
          mediaStream: {},
          call: [],
          receive: [],
          // isSideNavOpened:false,
          profilePhoto: "https://avatars1.githubusercontent.com/u/17480651?s=400&v=4",

        }
      },
      methods: {
        videoIconCLick: function (account_id, index) {
          this.currentID = account_id;
          this.currentIndex = index;
          var element = document.getElementById('global');
          if (this.screen_streams.hasOwnProperty(account_id)) {
            element.srcObject = this.screen_streams[account_id];
            console.log(element.srcObject);
          } else {
            element.srcObject = null;
          }
        },
        switchScreen: function () {
          var vm = this;
          vm.isVideo = !vm.isVideo;
          if (vm.isVideo) {
            var elem = document.getElementById('global');
            var smallElem = document.getElementById(vm.currentID);
            elem.srcObject = vm.video_streams[vm.currentID];
            smallElem.srcObject = vm.screen_streams[vm.currentID];
          } else {
            var elem = document.getElementById('global');
            var smallElem = document.getElementById(vm.currentID);
            elem.srcObject = vm.screen_streams[vm.currentID];
            smallElem.srcObject = vm.video_streams[vm.currentID];
          }

        },
        muteAudio: function (account_id) {
          var mic = document.getElementById(account_id + 'audio');
          (mic.innerHTML == "mic") ? mic.innerHTML = "mic_off" : mic.innerHTML = "mic";
          if (account_id == this.peer_id) {
            var mediaStream = this.stream;
            mediaStream.getAudioTracks()[0].enabled = !mediaStream.getAudioTracks()[0].enabled;
          } else {
            var mediaStream = this.video_streams[account_id];
            video_streams[account_id].getAudioTracks()[0].enabled = !mediaStream.getAudioTracks()[0].enabled;
          }


        },
        muteVideo: function (account_id) {
          var video = document.getElementById(account_id + 'video');
          (video.innerHTML == "videocam") ? video.innerHTML = "videocam_off" : video.innerHTML = "videocam";
          if (account_id == this.peer_id) {
            var mediaStream = this.stream;
            mediaStream.getVideoTracks()[0].enabled = !mediaStream.getVideoTracks()[0].enabled;
          } else {
            var mediaStream = this.video_streams[account_id];
            mediaStream.getVideoTracks()[0].enabled = !mediaStream.getVideoTracks()[0].enabled;

          }

        },
        requestFullScreen: function () {
          var videoEl = document.getElementById('global');
          videoEl.requestFullscreen();
        },

        f: async function () {

          this.stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
            return stream
          }).catch((e) => {
            return e
          });


        },
        sf: async function sf() {

          this.sstream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: true}, (sstream) => {
            return sstream
          }).catch((e) => {
            return e
          });


        },
        connect: function () {

          let peer = this.peer;
          var anotherid = document.getElementById('another-id').value;
          var conn = peer.connect(anotherid);

          conn.on('open', function () {

            console.log('connection established!!');
            conn.send('hi!');
          });
          // console.log(this.peer)
          this.conn = conn;
        },
        call_video: async function () {
          var call1;
          var vm = this;
          var peer = vm.peer;
          var options = {
            metadata: {'type': 'video'},
          };
          console.log('calling...');
          var anotherid = document.getElementById('another-id').value;
          call1 = peer.call(anotherid, vm.stream, options);
          call1.on('stream', function (remoteStream) {
            var video1 = document.getElementById(call1.peer);
            vm.$set(vm.video_streams, call1.peer, remoteStream);
            video1.srcObject = vm.video_streams[call1.peer];

          }, function (err) {
            console.log(err)
          });
        },
        call_screen: function () {
          var vm = this;
          var peer = this.peer;
          var options = {
            metadata: {'type': 'screen'},
          };
          console.log('calling...');
          var anotherid = document.getElementById('another-id').value;
          var call = peer.call(anotherid, vm.sstream, options);
          call.on('stream', function (remoteStream) {
            vm.$set(vm.screen_streams, call.peer, remoteStream);
            console.log("sender");
            if (Object.keys(vm.screen_streams).length == 1) {
              vm.currentID = call.peer;
              console.log(vm.currentID, call.peer + 'screen');
              var element = document.getElementById('global');
              console.log("sender: element: ", element);

              element.srcObject = remoteStream;
            }
            console.log(vm.screen_streams)
          }, function (err) {
            console.log(err)
          });
        },
        answer_video: async function (call) {
          var vm = this;
          call.answer(vm.stream);
          call.on('stream', function (remoteStream) {
            console.log('call answered');
            var video1 = document.getElementById(call.peer);
            video1.srcObject = remoteStream;
            vm.$set(vm.video_streams, call.peer, remoteStream);
            video1.srcObject = vm.video_streams[call.peer];
          })
        },
        answer_screen: async function (call) {
          var vm = this;
          console.log("here in answer screen function");
          call.answer(vm.sstream);
          call.on('stream', function (remoteStream) {

            vm.$set(vm.screen_streams, call.peer, remoteStream);
            console.log("Receiver");
            if (Object.keys(vm.screen_streams).length == 1) {
              var element = document.getElementById('global');
              console.log("receiver: element: ", element);
              element.srcObject = remoteStream;
            } else {

              console.log(this.screen_streams[call.peer])
            }

          })
        }


      },


    }
  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
    .main-body {
      height: 90vh;
    }

    .side-bar {
      min-height: 90vh;
      border: 1px solid grey;

    }

    .candidate-video {
      height: 70vh;
      min-width:100%;
      alignment: right;
      background: #f4f4f4;
      padding: 0;


    }

    .candidate-icons {
      height: 20vh;
      padding: 0;
      top: 0;
    }

    .container-fluid {
      margin-bottom: 0px;
    }

    .video-webcam {
      height: 70vh;
      width: 80%;
      padding-bottom: 1rem;

    }

    .video-icons {
      top: 0 !important;
      height: 20vh;


    }


    /*scrollbar for video icons*/

    div.scrollmenu {

      overflow: auto;
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

    .material-icons {
      vertical-align: middle;
      width: fit-content;

    }

    .nav {
      height: 10vh;
    }

  </style>



