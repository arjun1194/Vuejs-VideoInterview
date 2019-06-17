<template>
  <div>
    <!-- main row-->
    <!--main row is divided into 2 partitions -->
    <div class="row container-fluid">
      <nav class="black">
        <div class="row">
          <div class="col l1"><i class="material-icons left">menu</i>
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
          <!--Resume and other details-->
          <div class="col l3 candidate-details hide-on-med-and-down">
            <div class="row" style="margin-bottom: 0">
              <div class="center"><img :src=profilePhoto
                                       style="height: 40%;width: 40%;border-radius: 999px;margin-top: 3rem"></div>
              <div class="center" style="font-size: 20px">{{interviewData.participants[currentIndex].username}}</div>
              <div class="center">{{interviewData.participants[currentIndex].userInfo}}</div>
              <div style="margin-top: 2rem">Your peer id={{peer_id}}</div>
              <div>Qualifications:</div>
              <div class="col s12"><input class="input-field" id="another-id"></div>
              <div class="col s12">
                <a @click="connect" class="btn white-text">Connect</a>
                <a @click="call_video" class="btn white-text">Video call</a>
                <a @click="call_screen" class="btn white-text">Screen call</a>
              </div>
              <div class="col s12" v-for="(i,index) in interviewData.participants">
                <input v-model="interviewData.participants[index].accountId">
              </div>
            </div>
          </div>
          <!--Video main-->
          <div class="col l9 candidate-details hide-on-med-and-down">
            <div class="row">
              <div class="candidate-video">
                <main-video :currentId ="currentID" :peerId="peer_id" @toggleArea="toggleArea" :interview-data="interviewData"></main-video>
                <!--<code-share></code-share>-->
              </div>
              <div class="col s12" style="width: 100%">
                <video-icons @changeVideo="changeVideo" :interview-data="interviewData"></video-icons>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--Partition2-->
        <!--sidebar-->
      <div class="col s3 l2 side-bar hide-on-med-and-down " style="margin-top: 0;margin-bottom:0 ">
        <div class="row">
          <div class="col s12 center" style="font-size: large;margin-top: 1rem">Participants</div>
          <div class="col s12" v-for="p in interviewData.participants">{{p.username}}
            <i :id="p.accountId+'video'" @click="muteVideo(p.accountId)" class="material-icons right">videocam</i>
            <i :id="p.accountId+'audio'" @click="muteAudio(p.accountId)" class="material-icons right">mic</i>
          </div>
        </div>
        <div class="row" style="width: 100%; height: available;margin: 0 !important;padding:0 !important;">
          <div class="col s12 "><input class="input-field col s8" id="chat"><a @click="sendchat" class="btn-small col s4 " style="vertical-align: middle">send</a></div>
          <div class="row ex1" id="chatbox"></div>
        </div>

      </div>

    </div>



  </div>
</template>

<script>


  import MainVideo from "@/components/mainVideo";
  import VideoIcons from "@/components/videoIcons";
  import CodeShare from "@/components/codeShare";

  export default {
    name: 'main',
    components: {CodeShare, VideoIcons, MainVideo},
    async mounted() {
      M.AutoInit();
      var vm = this;
      var peer = new Peer({host: 'peerserver.herokuapp.com', secure: true});
      //listener for peer id
      peer.on('open', function (id) {
        vm.peer = peer;
        vm.peer_id = id;
        vm.f().then(()=>{
          var elem = document.getElementById(vm.peer_id);
          elem.srcObject = vm.stream;
          vm.currentID = vm.peer_id;
        });
      });
      this.sf();


      //listener for connection and data
      peer.on('connection', function (conn) {
        console.log('connection established!');
        this.conn = conn;
        conn.on('data', function (data) {
          vm.recievechat();
          conn.on('close', function() {alert('closed')});
        })
      });
      //Listner for when user gets a call
      peer.on('call', function (call) {
        if (call.metadata.type == 'screen') {
          vm.answer_screen(call);
        } else if (call.metadata.type == 'video') {
          console.log(call);
          vm.answer_video(call);
        }

      });
      peer.on('error', function(err) {console.log(err)});
    },
    data() {
      return {
        count: 1,
        peer: null,
        peer_id: null,
        conn: null,
        stream: null, // self Stream
        sstream: null,
        screen_streams: {},
        video_streams: {},
        isVideo: true,
        myId: '',
        sidebarShow: true,
        currentID: 1,
        currentIndex: 0,
        currentTheme: 'vs',
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
        mediaStream: {}, // stream of other members
        call: [],
        receive: [],
        isSideNavOpened: false,
        profilePhoto: "https://avatars1.githubusercontent.com/u/17480651?s=400&v=4",

      }
    },
    methods: {
      toggleArea: function(type){
      var vm =this;
        var elem = document.getElementById('global');
        var smallElem = document.getElementById(vm.currentID);


        if (type=='screen_streams'){
          smallElem.srcObject = vm.screen_streams[vm.currentID];
          elem.srcObject = vm.video_streams[vm.currentID]
        }
        else{
          smallElem.srcObject = vm.video_streams[vm.currentID];

          elem.srcObject = vm.screen_streams[vm.currentID]

        }

      },
      changeVideo: function(account_id){
        var vm=this;
        this.currentID = account_id;
        var element = document.getElementById('global');
        console.log("screen_streams: ",vm.video_streams);
        if (account_id === vm.peer_id){           // media stream of self is stored differently in this.stream
          element.srcObject = vm.stream;
        }
        else {                                   // media streams of others are stored in this.screen_streams
          if(vm.video_streams!=null){
            if(vm.video_streams.hasOwnProperty(account_id)) {
              element.srcObject = vm.video_streams[account_id];
              console.log(element.srcObject);
            }
            else{
              element.srcObject = null;
            }
          }
        }
      },
      sendchat: function (){
        var objDiv = document.getElementById("chatbox");
        objDiv.scrollTop = objDiv.scrollHeight * 10;
        var input_text = document.getElementById('chat').value;
        var vm = this;
        var c = vm.peer.connections;
        for (var i in c) {
          c[i][0].send(input_text);
        }
        var chatbox = document.getElementById('chatbox');
        var recieved = document.createElement("div");
        recieved.innerHTML = "<span class='blue-text'>You: </span>" + "<span style='font-size: 12px'>" + input_text + "</span>";
        recieved.classList.add('col');
        recieved.classList.add('s12');
        recieved.classList.add('left-align');
        chatbox.appendChild(recieved);
        objDiv.scrollTop = objDiv.scrollHeight * 10;
      },
      recievechat: function(){
        var vm = this;
        var objDiv = document.getElementById("chatbox");
        objDiv.scrollTop = objDiv.scrollHeight * 10;
        var chatbox = document.getElementById('chatbox');
        var recieved = document.createElement("div");
        recieved.innerText = "<span class='red-text'>" + vm.getPeerName(vm.conn.peer) + ": </span>" + "<span style='font-size: 12px'>" + data + "</span>";
        recieved.classList.add('col');
        recieved.classList.add('s12');
        recieved.classList.add('left-align');
        chatbox.appendChild(recieved);
        objDiv.scrollTop = objDiv.scrollHeight * 10;
      },
      getPeerName(peerid){
        var vm = this;
        var p = vm.interviewData.participants;
        for (let i in p) {
          if (p[i].accountId == peerid) {
            return p[i].username;
          }
        }
      },
      switchScreen: function (){
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
      muteAudio: function (account_id){
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
      muteVideo: function (account_id){
        var video = document.getElementById(account_id + 'video');
        (video.innerHTML == "videocam") ? video.innerHTML = "videocam_off" : video.innerHTML = "videocam";
        // checking if accountId to be mute is self..
        if (account_id == this.peer_id) {
          var mediaStream = this.stream;
          mediaStream.getVideoTracks()[0].enabled = !mediaStream.getVideoTracks()[0].enabled;
        } else {
          var mediaStream = this.video_streams[account_id];
          mediaStream.getVideoTracks()[0].enabled = !mediaStream.getVideoTracks()[0].enabled;

        }

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
        var vm = this;
        let peer = this.peer;
        var anotherid = document.getElementById('another-id').value;
        var conn = peer.connect(anotherid);

        conn.on('open', function () {
          console.log('connection established!!');
          console.log(conn);
          conn.on('data', function (data) {
            var objDiv = document.getElementById("chatbox");
            objDiv.scrollTop = objDiv.scrollHeight * 10;
            console.log(data);
            var chatbox = document.getElementById('chatbox');
            var recieved = document.createElement("div");
            recieved.innerHTML = "<span class='red-text'>" + vm.getPeerName(conn.peer) + ": </span>" + "<span style='font-size: 12px'>" + data + "</span>";
            recieved.classList.add('col');
            recieved.classList.add('s12');
            recieved.classList.add('left-align');
            chatbox.appendChild(recieved);
            objDiv.scrollTop = objDiv.scrollHeight * 10;
          })
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
  }  .side-bar {
    min-height: 90vh;
    border: 1px solid grey;
  } .candidate-details {
    height: 90vh;
    border: 1px solid grey;
  }  .container-fluid {
    margin-bottom: 0;
  }

  /*chat scrollbar*/
  .ex1 {
    width: 100%;
    height: 300px;
    overflow-y: scroll;
  }.ex1::-webkit-scrollbar-track {
       background-color: #F5F5F5;
  }  .ex1::-webkit-scrollbar {
    width: 10px;
    background-color: #F5F5F5;
  }  .ex1::-webkit-scrollbar-thumb {
    background-color: #a9a9a9;
  }


  .material-icons {
    vertical-align: middle;
    width: fit-content;
  }.candidate-video {
    height: 70vh;
    width: 100%;
    padding: 0;
  }

</style>
