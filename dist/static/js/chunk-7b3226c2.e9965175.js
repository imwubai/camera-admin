(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7b3226c2"],{3642:function(e,t,s){"use strict";var a=s("6039"),o=s.n(a);o.a},6039:function(e,t,s){},a434:function(e,t,s){"use strict";var a=s("23e7"),o=s("23cb"),n=s("a691"),i=s("50c4"),r=s("7b0b"),c=s("65f0"),l=s("8418"),d=s("1dde"),g=s("ae40"),u=d("splice"),m=g("splice",{ACCESSORS:!0,0:0,1:2}),h=Math.max,f=Math.min,p=9007199254740991,b="Maximum allowed length exceeded";a({target:"Array",proto:!0,forced:!u||!m},{splice:function(e,t){var s,a,d,g,u,m,v=r(this),P=i(v.length),S=o(e,P),y=arguments.length;if(0===y?s=a=0:1===y?(s=0,a=P-S):(s=y-2,a=f(h(n(t),0),P-S)),P+s-a>p)throw TypeError(b);for(d=c(v,a),g=0;g<a;g++)u=S+g,u in v&&l(d,g,v[u]);if(d.length=a,s<a){for(g=S;g<P-a;g++)u=g+a,m=g+s,u in v?v[m]=v[u]:delete v[m];for(g=P;g>P-a+s;g--)delete v[g-1]}else if(s>a)for(g=P-a;g>S;g--)u=g+a-1,m=g+s-1,u in v?v[m]=v[u]:delete v[m];for(g=0;g<s;g++)v[g+S]=arguments[g+2];return v.length=P-a+s,d}})},b822:function(e,t,s){},cb4b:function(e,t,s){"use strict";var a=s("b822"),o=s.n(a);o.a},dc42:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"app-container"},[s("el-form",{ref:"form",attrs:{model:e.form,"label-width":"120px"}},[s("el-row",{attrs:{gutter:20}},[s("el-col",{attrs:{span:5}},[s("el-form-item",{attrs:{label:"路口名称"}},[s("el-input",{attrs:{placeholder:"请设置路口名称"},model:{value:e.form.crossingName,callback:function(t){e.$set(e.form,"crossingName",t)},expression:"form.crossingName"}})],1)],1)],1),s("el-row",[s("el-form-item",{attrs:{label:"已选择路口方位"}},e._l(e.selectedRoadArray,(function(t,a){return s("div",{key:t.crossingPointName,staticClass:"selectedRoad"},[e._v(e._s(t.crossingPointName)),s("i",{staticClass:"selectedRoadClear el-icon-circle-close",on:{click:function(t){return e.removeSelectedRoad(a)}}})])})),0)],1)],1),s("el-form",{ref:"form",staticClass:"roadposition_form",attrs:{model:e.searchform,"label-width":"120px"}},[s("el-row",{attrs:{gutter:20}},[s("el-col",{attrs:{span:5}},[s("el-form-item",{attrs:{label:"路口方位"}},[s("el-input",{attrs:{placeholder:"请输入路口方位查找"},model:{value:e.searchform.crossingPointName,callback:function(t){e.$set(e.searchform,"crossingPointName",t)},expression:"searchform.crossingPointName"}})],1)],1),s("el-col",{attrs:{span:4}},[s("el-button",{attrs:{type:"primary",loading:e.listLoading},on:{click:e.onSearch}},[e._v("搜索")])],1)],1)],1),s("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],staticStyle:{width:"600px"},attrs:{data:e.tableData,border:""}},[s("el-table-column",{attrs:{label:"操作",width:"50"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("el-checkbox",{key:t.row.crossingPointId,staticClass:"selectRow-checkbox",attrs:{checked:(e.multipleSelection[t.row.crossingPointId]||{}).value||!1},on:{change:function(s){return e.handleSelectionChange(s,t.row)}}})]}}])}),s("el-table-column",{attrs:{prop:"crossingPointName",label:"路口方位"}}),s("el-table-column",{attrs:{prop:"crossingPointStatus",label:"状态"},scopedSlots:e._u([{key:"default",fn:function(t){return[2===t.row.crossingPointStatus?s("div",[e._v("启用")]):e._e(),1===t.row.crossingPointStatus?s("div",[e._v("禁用")]):e._e(),3===t.row.crossingPointStatus?s("div",[e._v("维修")]):e._e()]}}])})],1),s("div",{staticClass:"table_pagination"},[s("el-pagination",{attrs:{background:"",layout:"prev, pager, next",total:e.paginationTotal,"page-size":10},on:{"current-change":e.currentChange}})],1),s("div",{staticClass:"savebtn"},[s("el-button",{attrs:{type:"primary",loading:e.saveLoading},on:{click:e.doSubmit}},[e._v("设置路口完成")])],1)],1)},o=[],n=(s("4160"),s("d81d"),s("a434"),s("159b"),s("5530")),i=s("b775"),r={data:function(){return{crossingId:null,listLoading:!1,currentPage:1,paginationTotal:0,tableData:[],saveLoading:!1,multipleSelection:{},selectedRoadArray:[],form:{crossingName:""},searchform:{},searchData:{}}},mounted:function(){var e=this,t=this.$route.query,s=t.crossingId,a=t.crossingPointName,o=t.crossingPointId;this.getTableData(1),s?i["a"].get("/api/crossings/".concat(s)).then((function(t){var s=t.data,a=s.crossingName,o=s.crossingId,n=s.crossingPointData;e.crossingId=o,e.form.crossingName=a,n&&n.length>0&&(e.selectedRoadArray=n,n.forEach((function(t){e.multipleSelection[t.crossingPointId]={value:!0,crossingPointId:t.crossingPointId,crossingPointName:t.crossingPointName}})))})).catch((function(t){e.$message.error(t.response.data.returnMessage||"获取数据异常")})):a&&(this.selectedRoadArray=[{crossingPointId:o,crossingPointName:a}],this.multipleSelection[o]={value:!0,crossingPointId:o,crossingPointName:a})},methods:{getTableData:function(e){var t=this;this.listLoading=!0,i["a"].post("/api/crossingpoints/search",Object(n["a"])({pageNo:e,pageSize:10,type:2,crossingName:"无"},this.searchData)).then((function(e){t.listLoading=!1,t.tableData=e.data.data,t.paginationTotal=e.data.totalCount})).catch((function(e){t.listLoading=!1,t.$message({message:"获取数据异常",type:"error"})}))},currentChange:function(e){this.getTableData(e)},onSearch:function(){this.searchData=this.searchform,this.getTableData(1)},handleSelectionChange:function(e,t){for(var s in this.multipleSelection[t.crossingPointId]||(this.multipleSelection[t.crossingPointId]={}),Object.assign(this.multipleSelection[t.crossingPointId],Object(n["a"])({value:e},t)),this.selectedRoadArray=[],this.multipleSelection){var a=this.multipleSelection[s]||{},o=a.crossingPointId,i=a.crossingPointName,r=a.value;r&&this.selectedRoadArray.push({crossingPointId:o,crossingPointName:i})}},removeSelectedRoad:function(e){var t=this,s=this.selectedRoadArray[e].crossingPointId;this.selectedRoadArray.splice(e,1),this.multipleSelection[s].value=!1;var a=this.tableData;this.tableData=[],setTimeout((function(){t.tableData=a}))},doSubmit:function(){var e=this,t=this.form.crossingName;if(t)if(this.selectedRoadArray.length<=0)this.$message.error("请先选择路口方位");else{var s=this.selectedRoadArray.map((function(e){var t=e.crossingPointId;return t}));this.saveLoading=!0,this.crossingId?i["a"].put("/api/crossings",{crossingId:this.crossingId,crossingPointId:s}).then((function(t){e.saveLoading=!1,e.$message({message:"操作成功",type:"success",duration:1e3,onClose:function(){location.reload()}}),console.log(t)})).catch((function(t){e.saveLoading=!1,e.$message.error(t.response.data.returnMessage||"操作失败")})):i["a"].post("/api/crossings",{crossingName:t,crossingPointId:s}).then((function(t){e.saveLoading=!1,e.$message({message:"操作成功",type:"success",duration:1e3,onClose:function(){location.reload()}}),console.log(t)})).catch((function(t){e.saveLoading=!1,e.$message.error(t.response.data.returnMessage||"操作失败")}))}else this.$message.error("请先输入路口名称")}}},c=r,l=(s("3642"),s("cb4b"),s("2877")),d=Object(l["a"])(c,a,o,!1,null,"61e0241a",null);t["default"]=d.exports}}]);