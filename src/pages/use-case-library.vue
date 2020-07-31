<template>
  <div class="useCaseLibraryApp clearfix">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/usecasesetlist' }">用例管理</el-breadcrumb-item>
        <el-breadcrumb-item>用例库详情</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <body class="useCaseLibraryBody">
      <div class="selector" ref="selector" v-if="selectorDialog" @mouseenter="rightMouseenter" @mouseleave="rightMouseleave">
        <ul>
          <li v-for="(val, key) in rightMenu" :key="key" @mouseenter="menuMouseenter" @mouseleave="menuMouseleave" @click="liClick">
            <template>
              <span>{{ val }}</span>
            </template>
          </li>
        </ul>
      </div>
      <div class="container">

        <div class="left" id="left">
          <div class="top">
            <el-input placeholder="请输入内容" v-model.trim="searchValue" clearable @keyup.enter.native="searchEle" @blur="blurEvent"></el-input>
            <el-button type="primary" @click="searchEle">查询</el-button>
          </div>
          <p v-if = "this.$route.query.behaviour === 'see' ">
            当前为只读模式，请点击<el-button type="primary" size="mini" @click="changeEdit">编辑</el-button>进入编辑模式
          </p>
          <div class="body">
            <el-tree class="filter-tree"
                     :data="data"
                     :props="defaultProps"
                     default-expand-all
                     :filter-node-method="filterNode"
                     node-key="id"
                     ref="tree"
                     @node-click="handleNodeClick"
                     @node-expand="openTreeNode"
                     :render-content="renderContent"
                     @node-contextmenu="rightNodeClcik">
            </el-tree>
          </div>
        </div>
        <div id="resize"></div>
        <div class="right" id ="right">
          <CreateUseCaseManagmentSmall v-if="treeNodeType === 0"></CreateUseCaseManagmentSmall>
          <!-- 回归库历史记录 -->
          <ReturnHistoryRecord v-if="treeNodeType === 1" :returnHistory="getReturnHistory"></ReturnHistoryRecord>
          <!-- 版本库历史记录 -->
          <VersionHistoryRecord v-if="treeNodeType === 2" :versionHistory="getVersionHistory"></VersionHistoryRecord>
          <!-- 版本或模块 -->
          <ModuleDetail v-if="treeNodeType === 3 || treeNodeType === 4" :moduleData="getModuleData" @emitNewAddModuleData="getNewModuleOrVersionData" :moduleScrollTop="moveScrollTop" :deleteOper='delelteModuleOrVersion' @updataModule='goToUpdateCaseName'></ModuleDetail>
          <!-- 用例集 -->
          <CaseDetail v-if="treeNodeType === 5" :caseData="getCaseData" @emitNewAddCaseData='getNewAddCaseData' :caseScrollTop="moveScrollTop" :deleteOper='delelteCase' @updataCase='goToUpdateCaseName'></CaseDetail>
        </div>
        <!-- 批量修改 -->
        <el-dialog title="批量修改" :visible.sync="dialogmultipleModifyCase" class="dialogmultipleModifyCase">
          <el-table :data="caseDataArr">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <!-- <el-table-column property="caseDesc" label="用例描述" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.caseDesc" placeholder="请输入内容"></el-input>
                    </template>
                  </el-table-column> -->
                  <el-form-item label="用例描述">
                    <el-input type="textarea" placeholder="请输入内容" v-model="props.row.caseDesc" :rows="4"></el-input>
                  </el-form-item>
                  <el-form-item label="预置条件">
                    <el-input type="textarea" placeholder="请输入内容" v-model="props.row.preCondition" :rows="4"></el-input>
                  </el-form-item>
                  <el-form-item label="测试数据">
                    <el-input type="textarea" placeholder="请输入内容" v-model="props.row.caseData" :rows="4"></el-input>
                  </el-form-item>
                  <el-form-item label="测试步骤">
                    <el-input type="textarea" placeholder="请输入内容" v-model="props.row.caseStep" :rows="4"></el-input>
                  </el-form-item>
                  <el-form-item label="预期结果">
                    <el-input type="textarea" placeholder="请输入内容" v-model="props.row.expectResult" :rows="4"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="所属店铺">
                    <span>{{ props.row.shop }}</span>
                  </el-form-item>
                  <el-form-item label="商品 ID">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="店铺 ID">
                    <span>{{ props.row.shopId }}</span>
                  </el-form-item>
                  <el-form-item label="商品分类">
                    <span>{{ props.row.category }}</span>
                  </el-form-item>
                  <el-form-item label="店铺地址">
                    <span>{{ props.row.address }}</span>
                  </el-form-item>
                  <el-form-item label="商品描述">
                    <span>{{ props.row.desc }}</span>
                  </el-form-item> -->
                </el-form>
              </template>
            </el-table-column>
            <el-table-column property="caseName" label="用例名称" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.caseName" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="caseLevel" label="用例集别" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select v-model="scope.row.caseLevel" placeholder="请选择">
                  <el-option
                    v-for="item in caseLevelArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column property="caseAuto" label="是否自动化" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select v-model="scope.row.caseAuto" placeholder="请选择">
                  <el-option
                    v-for="item in caseAutoArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column property="label" label="用例标签" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select v-model="scope.row.label" @visible-change="visibleChange" size="large" multiple filterable remote :remote-method="searchCaseTagFromServer" allow-create default-first-option placeholder="请选择标签">
                  <el-option v-for="item in caseLabelData.caseLabelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <!-- <i :class="picture" @mouseenter="labelMouseenter" @click="labelClick"></i> -->
              </template>
            </el-table-column>
            <el-table-column property="stage" label="适用阶段" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select v-model="scope.row.stage" @visible-change="visibleChange" size="large" multiple filterable remote :remote-method="searchCaseTagFromServer" allow-create default-first-option placeholder="请选择标签">
                  <el-option v-for="item in caseLabelData.caseStageOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <!-- <i :class="picture" @mouseenter="labelMouseenter" @click="labelClick"></i> -->
              </template>
            </el-table-column>
            <el-table-column property="merge" label="是否合并" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select v-model="scope.row.merge" placeholder="请选择">
                  <el-option
                    v-for="item in mergeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <!-- <el-table-column property="caseDesc" label="用例描述" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.caseDesc" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="preCondition" label="预置条件" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.preCondition" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="caseData" label="测试数据" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.caseData" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="caseStep" label="测试步骤" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.caseStep" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="expectResult" label="预期结果" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.expectResult" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column> -->
          </el-table>
          <div class="button" style="margin-top: 20px;display: flex;justify-content: flex-end">
            <el-button @click="dialogmultipleModifyCase = false">取 消</el-button>
            <el-button type="primary" @click="submitMultipleCaseData">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 右键菜单导入用例 -->
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
      </div>
    </body>
  </div>
</template>

<script>
import { baseUrl } from '../../src/util/http'
import CreateUseCaseManagmentSmall from './useCaseManagement/create-use-case-managment-small'
import ReturnHistoryRecord from '../components/case-repository/return-repository-history-record'
import VersionHistoryRecord from '../components/case-repository/version-repository-history-record'
import ModuleDetail from '../components/case-repository/module-detail'
import CaseDetail from '../components/case-repository/case-detail'
import { getNodeTreeByCaseSuitePower, getNodeTreeByModulePower, getFullNodeTreePower, deleteModuleNodePower, deleteCaseNodePower, getCaseDetail, addCase, mergeCaseNodePower, getCaseListsByNodeId, batchUpdateCase, getCaseExcelFilePath } from '../api/api'
export default {
  components: {
    CreateUseCaseManagmentSmall,
    ReturnHistoryRecord,
    VersionHistoryRecord,
    ModuleDetail,
    CaseDetail
  },
  data () {
    const data = []
    return {
      searchValue: '',
      rootlabel: '',
      data: JSON.parse(JSON.stringify(data)),
      defaultProps: {
        children: 'children',
        label: 'nodeName',
        isLeaf: true
      },
      selectorDialog: false,
      // 当前页面距离浏览器左侧的距离
      appOffsetLeft: 0,
      rightMenu: [],
      // 观察模式还是完全模式
      behaviour: '',
      caseSuiteId: '',
      treeNodeStatus: true,
      treeNodeType: 0,
      getReturnHistory: {},
      getVersionHistory: {},
      getModuleData: {},
      getCaseData: {},
      // data
      currentRightClickElementMessage: {},
      // node
      currentRightClickElementMessage2: {},
      currentRightClickElementMessage3: {},
      rightElement: {},
      // 滚动高度
      scrollDistance: 0,
      // 新增模块或者用例集的临时存储容器
      tempData: {},
      copyCase: false,
      copyCaseData: {},
      // 增加用例后需要给当前用例的模块数量增加
      addNewCaseAddModuleCount: null,
      moveScrollTop: 0,
      delelteModuleOrVersion: 0,
      delelteCase: 0,
      currentRightElement: {},
      updateMessage: {},
      moduleArr: [],
      upLoadText: {},
      isAllCaseArr: [],
      dialogmultipleModifyCase: false,
      caseDataArr: [],
      caseLevelArr: [
        {
          label: 'L0',
          value: 'L0'
        }, {
          label: 'L1',
          value: 'L1'
        }, {
          label: 'L2',
          value: 'L2'
        }, {
          label: 'L3',
          value: 'L3'
        }, {
          label: 'L4',
          value: 'L4'
        }
      ],
      caseAutoArr: [
        {
          label: '否',
          value: 0
        }, {
          label: '是',
          value: 1
        }
      ],
      mergeArr: [
        {
          label: '否',
          value: 0
        }, {
          label: '是',
          value: 1
        }
      ],
      // 用例标签相关数据
      caseLabelData: {
        caseLabelOptions: []
      },
      dialogCaseVisible: false,
      url: ''
    }
  },
  // watch: {
  //   searchValue (val) {
  //   }
  // },
  methods: {
    upLoadFile () {
      this.upLoadText = {
        creator: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        caseSuiteId: this.$route.query.caseSuiteId,
        fileName: this.fileName,
        nodeId: this.currentRightClickElementMessage.id
      }
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
    visibleChange () {
    },
    searchCaseTagFromServer () {
    },
    // 提交批量修改的用例
    submitMultipleCaseData () {
      // id是nodeId
      let data = this.caseDataArr.map((ele, index) => {
        return {
          id: this.currentRightClickElementMessage.children[index].id,
          caseName: ele.caseName,
          caseDesc: ele.caseDesc,
          caseLevel: ele.caseLevel,
          caseAuto: ele.caseAuto,
          caseData: ele.caseData,
          caseStep: ele.caseStep,
          merge: ele.merge,
          stageLabelName: ele.stage.join(','),
          labelName: ele.label.join(','),
          precondition: ele.preCondition,
          expectResult: ele.expectResult,
          updateAccountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
          caseSuiteId: this.$route.query.caseSuiteId
        }
      })
      batchUpdateCase(data)
        .then(res => {
          if (res.state === 1000) {
            this.dialogmultipleModifyCase = false
            setTimeout(() => {
              this.initTreeData()
            }, 500)
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误，请稍后再试！')
        })
    },
    // upLoadFile () {
    // },
    goToUpdateCaseName (mes) {
      this.$set(this.updateMessage, 'nodeName', mes)
    },
    searchEle () {
      if (this.searchValue) {
        getFullNodeTreePower({caseSuiteId: this.$route.query.caseSuiteId})
          .then(res => {
            if (res.state === 1000) {
              this.data = [
                {
                  nodeName: this.$route.query.label,
                  nodeType: 0,
                  id: 10000000,
                  children: res.data.treeList
                }
              ]
              this.$nextTick(() => {
                this.$refs.tree.filter(this.searchValue)
              })
            } else {
              this.errorAjax()
            }
          }, rej => {
            this.errorAjax()
          })
      } else {
        this.initTreeData()
      }
      // getFullNodeTreePower({caseSuiteId: this.$route.query.caseSuiteId})
      //   .then(res => {
      //     if (res.state === 1000) {
      //       this.data = [
      //         {
      //           nodeName: this.$route.query.label,
      //           nodeType: 0,
      //           id: 10000000,
      //           children: res.data.treeList
      //         }
      //       ]
      //       this.$nextTick(() => {
      //         this.$refs.tree.filter(this.searchValue)
      //       })
      //     } else {
      //       this.errorAjax()
      //     }
      //   }, rej => {
      //     this.errorAjax()
      //   })
    },
    blurEvent () {
      // if (this.searchValue === '') {
      //   this.initTreeData()
      // }
    },
    filterNode (value, data, node) {
      if (value === '') {
        return false
      }
      if (data.nodeName.indexOf(value) !== -1) {
        return true
      }
    },
    // 新增模块或者版本
    getNewModuleOrVersionData (mes) {
      this.tempData.id = mes.id
      this.tempData.nodeName = mes.nodeName
      if (!this.currentRightClickElementMessage.children) {
        this.$set(this.currentRightClickElementMessage, 'children', [])
        this.currentRightClickElementMessage.children.push(this.tempData)
      } else {
        this.append(this.tempData, this.currentRightClickElementMessage2)
      }
      // 增加成功后返回上一级并显示上一级信息
      this.treeNodeType = this.currentRightClickElementMessage.nodeType
      this.getModuleData = {
        nodeId: this.currentRightClickElementMessage.id,
        clickType: 1,
        moduleType: this.treeNodeType
      }
    },
    // 增加用例
    getNewAddCaseData (mes) {
      this.tempData.id = mes.id
      this.tempData.nodeName = mes.nodeName
      if (this.currentRightClickElementMessage.belongRepository === 1) {
        this.$set(this.data[0].children[0], 'caseSum', this.data[0].children[0].caseSum + 1)
      }
      if (this.currentRightClickElementMessage.belongRepository === 2) {
        this.$set(this.data[0].children[1], 'caseSum', this.data[0].children[1].caseSum + 1)
        let rightVersion = this.getVersion(this.currentRightClickElementMessage2)
        this.$set(rightVersion.data, 'caseSum', rightVersion.data.caseSum + 1)
      }
      let rightModule = this.getModule(this.currentRightClickElementMessage2)
      rightModule.map(ele => this.$set(ele.data, 'caseSum', ele.data.caseSum + 1))
      if (!this.currentRightClickElementMessage.children) {
        this.$set(this.currentRightClickElementMessage, 'children', [])
        this.currentRightClickElementMessage.children.push(this.tempData)
      } else {
        this.append(this.tempData, this.currentRightClickElementMessage2)
      }
      this.moduleArr = []
      this.treeNodeType = this.currentRightClickElementMessage.nodeType
      this.getModuleData = {
        nodeId: this.currentRightClickElementMessage.id,
        clickType: 1,
        moduleType: this.treeNodeType
      }
    },
    getVersion (ele) {
      if (ele.parent.data.nodeType === 3) {
        return ele.parent
      }
      return this.getVersion(ele.parent)
    },
    getModule (ele) {
      if (ele.data.nodeType <= 3) {
        return this.moduleArr
      }
      if (ele.data.nodeType === 4) {
        this.moduleArr.push(ele)
      }
      return this.getModule(ele.parent)
    },
    addEventListenerScroll () {
      document.getElementsByClassName('body')[0].addEventListener('scroll', evn => {
        this.scrollDistance = document.getElementsByClassName('body')[0].scrollTop
      })
    },
    // 右键菜单选中
    liClick (evn) {
      // 新增模块
      if (evn.target.innerHTML === '增加模块') {
        this.treeNodeType = 4
        this.getModuleData = {
          clickType: 2,
          moduleType: 4,
          caseSuiteId: this.$route.query.caseSuiteId,
          fatherId: this.currentRightClickElementMessage.id,
          nodeDepth: this.currentRightClickElementMessage.nodeDepth + 1,
          belongRepository: this.currentRightClickElementMessage.belongRepository,
          userName: window.sessionStorage.getItem('userName') || window.localStorage.getItem('userName'),
          userAccount: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
        }
        this.tempData = {
          nodeDepth: this.currentRightClickElementMessage.nodeDepth + 1,
          caseSum: 0,
          belongRepository: this.currentRightClickElementMessage.belongRepository,
          nodeType: 4,
          children: []
        }
      }
      // 新增版本
      if (evn.target.innerHTML === '新增版本') {
        this.treeNodeType = 3
        this.getModuleData = {
          clickType: 2,
          moduleType: 3,
          caseSuiteId: this.$route.query.caseSuiteId,
          fatherId: this.currentRightClickElementMessage.id,
          nodeDepth: this.currentRightClickElementMessage.nodeDepth + 1,
          belongRepository: this.currentRightClickElementMessage.belongRepository,
          userName: window.sessionStorage.getItem('userName') || window.localStorage.getItem('userName'),
          userAccount: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
        }
        this.tempData = {
          nodeDepth: this.currentRightClickElementMessage.nodeDepth + 1,
          caseSum: 0,
          belongRepository: this.currentRightClickElementMessage.belongRepository,
          nodeType: 3,
          children: [],
          merged: 0
        }
      }
      // 删除模块&&版本
      if (evn.target.innerHTML === '删除版本' || evn.target.innerHTML === '删除模块') {
        this.$confirm('确定删除模块或者版本?', '重要操作警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.currentRightClickElementMessage.lastMerge) {
            this.$message({
              message: '最后一次合并禁止删除',
              type: 'warning'
            })
          } else {
            let data = {
              id: this.currentRightClickElementMessage.id,
              operator: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
            }
            deleteModuleNodePower(data)
              .then(res => {
                if (res.state === 1000) {
                  let miniusCase = this.currentRightClickElementMessage2.data.caseSum
                  if (this.currentRightClickElementMessage.belongRepository === 1) {
                    this.$set(this.data[0].children[0], 'caseSum', this.data[0].children[0].caseSum - miniusCase)
                  }
                  if (this.currentRightClickElementMessage.belongRepository === 2) {
                    this.$set(this.data[0].children[1], 'caseSum', this.data[0].children[1].caseSum - miniusCase)
                    if (this.currentRightClickElementMessage.nodeType === 4) {
                      let rightVersion = this.getVersion(this.currentRightClickElementMessage2)
                      this.$set(rightVersion.data, 'caseSum', rightVersion.data.caseSum - miniusCase)
                    }
                  }
                  let rightModule = this.getModule(this.currentRightClickElementMessage2.parent)
                  rightModule.forEach(ele => {
                    this.$set(ele.data, 'caseSum', ele.data.caseSum - miniusCase)
                  })
                  this.remove(this.currentRightClickElementMessage2, this.currentRightClickElementMessage)
                  this.delelteModuleOrVersion = 1
                } else {
                  // this.errorAjax()
                  this.$message.error(res.message)
                }
              }, rej => {
                this.errorAjax()
              })
          }
        })
      }
      // 新增用例
      if (evn.target.innerHTML === '增加用例') {
        this.treeNodeType = 5
        this.getCaseData = {
          clickType: 2,
          caseSuiteId: this.$route.query.caseSuiteId,
          fatherId: this.currentRightClickElementMessage.id,
          nodeDepth: this.currentRightClickElementMessage.nodeDepth + 1,
          belongRepository: this.currentRightClickElementMessage.belongRepository,
          userName: window.sessionStorage.getItem('userName') || window.localStorage.getItem('userName'),
          userAccount: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
          operationEvent: 1
        }
        this.tempData = {
          nodeDepth: this.currentRightClickElementMessage.nodeDepth + 1,
          caseSum: 0,
          belongRepository: this.currentRightClickElementMessage.belongRepository,
          nodeType: 5,
          merged: 0
        }
      }
      // 删除用例
      if (evn.target.innerHTML === '删除用例') {
        this.$confirm('确定删除用例?', '重要操作警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.currentRightClickElementMessage.lastMerge) {
            this.$message({
              message: '最后一次合并禁止删除',
              type: 'warning'
            })
          } else {
            let data = {
              id: this.currentRightClickElementMessage.id,
              operator: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
            }
            deleteCaseNodePower(data)
              .then(res => {
                if (res.state === 1000) {
                  if (this.currentRightClickElementMessage.belongRepository === 1) {
                    this.$set(this.data[0].children[0], 'caseSum', this.data[0].children[0].caseSum - 1)
                  }
                  if (this.currentRightClickElementMessage.belongRepository === 2) {
                    this.$set(this.data[0].children[1], 'caseSum', this.data[0].children[1].caseSum - 1)
                    let rightVersion = this.getVersion(this.currentRightClickElementMessage2)
                    this.$set(rightVersion.data, 'caseSum', rightVersion.data.caseSum - 1)
                  }
                  let rightModule = this.getModule(this.currentRightClickElementMessage2.parent)
                  rightModule.forEach(ele => {
                    this.$set(ele.data, 'caseSum', ele.data.caseSum - 1)
                  })
                  this.remove(this.currentRightClickElementMessage2, this.currentRightClickElementMessage)
                  this.moduleArr = []
                } else if (res.state === 2030) {
                  this.$message.warning(res.message.split(',')[0])
                } else {
                  this.errorAjax()
                }
              }, rej => {
                this.errorAjax()
              })
          }
        })
      }
      if (evn.target.innerHTML === '复制用例') {
        this.copyCase = true
        this.copyCaseData = this.currentRightClickElementMessage
      }
      if (evn.target.innerHTML === '粘贴用例') {
        // 复制的用例名称
        if (!this.currentRightClickElementMessage.children) {
          this.$set(this.currentRightClickElementMessage, 'children', [])
        }
        let arr = []
        let str = ''
        let num = 0
        const str1 = this.copyCaseData.nodeName + '-copy'
        for (var i = 0; i < str1.length; i++) {
          if (str1[i] === '-') {
            num++
          }
        }
        let num2 = 0
        this.currentRightClickElementMessage.children.forEach(ele => {
          if (ele.nodeName.startsWith(str1)) {
            for (var j = 0; j < ele.nodeName.length; j++) {
              if (ele.nodeName[j] === '-') {
                num2++
              }
            }
            if (num2 === num) {
              arr.push(ele.nodeName)
            }
            num2 = 0
          }
        })
        if (arr.length === 0) {
          str = '-copy' + 1
        } else {
          let newArr = []
          arr.forEach(ele => {
            newArr.push(ele.slice(ele.lastIndexOf('copy')))
          })
          let newNewArr = []
          newArr.forEach(ele => {
            newNewArr.push(ele.slice(4))
          })
          str = '-copy' + (Math.max(...newNewArr) + 1)
        }
        if (this.currentRightClickElementMessage.belongRepository !== this.copyCaseData.belongRepository) {
          this.$message({
            message: '不允许跨库粘贴用例',
            type: 'warning'
          })
        } else {
          getCaseDetail({nodeId: this.copyCaseData.id})
            .then(res => {
              if (res.state === 1000) {
                let data = {
                  fatherId: this.currentRightClickElementMessage.id,
                  nodeDepth: this.currentRightClickElementMessage.nodeDepth + 1,
                  caseName: res.data.caseInfo.caseName + str,
                  caseDesc: res.data.caseInfo.caseDesc,
                  caseLevel: res.data.caseInfo.caseLevel,
                  caseAuto: res.data.caseInfo.caseAuto,
                  merge: res.data.caseInfo.merge,
                  stageLabelName: res.data.caseInfo.stageLabelName.join(','),
                  labelName: res.data.caseInfo.caseLabelName.join(','),
                  precondition: res.data.caseInfo.precondition,
                  caseData: res.data.caseInfo.caseData,
                  caseStep: res.data.caseInfo.caseStep,
                  exceptResult: res.data.caseInfo.exceptResult,
                  creatorAccountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
                  caseSuiteId: res.data.caseInfo.caseSuiteId,
                  updateAccountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
                  belongRepository: this.currentRightClickElementMessage.belongRepository,
                  operationEvent: 8,
                  expectResult: res.data.caseInfo.expectResult
                }
                addCase(data)
                  .then(res => {
                    if (res.state === 1000) {
                      this.tempData = {
                        nodeDepth: this.currentRightClickElementMessage.nodeDepth + 1,
                        caseSum: 0,
                        belongRepository: this.currentRightClickElementMessage.belongRepository,
                        nodeType: 5,
                        children: [],
                        merged: 0
                      }
                      let mes = {
                        id: res.data.nodeId,
                        nodeName: data.caseName
                      }
                      this.getNewAddCaseData(mes)
                    } else {
                      this.$message({
                        type: 'error',
                        message: '复制的名称超出30个字的限制',
                        duration: 1000
                      })
                    }
                  })
              }
            })
        }
      }
      if (evn.target.innerHTML === '合并到回归库') {
        mergeCaseNodePower({
          caseSuiteId: this.$route.query.caseSuiteId,
          operator: window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName'),
          sourceNodeName: this.currentRightClickElementMessage.nodeName,
          nodeId: this.currentRightClickElementMessage.id
        }).then(res => {
          if (res.state === 1000) {
            this.data = []
            this.initTreeData()
          } else if (res.state === 1002) {
            this.$message({
              type: 'error',
              message: '必要参数缺失',
              duration: 1000
            })
          } else if (res.state === 3012) {
            this.$message({
              type: 'error',
              message: '回归库节点对象缺失',
              duration: 1000
            })
          } else {
            this.errorAjax()
          }
        })
      }
      if (evn.target.innerHTML === '批量修改') {
        this.caseDataArr.splice(0, this.caseDataArr.length)
        // this.caseDataArr = this.currentRightClickElementMessage.children
        // console.log(this.currentRightClickElementMessage.children)
        getCaseListsByNodeId({
          nodeId: this.currentRightClickElementMessage.id
        }).then(res => {
          if (res.state === 1000) {
            console.log(res)
            this.caseDataArr = res.data.caseList
          }
        })
        this.dialogmultipleModifyCase = true
      }
      if (evn.target.innerHTML === '撤销合并') {
      }
      if (evn.target.innerHTML === '导入用例') {
        console.log('导入用例')
        this.dialogCaseVisible = true
      }
      if (evn.target.innerHTML === '导出用例') {
        console.log(this.currentRightClickElementMessage)
        getCaseExcelFilePath({
          nodeId: this.currentRightClickElementMessage.id,
          nodeType: this.currentRightClickElementMessage.nodeType,
          nodeName: this.currentRightClickElementMessage.nodeName
        }).then(res => {
          if (res.state === 1000) {
            window.location.href = res.data.caseFilePath
          }
        })
      }
      this.selectorDialog = false
    },
    openForm () {
    },
    // 添加模块
    append (data, node) {
      if (node.data.children) {
        node.data.children.push(data)
        this.data = JSON.parse(JSON.stringify(this.data))
      }
    },
    // 删除模块
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      this.data = JSON.parse(JSON.stringify(this.data))
    },
    // 禁止默认行为
    rightClickInvalid () {
      document.getElementsByClassName('useCaseLibraryApp')[0].oncontextmenu = function () {
      }
    },
    appendRender (data) {
      this.currentRightElement = data
    },
    renderContent (h, { node, data, store }) {
      if (data.nodeType === 0) {
        return (
          <div>
            <i class="htp-icondatabase"></i>
            <span style="margin-left: 5px">{ data.nodeName }</span>
          </div>
        )
      }
      if (data.nodeType === 1) {
        return (
          <div>
            <i class="htp-iconinbox-in"></i>
            <span style="margin-left: 5px" on-contextmenu={ () => this.appendRender(data) }>{ data.nodeName + '(' + data.caseSum + ')' }</span>
          </div>
        )
      }
      if (data.nodeType === 2) {
        return (
          <div>
            <i class="htp-iconlayer-group"></i>
            <span style="margin-left: 5px" on-contextmenu={ () => this.appendRender(data) }>{ data.nodeName + '(' + data.caseSum + ')' }</span>
          </div>
        )
      }
      if (data.nodeType === 3) {
        return (
          <div>
            <i class="htp-iconstepmode"></i>
            <span style="margin-left: 5px;color: #409EFF" on-contextmenu={ () => this.appendRender(data) }>{ data.nodeName + '(' + data.caseSum + ')' }</span>
          </div>
        )
      }
      if (data.nodeType === 4) {
        return (
          <div>
            <i class="htp-iconall"></i>
            <span style="margin-left: 5px" on-contextmenu={ () => this.appendRender(data) }>{ data.nodeName + '(' + data.caseSum + ')' }</span>
          </div>
        )
      }
      if (data.belongRepository === 1) {
        if (data.nodeType === 5) {
          return (
            <div>
              <i class="htp-iconfile"></i>
              <span style="margin-left: 5px" on-contextmenu={ () => this.appendRender(data) }>{ data.nodeName }</span>
            </div>
          )
        }
      }
      if (data.belongRepository === 2) {
        if (data.nodeType === 5) {
          if (data.merged === 0) {
            return (
              <div>
                <i class="htp-iconfile"></i>
                <span style="margin-left: 5px;color: #409EFF">{ data.nodeName }</span>
              </div>
            )
          } else {
            return (
              <div>
                <i class="htp-iconfile"></i>
                <span style="margin-left: 5px;color: black">{ data.nodeName }</span>
              </div>
            )
          }
        }
      }
    },
    // 树节点左键单击
    handleNodeClick (obj, node, ele) {
      console.log(obj)
      this.updateMessage = obj
      this.selectorDialog = false
      this.treeNodeType = obj.nodeType
      if (this.treeNodeType === 1) {
        this.getReturnHistory = {
          caseSuiteId: this.$route.query.caseSuiteId,
          belongResp: 1
        }
      }
      if (this.treeNodeType === 2) {
        this.getVersionHistory = {
          caseSuiteId: this.$route.query.caseSuiteId,
          belongResp: 2
        }
      }
      if (this.treeNodeType === 3 || this.treeNodeType === 4) {
        this.getModuleData = {
          nodeId: obj.id,
          clickType: 1,
          moduleType: obj.nodeType
        }
      }
      if (this.treeNodeType === 5) {
        this.getCaseData = {
          nodeId: obj.id,
          clickType: 1,
          moduleType: obj.nodeType
        }
      }
      if (obj.id !== 10000000) {
        getNodeTreeByModulePower({ nodeId: obj.id })
          .then(res => {
            if (res.state === 1000) {
              // console.log(res.data)
              // 如果该模块或者版本下面只有用例,存储该模块或者版本的ID,便于右键点击时显示批量修改
              console.log(res.data.isAllCase)
              if (res.data.isAllCase) {
                if (this.isAllCaseArr.indexOf(obj.id) === -1) {
                  this.isAllCaseArr.push(obj.id)
                }
              }
              this.$refs.tree.updateKeyChildren(obj.id, res.data.treeList)
            } else {
              this.errorAjax()
            }
          }, rej => {
            this.errorAjax()
          })
      }
    },
    openTreeNode (obj) {
    },
    // 点击鼠标右键
    rightNodeClcik (evn, obj, node, ele) {
      console.log(obj)
      // console.log(evn)
      // console.log(node)
      // console.log(ele)
      this.addNewCaseAddModuleCount = evn.target
      this.currentRightClickElementMessage = obj
      this.currentRightClickElementMessage2 = node
      this.currentRightClickElementMessage3 = ele
      if (this.behaviour === 'all') {
        if (obj.id !== 10000000) {
          this.selectorDialog = false
          this.rightMenu = []
          let data = []
          // 回归库
          // 如果是参与者：点击用例集名称访问无右键权力，点击创建用例右键权力只有版本库无回归库
          // 如果是创建者：点击用例集名称访问无右键权力，点击创建用例右键所有权力
          // 1是回归库
          // 2是版本库
          // 3是版本
          // 4是模块
          // 5是用例
          if (this.$route.query.from === 'join') {
            if (obj.belongRepository === 1) {
            } else {
              if (obj.nodeType === 2) {
                data = ['新增版本']
              }
              if (obj.nodeType === 3) {
                data = ['合并到回归库', '增加模块', '删除版本', '导入用例', '导出用例']
              }
              if (obj.nodeType === 4) {
                if (this.copyCase) {
                  // 该模块或者版本的id在isAllCaseArr数组当中，表示该模块或者版本下面都是用例，可以批量修改用例
                  if (this.isAllCaseArr.some(ele => ele === obj.id)) {
                    data = ['增加模块', '删除模块', '增加用例', '粘贴用例', '导出用例', '导入用例', '批量修改']
                  } else {
                    data = ['增加模块', '删除模块', '增加用例', '粘贴用例', '导出用例', '导入用例']
                  }
                } else {
                  if (this.isAllCaseArr.some(ele => ele === obj.id)) {
                    data = ['增加模块', '删除模块', '增加用例', '导出用例', '导入用例', '批量修改']
                  } else {
                    data = ['增加模块', '删除模块', '增加用例', '导出用例', '导入用例']
                  }
                }
              }
              if (obj.nodeType === 5) {
                data = ['复制用例', '删除用例']
              }
              this.rightMenuFunction(data, evn)
            }
          } else {
            if (obj.belongRepository === 1) {
              if (obj.nodeType === 1) {
                data = ['增加模块', '导入用例', '撤销合并']
              }
              if (obj.nodeType === 4) {
                if (this.copyCase) {
                  if (this.isAllCaseArr.some(ele => ele === obj.id)) {
                    data = ['增加模块', '删除模块', '增加用例', '粘贴用例', '导出用例', '导入用例', '批量修改']
                  } else {
                    data = ['增加模块', '删除模块', '增加用例', '粘贴用例', '导出用例', '导入用例']
                  }
                } else {
                  if (this.isAllCaseArr.some(ele => ele === obj.id)) {
                    data = ['增加模块', '删除模块', '增加用例', '导出用例', '导入用例', '批量修改']
                  } else {
                    data = ['增加模块', '删除模块', '增加用例', '导出用例', '导入用例']
                  }
                }
              }
              if (obj.nodeType === 5) {
                data = ['复制用例', '删除用例']
              }
            } else {
              if (obj.nodeType === 2) {
                data = ['新增版本']
              }
              if (obj.nodeType === 3) {
                data = ['合并到回归库', '增加模块', '删除版本', '导入用例', '导出用例']
              }
              if (obj.nodeType === 4) {
                if (this.copyCase) {
                  if (this.isAllCaseArr.some(ele => ele === obj.id)) {
                    data = ['增加模块', '删除模块', '增加用例', '粘贴用例', '导出用例', '导入用例', '批量修改']
                  } else {
                    data = ['增加模块', '删除模块', '增加用例', '粘贴用例', '导出用例', '导入用例']
                  }
                } else {
                  if (this.isAllCaseArr.some(ele => ele === obj.id)) {
                    data = ['增加模块', '删除模块', '增加用例', '导出用例', '导入用例', '批量修改']
                  } else {
                    data = ['增加模块', '删除模块', '增加用例', '导出用例', '导入用例']
                  }
                }
              }
              if (obj.nodeType === 5) {
                data = ['复制用例', '删除用例']
              }
            }
            this.rightMenuFunction(data, evn)
          }
        }
      }
    },
    rightMenuFunction (data, evn) {
      data.forEach(ele => {
        this.rightMenu.push(ele)
      })
      this.selectorDialog = true
      this.$nextTick(() => {
        this.$refs.selector.style.top = evn.clientY + this.moveScrollTop + 'px'
        this.$refs.selector.style.left = evn.clientX + 'px'
      })
    },
    rightMouseenter (event) {
      event.target.style.cursor = 'pointer'
    },
    rightMouseleave (event) {
      event.target.style.cursor = 'auto'
    },
    menuMouseenter (event) {
      event.target.style.backgroundColor = '#d9d9d9'
    },
    menuMouseleave (event) {
      event.target.style.backgroundColor = ''
    },
    errorAjax () {
      this.$message({
        type: 'error',
        message: '网络异常',
        duration: 1000
      })
    },
    initTreeData () {
      getNodeTreeByCaseSuitePower({ caseSuiteId: this.caseSuiteId })
        .then(res => {
          if (res.state === 1000) {
            this.data = [
              {
                nodeName: this.$route.query.label,
                nodeType: 0,
                id: 10000000,
                children: res.data.treeList
              }
            ]
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
    },
    changeEdit() {
      this.$router.push({
        path: '/usecaselibrary',
        query: {
          behaviour: 'all',
          caseSuiteId: this.caseSuiteId,
          label: this.rootlabel,
          caseSuiteDesc: this.caseSuiteDesc,
          startTime: this.startTime,
          endTime: this.endTime,
          from: this.from
        }})
    },
    dragControllerDiv: function () {
      let left = document.getElementById('left')
      let resize = document.getElementById('resize')
      let right = document.getElementById('right')
      let box = document.getElementsByClassName('container')[0]
      resize.onmousedown = function (e) {
        let startX = e.clientX
        const resizeLeft = resize.offsetLeft
        document.onmousemove = function (e) {
          let endX = e.clientX
          let moveLen = resizeLeft + (endX - startX)
          let maxT = box.clientWidth - resize.offsetWidth
          if (moveLen < 400) moveLen = 400
          if (moveLen > maxT - 473) moveLen = maxT - 473
          resize.style.left = moveLen
          left.style.width = moveLen + 'px'
          right.style.width = (box.clientWidth - moveLen - 5) + 'px'
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
          resize.releaseCapture && resize.releaseCapture()
        }
        resize.setCapture && resize.setCapture()
        return false
      }
    }
  },
  created () {
    this.url = baseUrl + '/open/case/importCaseByExcel.action'
    window.addEventListener('contextmenu', () => {
      this.selectorDialog = false
    })
    window.addEventListener('scroll', () => {
      let scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
      this.moveScrollTop = scrollTop
    })
    window.addEventListener('click', () => {
      if (this.selectorDialog) {
        this.selectorDialog = false
      }
    })
    this.behaviour = this.$route.query.behaviour
    this.caseSuiteId = this.$route.query.caseSuiteId
    this.rootlabel = this.$route.query.label
    this.caseSuiteDesc = this.$route.query.caseSuiteDesc
    this.startTime = this.$route.query.startTime
    this.endTime = this.$route.query.endTime
    this.from = this.$route.query.from
    this.initTreeData()
  },
  mounted () {
    this.appOffsetLeft = document.getElementsByClassName('useCaseLibraryApp')[0].offsetLeft
    this.rightClickInvalid()
    this.addEventListenerScroll()
    this.dragControllerDiv()
  },
  computed: {
    isRefresh () {
      return this.$store.state.isRefresh
    }
  },
  watch: {
    isRefresh (val) {
      if (val) {
        this.initTreeData()
        setTimeout(() => {
          this.$store.commit('refreshData', false)
        })
      }
    }
  },
  updated() {
    this.behaviour = this.$route.query.behaviour
  }
}
</script>

<style>
@import url('../assets/css/use-case-library.css');
</style>
