<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-8" id="affdex_elements" style="width:680px;height:480px;"></div>
      <div class="col-md-4">
        <div style="height:25em;">
          <strong>EMOTION TRACKING RESULTS</strong>
          <div id="results" style="word-wrap:break-word;"></div>
        </div>
        <div>
          <strong>DETECTOR vm.log MSGS</strong>
        </div>
        <div id="vm.logs"></div>
      </div>
    </div>
    <div>
      <button id="start" @click="onStart()">Start</button>
      <button id="stop" @click="onStop()">Stop</button>
      <button id="reset" @click="onReset()">Reset</button>
      <h3>Affectiva JS SDK CameraDetector to track different emotions.</h3>
      <p>
        <strong>Instructions</strong>
        Press the start button to start the detector.
        <br/> When a face is detected, the probabilities of the different emotions are written to the DOM.
        <br/> Press the stop button to end the detector.
      </p>
    </div>
  </div>

</template>
<script>

export default {
  name:'face',
  data(){
    return {
        detector:null,
    }
  },
  methods:{

log(node_name, msg) {
  $(node_name).append("<span>" + msg + "</span><br />")
},


//function executes when Start button is pushed.
  async onStart() {
    if (this.detector && !this.detector.isRunning) {
      $("#vm.logs").html("");
      await this.detector.start();
    }
  }
},

//function executes when the Stop button is pushed.
onStop() {
  vm.log('#vm.logs', "Clicked the stop button");
  if (this.detector && this.detector.isRunning) {
    this.detector.removeEventListener();
    this.detector.stop();
  }
},

//function executes when the Reset button is pushed.
onReset() {
  vm.log('#vm.logs', "Clicked the reset button");
  if (this.detector && this.detector.isRunning) {
    this.detector.reset();

    $('#results').html("");
  }
}
,
   mounted(){

    let vm = this;
    // Here we are adding those nodes a predefined div.
    var divRoot = $("#affdex_elements")[0];
    var width = 640;
    var height = 480;
    var faceMode =  affdex.FaceDetectorMode.LARGE_FACES;
    //Construct a CameraDetector and specify the image width / height and face detector mode.
    vm.detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

    console.log(vm.detector);
     console.log(vm.detector.start());
    //Enable detection of all Expressions, Emotions and Emojis classifiers.
     vm.detector.detectAllEmotions();
     vm.detector.detectAllExpressions();
     vm.detector.detectAllEmojis();
     vm.detector.detectAllAppearance();

    //Add a callback to notify when the detector is initialized and ready for runing.
    vm.detector.addEventListener("onInitializeSuccess", function() {
      vm.log('#vm.logs', "The detector reports initialized");
      //Display canvas instead of video feed because we want to draw the feature points on it
      $("#face_video_canvas").css("display", "block");
      $("#face_video").css("display", "none");
    });


    //Add a callback to notify when camera access is allowed
    vm.detector.addEventListener("onWebcamConnectSuccess", function() {
      vm.log('#vm.logs', "Webcam access allowed");
    });

    //Add a callback to notify when camera access is denied
    vm.detector.addEventListener("onWebcamConnectFailure", function() {
      vm.log('#vm.logs', "webcam denied");
      console.log("Webcam access denied");
    });

    //Add a callback to notify when detector is stopped
    vm.detector.addEventListener("onStopSuccess", function() {
      vm.log('#vm.logs', "The detector reports stopped");
      $("#results").html("");
    });

    //Add a callback to receive the results from processing an image.
    //The faces object contains the list of the faces detected in an image.
    //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
    vm.detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
      $('#results').html("");
      vm.log('#results', "Timestamp: " + timestamp.toFixed(2));
      vm.log('#results', "Number of faces found: " + faces.length);
      if (faces.length > 0) {
        vm.log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
        vm.log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
          return val.toFixed ? Number(val.toFixed(0)) : val;
        }));
        vm.log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
          return val.toFixed ? Number(val.toFixed(0)) : val;
        }));
        vm.log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
        if($('#face_video_canvas')[0] != null)
          drawFeaturePoints(image, faces[0].featurePoints);
      }
    });

    //Draw the detected facial feature points on the image
    function drawFeaturePoints(img, featurePoints) {
      var contxt = $('#face_video_canvas')[0].getContext('2d');

      var hRatio = contxt.canvas.width / img.width;
      var vRatio = contxt.canvas.height / img.height;
      var ratio = Math.min(hRatio, vRatio);

      contxt.strokeStyle = "#FFFFFF";
      for (var id in featurePoints) {
        contxt.beginPath();
        contxt.arc(featurePoints[id].x,
          featurePoints[id].y, 2, 0, 2 * Math.PI);
        contxt.stroke();

      }
    }

      console.log(vm.detector.worker);
  },
}
</script>
<style scoped>

</style>
