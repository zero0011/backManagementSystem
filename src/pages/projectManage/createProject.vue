<template>
  <div class="createUseCaseManagment">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/projectControl' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item v-html="this.$route.query.action === 'edit'?'编辑项目':'创建项目'"></el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- 项目名称 -->
      <el-form-item label="项目名称" prop="name">
        <el-input v-model.trim="ruleForm.name"></el-input>
      </el-form-item>
      <!-- 项目编号 -->
      <el-form-item label="项目编号" prop="number">
        <el-input v-model.trim="ruleForm.number"></el-input>
      </el-form-item>
      <!-- 项目描述 -->
      <el-form-item label="项目描述">
        <el-input type="textarea" v-model.trim="ruleForm.desc"></el-input>
      </el-form-item>
      <!-- 项目类型 -->
      <el-form-item label="项目类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择项目类型" style="width:200px">
          <el-option label="PDT" value="1"></el-option>
          <el-option label="TDT" value="2"></el-option>
          <el-option label="LTC" value="3"></el-option>
          <el-option label="LMT" value="4"></el-option>
        </el-select>
      </el-form-item>
      <!-- 所属BU -->
      <el-form-item label="所属BU" prop="belongBu">
        <el-select v-model="ruleForm.belongBu" placeholder="请选择业务单元" style="width:200px">
          <el-option label="AUTO" value="AUTO"></el-option>
          <el-option label="AIOT" value="AIOT"></el-option>
          <el-option label="PLATFORM" value="PLATFORM"></el-option>
          <el-option label="管理项目" value="管理项目"></el-option>
          <el-option label="休假" value="休假"></el-option>
        </el-select>
      </el-form-item>
      <!-- 所属部门 -->
      <el-form-item label="立项部门" prop="department">
        <el-input v-model.trim="ruleForm.department" style="width:200px"></el-input>
      </el-form-item>
      <!-- 项目经理 -->
      <el-form-item label="项目经理" prop="manager">
        <el-input v-model.trim="ruleForm.manager" style="width:200px"></el-input>
      </el-form-item>
      <!-- 测试代表 -->
      <el-form-item label="测试代表" prop="testerLeader">
        <el-input v-model.trim="ruleForm.testerLeader" style="width:200px"></el-input>
      </el-form-item>
      <!-- 创建人 -->
      <el-form-item label="创建人">
        <el-input :disabled="true" v-model="ruleForm.creator"></el-input>
      </el-form-item>
      <el-form-item label="项目起始" prop="dateRange" required>
        <el-date-picker
          v-model="ruleForm.dateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="haveSelected"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <!-- 项目阶段 -->
      <el-form-item label="TR阶段" prop="stage">
        <el-button type="primary" @click="addStage" style="float:right">新增</el-button>
      </el-form-item>
      <el-form-item label>
        <el-table :data="ruleForm.stageTable" tooltip-effect="dark" style="width: 100%" border :header-cell-style="{background:'rgb(250, 250, 250)'}">
          <el-table-column
            prop="projectStage"
            label="TR阶段节点"
            width="245"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            width="256"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="endTime"
            label="结束时间"
            show-overflow-tooltip
            align="center"
            width="285"
          ></el-table-column>
          <el-table-column label="操作" width="240" align="center">
            <template slot-scope="scope">
              <el-button
                @click="editProjectStage(scope.$index,scope.row)"
                type="text"
                size="small"
              >编辑</el-button>
              <el-button
                @click="delProjectStage(scope.$index,ruleForm.stageTable)"
                type="text"
                size="small"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!-- 项目成员 -->
      <el-form-item label="项目成员" prop="function">
        <el-button type="primary" @click="addPersonNew" style="float:right">新增</el-button>
        <el-button type="primary" @click="multipleDelete" style="float:right;margin-right:20px">删除</el-button>
      </el-form-item>
      <el-form-item label>
        <el-table
          ref="multipleTable"
          :data="multipleTable"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          border
          :header-cell-style="{background:'rgb(250, 250, 250)'}"
        >
          <el-table-column type="selection" width="95" align="center"></el-table-column>
          <el-table-column prop="userName" label="姓名" width="245" align="center"></el-table-column>
          <el-table-column prop="accountName" label="账户名" width="245" align="center"></el-table-column>
          <el-table-column
            prop="department"
            label="部门"
            show-overflow-tooltip
            align="center"
            width="245"
          ></el-table-column>
          <el-table-column label="操作" width="198" align="center">
            <template slot-scope="scope">
              <el-button @click="del(scope.row,scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!-- 是否需要进行统计 -->
      <el-form-item label="参与统计">
        <el-switch v-model="statist"></el-switch>
      </el-form-item>

      <el-form-item class="build" style="position:relative;height:40px;margin-top: 100px;">
        <el-button type="primary" @click="submitForm('create')" v-if="action === ''" style="position:absolute;left:30%">立即创建</el-button>
        <el-button type="primary" @click="submitForm('edit')" v-if="action === 'edit'" style="position:absolute;left:30%">编辑完成</el-button>
        <el-button type="primary" @click="cancelCreate" style="position:absolute;left:40.9%">取消</el-button>
        <el-button type="primary" v-if="action === ''" @click="reCreateFun()" style="position:absolute;left:50%">再建一个</el-button>
      </el-form-item>
    </el-form>

    <!-- 项目阶段弹层 -->
    <el-dialog title="项目阶段" :visible.sync="showDialogStage" :before-close="clickOther">
      <!-- <el-form ref="formStage" :rules="rulesStage" :model="formStage" label-width="80px"> -->
      <el-form ref="formStage" :model="formStage" label-width="80px">
        <!-- 项目阶段名称 -->
        <el-form-item label="阶段名称" prop="selectStageName">
          <el-select
            v-model="formStage.selectStageName"
            placeholder="请选择阶段名称"
            style="width: 350px;"
          >
            <el-option
              v-for="item in formStage.stageNames"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 开始时间和结束时间 -->
        <el-form-item label="时间选择" prop="dateRange">
          <el-date-picker
            v-model="formStage.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogBindStage('cancel')">取 消</el-button>
        <el-button type="primary" @click="closeDialogBindStage('ok')">确 定</el-button>
      </span>
    </el-dialog>
    <SelectPeople
      :showSelectPeople="showSelectPeople"
      :bindUserData="bindUserData"
      :havebindUserData="havebindUserData"
      @changeShowSelectPeople="changeShowSelectPeople"
      @commitBindPeople="commitBindPeople"
      @searchFromComponent="getSearchFromComponent"
      :getSearch="sendSearch"
    ></SelectPeople>
  </div>
</template>

<script>
import { addCaseSuitePower, getLabelsUsedByCaseSuitePower, updateCaseSuiteLabelPower, updateCaseSuiteUserPower, getUserPower, getLabelPower, getCaseSuiteUserPower, editCaseSuitePower,
  getAllProjectStage, updateProjectStageNode, getPorjectParticipant, updatePorjectParticipant, addProject, updateProject, getProjectStageInfo, getUserListPower, searchAndGetUsers} from '../../api/api'
import SelectPeople from '../../components/selectPeople'
export default {
  components: {
    SelectPeople
  },
  data() {
    return {
      showDialogUser: false,
      showDialogStage: false,
      action: '',
      stageAction: '',
      personAction: '',
      allUser: [],
      hide: false,
      bindRole: [],
      haveBindUser: [],
      haveBindUserTemp: [],
      count: 0,
      preAddRole: '',
      reCreate: false,
      deleteWindow: false,
      tempAddRole: [],
      multipleSelect: [],
      // 添加人员的accountName
      // preAddRoleArr: [],
      radio: '单人编写',
      picture: 'el-icon-arrow-up',
      timeRangeSelect: false,
      loading: false,
      // 测试经理候选数据
      managerOptions: [],
      // 创建的项目id
      caseSuiteId: '',
      ruleForm: {
        name: '',
        number: '',
        desc: '',
        type: '',
        belongBu: '',
        department: '',
        creator: (window.sessionStorage.getItem('userName') || window.localStorage.getItem('userName')) + '(' + (window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')) + ')',
        manager: '',
        department: '',
        testerLeader: '',
        stageTable: [],
        dateRange: ['', ''],
        personTable: '',
        tagArr: []
        // tagArr: ['UI界面', '接口', '硬件', '算法']
      },
      multipleTable: [],
      formStage: {
        selectStageName: '',
        stageNames: [],
        dateRange: ''
      },
      statist: true,
      rules: {
        belongBu: [
          { required: true, message: '请选择业务单元', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择项目类型', trigger: 'change' }
        ],
        department: [
          { required: true, message: '请输入立项部门', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个汉字', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入项目编号', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个汉字', trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请选择用户信息', trigger: 'blur' }
        ],
        testerLeader: [
          { required: true, message: '请输入测试代表', trigger: 'blur' }
        ],
        dateRange: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      tablerow: {
        index: null,
        stageName: ''
      },
      pickerOptions: {
        disabledDate(time) {
          // return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      options: [
        // {
        //   value: '中国',
        //   label: 'China'
        // }, {
        //   value: '日本',
        //   label: 'Japan'
        // }, {
        //   value: '意大利',
        //   label: ' Itlay'
        // }, {
        //   value: '法国',
        //   label: 'Franch'
        // }, {
        //   value: '英国',
        //   label: 'England'
        // }, {
        //   value: '德国',
        //   label: 'German'
        // }
      ],
      showSelectPeople: false,
      bindUserData: [],
      havebindUserData: [],
      sendSearch: [],
      closeDialogBindUserParam: true
    }
  },
  methods: {
    getSearchFromComponent(mes) {
      searchAndGetUsers({
        userName: mes.userName,
        searchType: mes.searchType
      }).then(res => {
        if (res.state === 1000) {
          this.sendSearch = res.data.userList
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试')
      })
    },

    // 新版人员选择控件，提交已绑定人员数据到redis
    commitBindPeople(val) {
      if (!this.closeDialogBindUserParam) {
        this.closeDialogBindUser('close')
      } else {
        this.closeDialogBindUser('confirm', val)
      }
    },
    changeShowSelectPeople(val) {
      // this.closeDialogBindUserParam = val;
      this.showSelectPeople = false
    },
    reCreateFun() {
      this.submitForm('recreate')
    },
    preventCode() {
      window.addEventListener('keydown', e => {
        if ((e.keyCode === 116) || (e.ctrlKey && e.keyCode === 82)) {
          e.keyCode = 0
          e.returnValue = false
        }
      })
    },
    preventOnload() {
      // window.addEventListener('beforeunload', () => {
      //   debugger
      //   return false
      // })
      window.addEventListener('load', () => {
        return false
      })
    },
    // preventRight () {
    //   document.oncontextmenu = function () {
    //     return false
    //   }
    // },
    cancelCreate() {
      this.$router.replace({
        path: '/projectControl',
        query: {
          activeName: this.$route.query.activeName
        }
      })
    },
    diffset(arr1, arr2) {
      var l, shortArr, longArr
      if (arr1.length > arr2.length) {
        shortArr = arr2
        longArr = JSON.parse(JSON.stringify(arr1))
      } else {
        shortArr = arr1
        longArr = JSON.parse(JSON.stringify(arr2))
      }
      l = shortArr.length
      for (var i = l - 1; i >= 0; i--) {
        let { accountName, userName } = shortArr[i]
        let t = longArr.findIndex(item => item.accountName === accountName && item.userName === userName)
        if (t < 0) {
          longArr.push(arr2[i])
        } else {
          longArr.splice(t, 1)
        }
      }
      return longArr
    },
    // select支持远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        let queryData = {
          userName: '',
          accountName: '',
          department: '',
          startNum: 1,
          range: 0
        }
        getUserPower(queryData)
          .then(res => {
            if (res.state === 1000) {
              let tempList = res.data.userList.map(item => {
                return { value: item.userName + '(' + item.accountName + ')', label: item.userName + '(' + item.accountName + ')' }
              })
              this.loading = false
              this.managerOptions = tempList.filter(item => {
                return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
              })
            } else {
              setTimeout(() => {
                this.$message.error(res.message)
              }, 100)
            }
          }, rej => {
            this.errorAjax()
          })
      } else {
        this.managerOptions = []
      }
    },

    // 判断数组中是否包含某元素
    containsInArr(arr, obj) {
      let i = arr.length
      while (i--) {
        if (arr[i] === obj) {
          return true
        }
      }
      return false
    },

    // 多选删除
    multipleDelete() {
      // 定义临时数组，用于存放勾选数据的索引
      let tempPreDelDataIndex = []
      if (this.multipleSelect.length) {
        this.multipleSelect.forEach(ele => {
          // tempPreDelData.push(ele.userName+"("+ele.accountName+")")
          let delIndex = this.multipleTable.findIndex(item => {
            return item.accountName === ele.accountName
          })
          tempPreDelDataIndex.push(delIndex)
        })
      } else {
        return
      }

      let unSelectArr = []
      for (let i = 0; i < this.multipleTable.length; i++) {
        if (!this.containsInArr(tempPreDelDataIndex, i)) {
          unSelectArr.push(this.multipleTable[i].userName + '(' + this.multipleTable[i].accountName + ')')
        } else {
          continue
        }
      }

      let queryData = {}
      queryData.accountName = window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      queryData.projectMember = unSelectArr.join(',')
      // queryData.action = "3"

      if (this.action == '') {
        queryData.projectId = ''
      } else if (this.action == 'edit') {
        queryData.projectId = this.$route.query.projectId
      }

      // 向后台更新数据
      updatePorjectParticipant(queryData)
        .then(res => {
          if (res.state === 1000) {
            // 重新从后台获取数据
            getPorjectParticipant({ projectId: queryData.projectId, accountName: queryData.accountName })
              .then(res1 => {
                if (res1.state === 1000) {
                  // 先清空数据
                  this.multipleTable.splice(0, this.multipleTable.length)
                  if (res1.data.projectMembers.length > 0) {
                    for (var i = 0; i < res1.data.projectMembers.length; i++) {
                      let memberTempInfo = {
                        // role:res1.data.projectMembers[i].realName+"("+res1.data.projectMembers[i].accountName+")",
                        userName: res1.data.projectMembers[i].realName,
                        accountName: res1.data.projectMembers[i].accountName,
                        department: res1.data.projectMembers[i].department

                      }
                      this.multipleTable.push(memberTempInfo)
                    }
                  } else {
                    this.multipleTable.splice(0, this.multipleTable.length)
                  }
                } else {
                  setTimeout(() => {
                    this.$message.error(res1.message)
                  }, 100)
                }
              }, rej => {
                this.errorAjax()
              }
              )
          } else {
            setTimeout(() => {
              this.$message.error(res.message)
            }, 100)
          }
        }, rej => {
          this.errorAjax()
        }
        )
    },
    // 表格的删除
    del(row, index) {
      let queryData = {}
      queryData.accountName = window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      // queryData.projectMember = row.userName+"("+row.accountName+")"
      // queryData.action = "3"

      if (this.action == '') {
        queryData.projectId = ''
      } else if (this.action == 'edit') {
        queryData.projectId = this.$route.query.projectId
      }

      this.multipleTable.splice(index, 1)
      let tempMemberArr = []
      this.multipleTable.forEach(item => {
        tempMemberArr.push(item.userName + '(' + item.accountName + ')')
      })

      queryData.projectMember = tempMemberArr.join(',')

      // 向后台更新数据
      updatePorjectParticipant(queryData)
        .then(res => {
          if (res.state === 1000) {
            // 重新从后台获取数据
            getPorjectParticipant({ projectId: queryData.projectId, accountName: queryData.accountName })
              .then(res1 => {
                if (res1.state === 1000) {
                  // 先清空数据
                  this.multipleTable.splice(0, this.multipleTable.length)
                  if (res1.data.projectMembers.length > 0) {
                    for (var i = 0; i < res1.data.projectMembers.length; i++) {
                      let memberTempInfo = {
                        // role:res1.data.projectMembers[i].realName+"("+res1.data.projectMembers[i].accountName+")",
                        userName: res1.data.projectMembers[i].realName,
                        accountName: res1.data.projectMembers[i].accountName,
                        department: res1.data.projectMembers[i].department

                      }
                      this.multipleTable.push(memberTempInfo)
                    }
                  }
                } else {
                  setTimeout(() => {
                    this.$message.error(res1.message)
                  }, 100)
                }
              }, rej => {
                this.errorAjax()
              }
              )
          } else {
            setTimeout(() => {
              this.$message.error(res.message)
            }, 100)
          }
        }, rej => {
          this.errorAjax()
        }
        )

      // this.$store.commit('updateCurrentJoinPerson', index)
    },
    // 关闭弹窗
    closeDialogBindUser(action, realData) {
      // 根据之前临时存储的数据去比较vuex中的数据,找到要删除的索引以及要删除的长度
      if (action === 'close') {
        this.haveBindUser.splice(0, this.haveBindUser.length)
        // 关闭弹层
        this.showSelectPeople = false
      }
      if (action === 'confirm') {
        // 首选提交当前数据到redis，关闭弹层，从redis再次取得数据并刷新table
        let queryData = {}
        queryData.accountName = window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
        let selectedMember = []
        if (realData.length > 0) {
          realData.forEach(ele => {
            selectedMember.push(ele.fullName)
          })
        } else {
          this.$message.error('请至少选择一个成员！')
          return
        }
        queryData.projectMember = selectedMember.join(',')
        if (this.action == '') {
          queryData.projectId = ''
        } else if (this.action == 'edit') {
          queryData.projectId = this.$route.query.projectId
        }
        // 向后台更新数据
        updatePorjectParticipant(queryData)
          .then(res => {
            if (res.state === 1000) {
              // 重新从后台获取数据
              getPorjectParticipant({ projectId: queryData.projectId, accountName: queryData.accountName })
                .then(res1 => {
                  if (res1.state === 1000) {
                    // 先清空外部数据
                    this.multipleTable.splice(0, this.multipleTable.length)
                    if (res1.data.projectMembers.length > 0) {
                      for (var i = 0; i < res1.data.projectMembers.length; i++) {
                        let memberTempInfo = {
                          // role:res1.data.projectMembers[i].realName+"("+res1.data.projectMembers[i].accountName+")",
                          userName: res1.data.projectMembers[i].realName,
                          accountName: res1.data.projectMembers[i].accountName,
                          department: res1.data.projectMembers[i].department

                        }
                        this.multipleTable.push(memberTempInfo)
                      }
                    }
                  } else {
                    setTimeout(() => {
                      this.$message.error(res1.message)
                    }, 100)
                  }
                }, rej => {
                  this.errorAjax()
                }
                )
              // 关闭弹层
              this.showSelectPeople = false
            } else {
              setTimeout(() => {
                this.$message.error(res.message)
              }, 100)
            }
          }, rej => {
            this.errorAjax()
          }
          )
      }
    },
    // 点击了弹窗的删除
    deleteBindUser(index) {
      this.deleteWindow = true
      if (this.count === 0) {
        this.haveBindUser.forEach(ele => {
          this.haveBindUserTemp.push(ele)
        })
        this.count = 1
      }
      this.haveBindUser.splice(index, 1)
    },
    addRole() {
      let tableDataArr = []
      this.haveBindUser.forEach(ele => {
        tableDataArr.push(ele.role)
      })
      if (tableDataArr.indexOf(this.preAddRole) === -1) {
        let data = {
          role: this.preAddRole
        }
        if (data.role !== '') {
          this.tempAddRole.push(data)
          this.haveBindUser.push(data)
        }
      } else {
        this.$message({
          type: 'warning',
          message: '绑定角色重复',
          duration: 1000
        })
      }
    },
    handleNodeClick(data) {
      if (data.label !== '人员信息') {
        this.preAddRole = data.label
      }
    },

    // v1.5.1版本 人员选择控件弹层（New）
    addPersonNew() {
      let promise1 = getUserListPower({
        startNum: 1,
        range: 0
      }).then(res => {
        if (res.state === 1000) {
          return res.data.userList
        } else {
          this.errorAjax()
        }
      }, rej => {
        this.errorAjax()
      })
      // 这里显示已绑定人员数据，获取redis数据
      let queryData = {}
      if (this.action == '') {
        queryData = {
          projectId: '',
          accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
        }
      } else if (this.action == 'edit') {
        queryData = {
          projectId: this.$route.query.projectId,
          accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
        }
      }
      let promise2 = getPorjectParticipant(queryData)
        .then(res1 => {
          if (res1.state === 1000) {
            this.haveBindUser.splice(0, this.haveBindUser.length)
            if (res1.data.projectMembers.length > 0) {
              for (var i = 0; i < res1.data.projectMembers.length; i++) {
                let memberTempInfo = {
                  // role:res1.data.projectMembers[i].realName+"("+res1.data.projectMembers[i].accountName+")"
                  userName: res1.data.projectMembers[i].realName,
                  accountName: res1.data.projectMembers[i].accountName
                }
                this.haveBindUser.push(memberTempInfo)
              }
            }
            return this.haveBindUser
          } else {
            setTimeout(() => {
              this.$message.error(res1.message)
            }, 100)
          }
        }, rej => {
          this.errorAjax()
        }
        )
      Promise.all([promise1, promise2]).then((res) => {
        // 显示选择用户列表的组件
        this.bindUserData = res[0]
        this.havebindUserData = res[1]
        setTimeout(() => {
          this.showSelectPeople = true
        })
      })
    },

    // 老版本人员选择控件弹层
    addPerson() {
      let data = {
        userName: '',
        accountName: '',
        department: '',
        startNum: 1,
        range: 0
      }
      getUserPower(data)
        .then(res => {
          if (res.state === 1000) {
            let tempData = res.data.userList
            this.allUser = res.data.userList
            let array = []
            for (var i = 0; i < tempData.length; i++) {
              array[i] = { label: '' }
            }
            for (let i = 0; i < tempData.length; i++) {
              array[i].label = tempData[i].userName + '(' + tempData[i].accountName + ')'
            }
            this.bindRole = [{
              label: '人员信息',
              children: array
            }]
            // this.haveBindUser = this.$store.state.prePerson
            // console.info(this.$store.state.prePerson)
          }
        })

      // 这里显示已绑定人员数据，获取redis数据
      let queryData = {}
      if (this.action == '') {
        queryData = {
          projectId: '',
          accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
        }
      } else if (this.action == 'edit') {
        queryData = {
          projectId: this.$route.query.projectId,
          accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
        }
      }
      getPorjectParticipant(queryData)
        .then(res1 => {
          if (res1.state === 1000) {
            this.haveBindUser.splice(0, this.haveBindUser.length)
            if (res1.data.projectMembers.length > 0) {
              for (var i = 0; i < res1.data.projectMembers.length; i++) {
                let memberTempInfo = {
                  role: res1.data.projectMembers[i].realName + '(' + res1.data.projectMembers[i].accountName + ')'
                }
                this.haveBindUser.push(memberTempInfo)
              }
            }
          } else {
            setTimeout(() => {
              this.$message.error(res1.message)
            }, 100)
          }
        }, rej => {
          this.errorAjax()
        }
        )

      setTimeout(() => {
        this.showDialogUser = true
      }, 100)
    },
    // 新增项目阶段
    addStage() {
      this.stageAction = 'add'
      if (this.formStage.stageNames.length > 0) {
        this.formStage.stageNames.splice(0, this.formStage.stageNames.length)
      }
      getAllProjectStage()
        .then(res => {
          if (res.state === 1000) {
            let tempData = res.data.allStageList
            for (var i = 0; i < tempData.length; i++) {
              var itemStage = {}
              itemStage.value = tempData[i]
              itemStage.label = tempData[i]
              this.formStage.stageNames.push(itemStage)
            }
            // console.info('弹窗开始:' + this.$store.state.prePerson)
          }
        })

      setTimeout(() => {
        this.showDialogStage = true
      }, 100)
    },
    // 编辑项目阶段
    editProjectStage(index, row) {
      this.stageAction = 'edit'
      this.formStage.selectStageName = row.projectStage
      this.formStage.dateRange = [row.startTime, row.endTime]

      // this.formStage.dateRange[0] = row.startTime
      // this.formStage.dateRange[1] = row.endTime
      this.showDialogStage = true
      this.formStage.stageNames.splice(0, this.formStage.stageNames.length)
      getAllProjectStage()
        .then(res => {
          if (res.state === 1000) {
            let tempData = res.data.allStageList
            for (var i = 0; i < tempData.length; i++) {
              var itemStage = {}
              itemStage.value = tempData[i]
              itemStage.label = tempData[i]
              this.formStage.stageNames.push(itemStage)
            }
            // console.info('弹窗开始:' + this.$store.state.prePerson)
          }
        })

      this.tablerow.index = index
      this.tablerow.stageName = row.projectStage
    },

    // 删除项目阶段
    delProjectStage(index, rows) {
      let redisData = {}
      if (this.action == '') {
        redisData = {
          projectId: '',
          accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
          // stageName:rows[index].projectStage,
          // startTime:rows[index].startTime,
          // endTime:rows[index].endTime,
          // action:'3'
        }
      } else if (this.action == 'edit') {
        redisData = {
          projectId: this.$route.query.projectId,
          accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
          // stageName:rows[index].projectStage,
          // startTime:rows[index].startTime,
          // endTime:rows[index].endTime,
          // action:'3'
        }
      }
      this.ruleForm.stageTable.splice(index, 1)
      let tempStageArr = []
      let tempStageObj = []
      this.ruleForm.stageTable.forEach(itemStageTable => {
        for (let itemObj in itemStageTable) {
          tempStageObj.push(itemStageTable[itemObj])
        }
        tempStageArr.push(tempStageObj.join(','))
        tempStageObj.splice(0, tempStageObj.length)
      })

      redisData.stageList = tempStageArr.join(';')

      // 提交后台处理
      updateProjectStageNode(redisData)
        .then(res => {
          if (res.state === 1000) {
            // rows.splice(index, 1);
            let queryStageData = {
              accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
            }
            if (this.action == '') {
              queryStageData.projectId = ''
            } else if (this.action == 'edit') {
              queryStageData.projectId = this.$route.query.projectId
            }

            // 从后台获取项目阶段数据
            getProjectStageInfo(queryStageData)
              .then(res => {
                if (res.state === 1000) {
                  this.ruleForm.stageTable.splice(0, this.ruleForm.stageTable.length)
                  if (res.data.stageLists.length > 0) {
                    res.data.stageLists.forEach(item => {
                      let stageTempInfo = {
                        projectStage: item.stage,
                        startTime: item.stageStartTime,
                        endTime: item.stageEndTime
                      }
                      this.ruleForm.stageTable.push(stageTempInfo)
                    })
                  }
                } else {
                  setTimeout(() => {
                    this.$message.error(res.message)
                  }, 100)
                }
              }, rej => {
                this.errorAjax()
              })
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.errorAjax()
        })
    },

    // 关闭项目阶段弹层
    closeDialogBindStage(action) {
      if (action == 'cancel') {
        this.formStage.selectStageName = ''
        this.formStage.dateRange = []

        this.showDialogStage = false
      } else {
        let redisData = {}

        // 首先判断整个项目是创建操作还是编辑操作
        if (this.action == '') {
          // 判断弹层是新增还是编辑
          if (this.stageAction == 'add') {
            // 遍历已选择的数据，如果名称重复则不允许进一步操作
            for (var i = 0; i < this.ruleForm.stageTable.length; i++) {
              if (this.ruleForm.stageTable[i].projectStage == this.formStage.selectStageName) {
                this.$message.error('已经选择此项目节点！')
                return
              }
            }
            redisData = {
              projectId: '',
              accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
              // stageName:this.formStage.selectStageName,
              // startTime:this.formStage.dateRange[0],
              // endTime:this.formStage.dateRange[1],
              // action:'1'
            }
          } else if (this.stageAction == 'edit') {
            // 保证编辑条件下，如果是对本身stage的编辑，则可以提交，否则，需要对项目阶段名称冲突进行返回
            if (this.tablerow.stageName != this.formStage.selectStageName) {
              // 遍历已选择的数据，如果名称重复则不允许进一步操作
              for (var i = 0; i < this.ruleForm.stageTable.length; i++) {
                if (this.ruleForm.stageTable[i].projectStage == this.formStage.selectStageName) {
                  this.$message.error('已经选择此项目节点！')
                  return
                }
              }
            }

            redisData = {
              projectId: '',
              accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
              // stageName:this.formStage.selectStageName,
              // startTime:this.formStage.dateRange[0],
              // endTime:this.formStage.dateRange[1],
              // action:'2'
            }
          }
        } else if (this.action == 'edit') {
          // 判断弹层是新增还是编辑
          if (this.stageAction == 'add') {
            // 遍历已选择的数据，如果名称重复则不允许进一步操作
            for (var i = 0; i < this.ruleForm.stageTable.length; i++) {
              if (this.ruleForm.stageTable[i].projectStage == this.formStage.selectStageName) {
                this.$message.error('已经选择此项目节点！')
                return
              }
            }
            redisData = {
              projectId: this.$route.query.projectId,
              accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
              // stageName:this.formStage.selectStageName,
              // startTime:this.formStage.dateRange[0],
              // endTime:this.formStage.dateRange[1],
              // action:'1'
            }
          } else if (this.stageAction == 'edit') {
            // 保证编辑条件下，如果是对本身stage的编辑，则可以提交，否则，需要对项目阶段名称冲突进行返回
            if (this.tablerow.stageName != this.formStage.selectStageName) {
              // 遍历已选择的数据，如果名称重复则不允许进一步操作
              for (var i = 0; i < this.ruleForm.stageTable.length; i++) {
                if (this.ruleForm.stageTable[i].projectStage == this.formStage.selectStageName) {
                  this.$message.error('已经选择此项目节点！')
                  return
                }
              }
            }

            redisData = {
              projectId: this.$route.query.projectId,
              accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
              // stageName:this.formStage.selectStageName,
              // startTime:this.formStage.dateRange[0],
              // endTime:this.formStage.dateRange[1],
              // action:'2'
            }
          }
        }

        // 构造数据，如果是编辑，则需要删除编辑前的数据
        if (this.stageAction == 'edit') {
          this.ruleForm.stageTable.splice(this.tablerow.index, 1)
        }

        let tempStageList = []
        let tempStageListAll = []
        tempStageList.push(this.formStage.selectStageName)
        tempStageList.push(this.formStage.dateRange[0])
        tempStageList.push(this.formStage.dateRange[1])
        let newStageStrTemp = tempStageList.join(',')
        tempStageListAll.push(newStageStrTemp)
        tempStageList.splice(0, tempStageList.length)
        newStageStrTemp = ''
        if (this.ruleForm.stageTable.length > 0) {
          this.ruleForm.stageTable.forEach(ele => {
            tempStageList.push(ele.projectStage)
            tempStageList.push(ele.startTime)
            tempStageList.push(ele.endTime)
            newStageStrTemp = tempStageList.join(',')
            tempStageListAll.push(newStageStrTemp)
            tempStageList.splice(0, tempStageList.length)
            newStageStrTemp = ''
          })
        }

        redisData.stageList = tempStageListAll.join(';')

        // 提交后台处理
        updateProjectStageNode(redisData)
          .then(res => {
            if (res.state === 1000) {
              // 关闭表单
              this.showDialogStage = false
              // 刷新外部表格数据
              // let colData = {
              //     projectStage:this.formStage.selectStageName,
              //     startTime:this.formStage.dateRange[0],
              //     endTime:this.formStage.dateRange[1]
              // }
              // if(this.stageAction == 'add'){
              //     this.ruleForm.stageTable.push(colData)
              // }else if(this.stageAction == 'edit'){
              //     this.ruleForm.stageTable[this.tablerow.index].projectStage = colData.projectStage
              //     this.ruleForm.stageTable[this.tablerow.index].startTime = colData.startTime
              //     this.ruleForm.stageTable[this.tablerow.index].endTime = colData.endTime
              // }

              let queryStageData = {
                accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
              }
              if (this.action == '') {
                queryStageData.projectId = ''
              } else if (this.action == 'edit') {
                queryStageData.projectId = this.$route.query.projectId
              }

              // 从后台获取项目阶段数据
              getProjectStageInfo(queryStageData)
                .then(res => {
                  if (res.state === 1000) {
                    this.ruleForm.stageTable.splice(0, this.ruleForm.stageTable.length)
                    if (res.data.stageLists.length > 0) {
                      res.data.stageLists.forEach(item => {
                        let stageTempInfo = {
                          projectStage: item.stage,
                          startTime: item.stageStartTime,
                          endTime: item.stageEndTime
                        }
                        this.ruleForm.stageTable.push(stageTempInfo)
                      })
                    }
                  } else {
                    setTimeout(() => {
                      this.$message.error(res.message)
                    }, 100)
                  }
                }, rej => {
                  this.errorAjax()
                })

              // 清空数据
              this.formStage.selectStageName = ''
              this.formStage.dateRange = []
            } else {
              this.$message.error(res.message)
            }
          }, rej => {
            this.errorAjax()
          })
      }
    },
    // 用例标签搜索
    searchTagFromServer(query) {
      if (query !== '') {
        this.loading = true
        getLabelPower({ labelName: query })
          .then(res => {
            if (res.state === 1000) {
              this.loading = false
              if (res.data.labelNameList.length === 0) {
                // alert(1111)
                document.getElementsByClassName('el-select-dropdown__item')[0].children[0].innerHTML = query + ' (new)'
              } else {
                let arr = res.data.labelNameList
                let newArr = arr.map(ele => {
                  return {
                    label: ele,
                    value: ele
                  }
                })
                // let arr = {
                //   labelList: [
                //     '地平线1', '地平线2', '地平线3', '地平线4'
                //   ]
                // }
                // let newArr = arr.labelList.map(ele => {
                //   return {
                //     label: ele,
                //     value: ele
                //   }
                // })
                // let arr = res.data.label
                // let newArr = []
                // for (var i = 0; i < arr.length; i++) {
                //   newArr[i] = {
                //     value: '',
                //     label: ''
                //   }
                // }
                // for (var j = 0; j < arr.length; j++) {
                //   newArr[j].label = arr[j].label_name
                //   newArr[j].value = arr[j].label_id
                // }
                this.options = newArr
              }
            } else {
              this.errorAjax()
            }
          }, rej => {
            this.errorAjax()
          })
      }
      // getLabelPower({labelName: query})
      //   .then(res => {
      //     if (res.state === 1000) {
      //       this.loading = false
      //       if (res.data.label.length === 0) {
      //         document.getElementsByClassName('el-select-dropdown__item hover')[0].children[0].innerHTML = query + '(new)'
      //       } else {
      //         let arr = res.data.caseSuiteLabelRelations
      //         let newArr = []
      //         for (var i = 0; i < arr.length; i++) {
      //           newArr[i] = {
      //             value: '',
      //             label: ''
      //           }
      //         }
      //         for (var j = 0; j < arr.length; j++) {
      //           newArr[j].label = arr[j].label_name
      //           newArr[j].value = arr[j].label_id
      //         }
      //         this.options = newArr
      //       }
      //     } else {
      //       this.errorAjax()
      //     }
      //   }, rej => {
      //     this.errorAjax()
      //   })
    },
    errorAjax() {
      this.$message({
        type: 'error',
        message: '网络异常',
        duration: 1000
      })
    },
    // 添加进去的标签
    change() {
      // document.getElementsByClassName('el-select-dropdown__item hover')[0].children[0].innerHTML = ''
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelect = val
    },
    // 立即创建
    submitForm(action) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let tempArrMember = []
          let projectMemberStr = ''
          if (this.multipleTable.length > 0) {
            this.multipleTable.forEach(ele => {
              tempArrMember.push(ele.userName + '(' + ele.accountName + ')')
              projectMemberStr = tempArrMember.join(',')
            })
          }
          let tempArrStage = []
          let tempArrStageDetail = []
          let projectStageStr = ''
          if (this.ruleForm.stageTable.length > 0) {
            this.ruleForm.stageTable.forEach(ele => {
              for (let key in ele) {
                tempArrStageDetail.push(ele[key])
              }
              tempArrStage.push(tempArrStageDetail.join(','))
              tempArrStageDetail.splice(0, tempArrStageDetail.length)
            })
            projectStageStr = tempArrStage.join(';')
          }
          // if (this.ruleForm.type == 'PDT') {
          //   this.ruleForm.type = 1
          // } else if (this.ruleForm.type === 'TDT') {
          //   this.ruleForm.type = 2
          // } else if (this.ruleForm.type === 'LTC') {
          //   this.ruleForm.type = 3
          // }
          let submitProjectData = {
            projectName: this.ruleForm.name,
            projectNumber: this.ruleForm.number,
            projectDesc: this.ruleForm.desc,
            projectType: this.ruleForm.type,
            projectBelong: this.ruleForm.department,
            projectManager: this.ruleForm.manager,
            accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
            startTime: this.ruleForm.dateRange[0],
            endTime: this.ruleForm.dateRange[1],
            projectMember: projectMemberStr,
            stageList: projectStageStr,
            statistical: this.statist,
            testerLeader: this.ruleForm.testerLeader,
            belongBu: this.ruleForm.belongBu
          }
          this.createProject(submitProjectData, action)
        } else {
          return false
        }
      })
    },
    // 编辑已经创建的项目
    submitFormEdit(formName) {

    },
    // 提交编辑的项目
    editCaseSuit(data) {
      editCaseSuitePower(data)
        .then(res => {
          if (res.state === 1000) {
            // 获得创建后的项目id
            this.caseSuiteId = this.$route.query.caseSuiteId
            let arr = Object.values(this.ruleForm.tagArr)
            if (arr.length > 0) {
              this.updateCaseSuit(arr.join(','))
            } else {
              this.updateCaseSuit('')
            }
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
    },
    // 提交项目数据
    createProject(data, action) {
      if (action === 'edit') {
        // 提交编辑项目数据
        data.projectId = this.$route.query.projectId
        delete data.accountName
        updateProject(data)
          .then(res => {
            if (res.state === 1000) {
              this.$router.replace({
                path: '/projectControl',
                query: {
                  reCreate: false,
                  activeName: 'create'
                }
              })
            } else {
              this.$message.error(res.message)
            }
          }, rej => {
            this.createProjectFail()
          })
      } else {
        addProject(data)
          .then(res => {
            if (res.state === 1000) {
              if (action === 'create') {
                this.$router.replace({
                  path: '/projectControl',
                  query: {
                    reCreate: false,
                    activeName: 'create'
                  }
                })
              } else if (action === 'recreate') {
                this.$message.success('已经新增成功！')
                this.ruleForm.name = ''
                this.ruleForm.number = ''
                this.ruleForm.desc = ''
                this.ruleForm.type = ''
                this.ruleForm.manager = ''
                this.ruleForm.department = ''
                this.ruleForm.dateRange = ''
                this.ruleForm.stageTable = ''
                this.ruleForm.personTable = ''
                this.multipleTable = ''
              }
            } else {
              this.$message.error(res.message)
            }
          }, rej => {
            this.createProjectFail()
          })
      }
    },
    createProjectFail() {
      this.$message({
        type: 'error',
        message: '创建项目失败',
        duration: 1000
      })
    },
    // 更新项目标签
    updateCaseSuit(labelIdList) {
      let data = {
        caseSuiteId: this.caseSuiteId,
        labelNameList: labelIdList,
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      }
      updateCaseSuiteLabelPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.updateUserSuit()
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
    },
    // 更新编写人员
    updateUserSuit() {
      // alert('更新编写人员')
      let data = {}
      if (this.radio === '单人编写') {
        data = {
          caseSuiteId: this.caseSuiteId,
          accountNameList: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
          // editType: 1
        }
      } else {
        let arr3 = []
        this.$store.state.joinPerson.forEach(ele => {
          arr3.push(ele.accountName)
        })
        data = {
          caseSuiteId: this.caseSuiteId,
          accountNameList: arr3.join(',')
          // editType: 2
        }
      }
      updateCaseSuiteUserPower(data)
        .then(res => {
          if (res.state === 1000) {
            if (this.reCreate) {
              this.$store.commit('changeActiveName', this.$route.query.activeName)
              this.$router.replace({
                path: '/usecasesetlist',
                query: {
                  reCreate: true
                }
              })
              this.$store.commit('currentJoinPerson', [])
            } else {
              this.$store.commit('changeActiveName', this.$route.query.activeName)
              this.$router.replace({
                path: '/usecasesetlist',
                query: {
                  reCreate: false
                }
              })
              this.$store.commit('currentJoinPerson', [])
            }
          } else {
            this.errorAjax()
          }
        }, rej => {
          this.errorAjax()
        })
    },
    // 用例标签右边的箭头鼠标悬停
    labelMouseenter(event) {
      event.target.style.cursor = 'pointer'
    },
    // 点击用例标签的向上箭头获取所有用例标签
    labelClick(event) {
      if (this.picture === 'el-icon-arrow-up') {
        this.picture = 'el-icon-arrow-down'
        getLabelPower({})
          .then(res => {
            if (res.state === 1000) {
              let arr = res.data.labelNameList
              let arr1 = []
              if (arr.length === 0) {
                arr1.push({
                  value: 'nodata',
                  label: '无数据',
                  disabled: true
                })
              } else {
                arr1 = arr.map(ele => {
                  return {
                    label: ele,
                    value: ele
                  }
                })
              }
              this.options = arr1
            } else {
              this.errorAjax()
            }
          }, rej => {
            this.errorAjax()
          })
        event.target.previousElementSibling.children[1].children[0].focus()
      }
    },
    // 项目标签下拉框是否显示
    visibleChange(val) {
      if (val === false) {
        setTimeout(() => {
          this.picture = 'el-icon-arrow-up'
        }, 50)
      }
    },
    haveSelected() {
      this.timeRangeSelect = true
    },
    clickOther(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
    }
  },
  created() {
    this.preventCode()
    this.preventOnload()
    this.action = this.$route.query.action
    if (this.$route.query.action === 'edit') {
      let tableData = JSON.parse(this.$route.query.projectForm)
      this.ruleForm.name = tableData.projectName,
      this.ruleForm.number = tableData.projectNumber,
      this.ruleForm.desc = tableData.projectDesc,
      this.ruleForm.type = tableData.projectType,
      this.ruleForm.department = tableData.projectBelong,
      this.ruleForm.manager = tableData.projectManager,
      this.ruleForm.dateRange = [tableData.startTime, tableData.endTime]
      this.ruleForm.testerLeader = tableData.testerLeader
      this.ruleForm.belongBu = tableData.belongBu
      if (tableData.statistical == 1) {
        this.statist = true
      } else {
        this.statist = false
      }

      // 从后台获取成员数据
      getPorjectParticipant({ projectId: tableData.projectId, accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName') })
        .then(res1 => {
          if (res1.state === 1000) {
            // 先清空数据
            this.multipleTable.splice(0, this.multipleTable.length)
            if (res1.data.projectMembers.length > 0) {
              for (var i = 0; i < res1.data.projectMembers.length; i++) {
                let memberTempInfo = {
                  // role:res1.data.projectMembers[i].realName+"("+res1.data.projectMembers[i].accountName+")",
                  userName: res1.data.projectMembers[i].realName,
                  accountName: res1.data.projectMembers[i].accountName,
                  department: res1.data.projectMembers[i].department
                }
                this.multipleTable.push(memberTempInfo)
              }
            }
          } else {
            setTimeout(() => {
              this.$message.error(res.message)
            }, 100)
          }
        }, rej => {
          this.errorAjax()
        }
        )

      // 从后台获取项目阶段数据
      getProjectStageInfo({ projectId: tableData.projectId, accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName') })
        .then(res => {
          if (res.state === 1000) {
            this.ruleForm.stageTable.splice(0, this.ruleForm.stageTable.length)
            if (res.data.stageLists.length > 0) {
              res.data.stageLists.forEach(item => {
                let stageTempInfo = {
                  projectStage: item.stage,
                  startTime: item.stageStartTime,
                  endTime: item.stageEndTime
                }
                this.ruleForm.stageTable.push(stageTempInfo)
              })
            }
          } else {
            setTimeout(() => {
              this.$message.error(res.message)
            }, 100)
          }
        }, rej => {
          this.errorAjax()
        })
    }
  },
  watch: {
  },
  destroyed() {
    this.action = ''
    this.reCreate = false
    this.ruleForm = {
      name: '',
      desc: '',
      creator: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
      dateRange: '',
      tagArr: ['UI界面', '接口', '硬件', '算法']
    }
    document.oncontextmenu = function () {
      return true
    }
  }
}
</script>

<style scoped>
@import url('../../assets/css/create-use-case-managment.css');
</style>
