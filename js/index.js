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
    tip_msg: {}
  },
  computed: {
    mas_marked() {
      return marked(this.msg_mark);
    },
  },
  methods: {
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
      setTimeout(() => {
        this.$refs['textarea'].setSelectionRange(start, end);
      }, 0);
    },
    stringSplice(str, index, howMany, newValue) {
      return str.slice(0, index) + newValue + str.slice(index + Math.abs(howMany));
    },
    handleSave() {
      let fname = this.fileName;
      if (fname) {
        const blob = new Blob([this.msg_mark], {
          type: "text/plain;charset=utf-8"
        });
        fname = fname.replace(/\.md$/, "");
        saveAs(blob, fname + ".md");
        this.fileName = '';
      }
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
          title: ''
        }],
        inline: [{
          name: '数据加载异常',
          example: '请联系liulihao97@gmail.com修复。',
          title: ''
        }]
      }
    });
  }
});