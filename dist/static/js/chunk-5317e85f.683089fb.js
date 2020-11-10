(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5317e85f"],{"198b":function(e,t,a){"use strict";var s=a("9b45"),l=a.n(s);l.a},3903:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("el-form",{ref:"form",staticClass:"roadposition_form",attrs:{model:e.form,"label-width":"100px"}},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:5}},[a("el-form-item",{attrs:{label:"用户名"}},[a("el-input",{attrs:{placeholder:"请输入"},model:{value:e.form.username,callback:function(t){e.$set(e.form,"username",t)},expression:"form.username"}})],1)],1),a("el-col",{attrs:{span:5}},[a("el-form-item",{attrs:{label:"所属中队"}},[a("el-input",{attrs:{placeholder:"请输入"},model:{value:e.form.policeStationName,callback:function(t){e.$set(e.form,"policeStationName",t)},expression:"form.policeStationName"}})],1)],1),a("el-col",{attrs:{span:5}},[a("el-form-item",{attrs:{label:"手机号"}},[a("el-input",{attrs:{placeholder:"请输入"},model:{value:e.form.telephone,callback:function(t){e.$set(e.form,"telephone",t)},expression:"form.telephone"}})],1)],1),a("el-col",{attrs:{span:5}},[a("el-form-item",{attrs:{label:"状态"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.status,callback:function(t){e.$set(e.form,"status",t)},expression:"form.status"}},e._l(e.statusOptions,(function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1)],1)],1),a("el-col",{attrs:{span:4}},[a("el-button",{attrs:{type:"primary",loading:e.listLoading},on:{click:e.onSearch}},[e._v("搜索")])],1)],1)],1),a("el-row",{staticClass:"btns_box"},[a("el-button",{on:{click:e.handleClickAdd}},[e._v("新建")]),a("el-button",{on:{click:e.handleClickUpdate}},[e._v("修改")]),a("el-button",{on:{click:e.handleClickStart}},[e._v("启动")]),a("el-button",{on:{click:e.handleClickStop}},[e._v("禁用")]),a("el-button",{on:{click:e.handleClickDel}},[e._v("删除")])],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],staticStyle:{width:"100%"},attrs:{data:e.tableData,border:""}},[a("el-table-column",{attrs:{label:"操作",width:"50"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-radio",{staticClass:"selectRow-radio",attrs:{label:t.row.userId,value:e.selectedRowKey},on:{change:function(a){return e.handleSelectRow(t.row.userId)}}})]}}])}),a("el-table-column",{attrs:{prop:"username",label:"用户名"}}),a("el-table-column",{attrs:{prop:"policeStationName",label:"所属中队"}}),a("el-table-column",{attrs:{prop:"telephone",label:"手机号"}}),a("el-table-column",{attrs:{prop:"status",label:"状态"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(1===t.row.status?"禁用":"启用")+" ")]}}])})],1),a("div",{staticClass:"table_pagination"},[a("el-pagination",{attrs:{background:"",layout:"prev, pager, next",total:e.paginationTotal,"page-size":10,"current-page":e.currentPage},on:{"current-change":e.currentChange}})],1)],1)},l=[],n=(a("4de4"),a("5530")),o=a("b775"),r={data:function(){return{listLoading:!1,currentPage:1,paginationTotal:0,selectedRowKey:null,statusOptions:[{value:0,label:"全部"},{value:2,label:"启用"},{value:1,label:"禁用"}],tableData:[],form:{},searchData:{}}},mounted:function(){this.getTableData(1)},methods:{handleSelectRow:function(e){this.selectedRowKey=e},getTableData:function(e){var t=this;this.listLoading=!0,o["a"].post("/api/users/search",Object(n["a"])({pageNo:e,pageSize:10,type:2},this.searchData)).then((function(e){t.listLoading=!1,t.tableData=e.data.data,t.paginationTotal=e.data.totalCount})).catch((function(e){t.listLoading=!1,t.$message({message:"获取数据异常",type:"error"})}))},currentChange:function(e){this.getTableData(e)},onSearch:function(){this.searchData=this.form,this.getTableData(1)},handleClickAdd:function(){this.$router.push({path:"/user/add"})},handleClickUpdate:function(){var e=this;if(this.selectedRowKey){var t=this.tableData.filter((function(t){return t.userId===e.selectedRowKey}))[0],a=t.username,s=t.userId;this.$router.push({path:"/user/add",query:{userId:s,username:a}})}else this.$message({message:"请先选择一条数据",type:"error"})},handleClickStart:function(){var e=this;this.selectedRowKey?o["a"].put("/api/users",{userId:this.selectedRowKey,status:2}).then((function(t){e.$message.success("操作成功"),e.currentPage=1,e.getTableData(1)})).catch((function(){e.$message.error("操作失败")})):this.$message({message:"请先选择一条数据",type:"error"})},handleClickStop:function(){var e=this;this.selectedRowKey?o["a"].put("/api/users",{userId:this.selectedRowKey,status:1}).then((function(t){e.$message.success("操作成功"),e.currentPage=1,e.getTableData(1)})).catch((function(){e.$message.error("操作失败")})):this.$message({message:"请先选择一条数据",type:"error"})},handleClickDel:function(){var e=this;this.selectedRowKey?this.$alert("确认删除？","系统提示",{confirmButtonText:"确定",callback:function(t){"confirm"===t&&o["a"].delete("/api/users/".concat(e.selectedRowKey)).then((function(t){e.$message.success("操作成功"),e.currentPage=1,e.getTableData(1)})).catch((function(t){e.$message.error(t.response.data.returnMessage||"操作失败")}))}}):this.$message({message:"请先选择一条数据",type:"error"})}}},i=r,c=(a("198b"),a("b3ea"),a("2877")),u=Object(c["a"])(i,s,l,!1,null,"028ff5a4",null);t["default"]=u.exports},"974e":function(e,t,a){},"9b45":function(e,t,a){},b3ea:function(e,t,a){"use strict";var s=a("974e"),l=a.n(s);l.a}}]);