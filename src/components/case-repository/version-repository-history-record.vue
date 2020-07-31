<!-- 版本库操作历史记录 -->
<template>
  <div class="versionRepositoryRecordApp">
    <header class="header">
      版本库操作历史记录
    </header>
      <el-card shadow="always" class="box-card">
        <!-- <div slot="header" class="clearfix">
            <span>版本库操作历史记录</span>
        </div> -->
        <div class="text item">
            <el-form :inline="true" ref="queryForm" :model="queryForm.data" >
              <el-form-item>
                <el-input v-model="queryForm.data.nodeName" placeholder="节点名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="queryForm.data.operEvent" placeholder="操作事件"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="queryForm.data.nodeType" placeholder="节点类型"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="queryForm.data.operor" placeholder="操作人"></el-input>
              </el-form-item>
              <el-form-item>
                <el-date-picker 
                v-model="queryForm.data.operTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onQuery">查询</el-button>
              </el-form-item>
            </el-form>
            <!-- 渲染表格 -->
            <el-table
              :data="tableData"
              border
              stripe
              style="width: 100%">
              <el-table-column
                prop="sourceNode"
                label="节点名称"
                align="center"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="operationEventStr"
                label="操作事件"
                align="center"
                show-overflow-tooltip
                width="100">
              </el-table-column>
              <el-table-column
                prop="nodeTypeStr"
                label="节点类型"
                align="center"
                show-overflow-tooltip
                width="100">
              </el-table-column>
              <el-table-column
                prop="operator"
                label="操作人"
                align="center"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="operationTime"
                label="操作时间"
                align="center"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
              <el-pagination :current-page.sync="pagination.startNum"
                            :page-sizes="[5, 10, 20]"
                            :page-size="pagination.range"
                            :total="pagination.total"
                            layout="total, sizes, prev, pager, next"
                            @size-change="rangeChange"
                            @current-change="startNumChange">
              </el-pagination>
            </div>
        </div>
      </el-card>
  </div>
</template>
<script>
/* eslint-disable */
import { getLibraryHistroryRecordPower } from '../../api/api'
// import supendButton from './suspend-button.vue'
export default {
  // versionHistory包含caseSuiteId和nodeId两个字段的值
props: ['versionHistory'],
data () {
    return {
      queryForm:{
          data:{
              nodeName:'',
              operEvent:'',
              nodeType:'',
              operor:'',
              operTime:['', ''] 
          }
      },
      tableData:[],
      pagination:{
        startNum: 1,
        range: 10,
        total: 0,
      }
    }
  },
methods:{
  onQuery(){
    
    let queryData = {
          caseSuiteId:this.versionHistory.caseSuiteId,
          belongResp:this.versionHistory.belongResp,
          sourceNode:this.queryForm.data.nodeName.replace(/\s*/g,""),
          operationEventFilterStr:this.queryForm.data.operEvent.replace(/\s*/g,""),
          nodeTypeFilterStr:this.queryForm.data.nodeType.replace(/\s*/g,""),
          operator:this.queryForm.data.operor.replace(/\s*/g,""),
          startNum:this.pagination.startNum,
          range:this.pagination.range
        }

        if(this.queryForm.data.operTime == null || this.queryForm.data.operTime[0].length == 0){
          queryData.operStartDate = ''
          queryData.operEndDate = ''
        }else{
          
      let beginyear = this.queryForm.data.operTime[0].getFullYear()+""
      let beginmouth = ""
      if((this.queryForm.data.operTime[0].getMonth()+"").length == 1){
        beginmouth = "0"+(this.queryForm.data.operTime[0].getMonth()+1)
      }else{
        beginmouth = (this.queryForm.data.operTime[0].getMonth()+1)+""
      }
      let begindate = ""
      if((this.queryForm.data.operTime[0].getDate()+"").length == 1){
        begindate = "0"+this.queryForm.data.operTime[0].getDate()
      }else{
        begindate = this.queryForm.data.operTime[0].getDate()+""
      }

      let endyear = this.queryForm.data.operTime[1].getFullYear()+""
      let endnmouth = ""
      if((this.queryForm.data.operTime[1].getMonth()+"").length == 1){
        endnmouth = "0"+(this.queryForm.data.operTime[1].getMonth()+1)
      }else{
        endnmouth = (this.queryForm.data.operTime[1].getMonth()+1)+""
      }
      let enddate = ""
      if((this.queryForm.data.operTime[1].getDate()+"").length == 1){
        enddate = "0"+this.queryForm.data.operTime[1].getDate()
      }else{
        enddate = this.queryForm.data.operTime[1].getDate()+""
      }


      /* queryData.operationStartData=this.queryForm.data.operTime[0].toLocaleDateString().replace(/\//g,"-"),
      queryData.operationEndData=this.queryForm.data.operTime[1].toLocaleDateString().replace(/\//g,"-") */
      queryData.operStartDate=beginyear+"-"+beginmouth+"-"+begindate
      queryData.operEndDate=endyear+"-"+endnmouth+"-"+enddate
      }
      
      getLibraryHistroryRecordPower(queryData)
              .then(res => {
                if (res.state === 1000) {
                  // alert(222222)
                  this.tableData = res.data.libraryHistroryRecord
                  this.pagination.total = res.data.total
                } else {
                  this.$message.error('加载数据失败！');
                }
              }, rej => {
                this.errorAjax()
              })
  },
  // 点击第几页e
  startNumChange (val) {
      this.startNum = val
      this.onQuery()
    },
  // 选择每页展示多少条数据
  rangeChange (val) {
      this.range = val
      this.onQuery()
    },
    //刷新页面数据
    initTableData () {
      let queryData = {
          caseSuiteId:this.versionHistory.caseSuiteId,
          belongResp:this.versionHistory.belongResp,
          sourceNode:'',
          operationEventFilterStr:'',
          nodeTypeFilterStr:'',
          operator:'',
          operStartDate:'',
          operEndDate:'',
          startNum:this.pagination.startNum,
          range:this.pagination.range
        }
      // alert(2)
      getLibraryHistroryRecordPower(queryData)
              .then(res => {
                if (res.state === 1000) {
                  this.tableData = res.data.libraryHistroryRecord
                  this.pagination.total = res.data.total
                } else {
                  this.$message.error('加载数据失败！');
                }
              }, rej => {
                this.errorAjax()
              })
    },
    errorAjax () {
      this.$message({
        type: 'error',
        message: '失败',
        duration: 1000
      })
    }
},
mounted () {
  console.log(this.versionHistory)
  this.initTableData();
}
}
</script>

<style>
.versionRepositoryRecordApp {
  width: 100%;
}
.versionRepositoryRecordApp > .el-card > .el-card__body > .text > .el-form > .el-form-item {
  margin-right: 66px
}
.versionRepositoryRecordApp > .el-card > .el-card__body > .text > .el-form > .el-form-item:nth-of-type(3) {
  margin-right: 0px
}
.versionRepositoryRecordApp > .el-card > .el-card__body > .text > .el-form > .el-form-item:nth-of-type(5) {
  margin-right: 46px
}
.versionRepositoryRecordApp > .el-card > .el-card__body > .text > .el-form > .el-form-item:nth-of-type(6) {
  margin-right: 0px
}
.versionRepositoryRecordApp > .el-card > .el-card__body > .text > .pagination {
  margin-top: 10px
}
.versionRepositoryRecordApp > .header {
  height: 60px;
  border-bottom: 1px solid #ccc;
  line-height: 60px;
  font-size: 24px;
  text-indent: 30px
}
/* .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 60%;
  } */
</style>