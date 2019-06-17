<template>
<div>
  <div class="menu row" >

    <div class="input-field col s4">
      <select v-model="lang">
        <option value="">{{lang}}</option>
        <option v-for="lg in options.languages">{{lg}}</option>
      </select>
      <label>Languages</label>
    </div>

    <div class="input-field col s4">
      <select v-model="currentTheme">
        <option v-for="tm in options.themes">{{tm}}</option>
      </select>
      <label>Languages</label>
    </div>
  {{currentTheme}}

  </div>

  <div class="row candidate-video">


      <Monaco
        :language="lang"
        :theme="ptheme"
        :code="code"
        :options="options"
        :changeThrottle="500"
        @mounted="onMounted"
        @codeChange="onCodeChange">
      </Monaco>
    </div>

  </div>

</template>

<script>

  import Monaco from "monaco-editor-forvue/src/Monaco";
  export default {

    name: "codeShare",
    components: {Monaco},
    data() {
      return {
          lang:'javacript',
          currentTheme:"vs-dark",
        currIndex:0,
          code: "//Type away! \n",

          options:{
            features:['suggest'],
            themes:['vs-dark','vs','hc-black'],
            languages:['apex', 'azcli', 'bat', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'dockerfile', 'fsharp', 'go', 'handlebars', 'html', 'ini', 'java', 'javascript', 'json', 'less', 'lua', 'markdown', 'msdax', 'mysql', 'objective', 'perl', 'pgsql', 'php', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'ruby', 'rust', 'sb', 'scheme', 'scss', 'shell', 'solidity', 'sql', 'st', 'swift', 'typescript', 'vb', 'xml', 'yaml'],
          }
      }
    },
    methods: {
      onMounted(editor) {
        this.editor = editor;
      },
      onCodeChange(editor) {
        console.log(this.editor.getValue());
      },
    },
    props:{ptheme:{type:String},},
    watch: {
      currentTheme: function(val) {
        //do something when the data changes.
        if (val) {
          this.$emit('themeChange',val);
        }
      }
    },
    mounted(){
      M.AutoInit();

    }
  }
</script>

<style scoped>
  .editor {
    width: 600px;
    height: 800px;
  }
  .menu{
    padding-left:5rem;
  }

   .candidate-video {
     height: 60vh;
     width: 100%;
     padding: 0;
     margin: 0 !important;
   }
  .btn{
    border: 1px solid grey;
  }
  .row{
    padding: 0;
    margin: 0;
  }

</style>
