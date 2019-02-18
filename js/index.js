window.onbeforeunload = function() { 
  return "页面卸载时询问。";
}
marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});
var box = new Vue({
  el: "#box",
  data: {
    mouseSelection: {
      start: 999,
      end: 999
    },
    fileName: '',
    tip_flag: false,
    msg_mark: `# 你好！——llh`,
    tip_msg: {},
    tip_title:'终极彩蛋：\n你好，我是llh，欢迎使用这个小工具.\n除了表明上的功能，隐藏功能我介绍一下：\n1、在输入框Ctrl+S复制到剪切板\n2、Tab按键查看tip(应该以及发现了~嘿嘿)。'
  },
  computed: {
    mas_marked() {
      return marked(this.msg_mark);
    },
  },
  methods: {
    inputTab(e){
      e.preventDefault();
      // 屏蔽Tab按键
      this.tip_flag = !this.tip_flag;
    },
    copyToClipboard(e){
      if(e.ctrlKey && e.key=="s"){
        e.preventDefault();
        //屏蔽浏览器Ctrl+S的保存
        const temp = {
          end: e.target.selectionEnd,
          start: e.target.selectionStart
        }
        this.setCursorPosition(0,this.msg_mark.length);
        setTimeout(()=>{
          document.execCommand('Copy','false',null);
          this.setCursorPosition(temp.start,temp.end);
        },0);
      }
    },
    handleTip() {
      this.tip_flag = !this.tip_flag;
    },
    handleBlur(e) {
      this.mouseSelection = {
        end: e.target.selectionEnd,
        start: e.target.selectionStart
      }
    },
    handleTipBtn(msg, index, $event) {
      $event.stopPropagation();
      const blurEnd = this.mouseSelection.end;
      const content = this.tip_msg[msg][index].example;
      const range = this.tip_msg[msg][index].selectionRange ? this.tip_msg[msg][index].selectionRange : {start: 1, end: content.length + 1};
      const start = blurEnd + range.start - 1;
      const end = blurEnd + range.end - 1;
      this.msg_mark = this.stringSplice(this.msg_mark, blurEnd, 0, content);
      this.$refs['textarea'].focus();
      this.setCursorPosition(start,end);
    },
    stringSplice(str, index, howMany, newValue) {
      return str.slice(0, index) + newValue + str.slice(index + Math.abs(howMany));
    },
    handleSave() {
      let fname = this.fileName.replace(/^\s*$/,"");
      if (fname) {
        const blob = new Blob([this.msg_mark], {
          type: "text/plain;charset=utf-8"
        });
        fname = fname.replace(/\.md$/, "");
        saveAs(blob, fname + ".md");
        this.fileName = '';
      }
    },
    setCursorPosition(start,end){
      setTimeout(()=>{
        this.$refs['textarea'].setSelectionRange(start, end);
      },0);
    },
    ajax(method, url, data) {
      const request = new XMLHttpRequest();
      return new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            if (request.status === 200) {
              resolve(request.responseText);
            } else {
              reject(request.status);
            }
          }
        };
        request.open(method, url);
        request.send(data);
      });
    }
  },
  created() {
    this.ajax('GET', "./markdown-grammar.json").then(res => {
      this.tip_msg = JSON.parse(res);
    }).catch(res => {
      this.tip_msg = {
        block: [{
          name: '数据加载异常',
          example: '请联系liulihao97@gmail.com修复。',
          title: '数据加载异常'
        }],
        inline: [{
          name: '数据加载异常',
          example: '请联系liulihao97@gmail.com修复。',
          title: '数据加载异常'
        }]
      }
    });
  }
});