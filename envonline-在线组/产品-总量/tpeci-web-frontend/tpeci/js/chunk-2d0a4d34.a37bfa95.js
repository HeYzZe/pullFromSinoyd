(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0a4d34"],{"07a8":function(e,t,a){"use strict";a.r(t);var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("dialog-modal",{ref:"dialog",attrs:{type:"title",size:"mini","append-to-body":"",maxScrollbar:"",title:e.title},on:{close:e.closeDialog}},[a("el-form",{ref:"form",staticClass:"mar-t-xs pad-x-sm item-space el-box",attrs:{rules:e.formRules,"label-width":"90px",model:e.itemModel}},[a("el-form-item",{attrs:{label:"处置人员：",prop:"dealUserName","hint-down":""}},[a("el-input",{attrs:{disabled:""},model:{value:e.itemModel.dealUserName,callback:function(t){e.$set(e.itemModel,"dealUserName",t)},expression:"itemModel.dealUserName"}})],1),a("el-form-item",{attrs:{label:"选择状态：",prop:"dealType"}},[a("el-select",{attrs:{disabled:e.dealDis||e.noEdit},model:{value:e.itemModel.dealType,callback:function(t){e.$set(e.itemModel,"dealType",t)},expression:"itemModel.dealType"}},e._l(e.$enum.get("ALARM_DEALTYPE"),(function(e,t){return a("el-option",{key:t,attrs:{label:e.label,value:e.value}})})),1)],1),a("el-form-item",{attrs:{label:"处置时间：",prop:"dealDate"}},[a("el-date-picker",{staticStyle:{width:"100%"},attrs:{"value-format":"yyyy-MM-dd HH:mm:ss",format:"yyyy-MM-dd HH:mm:ss",type:"datetime",placeholder:"选择日期时间",clearable:!1,disabled:e.noEdit},model:{value:e.itemModel.dealDate,callback:function(t){e.$set(e.itemModel,"dealDate",t)},expression:"itemModel.dealDate"}})],1),a("el-form-item",{attrs:{label:"处置说明：",prop:"dealContext"}},[a("el-input",{attrs:{type:"textarea",autosize:{minRows:2},disabled:e.noEdit},model:{value:e.itemModel.dealContext,callback:function(t){e.$set(e.itemModel,"dealContext",t)},expression:"itemModel.dealContext"}})],1),a("el-form-item",{attrs:{label:"附件上传："}},[a("upload-file-all",{ref:"upload",attrs:{disabled:e.noEdit,id:e.itemModel.alarmId}})],1)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},["alarmId"!==e.code?a("el-button",{attrs:{type:"primary",icon:"fas fa-save",loading:e.saveLoading},on:{click:function(t){return e.onSaveCheck(e.saveCallback)}}},[e._v("保 存\n    ")]):e._e(),a("el-button",{attrs:{icon:"fas fa-times"},on:{click:e.closeDialog}},[e._v("关 闭"+e._s("alarmId"===e.code?"详情":""))])],1)],1)},o=[],i=a("73cb"),d={props:{title:{type:String,required:!0},dealDis:{type:Boolean,default:!1},noEdit:{type:Boolean,default:!1}},mixins:[i["d"]],data:function(){return{saveLoading:!1,url:"alarm/AlarmRecordDealDetail",itemModel:{alarmId:"",dealType:1,dealDate:"",dealContext:"",dealUserName:""},formRules:{dealType:[{required:!0,message:"请选择状态",trigger:["blur","change"]}],dealDate:[{required:!0,message:"请选择处理时间",trigger:["blur","change"]}],dealContext:[{required:!0,message:"请输入处置说明",trigger:["blur","change"]}]},code:"id"}},computed:{user:function(){return this.$store.state.auth.user}},mounted:function(){},methods:{openDialog:function(e,t){var a=this;this.itemModel.dealUserName=this.user.userName,this.itemModel.alarmId=e[t],this.code=t,"alarmId"===t?this.itemModel={alarmId:e.alarmId,dealType:e.dealType,dealDate:e.dealDate,dealContext:e.dealContext,dealUserName:e.dealUserName}:this.itemModel.dealDate=this.$tools.formatDate(new Date,"Y-m-d H:i:s"),this.$refs.dialog.openDialog(),this.$nextTick((function(){a.$refs.upload.getFileList(),a.$refs.form.clearValidate()}))},closeDialog:function(){this.itemModel=this.getEmptyItem(),this.$refs.dialog.closeDialog()},saveCallback:function(){this.closeDialog(),this.$emit("getItemList")},getEmptyItem:function(){return{alarmId:"",dealType:1,dealDate:"",dealContext:"",dealUserName:""}}}},s=d,r=a("2877"),n=Object(r["a"])(s,l,o,!1,null,null,null);t["default"]=n.exports}}]);