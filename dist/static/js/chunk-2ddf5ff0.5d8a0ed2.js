(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2ddf5ff0"],{1768:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("el-row",[n("el-col",{attrs:{span:12}},[n("el-form",{ref:"form",attrs:{model:e.form,"label-width":"180px",rules:e.formRules}},[n("el-form-item",{attrs:{label:"当前NTP服务器地址为"}},[n("el-input",{attrs:{disabled:""},model:{value:e.form.ntp,callback:function(t){e.$set(e.form,"ntp",t)},expression:"form.ntp"}})],1),n("el-form-item",{attrs:{label:"获取时间为"}},[n("el-input",{attrs:{disabled:""},model:{value:e.form.time,callback:function(t){e.$set(e.form,"time",t)},expression:"form.time"}})],1),n("el-form-item",{attrs:{label:"请设置NTP服务器地址",prop:"newntp"}},[n("el-input",{attrs:{maxlength:"50"},model:{value:e.form.newntp,callback:function(t){e.$set(e.form,"newntp",t)},expression:"form.newntp"}})],1),n("el-form-item",[n("el-button",{attrs:{type:"primary",loading:e.saveLoading},on:{click:e.onSubmit}},[e._v("保存")])],1)],1)],1)],1)],1)},o=[],a=n("b775"),s={data:function(){var e=function(e,t,n){t?n():n(new Error("请输入必填项"))};return{formRules:{newntp:[{required:!0,trigger:"blur",validator:e}]},saveLoading:!1,form:{ntp:"",time:"",newntp:""}}},mounted:function(){this.getNtp()},methods:{getNtp:function(){var e=this;a["a"].post("/get_ntp").then((function(t){e.form.ntp=t.data.server,e.form.time=t.data.time})).catch((function(t){e.$message({message:"获取NTP服务异常",type:"error"})}))},onSubmit:function(){var e=this;this.$refs.form.validate((function(t){t&&(e.saveLoading=!0,a["a"].post("/set_ntp",{enable:1,server:e.form.newntp}).then((function(t){e.saveLoading=!1,e.form.ntp=e.form.newntp,e.$message({message:"设置成功",type:"success"})})).catch((function(t){e.saveLoading=!1,e.$message({message:"设置NTP服务异常",type:"error"})})))}))}}},i=s,f=(n("f192"),n("2877")),l=Object(f["a"])(i,r,o,!1,null,"19f8ec85",null);t["default"]=l.exports},f192:function(e,t,n){"use strict";var r=n("f8ef"),o=n.n(r);o.a},f8ef:function(e,t,n){}}]);