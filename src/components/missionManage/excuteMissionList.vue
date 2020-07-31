/* eslint-disable vue/no-parsing-error */
<template>
  <div class="excuteMissionListApp">
    <!-- 搜索 -->
    <div class="search">
      <el-input v-model.trim="caseName" placeholder="用例名称关键字"></el-input>
      <template>
        <el-select v-model="caseLevel" placeholder="用例级别">
          <el-option
            v-for="item in caseLevelArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>
      <template>
        <el-select v-model="caseAuto" placeholder="是否自动化">
          <el-option
            v-for="item in caseAutoArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>
      <template v-if="this.tabName === 'yijing'">
        <el-select v-model="taskResult" placeholder="测试结果">
          <el-option v-for="item in taskResultArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          ></el-option>
        </el-select>
      </template>
      <el-button type="primary" @click="search">查询</el-button>
      <el-dropdown @command="handClick">
        <el-button type="primary">批量执行</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">成功</el-dropdown-item>
          <el-dropdown-item command="2">失败</el-dropdown-item>
          <el-dropdown-item command="3">阻塞</el-dropdown-item>
          <el-dropdown-item command="4">跳过</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="container">
      <el-card class="box-card">
        <!-- 列表宽度1157px，最大高度530px -->
        <el-table
          :data="tableData"
          border
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          @cell-mouse-enter="shouPointer"
          @row-click="rowClick"
          :header-cell-style="{background:'rgb(250, 250, 250)'}"
        >
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column
            prop="path"
            label="用例路径"
            align="center"
            v-if="tabName === 'zhunbei'"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="path"
            label="用例路径"
            align="center"
            v-if="tabName === 'yijing'"
            show-overflow-tooltip
          ></el-table-column>
          <!-- <el-table-column label="用例详情" width="80" align="center" v-if="tabName === 'zhunbei'">
        <template slot-scope="scope">
          <el-button type="text" @click="changeResult(scope.row, 1, $event)">详情</el-button>
        </template>
          </el-table-column>-->
          <!-- <el-table-column label="用例详情" width="80" align="center" v-if="tabName === 'yijing'"></el-table-column> -->
          <el-table-column prop="caseName" label="用例名称" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- <el-tooltip placement="top"> -->
              <!-- <div slot="content">用例名称：{{ scope.row.caseName }}<br/>预置条件：{{ scope.row.precondition }}<br/>测试数据：{{ scope.row.caseData }}<br/>测试步骤：{{ scope.row.caseStep }}<br/>预期结果：{{ scope.row.expectResult }}</div> -->
              <span>{{ scope.row.caseName }}</span>
              <!-- </el-tooltip> -->
            </template>
          </el-table-column>
          <!-- <el-table-column label="用例详情" width="80" align="center" v-if="tabName === 'zhunbei'">
        <template slot-scope="scope">
          <el-button type="text" @click="seeCaseMore(scope.row, 1, $event)">详情</el-button>
        </template>
          </el-table-column>-->
          <!-- <el-table-column label="用例详情" width="80" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="seeCaseMore(scope.row, 1, $event)">详情</el-button>
        </template>
          </el-table-column>-->
          <!-- <el-table-column
        prop="caseNumber"
        label="用例编号"
        width="80"
        align="center"
        show-overflow-tooltip
          ></el-table-column>-->
          <!-- <el-table-column
        prop="caseSuiteName"
        label="所属用例集"
        width="100"
        align="center"
        show-overflow-tooltip
          ></el-table-column>-->
          <!-- <el-table-column
        prop="belongRepository"
        label="所属库"
        width="70"
        align="center"
        show-overflow-tooltip
          ></el-table-column>-->
          <el-table-column
            prop="taskResult"
            label="测试结果"
            width="100"
            align="center"
            show-overflow-tooltip
            v-if="tabName === 'yijing'"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="openDialog(scope.row)">
                {{
                scope.row.taskResult
                }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="150" align="center">
            <template slot-scope="scope">
              <el-input
                v-model.trim="inputValueArr[scope.$index]"
                placeholder="请输入内容"
                @blur="getInputValue($event, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="附件" width="70" align="center" v-if="tabName === 'yijing'">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="annexDetail(scope.row.attrachment)"
                v-show="scope.row.attrachment && scope.row.attrachment.length>0"
              >详情</el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="changeResult(scope.$index, scope.row, 1, $event)">成功</el-button>
          <el-button type="text" @click="fail(scope,2)">失败</el-button>
          <el-button type="text" @click="fail(scope,3)">阻塞</el-button>
          <el-button type="text" @click="changeResult(scope.$index, scope.row, 4, $event)">跳过</el-button>
        </template>
          </el-table-column>-->
        </el-table>
      </el-card>
      <!-- <div > -->
      <el-card class="containerRight" v-if="listData">
        <div slot="header" class="clearfix">
          <span>用例详情</span>
        </div>
        <!-- <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">用例详情</div>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">用例名称</div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">{{listData.caseName}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <!-- <div class="grid-content bg-purple">用例编号</div> -->
            <div class="grid-content bg-purple">用例id</div>
          </el-col>
          <el-col :span="16">
            <!-- <div class="grid-content bg-purple-light">{{listData.caseNumber}}</div> -->
            <div class="grid-content bg-purple-light">{{listData.caseId}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">所属用例集</div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">{{listData.caseSuiteName}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">所属库</div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">{{listData.belongRepository}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">预置条件</div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">{{listData.precondition}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">测试数据</div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">{{listData.caseData}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">测试步骤</div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">{{listData.caseStep}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">预期结果</div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">{{listData.expectResult}}</div>
          </el-col>
        </el-row>
      </el-card>
      <!-- </div> -->
      <div class="handleButton" v-if="listData">
        <el-button type="primary" @click="changeResult(listData.index, listData, 1)">成功</el-button>
        <el-button type="primary" @click="fail(2)">失败</el-button>
        <el-button type="primary" @click="fail(3)">阻塞</el-button>
        <el-button type="primary" @click="changeResult(listData.index, listData, 4)">跳过</el-button>
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination
      :current-page.sync="startNum"
      :page-sizes="[5, 10, 100, 500, 1000]"
      :page-size="range"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @size-change="rangeChange"
      @current-change="startNumChange"
    ></el-pagination>

    <!-- 执行记录 -->
    <el-dialog title :visible.sync="seeAllUserStatus" class="allUserStatus">
      <el-table :data="gridData" border>
        <el-table-column prop="result" label="执行结果" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.result === '通过'" style="color: #67C23A">
              {{
              scope.row.result
              }}
            </span>
            <span
              v-if="scope.row.result === '失败' || scope.row.result === '阻塞'"
              style="color: #F56C6C"
            >{{ scope.row.result }}</span>
            <span v-if="scope.row.result === '跳过'">
              {{
              scope.row.result
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="执行人" align="center"></el-table-column>
        <el-table-column prop="operateTime" label="执行时间" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="附件" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="annexDetail(scope.row.attrachment)"
              v-show="scope.row.attrachment && scope.row.attrachment.length>0"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 用例详情 -->
    <el-dialog title="用例详情" :visible.sync="showCaseMore" class="seeMoreCase">
      <ul>
        <li>
          <span>用例名称：</span>
          <span>{{ showCaseData.caseName }}</span>
        </li>
        <li>
          <span>预置条件：</span>
          <span>{{ showCaseData.precondition }}</span>
        </li>
        <li>
          <span>测试数据：</span>
          <span>{{ showCaseData.caseData }}</span>
        </li>
        <li>
          <span>测试步骤：</span>
          <span>{{ showCaseData.caseStep }}</span>
        </li>
        <li>
          <span>预期结果：</span>
          <span>{{ showCaseData.expectResult }}</span>
        </li>
      </ul>
      <!-- <el-table :data="showCaseData">
        <el-table-column property="caseName" label="用例名称" width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column property="precondition" label="预置条件" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column property="caseData" label="测试数据" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column property="caseStep" label="测试步骤" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column property="expectResult" label="预期结果" align="center" show-overflow-tooltip></el-table-column>
      </el-table>-->
    </el-dialog>
    <!-- 上传附件弹窗 -->
    <el-dialog title="上传附件" :visible.sync="annexVisible" :destroy-on-close="true">
      <el-upload
        class="upload-demo"
        :action="url"
        multiple
        :data="upLoadText"
        :on-success="uploadSuccess"
        :file-list="fileList"
        :on-change="fileChange"
        :on-remove="fileRemove"
        :auto-upload="false"
        ref="upload"
        accept="image/jpeg, image/jpg, image/png"
      >
        <el-button size="small" type="primary" @click="upLoadFile()">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传图片，且不超过5M</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeFailResult(listData.index, listData, type)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 附件详情弹窗 -->
    <el-dialog title="附件详情" :visible.sync="annexDetailVisible">
      <el-carousel :autoplay="false">
        <el-carousel-item v-for="item in attrachment" :key="item">
          <div class="blockImg">
            <img :src="item" height="100%" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTaskStatisticInfoPower,
  updateTaskProgressPower,
  getTaskAllParticipantStatusPower,
  stopTaskPower,
  getCaseToExecutePower,
  getCaseExecutedPower,
  updateCaseResultPower,
  getCaseExecuteResultHistoryPower
} from '../../api/api'
import { baseUrl } from '../../util/http.js'
export default {
  props: {
    tabName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      caseLevelArr: [{
        value: 'L0',
        label: 'L0'
      }, {
        value: 'L1',
        label: 'L1'
      }, {
        value: 'L2',
        label: 'L2'
      }, {
        value: 'L3',
        label: 'L3'
      }, {
        value: 'L4',
        label: 'L4'
      }],
      caseAutoArr: [{
        value: 0,
        label: '否'
      }, {
        value: 1,
        label: '是'
      }],
      taskResultArr: [{
        value: 1,
        label: '通过'
      }, {
        value: 2,
        label: '失败'
      }, {
        value: 3,
        label: '阻塞'
      }, {
        value: 4,
        label: '跳过'
      }],
      taskResult: '',
      caseLevel: '',
      caseAuto: '',
      tableData: [],
      taskName: '',
      creator: '',
      searchTime: '',
      startNum: 1,
      range: 10,
      total: 0,
      seeTestPeopleData: [],
      seeMoreUser: false,
      goingMouseenterContent: '',
      mouseleave: true,
      seeAllUserStatus: false,
      gridData: [],
      caseName: '',
      multipleAction: [],
      timeStamp: 0,
      count: 0,
      showCaseMore: false,
      showCaseData: [],
      annexVisible: false, // 上传附件弹窗
      annexData: '',
      url: '', // 上传附件url
      type: '',
      annexDetailVisible: false, // 附件详情弹窗
      attrachment: '',
      upLoadText: {}, // 上传时附带的额外参数
      fileList: [],
      listData: '',
      // 备注
      inputValueArr: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ]
    }
  },
  methods: {
    shouPointer (row, col, cell, evn) {
      cell.style.cursor = 'pointer'
    },
    getInputValue(evn, index) {
      // console.log(evn)
      // console.log(index)
      // console.log(this.inputValueArr[index])
    },
    seeCaseMore(val) {
      this.showCaseData = []
      this.showCaseData = val
      this.showCaseMore = true
    },
    openDialog(rowData) {
      getCaseExecuteResultHistoryPower({
        taskId: this.$route.query.taskId,
        caseId: rowData.caseId,
        accountName:
          localStorage.getItem('accountName') ||
          sessionStorage.getItem('accountName')
      }).then(
        res => {
          if (res.state === 1000) {
            this.gridData = res.data.history
            this.seeAllUserStatus = true
          } else {
            this.$message.error(res.message)
          }
        },
        rej => {
          this.$message.error('网络错误')
        }
      )
    },
    // 批量执行
    handClick(command) {
      if (this.multipleAction.length > 0) {
        let caseIdArr = this.multipleAction.map(ele => ele.caseId).join(',')
        let params = {
          caseId: caseIdArr,
          taskId: this.$route.query.taskId,
          accountName:
            localStorage.getItem('accountName') ||
            sessionStorage.getItem('accountName'),
          status: command
        }
        let paramsNew = new FormData()
        paramsNew.append('caseId', params.caseId)
        paramsNew.append('taskId', params.taskId)
        paramsNew.append('accountName', params.accountName)
        paramsNew.append('status', params.status)
        updateCaseResultPower(paramsNew).then(
          res => {
            if (res.state === 1000) {
              this.$message.success(res.message)
              this.discriminate()
            } else {
              this.$message.error(res.message)
            }
          },
          rej => {
            this.$message.error('网络错误')
          }
        )
      }
    },
    // 多选
    handleSelectionChange(selection) {
      this.multipleAction = selection
    },
    // 更改测试结果
    changeResult(index, rowData, action) {
      // console.log(this.inputValueArr[index])
      let params = {
        caseId: rowData.caseId,
        taskId: this.$route.query.taskId,
        accountName:
          localStorage.getItem('accountName') ||
          sessionStorage.getItem('accountName'),
        status: action,
        remark: this.inputValueArr[index]
      }
      let paramsNew = new FormData()
      paramsNew.append('caseId', params.caseId)
      paramsNew.append('taskId', params.taskId)
      paramsNew.append('accountName', params.accountName)
      paramsNew.append('status', params.status)
      paramsNew.append('remark', params.remark)
      updateCaseResultPower(paramsNew).then(
        res => {
          if (res.state === 1000) {
            this.$message.success(res.message)
            this.discriminate()
            this.inputValueArr = [
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              ''
            ]
          } else {
            this.$message.error(res.message)
          }
        },
        rej => {
          this.$message.error('网络错误')
        }
      )
    },
    // 任务执行
    jumpToexecuteMission(rowData) {
      this.$router.replace({
        path: '/excuteMission'
      })
    },
    // 编辑任务
    editMission(rowData) {
      this.$router.replace({
        path: '/createmission',
        query: {
          from: this.tabName,
          action: '1',
          taskName: rowData.taskName,
          taskDesc: rowData.taskDesc,
          startTime: rowData.startTime,
          endTime: rowData.endTime,
          versionName: rowData.belongVersion,
          versionId: rowData.versionId,
          projectName: rowData.belongProject,
          projectId: rowData.projectId,
          id: rowData.taskId
        }
      })
    },
    // 终止
    stopStatus(rowData) {
      stopTaskPower({ taskId: rowData.taskId }).then(
        res => {
          if (res.state === 1000) {
            setTimeout(() => {
              this.discriminate()
            }, 500)
          } else {
            this.$message.error(res.message)
          }
        },
        rej => {
          this.$message.error('网络错误')
        }
      )
    },
    seeTestPeopleStatus(rowData) {
      getTaskAllParticipantStatusPower({ taskId: rowData.task }).then(
        res => {
          if (res.state === 1000) {
            let tempData = res.data.participant
            this.gridData = tempData.map(ele => {
              return {
                accountName: ele.realName + '(' + ele.accountName + ')',
                status: ele.status,
                delayDays: ele.delayDays,
                color: ele.color
              }
            })
            this.seeAllUserStatus = true
          } else {
            this.$message.error(res.message)
          }
        },
        rej => {
          this.$message.error('网络错误')
        }
      )
    },
    // 进行中鼠标悬停
    goingMouseenter(event) {
      event.target.style.cursor = 'pointer'
      this.goingMouseenterContent = event.target.innerHTML
      event.target.innerHTML = '完成编写'
      event.target.style.color = '#409EFF'
    },
    // 进行中鼠标移出
    goingMouseleave(event) {
      if (this.mouseleave) {
        event.target.innerHTML = this.goingMouseenterContent
        this.goingMouseenterContent = ''
        event.target.style.color = ''
        event.target.style.cursor = ''
      }
    },
    // 进行中鼠标悬停点击
    goingClick(rowData, event) {
      this.mouseleave = false
      updateTaskProgressPower({
        taskId: rowData.taskId,
        accountName:
          localStorage.getItem('accountName') ||
          sessionStorage.getItem('accountName'),
        status: '完成',
        delayDays: ''
      }).then(
        res => {
          if (res.state === 1000) {
            this.discriminate()
          } else {
            this.$message.error(res.message)
          }
        },
        rej => {
          this.$message.error('网络错误')
        }
      )
    },
    delayMouseenter(event) {
      event.target.style.cursor = 'pointer'
      this.goingMouseenterContent = event.target.innerHTML
      event.target.innerHTML = '完成编写'
      event.target.style.color = '#409EFF'
    },
    delayMouseleave(event) {
      if (this.mouseleave) {
        event.target.innerHTML = this.goingMouseenterContent
        this.goingMouseenterContent = ''
        event.target.style.color = 'red'
        event.target.style.cursor = ''
      }
    },
    delayClick(rowData, event) {
      this.mouseleave = false
      updateTaskProgressPower({
        taskId: rowData.taskId,
        accountName:
          localStorage.getItem('accountName') ||
          sessionStorage.getItem('accountName'),
        status: '延期',
        delayDays: rowData.delayDays
      }).then(
        res => {
          if (res.state === 1000) {
            this.tableData = []
            this.$nextTick(() => {
              this.discriminate()
            })
          } else {
            this.$message.error(res.message)
          }
        },
        rej => {
          this.$message.error('网络错误')
        }
      )
    },
    discriminate() {
      if (this.tabName === 'zhunbei') {
        this.initDataZhunBei({
          accountName:
            localStorage.getItem('accountName') ||
            sessionStorage.getItem('accountName'),
          taskId: this.$route.query.taskId,
          caseName: this.caseName,
          startNumber: this.startNum,
          range: this.range,
          caseLevel: this.caseLevel,
          caseAuto: this.caseAuto
        })
      }
      if (this.tabName === 'yijing') {
        this.initDataYiJing({
          accountName:
            localStorage.getItem('accountName') ||
            sessionStorage.getItem('accountName'),
          taskId: this.$route.query.taskId,
          caseName: this.caseName,
          startNumber: this.startNum,
          range: this.range,
          caseLevel: this.caseLevel,
          caseAuto: this.caseAuto,
          taskResult: this.taskResult
        })
      }
    },
    search() {
      this.startNum = 1
      this.discriminate()
    },
    createMission() {
      this.$router.replace({
        path: '/createMission',
        query: {
          from: this.tabName,
          action: '0'
        }
      })
    },
    getTime(val) {
      if (val === null) {
        this.searchTime = ''
      } else {
        if (Date.parse(val[1]) - Date.parse(val[0]) > 3600 * 1000 * 24 * 90) {
          this.$message.error('时间范围不能超过三个月！')
          this.searchTime = ''
        } else {
          this.searchTime = val
        }
      }
    },
    // 查看统计信息
    seeStatisticalMessage(rowData) {
      let data = {
        taskId: rowData.taskId
      }
      getTaskStatisticInfoPower(data).then(
        res => {
          if (res.state === 1000) {
            this.seeTestPeopleData = res.data.caseExecutionStatistic
            this.seeMoreUser = true
          } else {
            this.$message.error(res.message)
          }
        },
        rej => {
          this.$message.error('网络错误')
        }
      )
    },
    editVersion(rowData) {
      this.$router.replace({
        path: '/createVersion',
        query: {
          from: this.tabName,
          action: '1',
          projectName: this.$route.query.projectName,
          projectId: this.$route.query.projectId,
          versionId: rowData.versionId,
          versionName: rowData.versionName,
          versionDesc: rowData.versionDesc,
          startTime: rowData.startTime,
          endTime: rowData.endTime
        }
      })
    },
    rangeChange(range) {
      this.range = range
      this.discriminate()
    },
    startNumChange(count) {
      this.startNum = count
      this.discriminate()
    },
    initDataZhunBei(data) {
      getCaseToExecutePower(data).then(
        res => {
          if (res.state === 1000) {
            this.tableData = res.data.assignedCases && res.data.assignedCases.map((item, index) => {
              return {
                attrachment: item.attrachment,
                belongRepository: item.belongRepository,
                caseData: item.caseData,
                caseDesc: item.caseDesc,
                caseId: item.caseId,
                caseName: item.caseName,
                caseNumber: item.caseNumber,
                caseStep: item.caseStep,
                caseSuiteName: item.caseSuiteName,
                expectResult: item.expectResult,
                path: item.path,
                precondition: item.precondition,
                taskResult: item.taskResult,
                index
              }
            })
            this.total = res.data.total
            this.listData = (this.tableData && this.tableData[0]) || ''
          } else {
            this.$message.error(res.message)
          }
        },
        rej => {
          this.$message.error('网络错误')
        }
      )
    },
    initDataYiJing(data) {
      getCaseExecutedPower(data).then(
        res => {
          if (res.state === 1000) {
            this.tableData = res.data.assignedCases && res.data.assignedCases.map((item, index) => {
              return {
                attrachment: item.attrachment,
                belongRepository: item.belongRepository,
                caseData: item.caseData,
                caseDesc: item.caseDesc,
                caseId: item.caseId,
                caseName: item.caseName,
                caseNumber: item.caseNumber,
                caseStep: item.caseStep,
                caseSuiteName: item.caseSuiteName,
                expectResult: item.expectResult,
                path: item.path,
                precondition: item.precondition,
                taskResult: item.taskResult,
                index
              }
            })
            this.total = res.data.total
            this.listData = (this.tableData && this.tableData[0]) || ''
          } else {
            this.$message.error(res.message)
          }
        },
        rej => {
          this.$message.error('网络错误')
        }
      )
    },
    // 失败阻塞的方法
    fail(type) {
      this.annexVisible = true
      // this.annexData = listData
      this.type = type
    },
    // 点击附件详情
    annexDetail(val) {
      this.annexDetailVisible = true
      this.attrachment = val
    },
    upLoadFile() {
      this.upLoadText = {
        caseId: this.listData.caseId,
        taskId: this.$route.query.taskId,
        accountName:
          localStorage.getItem('accountName') ||
          sessionStorage.getItem('accountName'),
        status: this.type
      }
    },
    // 检测文件变动获取文件
    fileChange(file, fileList) {
      this.fileList = fileList
    },
    // 检测文件删除
    fileRemove(file, fileList) {
      this.fileList = fileList
    },
    // 文件上传后提示
    uploadSuccess(response) {
      if (response.state === 1000) {
        this.$message({
          showClose: true,
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: response.message,
          type: 'error'
        })
      }
    },
    changeFailResult(index, rowData, action, event) {
      let params = {
        caseId: rowData.caseId,
        taskId: this.$route.query.taskId,
        accountName:
          localStorage.getItem('accountName') ||
          sessionStorage.getItem('accountName'),
        status: action,
        remark: this.inputValueArr[index],
        fileList: this.fileList
      }
      let paramsNew = new FormData()
      paramsNew.append('caseId', params.caseId)
      paramsNew.append('taskId', params.taskId)
      paramsNew.append('accountName', params.accountName)
      paramsNew.append('status', params.status)
      paramsNew.append('remark', params.remark)
      params.fileList && params.fileList.forEach(file => {
        const size = file.raw.size / 1024 / 1024 < 5
        if (!size) {
          this.$message.error(`${file.raw.name}大小超过5m`)
          return
        }
        paramsNew.append('file', file.raw)
      })
      updateCaseResultPower(paramsNew).then(
        res => {
          if (res.state === 1000) {
            this.$message.success(res.message)
            this.discriminate()
            this.inputValueArr = [
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              ''
            ]
          } else {
            this.$message.error(res.message)
          }
        },
        rej => {
          this.$message.error('网络错误')
        })
      this.annexVisible = false
      this.$refs.upload.clearFiles()
      this.fileList = []
    },
    rowClick(row) {
      this.listData = row
    }
  },
  created() {
    this.discriminate()
    this.url = baseUrl + '/open/task/updateCaseResult.action'
  }
}
</script>

<style scoped>
.excuteMissionListApp {
  width: 100%;
}
.container {
  display: flex;
}
.containerRight {
  /* flex: 1; */
  /* min-height: 700px; */
  width: 60%;
  margin-left: 10px;
  overflow: auto;
}
.handleButton {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.handleButton .el-button {
  margin: 0 0 10px 10px;
}
.excuteMissionListApp > .search {
  width: 100%;
  position: relative;
  margin-bottom: 10px;
}
.excuteMissionListApp > .search > .el-input {
  width: 150px;
  margin-right: 20px;
}
.excuteMissionListApp > .search > .block {
  display: inline-block;
  margin-right: 20px;
}
.excuteMissionListApp > .search > .el-dropdown {
  position: absolute;
  right: 0px;
  width: 130px;
  text-align: center;
}
.excuteMissionListApp > .search > .el-button:nth-last-of-type(1) {
  position: absolute;
  right: 128px;
}
.excuteMissionListApp > .el-table {
  margin-top: 10px;
}
/* 标题 */
.excuteMissionListApp
  > .el-table
  > .el-table__header-wrapper
  > .el-table__header
  > .has-gutter
  > tr
  > th {
  padding: 8.5px 0px;
}
.excuteMissionListApp
  > .el-table
  > .el-table__body-wrapper
  > .el-table__body
  > tbody
  > tr
  > td {
  padding: 4.5px 0px;
}
.excuteMissionListApp > .el-pagination {
  margin-top: 10px;
}
.excuteMissionListApp
  > .seeTestPeople
  > .el-dialog
  > .el-dialog__body
  > .el-table
  > .el-table__header-wrapper
  > .el-table__header
  > thead
  > tr
  > th {
  padding: 8.5px 0px;
}
.excuteMissionListApp
  > .seeTestPeople
  > .el-dialog
  > .el-dialog__body
  > .el-table
  > .el-table__body-wrapper {
  min-height: 50px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
}
.excuteMissionListApp
  > .seeTestPeople
  > .el-dialog
  > .el-dialog__body
  > .el-table
  > .el-table__body-wrapper
  > .el-table__body
  > tbody
  > tr
  > td {
  padding: 13px 0px;
}
.excuteMissionListApp
  > .allUserStatus
  > .el-dialog
  > .el-dialog__body
  > .el-table
  > .el-table__header-wrapper
  > .el-table__header {
  width: 100%;
}
.excuteMissionListApp
  > .allUserStatus
  > .el-dialog
  > .el-dialog__body
  > .el-table
  > .el-table__header-wrapper
  > .el-table__header
  > .has-gutter
  > tr
  > th {
  width: 50%;
}
.excuteMissionListApp
  > .allUserStatus
  > .el-dialog
  > .el-dialog__body
  > .el-table
  > .el-table__body-wrapper {
  min-height: 40px;
  max-height: 200px;
  overflow-y: auto;
}
.excuteMissionListApp .seeMoreCase ul {
  list-style: none;
  /* background-color: #ccc; */
}
.excuteMissionListApp .seeMoreCase ul > li {
  font-size: 16px;
  margin-bottom: 20px;
  /* border-bottom: 1px solid #ccc */
}
.excuteMissionListApp .seeMoreCase ul > li > span:nth-of-type(1) {
  font-weight: 600;
}
.blockImg {
  display: flex;
  justify-content: center;
  height: 100%;
}
.el-row {
  border: 1px solid #ebeef5;
  display: flex;
  align-items: center;
}
.bg-purple-light {
  border-left: 1px solid #ebeef5;
  justify-content: center;
}
.grid-content {
  min-height: 57px;
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  text-align: center;
}
.bg-purple {
  justify-content: center;
}
.box-card {
  width: 100%;
}
</style>
