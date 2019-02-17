marked.setOptions({
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    }
  });
  var box = new Vue({
    el: "#box",
    data: {
      mouseSelection:{
        start:999,
        end:999
      },
      fileName:'',
      tip_flag:false,
      msg_mark:`# 你好！——llh`,
      tip_msg:{
//         block:[
//           {
//             name:'一级标题',
//             example:'# 一级标题',
//             selectionRange:{start:3,end:7},
//             titile:'几级标题就加几个#号'
//           },
//           {
//             name:'引用内容',
//             example:'> 一级标题',
//             selectionRange:{start:3,end:7},
//             titile:'多级引用就多加几个>号'
//           },
//           {
//             name:'分割线',
//             example:'---',
//             titile:'使用这些效果一致：---/***'
//           },
//           {
//             name:'无序列表',
//             example:'- 无序列表',
//             selectionRange:{start:3,end:7},
//             title:'使用这些效果一致：-/+/*。\n子列表嵌套前面加三个空格'
//           },
//           {
//             name:'有序列表',
//             example:'1. 有序列表',
//             selectionRange:{start:4,end:8},
//             title:'数字 + . + 空格。\n子列表嵌套前面加三个空格'
//           },
//           {
//             name:'表格',
//             example:
// `表头|表头|表头
// ---|:--:|---:
// 内容|内容|内容
// 内容|内容|内容`,
//             title:
// `第二行分割表头和内容。
// - 有一个就行，为了对齐，多加了几个
// 文字默认居左
// -两边加：表示文字居中
// -右边加：表示文字居右
// 注：原生的语法两边都要用 | 包起来。此处省略`
//           },
//           {
//             name:'代码块',
//             example:
// `\`\`\`
//   function fn(){
//     console.log(666);
//   }
// \`\`\``,
//             selectionRange:{start:5,end:20},
//             title:'代码块'
//           }
//         ],
//         inline:[
//           {
//             name:'图片',
//             example:'![图片alt](图片地址 "图片title")',
//             selectionRange:{start:3,end:8},
//             title:'图片title(可选)为鼠标悬停显示的文字。'
//           },
//           {
//             name:'超链接',
//             example:'[超链接名](超链接地址 "超链接title")',
//             selectionRange:{start:3,end:8},
//             title:'超链接title(可选)为鼠标悬停显示的文字。'
//           },
//           {
//             name:'单行代码',
//             example:'\`console.log(666)\`',
//             selectionRange:{start:2,end:18},
//             title:'标记单行代码或关键词。'
//           },          
//           {
//             name:'斜体',
//             example:'*斜体*',
//             selectionRange:{start:2,end:4},
//             title:'斜体。'
//           },
//           {
//             name:'加粗',
//             example:'**加粗**',
//             selectionRange:{start:3,end:5},
//             title:'加粗。'
//           },
//           {
//             name:'斜体加粗',
//             example:'***斜体加粗***',
//             selectionRange:{start:4,end:8},
//             title:'斜体加粗。'
//           },
//           {
//             name:'删除线',
//             example:'~~删除线~~',
//             selectionRange:{start:3,end:6},
//             title:'删除线。'
//           }
//         ]
      }
    },
    computed:{
      mas_marked(){
        return marked(this.msg_mark);
      },
    },
    methods:{
      handleTip(){
        this.tip_flag = !this.tip_flag;
      },
      handleBlur(e){
        this.mouseSelection = {
          end: e.target.selectionEnd,
          start: e.target.selectionStart
        }
      },
      handleTipBtn(msg,index,$event){
        $event.stopPropagation();
        const blurEnd = this.mouseSelection.end;
        const content = this.tip_msg[msg][index].example;
        const range = this.tip_msg[msg][index].selectionRange ?
          this.tip_msg[msg][index].selectionRange :
          {start :1, end: content.length+1}
        ;
        const start = blurEnd + range.start-1;
        const end = blurEnd + range.end-1;
        this.msg_mark = this.stringSplice(this.msg_mark,blurEnd,0,content);
        this.$refs['textarea'].focus();
        setTimeout(()=>{
          this.$refs['textarea'].setSelectionRange(start,end);
        },0);
      },
      stringSplice(str,index,howMany,newValue){
        return str.slice(0, index) + newValue + str.slice(index + Math.abs(howMany));
      },
      handleSave(){
        const fname = this.fileName;
        if(fname){
          const blob = new Blob([this.msg_mark], {type: "text/plain;charset=utf-8"});
          fname = fname.replace(/\.md$/,"");
          saveAs(blob, fname + ".md");
          this.fileName = '';
        }
      },
      ajax(method, url, data){
        var request = new XMLHttpRequest();
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
    created(){
      this.ajax('GET',"./markdown-grammar.json").then(res=>{
        this.tip_msg = res;
      }).catch(res=>{
        this.tip_msg = {
          block:[
            {name:'数据加载异常',example:'请联系liulihao97@gmail.com修复。',title:''}
          ],
          inline:[
            {name:'数据加载异常',example:'请联系liulihao97@gmail.com修复。',title:''}
          ]
        }
      });
    }
  });