(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c1f29"],{"47e5":function(e,t,n){"use strict";n.r(t);var l=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-tree",{ref:"tree",style:{width:e.treeWidth},attrs:{"empty-text":"无数据","expand-on-click-node":!1,accordion:e.accordion,data:e.treeOptions,props:e.propsMerge,"highlight-current":e.highlightCurrent,"default-expand-all":e.defaultExpandAll,"node-key":e.propsMerge.value,"filter-node-method":e.filterNode,"render-content":e.renderContent},on:{"node-click":e.nodeClick}})},r=[],a=(n("ac6a"),n("7f7f"),n("6762"),n("2fdb"),n("2ef0")),i=n.n(a),o={name:"TreePortSingle",model:{prop:"value",event:"input"},props:{value:String,clearable:Boolean,disabled:Boolean,filterable:Boolean,accordion:Boolean,width:{type:String,default:"200px"},treeWidth:{type:String,default:"100%"},defaultExpandAll:{type:Boolean,default:!1},defaultValue:{type:Array,default:function(){return[]}},highlightCurrent:{type:Boolean,default:!1},options:{type:Array,default:function(){return[]}},field:{type:Array,required:!0},props:{type:Object,default:function(){return{label:"label",value:"value",children:"children"}}}},data:function(){return{labelModel:"",valueModel:[],treeOptions:[],once:!0}},computed:{propsMerge:function(){var e=Object.assign({value:"value",label:"label",children:"children",disabled:"disabled"},this.props);return e}},watch:{options:{handler:function(e){var t=this;this.labelModel="",this.treeOptions=[],0!==e.length&&this.$nextTick((function(){t.treeOptions=t.handleParentData(i.a.cloneDeep(e),0)}))},immediate:!0}},methods:{handleParentData:function(e,t){for(var n=this,l=this.field,r=e.map((function(e){return e[l[t].key]})),a=[],i=0;i<e.length;i+=1){var o=a.map((function(e){return e[n.propsMerge.value]}));if(!o.includes(r[i])){var d={};this.$set(d,"".concat(this.propsMerge.label),e[i][l[t].name]),this.$set(d,"".concat(this.propsMerge.value),e[i][l[t].key]),a.push(d)}}return t<this.field.length-1&&a.forEach((function(r){if(n.$set(r,"children",[]),e.forEach((function(e){r[n.propsMerge.value]===e[l[t].key]&&r.children.push(e)})),r.children.length){var a=t+1;n.$set(r,"children",n.handleParentData(r.children,a))}})),a},nodeClick:function(e,t){3===t.level&&this.$emit("input",e.value)},filterNode:function(){},renderContent:function(e,t){var n=t.node;return e("span",{class:"el-tree-node__label ".concat(n.disabled?"is-disabled":"")},[n.label])},setTreeNodeExpanded:function(e){var t=this;e.$children.forEach((function(e){e.$children.length&&e.node&&(t.$set(e.node,"expanded",!1),t.setTreeNodeExpanded(e))}))}}},d=o,c=n("2877"),u=Object(c["a"])(d,l,r,!1,null,null,null);t["default"]=u.exports}}]);