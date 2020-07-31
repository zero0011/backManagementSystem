<template>
  <div class="joinApp">
    <!-- 搜索 -->
    <div class="search">
      <el-input v-model="name" placeholder="用例集名称"></el-input>
      <el-input v-model="createAccountName" placeholder="创建人域账号"></el-input>
      <div class="block">
        <el-date-picker v-model="searchTime"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        @change="getTime">
        </el-date-picker>
      </div>
      <el-button type="primary" @click="search">查询</el-button>
      <!-- <el-button type="primary"><a href="http://10.64.152.17:8082/download/%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E6%A8%A1%E7%89%881.xlsx" download="模板.xlsx" style="text-decoration: none;color: #fff">下载模板</a></el-button> -->
      <el-button type="primary" @click="showDownloadDialog">下载模板</el-button>
      <el-button type="primary" @click="createUseCaseManagment">创建用例集</el-button>
    </div>
    <!-- 列表 -->
    <!-- <el-table :data="tableData" border style="width: 100%" max-height="547"> -->
    <el-table :data="tableData" border style="width: 100%" :header-cell-style="{background:'rgb(250, 250, 250)'}">
      <el-table-column fixed prop="caseSuiteName" label="用例集名称" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button @click="jumpToUseCaseLibrary(scope.row)" type="text" size="small">{{ scope.row.caseSuiteName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="caseSuiteDesc" label="用例集描述" width="145" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="110" align="center" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="110" align="center" sortable show-overflow-tooltip></el-table-column>
      <!-- <el-table-column prop="status" label="进度" width="90" align="center"> -->
        <!-- 未开始/进行中/完成/延期 -->
        <!-- <template slot-scope="scope">
          <template v-if="scope.row.status === null">
            <span v-if="Date.parse(scope.row.startTime + ' 00:00:00') > currentTime">{{ neverStart }}</span>
            <span v-if="(Date.parse(scope.row.startTime + ' 00:00:00') < currentTime) && (Date.parse(scope.row.endTime + ' 23:59:59') > currentTime)"
                  @mouseenter="mouseenterEvent"
                  @mouseleave="mouseleaveEvent"
                  @click="finishWrite(scope.row, $event)"
                  :class="changeColor">
              {{ process }}</span>
            <span style="color: red" v-if="Date.parse(scope.row.endTime + ' 23:59:59') < currentTime"
                  @mouseenter="mouseenterEventS(scope.row, $event)"
                  @mouseleave="mouseleaveEventS(scope.row, $event)"
                  @click="finishDelay(scope.$index, scope.row, $event)"
                  :class="changeColor">
              {{ delay + '(' + Math.ceil((currentTime - Date.parse(scope.row.endTime + ' 23:59:59')) / 1000 / 60 / 60 / 24) + ')'}}
            </span>
          </template>
          <template v-else>
            <span v-if="(scope.row.status === '完成') && (scope.row.delayDays === 0)">完成</span>
            <span style="color: red" v-if="(scope.row.status === '完成') && (scope.row.delayDays > 0)">{{ '完成' + '(' + scope.row.delayDays + ')'}}</span>
          </template>
        </template>
      </el-table-column> -->
      <el-table-column prop="caseTotalNumber" label="用例数" width="70" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="belongProject" label="所属项目" width="130" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="creator" label="创建人" width="140" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" align="center" sortable show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-dropdown placement="bottom">
            <span class="el-dropdown-link">...</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="jumpToUseCaseLibraryTwo(scope.row)">创建用例</el-dropdown-item>
              <el-dropdown-item @click.native="preUpload(scope.row)">导入</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button @click="jumpToUseCaseLibraryTwo(scope.row)" type="text" size="small">创建用例</el-button>
          <el-button @click="preUpload(scope.row)" type="text" size="small">导入</el-button> -->
          <!-- <el-upload class="upload-demo"
               :action="url"
               :show-file-list="false"
               accept=".xlsx,.xls"
               :before-upload="beforeUploadFile"
               :on-success="uploadSuccess"
               :data='upLoadText'
               style="display: inline-block">
            <el-button size="text" type="small" @click="upLoadFile(scope.row)">导入</el-button>
          </el-upload> -->
          <!-- <el-button type="text" size="small">
            <a href="/static/img/a.f26fc60.jpg" download="模板.jpg" style="text-decoration: none;color: #409EFF">导出</a>
            <a style="text-decoration: none;color: #409EFF">导出</a>
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :current-page.sync="startNum"
                   :page-sizes="[5, 10, 20]"
                   :page-size="range"
                   :total="total"
                   layout="total, sizes, prev, pager, next"
                   @size-change="rangeChange"
                   @current-change="startNumChange">
    </el-pagination>
    <!-- 点击上传的弹窗 -->
    <el-dialog title="用例导入" :visible.sync="dialogCaseVisible" class="dialogCaseVisible">
      <div>
        <el-upload class="upload-demo"
                   :action="url"
                   :show-file-list="false"
                   accept=".xlsx,.xls"
                   :before-upload="beforeUploadFile"
                   :on-success="uploadSuccess"
                   :data='upLoadText'
                   style="display: inline-block">
          <el-button type="primary" @click="upLoadFile()">xls格式</el-button>
        </el-upload>
        <!-- <el-button type="primary">xls格式</el-button> -->
        <span>请首先下载xls格式的导入模板导入</span>
      </div>
      <div>
        <ul>
          <li>用例导入说明：</li>
          <li>1、请务必先下载导入模板，并直接使用模板进行用例数据的编辑，否则可能会导入失败</li>
          <li>2、"版本信息"sheet页的"版本标题"是本次导入的所有用例的根节点</li>
          <li>3、"用例及模块信息"sheet页的结构树列的红点数目表示了用例的层次结构，请务必仔细核对，否则将导入失败</li>
          <li>4、"模块名称"列，如果填入值，表示此行数据为模块，那么本行的其他字段不可再填入信息</li>
          <li>5、"用例名称"列，如果填入值，表示此行数据为用例，那么本行的"模块名称"不可再填入信息</li>
          <li>6、"是否合并"列，如果选择T，则表示此条用例是否可以被合并到回归库中，选择F，则不会进行合并</li>
          <li>7、带*号的列，为必填项，不可为空值</li>
          <li>8、目前仅支持一次性导入用例，不支持增量导入</li>
          <li>9、一次性导入，最多导入数据量为3000行（包含模块行）</li>
          <li>10、暂不支持非文本类型的数据，如图片、附件等内容</li>
        </ul>
        <!-- <p>
          <span style="font-weight: 700;font-size: 16px">用例导入说明：</span>
          <div>1、请务必先下载导入模板，并直接使用模板进行用例数据的编辑，否则可能会导入失败</div>
          <div>2、"版本信息"sheet页的"版本标题"是本次导入的所有用例的根节点</div>
          <div>3、"用例及模块信息"sheet页的结构树列的红点数目表示了用例的层次结构，请务必仔细核对，否则将导入失败</div>
          <div>4、"模块名称"列，如果填入值，表示此行数据为模块，那么本行的其他字段不可再填入信息</div>
          <div>5、"用例名称"列，如果填入值，表示此行数据为用例，那么本行的"模块名称"不可再填入信息</div>
          <div>6、"是否合并"列，如果选择T，则表示此条用例是否可以被合并到回归库中，选择F，则不会进行合并</div>
          <div>7、带*号的列，为必填项，不可为空值</div>
          <div>8、目前仅支持一次性导入用例，不支持增量导入</div>
          <div>9、一次性导入，最多导入数据量为3000行（包含模块行）</div>
          <div>10、暂不支持非文本类型的数据，如图片、附件等内容</div>
        </p> -->
        <!-- <el-button type="primary">testlink格式</el-button>
        <span>请首先从testlink导出用例数据。注意：不要对数据做任何的修改</span> -->
      </div>
    </el-dialog>
    <!-- 点击下载模板的弹窗 -->
    <el-dialog title="下载模板" :visible.sync="dialogDownLoad" class="dialogDownLoad">
      <div>
        <el-button type="primary"><a :href="dialogDownLoadPath.fullImportCaseTempleteUrl" download="模板.xlsx" style="text-decoration: none;color: #fff">全量导入模板</a></el-button>
        <el-button type="primary"><a :href="dialogDownLoadPath.incrementImportCaseTempleteUrl" download="模板.xlsx" style="text-decoration: none;color: #fff">增量导入模板</a></el-button>
        <!-- <el-upload class="upload-demo"
                   :action="url"
                   :show-file-list="false"
                   accept=".xlsx,.xls"
                   :before-upload="beforeUploadFile"
                   :on-success="uploadSuccess"
                   :data='upLoadText'
                   style="display: inline-block">
          <el-button type="primary" @click="upLoadFile()">xls格式</el-button>
        </el-upload>
        <span>请首先下载xls格式的导入模板导入</span> -->
      </div>
      <div>
        <ul>
          <li>用例模版说明：</li>
          <li>1、全量导入模板：只能用于对整个版本库的用例进行导入，导入的入口为：“用例管理”-"我创建/参与的用例集"-"操作"-"导入”按钮</li>
          <li>2、增量导入模板：只能用于单个模块下的用例导入，导入入口为：“用例管理”-"我创建/参与的用例集"-"创建用例"，进入用例树，右击任意模块节点，即可看到"导入用例"</li>
          <!-- <li>用例导入说明：</li>
          <li>1、请务必先下载导入模板，并直接使用模板进行用例数据的编辑，否则可能会导入失败</li>
          <li>2、"版本信息"sheet页的"版本标题"是本次导入的所有用例的根节点</li>
          <li>3、"用例及模块信息"sheet页的结构树列的红点数目表示了用例的层次结构，请务必仔细核对，否则将导入失败</li>
          <li>4、"模块名称"列，如果填入值，表示此行数据为模块，那么本行的其他字段不可再填入信息</li>
          <li>5、"用例名称"列，如果填入值，表示此行数据为用例，那么本行的"模块名称"不可再填入信息</li>
          <li>6、"是否合并"列，如果选择T，则表示此条用例是否可以被合并到回归库中，选择F，则不会进行合并</li>
          <li>7、带*号的列，为必填项，不可为空值</li>
          <li>8、目前仅支持一次性导入用例，不支持增量导入</li>
          <li>9、一次性导入，最多导入数据量为3000行（包含模块行）</li>
          <li>10、暂不支持非文本类型的数据，如图片、附件等内容</li> -->
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCaseSuiteByParticipantPower, updateSuiteStatusByUserPower, getImportTempleteUrl } from '../../api/api'
import { baseUrl } from '../../util/http.js'
export default {
  data () {
    return {
      name: '',
      createAccountName: '',
      searchTime: null,
      trueSearchTime: ['', ''],
      startNum: 1,
      range: 10,
      currentTime: new Date(),
      total: null,
      neverStart: '未开始',
      process: '进行中',
      delay: '延期',
      delayDay: '',
      changeColor: {
        color: false
      },
      tableData: [],
      upLoadText: {},
      url: '',
      fileName: '',
      dialogCaseVisible: false,
      preUploadData: {},
      dialogDownLoad: false,
      dialogDownLoadPath: ''
    }
  },
  methods: {
    // 获取下载全量文档，增量文档的地址
    showDownloadDialog () {
      getImportTempleteUrl({})
        .then(res => {
          if (res.state === 1000) {
            // console.log(res.data.downLoadPath)
            this.dialogDownLoadPath = res.data.downLoadPath
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('获取下载地址失败，请稍后再试')
        })
      this.dialogDownLoad = true
    },
    preUpload (rowData) {
      // console.log(rowData)
      this.preUploadData = rowData
      this.dialogCaseVisible = true
    },
    uploadSuccess (response, file, fileList) {
      if (response.state === 1000) {
        this.$message({
          showClose: true,
          message: '导入成功',
          type: 'success'
        })
        this.dialogCaseVisible = false
        this.initTableData()
      } else {
        if (response.state === 3039) {
          this.$message.warning(response.message)
          this.dialogCaseVisible = false
        } else {
          this.$message({
            showClose: true,
            message: response.message,
            type: 'error'
          })
          this.dialogCaseVisible = false
        }
      }
    },
    beforeUploadFile (file) {
      this.fileName = file.name.slice(0, file.name.lastIndexOf('.'))
      const fileSize = file.size / 10 / 1024 / 1024 < 3
      const fileType = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!fileSize) {
        this.$message.error('上传文件大小不能超过30MB!')
      }
      if (!fileType) {
        this.$message.error('上传文件只能是excel表')
      }
      this.upLoadText.fileName = this.fileName
      return fileSize && fileType
    },
    upLoadFile () {
      this.upLoadText = {
        creator: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        caseSuiteId: this.preUploadData.caseSuiteId,
        fileName: '',
        nodeId: ''
      }
    },
    // 点击创建用例跳转到用例库
    jumpToUseCaseLibraryTwo (rowData) {
      this.$router.push({
        path: '/usecaselibrary',
        query: {
          behaviour: 'all',
          label: rowData.caseSuiteName,
          caseSuiteId: rowData.caseSuiteId,
          caseSuiteDesc: rowData.caseSuiteDesc,
          startTime: rowData.startTime,
          endTime: rowData.startTime,
          from: 'join'
        }
      })
    },
    // 点击用例集跳转到用例库
    jumpToUseCaseLibrary (rowData) {
      this.$router.push({
        path: '/usecaselibrary',
        query: {
          behaviour: 'see',
          label: rowData.caseSuiteName,
          caseSuiteId: rowData.caseSuiteId,
          caseSuiteDesc: rowData.caseSuiteDesc,
          startTime: rowData.startTime,
          endTime: rowData.startTime,
          from: 'join'
        }
      })
    },
    initTableData () {
      this.getJoinTableData()
    },
    getJoinTableData () {
      let data = {
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        startNum: this.startNum,
        range: this.range,
        caseSuiteName: this.name,
        createAccountName: this.createAccountName,
        startTime: this.trueSearchTime[0],
        endTime: this.trueSearchTime[1]
      }
      // 获取列表数据
      getCaseSuiteByParticipantPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = []
            this.tableData = res.data.caseSuiteList
            this.total = res.data.total
            // if (this.total > 0) {
            //   this.startSetInterval()
            // }
          } else {
            this.errorAjax()
          }
        }, rej => {
          // 测试数据
          this.errorAjax()
        })
    },
    // startSetInterval () {
    //   setInterval(() => {
    //     getCurrentTimePower({})
    //       .then(res => {
    //         if (res.state === 1000) {
    //           this.currentTime = Date.parse(res.data.currentTime)
    //         } else {
    //         }
    //       }, rej => {
    //       })
    //   }, 3600000)
    // },
    errorAjax () {
      this.$message({
        type: 'error',
        message: '网络异常',
        duration: 1000
      })
    },
    getTime (formatTimeArray) {
      if (formatTimeArray === null) {
        this.searchTime = ['', '']
        this.trueSearchTime = ['', '']
      } else {
        // 如果年份相同
        if (new Date(Object.values(formatTimeArray)[1]).getFullYear() === new Date(Object.values(formatTimeArray)[0]).getFullYear()) {
          if (new Date(Object.values(formatTimeArray)[1]).getMonth() - new Date(Object.values(formatTimeArray)[0]).getMonth() > 3) {
            this.$message({
              type: 'error',
              message: '日期范围三个月内',
              duration: 2000
            })
            this.searchTime = ['', '']
          } else {
            this.trueSearchTime = []
            for (var k in formatTimeArray) {
              this.trueSearchTime.push(formatTimeArray[k])
            }
          }
        } else {
          if (new Date(Object.values(formatTimeArray)[1]).getFullYear() - new Date(Object.values(formatTimeArray)[0]).getFullYear() >= 2) {
            this.$message({
              type: 'error',
              message: '日期范围三个月内',
              duration: 2000
            })
            this.searchTime = ['', '']
          } else {
            if (new Date(Object.values(formatTimeArray)[1]).getMonth() - new Date(Object.values(formatTimeArray)[0]).getMonth() + 12 > 3) {
              this.$message({
                type: 'error',
                message: '日期范围三个月内',
                duration: 2000
              })
              this.searchTime = ['', '']
            } else {
              this.trueSearchTime = []
              for (var l in formatTimeArray) {
                this.trueSearchTime.push(formatTimeArray[l])
              }
            }
          }
        }
      }
    },
    search () {
      this.startNum = 1
      this.initTableData()
    },
    rangeChange (range) {
      this.range = range
      this.initTableData()
    },
    startNumChange (startNum) {
      this.startNum = startNum
      this.initTableData()
    },
    mouseenterEvent (event) {
      event.target.innerHTML = '完成编写'
      event.target.style.color = '#409EFF'
      event.target.style.cursor = 'pointer'
    },
    mouseleaveEvent (event) {
      event.target.innerHTML = '进行中'
      event.target.style.color = '#000'
    },
    // 规定期间内点击完成编写
    finishWrite (rowData, event) {
      let data = {
        caseSuiteId: rowData.caseSuiteId,
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        caseSuiteStatus: '完成'
      }
      updateSuiteStatusByUserPower(data)
        .then(res => {
          if (res.state === 1000) {
            setTimeout(() => {
              this.initTableData()
            }, 500)
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
    },
    mouseenterEventS (rowData, event) {
      if (rowData.status === null) {
        this.delayDay = event.target.innerHTML.trim()
        event.target.innerHTML = '完成编写'
        event.target.style.color = '#409EFF'
        event.target.style.cursor = 'pointer'
      } else {
        return false
      }
    },
    mouseleaveEventS (rowData, event) {
      if (rowData.status === null) {
        event.target.innerHTML = this.delayDay
        event.target.style.color = 'red'
      }
    },
    // 延期点击完成编写
    finishDelay (index, rowData, event) {
      let data = {
        caseSuiteId: rowData.caseSuiteId,
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        caseSuiteStatus: '完成'
      }
      updateSuiteStatusByUserPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.$nextTick(() => {
              this.tableData[index].status = '完成'
              event.target.style.color = 'red'
              event.target.innerHTML = '完成' + this.delayDay.split('(')[1].split(')')[0]
              this.initTableData()
            })
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
    },
    seeMembers () {
    },
    // 创建用例集
    createUseCaseManagment () {
      this.$router.push({
        path: '/createusecasemanagment',
        query: {
          activeName: 'join',
          action: ''
        }
      })
    }
  },
  created () {
    this.url = baseUrl + '/open/case/importCaseByExcel.action'
    if (this.$route.query.reCreate === true) {
      this.$router.push({
        path: '/createusecasemanagment',
        query: {
          activeName: 'join',
          action: ''
        }
      })
    } else {
      this.initTableData()
    }
  },
  mounted () {
  }
}
</script>

<style>
.joinApp {
  width: 100%
}
.joinApp > .search {
  width: 100%
}
.joinApp > .search > .el-input {
  width: 150px;
  margin-right: 20px
}
.joinApp > .search > .block {
  display: inline-block;
  margin-right: 64px
}
.joinApp > .search > .el-button {
  margin-right: 40px
}
.joinApp > .search > .el-button:nth-of-type(3) {
  margin-right: 0px
}
.joinApp > .el-table {
  margin-top: 10px
}
.joinApp > .el-pagination {
  margin-top: 10px
}
.joinApp .dialogCaseVisible .el-dialog__body > div:nth-of-type(1) {
  margin-bottom: 50px
}
.joinApp .dialogCaseVisible .el-dialog__body > div {
  padding: 10px 20px
}
.joinApp .dialogCaseVisible .el-dialog__body > div:nth-of-type(1) > .upload-demo {
  margin-right: 46.45px
}
.joinApp .dialogCaseVisible .el-dialog__body > div:nth-of-type(2) > ul {
  list-style: none
}
.joinApp .dialogCaseVisible .el-dialog__body > div:nth-of-type(2) > ul > li {
  /* margin-right: 20px */
  font-size: 16px;
  margin-bottom: 5px
}
.joinApp .dialogDownLoad > .el-dialog > .el-dialog__body > div {
  display: flex;
  justify-content: space-around
}
.joinApp .dialogDownLoad .el-dialog__body > div:nth-of-type(1) {
  margin-bottom: 50px
}
.joinApp .dialogDownLoad .el-dialog__body > div {
  padding: 10px 20px
}
.joinApp .dialogDownLoad .el-dialog__body > div:nth-of-type(1) > .upload-demo {
  margin-right: 46.45px
}
.joinApp .dialogDownLoad .el-dialog__body > div:nth-of-type(2) > .el-button {
  margin-right: 20px
}
.joinApp .dialogDownLoad .el-dialog__body > div:nth-of-type(2) > ul {
  list-style: none
}
.joinApp .dialogDownLoad .el-dialog__body > div:nth-of-type(2) > ul > li {
  font-size: 16px;
  margin-bottom: 5px
}
.el-dropdown{
  font-size: 24px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-dropdown-menu{
  width: 120px;
}
.el-table td{
  padding:12px 0;
}
</style>
