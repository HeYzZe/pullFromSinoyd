(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c1d15"],{4850:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("dialog-modal",{ref:"dialog",attrs:{type:"title",size:"mini",maxScrollbar:"",title:"开关阀详情"}},[a("el-form",{ref:"form",staticClass:"item-space pad-a-xs",attrs:{rules:e.formRules,model:e.itemModel,"label-width":"90px"}},[a("el-form-item",{attrs:{label:"站点名称：",prop:"portId","hint-down":""}},[a("el-select",{attrs:{clearable:""},on:{change:e.onChangePort},model:{value:e.itemModel.portId,callback:function(t){e.$set(e.itemModel,"portId",t)},expression:"itemModel.portId"}},e._l(e.portList,(function(e){return a("el-option",{key:e.id,attrs:{value:e.id,label:e.portName}})})),1)],1),a("el-form-item",{attrs:{label:"申报人："}},[a("el-input",{attrs:{readonly:""},model:{value:e.userName,callback:function(t){e.userName=t},expression:"userName"}})],1),a("el-form-item",{attrs:{label:"关阀记录：",prop:"closeRecord"}},[a("el-input",{attrs:{readonly:"",type:"textarea",rows:4},model:{value:e.itemModel.closeRecord,callback:function(t){e.$set(e.itemModel,"closeRecord",t)},expression:"itemModel.closeRecord"}})],1),a("el-form-item",{attrs:{label:"申报时间："}},[a("el-date-picker",{staticStyle:{width:"100%"},attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:e.itemModel.applyTime,callback:function(t){e.$set(e.itemModel,"applyTime",t)},expression:"itemModel.applyTime"}})],1),a("el-form-item",{attrs:{label:"申报原因："}},[a("el-input",{attrs:{type:"textarea",rows:4},model:{value:e.itemModel.applyReason,callback:function(t){e.$set(e.itemModel,"applyReason",t)},expression:"itemModel.applyReason"}})],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"success",disabled:[1,2,"1","2"].includes(e.itemModel.status),icon:"fas fa-cloud-upload-alt",loading:e.saveLoading},on:{click:function(t){return e.onSaveCheck(1,e.saveCallback)}}},[e._v("提 交\n    ")]),a("el-button",{attrs:{type:"primary",disabled:[1,2,"1","2"].includes(e.itemModel.status),icon:"fas fa-save",loading:e.saveLoading},on:{click:function(t){return e.onSaveCheck(0,e.saveCallback)}}},[e._v("保 存\n    ")]),a("el-button",{attrs:{icon:"fas fa-times"},on:{click:function(t){return e.$refs.dialog.closeDialog()}}},[e._v("关 闭")])],1)],1)},s=[],i=(a("8e6e"),a("ac6a"),a("456d"),a("768b")),r=a("bd86"),l=a("2f62"),n=a("73cb"),c=a("0069"),d=a("4161");function p(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,o)}return a}function m(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?p(a,!0).forEach((function(t){Object(r["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):p(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var u={mixins:[n["d"]],data:function(){return{url:"tpeci/valveOpenApply",itemModel:{portId:"",applyTime:Object(d["formatDate"])(new Date,"Y-m-d H:i:s"),applyReason:"",closeRecord:"",status:0},portList:[],valveRecord:[],formRules:{portId:[{required:!0,message:"请选择申报排口",trigger:["change","blur"]}],closeRecord:[{required:!0,message:"该排口未查询到关阀记录",trigger:["change"]}]}}},computed:m({},Object(l["c"])("auth",["userName"])),methods:{onChangePort:function(e){if(e){var t=this.portList.filter((function(t){return t.id===e})),a=Object(i["a"])(t,1),o=a[0];this.itemModel.regionCodeId=o.regionCodeId,this.itemModel.regionName=o.regionName,this.itemModel.psId=o.psId,this.itemModel.psName=o.psName,this.itemModel.portName=o.portName,this.getValveList([e])}else this.itemModel.closeRecord=""},openDialog:function(e){var t=this;this.$refs.dialog.openDialog(),this.itemModel=this.setEmptyItem(e),this.getPortList(),this.$nextTick((function(){t.$refs.form.clearValidate()}))},onSaveCheck:function(e,t){var a=this;this.isEmptyObj(this.formRules)?this.onSaveItem(e,t):this.$refs.form.validate((function(o){o&&a.onSaveItem(e,t)}))},getPortList:function(){var e=this;this.$http.get("tpeci/valveOpenApply/getClosedPort").then((function(t){t.data.success&&(e.portList=t.data.data||[])}),(function(e){var t=e.response;Object(c["a"])(t)}))},getValveList:function(e){var t=this;this.$http.post("tpeci/tPECIWaterValveStatus",{isAll:!1,portIds:e,type:["01","02","03","04","05","06","07"],sort:"Tstamp-"},{params:{page:1,rows:1}}).then((function(e){if(e.data.success){var a=e.data.data||[],o=Object(i["a"])(a,1),s=o[0];if(s){var r=s.psName,l=s.portName,n=s.tstamp,c=s.ctypeValue;t.valveRecord=s,t.itemModel.closeRecord="".concat(r," ").concat(l," 阀门从").concat(n).concat(c)}else t.itemModel.closeRecord=""}}),(function(e){var t=e.response;Object(c["a"])(t)}))},onSaveItem:function(e,t){var a=this;t(),this.saveLoading=!0;var o=this.itemModel.id;this.itemModel.status=e,this.$http[o?"put":"post"](this.url,this.itemModel).then((function(e){200===e.status&&e.data.success?(a.$message.success({message:"操作成功",duration:3e3,showClose:!0}),a.itemModel=e.data.data,t?t(e.data.data):a.$emit("query")):(a.$message.warning({message:e.data.msg,duration:3e3,showClose:!0}),a.itemModel.status=0)}),(function(e){var t=e.response;a.itemModel.status=0,Object(c["a"])(t)})).finally((function(){a.saveLoading=!1}))},saveCallback:function(){this.$refs.dialog.closeDialog(),this.$emit("query")},setEmptyItem:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t={};return e.id&&(t={id:e.id}),m({},t,{regionCodeId:e.regionCodeId||"",regionName:e.regionName||"",psId:e.psId||"",psName:e.psName||"",portId:e.portId||"",portName:e.portName||"",closeRecord:e.closeRecord||"",applyReason:e.applyReason||"",applyTime:e.applyTime||Object(d["formatDate"])(new Date,"Y-m-d H:i:s"),status:e.status||0})}}},f=u,h=a("2877"),v=Object(h["a"])(f,o,s,!1,null,"5a410150",null);t["default"]=v.exports}}]);