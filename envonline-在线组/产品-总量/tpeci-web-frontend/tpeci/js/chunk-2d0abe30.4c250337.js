(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0abe30"],{"16d9":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"g-login"},[t._m(0),i("main",[i("el-form",{ref:"form",staticClass:"login-form",attrs:{model:t.loginForm,size:"medium"}},[i("div",{class:t.isScan?"btn-pc":"btn-QRcode",on:{click:function(e){return e.target!==e.currentTarget?null:t.handleScan(e)}}}),i("div",{directives:[{name:"show",rawName:"v-show",value:t.isScan,expression:"isScan"}],staticClass:"QRcode"},[i("div",{staticClass:"qr-code",attrs:{alt:"二维码"}}),i("div",{staticClass:"text-center tips"},[t._v("扫一扫，下载APP")])]),i("div",{directives:[{name:"show",rawName:"v-show",value:!t.isScan,expression:"!isScan"}]},[i("el-form-item",{staticStyle:{width:"300px"},attrs:{prop:"username"}},[i("template",{slot:"label"},[i("div",{staticClass:"form-label"},[i("span",{staticClass:"ch-label"},[t._v("用户名")]),i("span",{staticClass:"symbol"},[t._v(" | ")]),i("span",{staticClass:"en-label"},[t._v("User name")])])]),i("el-input",{attrs:{autofocus:"",clearable:"",placeholder:"请输入用户名"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.onClickLogin()}},model:{value:t.loginForm.uid,callback:function(e){t.$set(t.loginForm,"uid",e)},expression:"loginForm.uid"}},[i("i",{staticClass:"el-input__icon el-icon-user",attrs:{slot:"prefix"},slot:"prefix"})])],2),i("el-form-item",{staticClass:"mar-t-md",staticStyle:{width:"300px"},attrs:{prop:"password"}},[i("template",{slot:"label"},[i("div",{staticClass:"form-label"},[i("span",{staticClass:"ch-label"},[t._v("密 码")]),i("span",{staticClass:"symbol"},[t._v(" | ")]),i("span",{staticClass:"en-label"},[t._v("Password")])])]),i("el-input",{attrs:{placeholder:"请输入密码",type:t.isSee?"text":t.password},on:{focus:function(e){t.password="password"}},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.onClickLogin()}},model:{value:t.loginForm.pid,callback:function(e){t.$set(t.loginForm,"pid",e)},expression:"loginForm.pid"}},[i("i",{staticClass:"el-input__icon el-icon-key",attrs:{slot:"prefix"},slot:"prefix"}),t.loginForm.remember?t._e():i("i",{class:"el-input__icon fas fa-"+(t.isSee?"eye":"eye-slash"),attrs:{slot:"suffix"},on:{click:function(e){t.isSee=!t.isSee}},slot:"suffix"})])],2),i("el-form-item",[i("el-button",{staticClass:"btn-login mar-y-lg",attrs:{loading:t.loading,disabled:!t.isLoginValid},on:{click:function(e){return t.onClickLogin()}}},[t._v(t._s("登 录"+(t.loading?" 中":""))+"\n          ")])],1)],1)])],1),t._m(1)])},s=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("header",[i("div",{staticClass:"container"},[i("div",{staticClass:"brand"},[i("span",[t._v("智慧水务综合调度信息")]),t._v(" 监管平台\n      ")])])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("footer",[i("span",{staticClass:"copyright"},[t._v("Copyright ©2019 技术支持：江苏远大信息股份有限公司")])])}],o=(i("8e6e"),i("ac6a"),i("456d"),i("a481"),i("bd86")),a=i("2f62");function r(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,n)}return i}function l(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?r(i,!0).forEach((function(e){Object(o["a"])(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):r(i).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}var c={name:"Login",data:function(){return{isScan:!1,isSee:!1,loading:!1,password:"text",loginForm:{uid:"",pid:"",remember:!1}}},computed:l({},Object(a["e"])({user:function(t){return t.auth.user}}),{isLoginValid:function(){return this.loginForm.uid&&this.loginForm.pid},remember:function(){return this.loginForm.remember},logo:function(){return"string"===typeof this.$config.logo?["",this.$config.logo]:this.$config.logo}}),watch:{remember:function(t){this.isSee=!1}},methods:l({},Object(a["b"])("auth",["Login"]),{handleScan:function(){this.isScan=!this.isScan},onClickLogin:function(){var t=this;this.isLoginValid&&(this.loading=!0,this.$store.dispatch("auth/Login",this.loginForm).then((function(){t.$router.replace("/"),t.loading=!1}),(function(){})).finally((function(){t.loading=!1})))}})},u=c,p=i("2877"),d=Object(p["a"])(u,n,s,!1,null,null,null);e["default"]=d.exports}}]);