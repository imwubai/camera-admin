(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-38dd7a26"],{"804c":function(e,t,a){},a434:function(e,t,a){"use strict";var s=a("23e7"),o=a("23cb"),n=a("a691"),i=a("50c4"),r=a("7b0b"),c=a("65f0"),l=a("8418"),d=a("1dde"),g=a("ae40"),u=d("splice"),m=g("splice",{ACCESSORS:!0,0:0,1:2}),h=Math.max,f=Math.min,p=9007199254740991,b="Maximum allowed length exceeded";s({target:"Array",proto:!0,forced:!u||!m},{splice:function(e,t){var a,s,d,g,u,m,v=r(this),P=i(v.length),S=o(e,P),y=arguments.length;if(0===y?a=s=0:1===y?(a=0,s=P-S):(a=y-2,s=f(h(n(t),0),P-S)),P+a-s>p)throw TypeError(b);for(d=c(v,s),g=0;g<s;g++)u=S+g,u in v&&l(d,g,v[u]);if(d.length=s,a<s){for(g=S;g<P-s;g++)u=g+s,m=g+a,u in v?v[m]=v[u]:delete v[m];for(g=P;g>P-s+a;g--)delete v[g-1]}else if(a>s)for(g=P-s;g>S;g--)u=g+s-1,m=g+a-1,u in v?v[m]=v[u]:delete v[m];for(g=0;g<a;g++)v[g+S]=arguments[g+2];return v.length=P-s+a,d}})},b822:function(e,t,a){},b954:function(e,t,a){"use strict";var s=a("804c"),o=a.n(s);o.a},cb4b:function(e,t,a){"use strict";var s=a("b822"),o=a.n(s);o.a},dc42:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("el-form",{ref:"form",attrs:{model:e.form,"label-width":"120px"}},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:5}},[a("el-form-item",{attrs:{label:"路口名称"}},[a("el-input",{attrs:{placeholder:"请设置路口名称"},model:{value:e.form.crossingName,callback:function(t){e.$set(e.form,"crossingName",t)},expression:"form.crossingName"}})],1)],1)],1),a("el-row",[a("el-form-item",{attrs:{label:"已选择路口方位"}},e._l(e.selectedRoadArray,(function(t,s){return a("div",{key:t.crossingPointName,staticClass:"selectedRoad"},[e._v(e._s(t.crossingPointName)),a("i",{staticClass:"selectedRoadClear el-icon-circle-close",on:{click:function(t){return e.removeSelectedRoad(s)}}})])})),0)],1)],1),a("el-form",{ref:"form",staticClass:"roadposition_form",attrs:{model:e.searchform,"label-width":"120px"}},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:5}},[a("el-form-item",{attrs:{label:"路口方位"}},[a("el-input",{attrs:{placeholder:"请输入路口方位查找"},model:{value:e.searchform.crossingPointName,callback:function(t){e.$set(e.searchform,"crossingPointName",t)},expression:"searchform.crossingPointName"}})],1)],1),a("el-col",{attrs:{span:4}},[a("el-button",{attrs:{type:"primary",loading:e.listLoading},on:{click:e.onSearch}},[e._v("搜索")])],1)],1)],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],staticStyle:{width:"600px"},attrs:{data:e.tableData,border:""}},[a("el-table-column",{attrs:{label:"操作",width:"50"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-checkbox",{key:t.row.crossingPointId,staticClass:"selectRow-checkbox",attrs:{checked:(e.multipleSelection[t.row.crossingPointId]||{}).value||!1},on:{change:function(a){return e.handleSelectionChange(a,t.row)}}})]}}])}),a("el-table-column",{attrs:{prop:"crossingPointName",label:"路口方位"}}),a("el-table-column",{attrs:{prop:"crossingPointStatus",label:"状态"},scopedSlots:e._u([{key:"default",fn:function(t){return[2===t.row.crossingPointStatus?a("div",[e._v("启用")]):e._e(),1===t.row.crossingPointStatus?a("div",[e._v("禁用")]):e._e(),3===t.row.crossingPointStatus?a("div",[e._v("维修")]):e._e()]}}])})],1),a("div",{staticClass:"table_pagination"},[a("el-pagination",{attrs:{background:"",layout:"prev, pager, next",total:e.paginationTotal,"page-size":10},on:{"current-change":e.currentChange}})],1),a("div",{staticClass:"savebtn"},[a("el-button",{attrs:{type:"primary",loading:e.saveLoading},on:{click:e.doSubmit}},[e._v("设置路口完成")])],1)],1)},o=[],n=(a("4160"),a("d81d"),a("a434"),a("159b"),a("5530")),i=a("b775"),r={data:function(){return{crossingId:null,listLoading:!1,currentPage:1,paginationTotal:0,tableData:[],saveLoading:!1,multipleSelection:{},selectedRoadArray:[],form:{crossingName:""},searchform:{},searchData:{}}},mounted:function(){var e=this,t=this.$route.query,a=t.crossingId,s=t.crossingPointName,o=t.crossingPointId;this.getTableData(1),a?i["a"].get("/api/crossings/".concat(a)).then((function(t){var a=t.data,s=a.crossingName,o=a.crossingId,n=a.crossingPointData;e.crossingId=o,e.form.crossingName=s,n&&n.length>0&&(e.selectedRoadArray=n,n.forEach((function(t){e.multipleSelection[t.crossingPointId]={value:!0,crossingPointId:t.crossingPointId,crossingPointName:t.crossingPointName}})))})).catch((function(t){e.$message.error(t.response.data.returnMessage||"获取数据异常")})):s&&(this.selectedRoadArray=[{crossingPointId:o,crossingPointName:s}],this.multipleSelection[o]={value:!0,crossingPointId:o,crossingPointName:s})},methods:{getTableData:function(e){var t=this;this.listLoading=!0,i["a"].post("/api/crossingpoints/search",Object(n["a"])({pageNo:e,pageSize:10,type:2,crossingName:"无"},this.searchData)).then((function(e){t.listLoading=!1,t.tableData=e.data.data,t.paginationTotal=e.data.totalCount})).catch((function(e){t.listLoading=!1,t.$message.error(e.response.data.returnMessage||"获取数据异常")}))},currentChange:function(e){this.getTableData(e)},onSearch:function(){this.searchData=this.searchform,this.getTableData(1)},handleSelectionChange:function(e,t){for(var a in this.multipleSelection[t.crossingPointId]||(this.multipleSelection[t.crossingPointId]={}),Object.assign(this.multipleSelection[t.crossingPointId],Object(n["a"])({value:e},t)),this.selectedRoadArray=[],this.multipleSelection){var s=this.multipleSelection[a]||{},o=s.crossingPointId,i=s.crossingPointName,r=s.value;r&&this.selectedRoadArray.push({crossingPointId:o,crossingPointName:i})}},removeSelectedRoad:function(e){var t=this,a=this.selectedRoadArray[e].crossingPointId;this.selectedRoadArray.splice(e,1),this.multipleSelection[a].value=!1;var s=this.tableData;this.tableData=[],setTimeout((function(){t.tableData=s}))},doSubmit:function(){var e=this,t=this.form.crossingName;if(t)if(this.selectedRoadArray.length<=0)this.$message.error("请先选择路口方位");else{var a=this.selectedRoadArray.map((function(e){var t=e.crossingPointId;return t}));this.saveLoading=!0,this.crossingId?i["a"].put("/api/crossings",{crossingId:this.crossingId,crossingPointId:a}).then((function(t){e.saveLoading=!1,e.$message({message:"操作成功",type:"success",duration:1e3,onClose:function(){location.reload()}})})).catch((function(t){e.saveLoading=!1,e.$message.error(t.response.data.returnMessage||"操作失败")})):i["a"].post("/api/crossing",{crossingName:t,crossingPointId:a}).then((function(t){e.saveLoading=!1,e.$message({message:"操作成功",type:"success",duration:1e3,onClose:function(){location.reload()}}),console.log(t)})).catch((function(t){e.saveLoading=!1,e.$message.error(t.response.data.returnMessage||"操作失败")}))}else this.$message.error("请先输入路口名称")}}},c=r,l=(a("b954"),a("cb4b"),a("2877")),d=Object(l["a"])(c,s,o,!1,null,"aeb4f0c8",null);t["default"]=d.exports}}]);