<template>
  <div class="caseCreateApp">
    <!-- 搜索 -->
    <div class="search">
      <el-input v-model="name" placeholder="用例集名称"></el-input>
      <el-input placeholder="创建人" v-show="false"></el-input>
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
      <!-- <el-table-column prop="status" label="成员进度" width="90" align="center" show-overflow-tooltip> -->
        <!-- 未开始/进行中/完成/延期 -->
        <!-- <template slot-scope="scope">
          <span v-if="scope.row.status === '未开始'" @click="seeMembersStatus(scope.row)" style="cursor: pointer">未开始</span>
          <span v-if="scope.row.status === '进行中'" @click="seeMembersStatus(scope.row)" style="cursor: pointer">进行中</span>
          <span v-if="(scope.row.status === '完成') && (scope.row.delayDays === 0)" @click="seeMembersStatus(scope.row)" style="cursor: pointer">完成</span>
          <span v-if="(scope.row.status === '完成') && (scope.row.delayDays > 0)" @click="seeMembersStatus(scope.row)" :style="'cursor: pointer;color: ' + scope.row.statusColor">完成({{ scope.row.delayDays }})</span>
          <span v-if="(scope.row.status === '延期') && (scope.row.delayDays > 0)" @click="seeMembersStatus(scope.row)" :style="'cursor: pointer;color: ' + scope.row.statusColor">延期({{ scope.row.delayDays }})</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="caseTotalNumber" label="用例数" width="70" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="belongProject" label="所属项目" width="130" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="creator" label="创建人" width="140" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" align="center" sortable show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom">
            <span class="el-dropdown-link">...</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="jumpToUseCaseLibraryTwo(scope.row)">创建用例</el-dropdown-item>
              <el-dropdown-item @click.native="transferCreator(scope.row)">转移</el-dropdown-item>
              <el-dropdown-item @click.native="editCreateCase(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="preUpload(scope.row)">导入</el-dropdown-item>
              <el-dropdown-item @click.native="deleteCreateCase(scope.row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button @click="jumpToUseCaseLibraryTwo(scope.row)" type="text" size="small">创建用例</el-button>
          <el-button @click="transferCreator(scope.row)" type="text" size="small">转移</el-button>
          <el-button @click="editCreateCase(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="preUpload(scope.row)" type="text" size="small">导入</el-button> -->
          <!-- <el-upload class="upload-demo"
                     :action="url"
                     :show-file-list="false"
                     accept=".xlsx,.xls"
                     :data='upLoadText'
                     :before-upload="beforeUploadFile"
                     :on-success="uploadSuccess"
                     style="display: inline-block">
            <el-button size="text" type="small" @click="upLoadFile(scope.row)">导入</el-button>
          </el-upload> -->
          <!-- <el-button type="text" size="small">
            <a href="/static/img/a.f26fc60.jpg" download="模板.jpg" style="text-decoration: none;color: #409EFF">导出</a>
            <a style="text-decoration: none;color: #409EFF">导出</a>
          </el-button> -->
          <!-- <el-button @click="deleteCreateCase(scope.row)" type="text" size="small">删除</el-button> -->
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
    <!-- 弹窗 -->
    <el-dialog title="" :visible.sync="seeAllUserStatus" class="allUserStatus">
      <el-table :data="gridData" border>
        <el-table-column prop="accountName" label="成员名称" align="center"></el-table-column>
        <el-table-column prop="status" label="成员状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '未开始'">未开始</span>
            <span v-if="scope.row.status === '进行中'">进行中</span>
            <span v-if="(scope.row.status === '完成') && (scope.row.delayDays === 0)">完成</span>
            <span v-if="(scope.row.status === '完成') && (scope.row.delayDays > 0)" style="color: red">{{ '完成' + '(' + scope.row.delayDays + ')' }}</span>
            <span v-if="(scope.row.status === '延期')" style="color: red">{{ '延期' + '(' + scope.row.delayDays + ')' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 点击导入的弹窗 -->
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
          <!-- <li>3、"用例及模块信息"sheet页的结构树列的红点数目表示了用例的层次结构，请务必仔细核对，否则将导入失败</li>
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
    <!-- 选择用户（单选） -->
    <el-dialog title="选择用户" :visible.sync="showSelectSingleUser" :before-close="beforecloseSingleUser">
      <div class="content" style="height: 500px;overflow-y: auto">
        <div class="department" style="width: 100%;margin-bottom: 30px" v-for="(val, key) in data2" :key="key">
          <div class="dep" style="font-size: 16px">{{ val.label }}</div>
          <div class="singleSel" style="width: 100%;display: flex;flex-wrap: wrap;margin-top: 10px">
            <div class="signle" style="display: inline-block;width: 25%;margin-bottom: 8px" v-for="(name, key2) in val.children" :key="key2">
              <template v-if="name.label === trueName">
                <input type="radio" name="name" class="singleSelect" :accountName="name.label + '(' + name.accountName + ')'" checked>&nbsp;{{ name.label + '(' + name.accountName + ')' }}
              </template>
              <template v-else>
                <input type="radio" name="name" class="singleSelect" :accountName="name.label + '(' + name.accountName + ')'">&nbsp;{{ name.label + '(' + name.accountName + ')' }}
              </template>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px;position: relative;height: 40px"><el-button type="primary" @click="getCheckedAccountName" style="position: absolute;right: 20px">确 定</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllProject, getCaseSuiteByCreatorPower, updateSuiteStatusByUserPower, deleteCaseSuitePower, getParticipantStatusBySuiteIdPower, updateCaseSuiteLabelPower, updateCaseSuiteUserPower, getImportTempleteUrl, getUserListPower, transferCaseSuite } from '../../api/api'
import { baseUrl } from '../../util/http.js'
export default {
  data () {
    return {
      name: '',
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
      gridData: [],
      seeAllUserStatus: false,
      changeColor: {
        color: false
      },
      tableData: [],
      upLoadText: {},
      fileName: '',
      url: '',
      fromProject: [],
      dialogCaseVisible: false,
      preUploadData: {},
      dialogDownLoad: false,
      dialogDownLoadPath: '',
      showSelectSingleUser: false,
      data2: []
    }
  },
  methods: {
    beforecloseSingleUser () {
      this.showSelectSingleUser = false
      setTimeout(() => {
        this.data2.splice(0, this.data2.length - 1)
      }, 300)
    },
    getCheckedAccountName () {
      let arr = document.getElementsByClassName('singleSelect')
      // console.log(arr)
      let newArr = Array.from(arr)
      // console.log(newArr)
      let str = ''
      newArr.forEach(ele => {
        if (ele.checked) {
          str = ele.attributes[2].nodeValue.split('(')[1].split(')')[0]
        }
      })
      transferCaseSuite({
        caseSuiteId: this.transProjectId,
        userAccount: str
      }).then(res => {
        if (res.state === 1000) {
          this.showSelectSingleUser = false
          setTimeout(() => {
            this.initTableData()
          }, 300)
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
      })
    },
    transferCreator (rowData) {
      console.log(rowData)
      this.transProjectId = rowData.caseSuiteId
      if (window.sessionStorage.getItem('userName')) {
        this.trueName = window.sessionStorage.getItem('userName')
      } else {
        this.trueName = window.localStorage.getItem('userName')
      }
      getUserListPower({
        startNum: 1,
        range: 0
      }).then(res => {
        if (res.state === 1000) {
          this.data2 = res.data.userList
        }
      })
      this.showSelectSingleUser = true
    },
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
      this.preUploadData = rowData
      this.dialogCaseVisible = true
    },
    // 获取所有的项目
    getAllProject () {
      let data = {
        accountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
        projectName: '',
        projectManager: '',
        creator: '',
        department: '',
        startTime: '',
        endTime: '',
        startNum: 1,
        range: 0
      }
      getAllProject(data)
        .then(res => {
          if (res.state === 1000) {
            this.fromProject = res.data.projectList.map(ele => {
              return {
                label: ele.projectName,
                value: ele.projectId
              }
            })
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('获取所有项目列表失败')
        })
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
          this.$message.warning('正在导入中，请稍后查看！')
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
      return fileSize && fileType
    },
    // nodeId为空是全量导入
    upLoadFile () {
      this.upLoadText = {
        creator: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        caseSuiteId: this.preUploadData.caseSuiteId,
        fileName: this.fileName,
        nodeId: ''
      }
    },
    jumpToUseCaseLibraryTwo (rowData) {
      this.$router.push({
        path: '/usecaselibrary',
        query: {
          behaviour: 'all',
          label: rowData.caseSuiteName,
          caseSuiteId: rowData.caseSuiteId,
          caseSuiteDesc: rowData.caseSuiteDesc,
          startTime: rowData.startTime,
          endTime: rowData.endTime,
          from: 'create'
        }
      })
    },
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
          from: 'create'
        }
      })
    },
    seeMembersStatus (rowData) {
      this.seeAllUserStatus = true
      getParticipantStatusBySuiteIdPower({caseSuiteId: rowData.caseSuiteId})
        .then(res => {
          if (res.state === 1000) {
            this.gridData = res.data.status
          }
        })
    },
    // 编辑用例集
    editCreateCase (rowData) {
      // 把项目名称改成项目id
      // console.log(rowData.belongProject)
      let arr = []
      let belongProjectId = ''
      arr = this.fromProject.map(ele => {
        return ele.label
      })
      // console.log(arr.indexOf(rowData.belongProject))
      if (arr.indexOf(rowData.belongProject) !== -1) {
        let index = arr.indexOf(rowData.belongProject)
        belongProjectId = this.fromProject[index].value
      }
      this.$router.push({
        path: '/createusecasemanagment',
        query: {
          activeName: 'create',
          action: 'edit',
          startTime: rowData.startTime,
          endTime: rowData.endTime,
          caseSuiteName: rowData.caseSuiteName,
          caseSuiteDesc: rowData.caseSuiteDesc,
          caseSuiteId: rowData.caseSuiteId,
          editType: rowData.editType,
          belongProject: belongProjectId,
          belongProjectName: rowData.belongProject
        }
      })
    },
    // 删除用例集
    deleteCreateCase (rowData) {
      this.$confirm('此操作将永久删除该用例集, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 先删用例集绑定的标签
        updateCaseSuiteLabelPower({
          labelNameList: '',
          caseSuiteId: rowData.caseSuiteId,
          accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
        }).then(res => {
          if (res.state === 1000) {
            // 删除用例集绑定的人员
            updateCaseSuiteUserPower({
              caseSuiteId: rowData.caseSuiteId,
              accountNameList: ''
            }).then(res => {
              if (res.state === 1000) {
                // 删除用例集
                deleteCaseSuitePower({
                  caseSuiteId: rowData.caseSuiteId,
                  createAccountName: window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName')
                }).then(res => {
                  if (res.state === 1000) {
                    this.initTableData()
                  } else if (res.state === 2029) {
                    this.$message.warning(res.message.split(',')[0])
                  } else {
                    this.$message({
                      type: 'error',
                      message: '删除用例集失败',
                      duration: 1000
                    })
                  }
                }, rej => {
                  this.errorAjax()
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '删除用例集绑定的成员失败',
                  duration: 1000
                })
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除用例集绑定的标签失败',
              duration: 1000
            })
          }
        }, rej => {
          this.errorAjax()
        })
      }).catch(() => {
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
        startTime: this.trueSearchTime[0],
        endTime: this.trueSearchTime[1]
      }
      // 获取列表数据
      getCaseSuiteByCreatorPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.getAllUserStatus()
            this.tableData = res.data.caseSuiteList
            this.total = res.data.total
            // if (this.total > 0) {
            //   this.startSetInterval()
            // }
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
    },
    // 获取创建者的所有成员的完成状态
    getAllUserStatus () {
    },
    // startSetInterval () {
    //   let clearInt
    //   clearInterval(clearInt)
    //   clearInt = setInterval(() => {
    //     getCurrentTimePower({})
    //       .then(res => {
    //         if (res.state === 1000) {
    //         } else {
    //         }
    //       }, rej => {
    //         this.errorAjax()
    //       })
    //   }, 60000)
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
      this.process = '完成编写'
      this.changeColor = {
        color: true
      }
    },
    mouseenterEventS (event) {
      this.delayDay = event.target.innerHTML
      event.target.innerHTML = '完成编写'
      event.target.style.color = '#409EFF'
      event.target.style.cursor = 'pointer'
    },
    mouseleaveEvent (event) {
      this.process = '进行中'
      this.changeColor = {
        color: false
      }
    },
    mouseleaveEventS (event) {
      event.target.innerHTML = this.delayDay
      event.target.style.color = 'red'
    },
    // 规定期间内点击完成编写
    finishWrite (rowData) {
      let data = {
        caseSuiteId: rowData.caseSuiteId,
        accountName: rowData.creator.split('(')[1].split(')')[0],
        caseSuiteStatus: '完成'
      }
      updateSuiteStatusByUserPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.initTableData()
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
    },
    // 延期点击完成编写
    finishDelay (rowData) {
      let data = {
        caseSuiteId: rowData.caseSuiteId,
        accountName: rowData.creator.split('(')[1].split(')')[0],
        caseSuiteStatus: String.trim(this.delayDay)
      }
      updateSuiteStatusByUserPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.initTableData()
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
    },
    seeMembers () {
    },
    createUseCaseManagment () {
      this.$router.push({
        path: '/createusecasemanagment',
        query: {
          activeName: 'create',
          action: ''
        }
      })
    }
  },
  created () {
    this.getAllProject()
    this.url = baseUrl + '/open/case/importCaseByExcel.action'
    if (this.$route.query.reCreate === true) {
      this.$router.push({
        path: '/createusecasemanagment',
        query: {
          activeName: 'create',
          action: ''
        }
      })
    } else {
      this.initTableData()
    }
  }
}
</script>

<style>
.caseCreateApp {
  width: 100%
}
.caseCreateApp > .search {
  width: 100%
}
.caseCreateApp > .search > .el-input {
  width: 150px;
  margin-right: 85px
}
.caseCreateApp > .search > .block {
  display: inline-block;
  margin-right: 150px
}
.caseCreateApp > .search > .el-button {
  margin-right: 50px
}
.caseCreateApp > .search > .el-button:nth-of-type(3) {
  margin-right: 0px
}
.caseCreateApp > .el-table {
  margin-top: 10px
}
.caseCreateApp > .el-pagination {
  margin-top: 10px
}
.caseCreateApp > .allUserStatus > .el-dialog > .el-dialog__body > .el-table > .el-table__header-wrapper > .el-table__header {
  width: 100%;
}
.caseCreateApp > .allUserStatus > .el-dialog > .el-dialog__body > .el-table > .el-table__header-wrapper > .el-table__header > .has-gutter > tr > th{
  width: 50%
}
.caseCreateApp > .allUserStatus > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper{
  min-height: 40px;
  max-height: 200px;
  overflow-y: auto
}
.caseCreateApp .dialogCaseVisible .el-dialog__body > div:nth-of-type(1) {
  margin-bottom: 50px
}
.caseCreateApp .dialogCaseVisible .el-dialog__body > div {
  padding: 10px 20px
}
.caseCreateApp .dialogCaseVisible .el-dialog__body > div:nth-of-type(1) > .upload-demo {
  margin-right: 46.45px
}
.caseCreateApp .dialogCaseVisible .el-dialog__body > div:nth-of-type(2) > .el-button {
  margin-right: 20px
}
.caseCreateApp .dialogCaseVisible .el-dialog__body > div:nth-of-type(2) > ul {
  list-style: none
}
.caseCreateApp .dialogCaseVisible .el-dialog__body > div:nth-of-type(2) > ul > li {
  font-size: 16px;
  margin-bottom: 5px
}
.caseCreateApp .dialogDownLoad > .el-dialog > .el-dialog__body > div {
  display: flex;
  justify-content: space-around
}
.caseCreateApp .dialogDownLoad .el-dialog__body > div:nth-of-type(1) {
  margin-bottom: 50px
}
.caseCreateApp .dialogDownLoad .el-dialog__body > div {
  padding: 10px 20px
}
.caseCreateApp .dialogDownLoad .el-dialog__body > div:nth-of-type(1) > .upload-demo {
  margin-right: 46.45px
}
.caseCreateApp .dialogDownLoad .el-dialog__body > div:nth-of-type(2) > .el-button {
  margin-right: 20px
}
.caseCreateApp .dialogDownLoad .el-dialog__body > div:nth-of-type(2) > ul {
  list-style: none
}
.caseCreateApp .dialogDownLoad .el-dialog__body > div:nth-of-type(2) > ul > li {
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
