(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2a64550b","chunk-2d20f394"],{4812:function(e,t,a){},"514e":function(e,t,a){"use strict";var o=a("4812"),l=a.n(o);l.a},b35b:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("dialog-modal",{ref:"dialog",attrs:{type:"title",size:"mini",maxScrollbar:"",title:"开关阀详情"}},[a("el-form",{ref:"form",staticClass:"item-space pad-a-xs",attrs:{rules:e.formRules,model:e.itemModel,"label-width":"90px"}},[a("el-form-item",{attrs:{label:"审核结果：",prop:"status"}},[a("el-select",{model:{value:e.itemModel.status,callback:function(t){e.$set(e.itemModel,"status",t)},expression:"itemModel.status"}},[a("el-option",{attrs:{value:2,label:"同意"}}),a("el-option",{attrs:{value:3,label:"退回"}})],1)],1),a("el-form-item",{attrs:{label:"审核意见：",prop:"dealRemark",required:[3,"3"].includes(this.itemModel.status)}},[a("el-input",{attrs:{type:"textarea",rows:4},model:{value:e.itemModel.dealRemark,callback:function(t){e.$set(e.itemModel,"dealRemark",t)},expression:"itemModel.dealRemark"}})],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"success",icon:"fas fa-cloud-upload-alt",loading:e.saveLoading},on:{click:function(t){return e.onSaveCheck(e.saveCallback)}}},[e._v("确 认")]),a("el-button",{attrs:{icon:"fas fa-times"},on:{click:function(t){return e.$refs.dialog.closeDialog()}}},[e._v("关 闭")])],1)],1)},l=[],i=a("75fc"),n=(a("6762"),a("2fdb"),a("73cb")),s={mixins:[n["d"]],data:function(){var e=this,t=function(t,a,o){[3,"3"].includes(e.itemModel.status)?""===a?o("请输入审核意见"):o():(o(),e.$nextTick((function(){e.$refs.form.clearValidate("dealRemark")})))};return{url:"tpeci/valveOpenApply/changeStatus",itemModel:{ids:[],status:2,dealRemark:""},formRules:{status:[{required:!0,message:"请选择审核结果",trigger:["change","blur"]}],dealRemark:[{validator:t,trigger:["change","blur"]}]}}},methods:{openDialog:function(e){this.itemModel.ids=Object(i["a"])(e),this.$refs.dialog.openDialog()},saveCallback:function(){this.$message("如需发送开阀命令，请到远程控制页面"),this.itemModel={ids:[],status:2,dealRemark:""},this.$refs.dialog.closeDialog(),this.$emit("query")}}},r=s,c=a("2877"),u=Object(c["a"])(r,o,l,!1,null,"6e9a2510",null);t["default"]=u.exports},c2cd:function(e,t,a){"use strict";var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("dialog-modal",{ref:"dialog",attrs:{size:"small",scrollbar:"",view:!0,title:"上传附件"},on:{close:e.closeDialog}},[e.isShow?a("div",{staticClass:"mar-b-xs"},[a("el-button",{attrs:{type:"primary",icon:"fas fa-cloud-upload-alt"},on:{click:e.onClickUpload}},[e._v("上 传")]),a("el-button",{attrs:{type:"danger",icon:"fas fa-trash-alt",disabled:!e.selectedIds.length},on:{click:e.onClickDele}},[e._v("删 除\n    ")])],1):e._e(),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{height:e.isShow?"calc(100% - 64px)":"calc(100% - 31px)",data:e.itemList,border:"","highlight-current-row":""},on:{"selection-change":e.onSaveSelected}},[e.isShow?a("el-table-column",{attrs:{align:"center",type:"selection",width:"37"}}):e._e(),a("el-table-column",{attrs:{align:"center",label:"No.",type:"index",width:"50",index:e.index}}),a("el-table-column",{attrs:{align:"center",label:"操作",width:"67"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"primary",icon:"fas fa-pencil-alt"},on:{click:function(a){return e.onClickDown(t.row)}}},[e._v("下载")])]}}])}),a("el-table-column",{attrs:{prop:"docName","min-width":"160","show-overflow-tooltip":"",label:"名称"}}),a("el-table-column",{attrs:{prop:"uploadTime","min-width":"160","show-overflow-tooltip":"",label:"创建时间"}}),a("el-table-column",{attrs:{prop:"authorName","min-width":"120","show-overflow-tooltip":"",label:"作者"}})],1),a("paging-query",{attrs:{pager:e.pager},on:{query:e.getItemList}}),a("upload",{ref:"upload",attrs:{id:e.queryForm.objectId},on:{query:e.getItemList}})],1)},l=[],i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("dialog-modal",{ref:"dialog",attrs:{size:"mini",title:"上传附件",appendToBody:!0},on:{close:e.onCloseDialog}},[a("el-upload",{ref:"addFile",staticClass:"mar-t-xs mar-b-xs",attrs:{multiple:"",action:"","file-list":e.tempList,"auto-upload":!1,"on-change":e.onFileChange,"on-remove":e.handleRemove}},[a("el-button",{attrs:{size:"small"}},[e._v("选择文件")]),a("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[e._v("只能上传不超过 10MB 大小的文件, 且每次上传不超过 100MB 大小 ")])],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{type:"primary",icon:"fas fa-cloud-upload-alt"},on:{click:e.onClickUpload}},[e._v("上 传\n    ")]),a("el-button",{attrs:{icon:"fas fa-times"},on:{click:function(t){return e.$refs.dialog.closeDialog()}}},[e._v("关 闭")])],1)],1)},n=[],s=(a("5df3"),a("7f7f"),a("ac6a"),{props:{id:{type:String,required:!0}},data:function(){return{loading:!1,tempList:[]}},computed:{filesSize:function(){return this.tempList.map((function(e){return e.size/1024/1024}))},isFileSize:function(){return this.filesSize.every((function(e){return e<10}))},isFilesSize:function(){return this.filesSize.reduce((function(e,t){return e+t}),0)<100}},watch:{},methods:{openDialog:function(){this.$refs.dialog.openDialog()},handleRemove:function(e,t){this.tempList=t},onFileChange:function(e,t){this.tempList=t},beforeUpload:function(){var e=this,t=[];this.tempList.forEach((function(a){var o={param:{},config:{}};o.param=new FormData,o.param.append("file",a.raw,a.name),o.config={params:{objectId:e.id}},t.push(e.onCreateItem(o,a.name))})),this.loading=!0,Promise.all(t).then((function(){e.$message.success("上传成功"),e.$emit("query"),e.$refs.dialog.closeDialog()})).catch((function(t){e.$message.wraning({message:"文件".concat(t.join(","),"上传失败"),showClose:!0,duration:3e3})})).finally((function(){e.loading=!1}))},onCreateItem:function(e,t){var a=this;return new Promise((function(o,l){a.$http.post("res/document/upload",e.param,e.config).then((function(e){e.data.success?o():l(t)}),(function(){l(t)}))}))},onClickUpload:function(){this.tempList.length?this.isFileSize?this.isFilesSize?this.beforeUpload():this.$message.info("上传文件总大小不能超过100MB"):this.$message.info("单个文件大小不能超过10MB"):this.$message.info("请选择需要上传的附件")},onCloseDialog:function(){this.tempList=[]}}}),r=s,c=a("2877"),u=Object(c["a"])(r,i,n,!1,null,"a90fa5d8",null),d=u.exports,m=a("73cb"),p={mixins:[m["c"]],components:{Upload:d},props:{isShow:{type:Boolean}},data:function(){return{url:"res/document",isAuto:!1,loading:!1,itemList:[],queryForm:{objectId:"",sort:"uploadTime-"}}},computed:{},created:function(){},methods:{openDialog:function(e){this.queryForm.objectId=e.id||"",this.getItemList(),this.$refs.dialog.openDialog()},onSaveSelected:function(e){this.selectedIds=e.map((function(e){return e.id}))},onClickUpload:function(){this.$refs.upload.openDialog()},closeDialog:function(){this.queryList={objectId:"",sort:"uploadTime-"},this.itemList=[],this.loading=!1},onClickDele:function(){var e=this;0!==this.selectedIds.length?this.$confirm("是否删除选中的数据？","请确定",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){return e.$http.delete("res/document",{data:e.selectedIds})})).then((function(t){t.data.success&&e.getItemList(),e.$message({showClose:!0,message:t.data.success?"删除成功":t.data.msg,type:t.data.success?"success":"error",duration:3e3})})):this.$message("请选择要删除的数据")},onClickDown:function(e){var t=this;this.$http.get("res/document/download?id=".concat(e.id),{responseType:"blob"}).then((function(a){var o="application/json;charset=UTF-8"===a.headers["content-type"];if(o){var l=new FileReader;l.onload=function(e){return t.$message.warning(JSON.parse(e.target.result).msg)},l.readAsText(a.data)}else{var i=e.docName,n=new Blob([a.data],{type:"application/x-xls"});if(window.navigator.msSaveOrOpenBlob)navigator.msSaveBlob(n,i);else{var s=document.createElement("a");s.href=window.URL.createObjectURL(n),s.download=i,s.click(),window.URL.revokeObjectURL(s.href)}}}),(function(e){t.$hp.resp(e)})).finally((function(){}))}}},f=p,h=(a("514e"),Object(c["a"])(f,o,l,!1,null,"df2918d4",null));t["a"]=h.exports},e80a:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-card",[a("template",{slot:"header"},[a("el-form",{attrs:{model:e.queryForm,inline:""}},[a("el-form-item",{attrs:{label:"关键字："}},[a("el-input",{staticStyle:{width:"180px"},attrs:{placeholder:"企业名称、站点名称",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.onQueryList()}},model:{value:e.queryForm.key,callback:function(t){e.$set(e.queryForm,"key",t)},expression:"queryForm.key"}})],1),a("el-form-item",{attrs:{label:"申报时间："}},[a("el-date-picker",{staticStyle:{width:"135px"},attrs:{type:"date",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd",clearable:!1,editable:!1},model:{value:e.queryForm.fromDate,callback:function(t){e.$set(e.queryForm,"fromDate",t)},expression:"queryForm.fromDate"}}),e._v(" ~\n        "),a("el-date-picker",{staticStyle:{width:"135px"},attrs:{type:"date",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd",clearable:!1,editable:!1},model:{value:e.queryForm.toDate,callback:function(t){e.$set(e.queryForm,"toDate",t)},expression:"queryForm.toDate"}})],1),a("el-form-item",{attrs:{label:"申报状态："}},[a("el-select",{staticStyle:{width:"90px"},model:{value:e.queryForm.status,callback:function(t){e.$set(e.queryForm,"status",t)},expression:"queryForm.status"}},[a("el-option",{attrs:{value:"",label:"所有"}}),e._l(e.$enum.get("VALVE_CHECK_STATUS"),(function(e){return a("el-option",{directives:[{name:"show",rawName:"v-show",value:[1,2].includes(e.value),expression:"[1, 2].includes(item.value)"}],key:e.value,attrs:{value:e.value,label:e.label}})}))],2)],1),a("el-form-item",[a("el-button",{attrs:{type:"primary",icon:"fas fa-search"},on:{click:e.onQueryList}},[e._v("查 询")])],1)],1)],1),a("div",{staticClass:"mar-l-sm mar-y-xs"},[a("el-button",{attrs:{type:"warning",icon:"el-icon-document-copy",disabled:!e.selectedIds.length},on:{click:function(t){return e.onClickEdit(e.selectedIds)}}},[e._v("批量审核\n    ")])],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{border:"","highlight-current-row":"",height:"calc(100% - 72px)",data:e.itemList,"row-class-name":e.rowClassName},on:{"selection-change":e.onChangeSelected}},[a("el-table-column",{attrs:{align:"center",type:"selection",width:"37"}}),a("el-table-column",{attrs:{align:"center",label:"No.",width:"50",type:"index",index:e.index}}),a("el-table-column",{attrs:{label:"操作",align:"center",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"primary",icon:"fas fa-file-invoice",disabled:2===+t.row.status},on:{click:function(a){return e.onClickEdit([t.row.id])}}},[e._v("审核")]),a("el-button",{attrs:{type:"primary",icon:"fas fa-link"},on:{click:function(a){return e.onClickDoc(t.row)}}},[e._v("附件")])]}}])}),a("el-table-column",{attrs:{label:"企业名称",prop:"psName","min-width":"120","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"站点名称",prop:"portName","min-width":"120","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"关阀记录",prop:"closeRecord","min-width":"80","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"申报时间",prop:"applyTime","min-width":"145","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"申报人",prop:"applicantName","min-width":"100","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"申报原因",prop:"applyReason","min-width":"145","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"状态",prop:"status","min-width":"145","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[e._v("\n        "+e._s(e.$enum.getLabel("VALVE_CHECK_STATUS",+a.status))+"\n      ")]}}])}),a("el-table-column",{attrs:{label:"处理意见",prop:"dealRemark","min-width":"145","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"处理时间",prop:"dealTime","min-width":"145","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"当前阀门状态",prop:"currentStatus","min-width":"145","show-overflow-tooltip":""}})],1),a("paging-query",{attrs:{pager:e.pager},on:{query:e.getItemList}}),a("dialog-form",{ref:"dialog",on:{query:e.getItemList}}),a("upload-dialog",{ref:"upload",attrs:{isShow:e.isShow}})],2)},l=[],i=(a("8e6e"),a("456d"),a("ac6a"),a("6762"),a("2fdb"),a("bd86")),n=a("0069"),s=a("73cb"),r=a("c2cd"),c=a("b35b"),u=a("90de");function d(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,o)}return a}function m(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?d(a,!0).forEach((function(t){Object(i["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):d(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var p={name:"ValveOpeningCheckEnt",mixins:[s["c"]],components:{dialogForm:c["default"],UploadDialog:r["a"]},data:function(){var e=this.$store.getters["auth/orgGuid"]||"";return{url:"tpeci/valveOpenApply",loading:!1,isShow:!0,queryForm:{psId:e,fromDate:Object(u["b"])(-7,!1,!1),toDate:Object(u["b"])(0,!1,!1),key:"",status:"",isManagement:!0,sort:"applyTime-"},itemList:[]}},methods:{onClickEdit:function(e){this.$refs.dialog.openDialog(e)},openDialog:function(){this.$refs.dialog.openDialog()},onClickDoc:function(e){this.isShow=2!==+e.status,this.$refs.upload.openDialog(e)},getItemList:function(){var e=this;this.loading=!0,this.selectedIndexs=[];var t=this.pager,a=t.page,o=t.rows;this.$http.get(this.url,{params:m({page:a,rows:o},this.queryForm)}).then((function(t){200===t.status&&t.data.success?(e.itemList=t.data.data.filter((function(e){return[1,2].includes(e.status)})),e.itemList.forEach((function(e){e.dealTime&&e.dealTime.includes("1753")&&(e.dealTime="")})),e.pager.count=t.data.count):e.$message.warning({message:t.data.msg,duration:3e3,showClose:!0})}),(function(e){var t=e.response;Object(n["a"])(t)})).finally((function(){e.loading=!1}))}}},f=p,h=a("2877"),g=Object(h["a"])(f,o,l,!1,null,"3d1d0366",null);t["default"]=g.exports}}]);