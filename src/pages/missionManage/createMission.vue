<template>
  <div class="createMissionApp">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/missionManage' }">任务管理</el-breadcrumb-item>
        <el-breadcrumb-item v-html="this.$route.query.action === '1'?'编辑任务':'创建任务'"></el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main class="main">
      <fieldset>
        <!-- <legend>版本基本信息</legend> -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="versionForm">
          <!-- 版本名称 -->
          <el-form-item label="任务名称" prop="missionName">
            <el-input v-model.trim="ruleForm.missionName" placeholder="字符长度限制50"></el-input>
          </el-form-item>
          <!-- 版本描述 -->
          <el-form-item label="任务描述" prop="missionDesc">
            <el-input type="textarea" v-model.trim="ruleForm.missionDesc" placeholder="字符长度限制100"></el-input>
          </el-form-item>
          <!-- 创建人 -->
          <el-form-item label="创建人" prop="creator">
            <el-input :disabled="true" v-model="ruleForm.creator"></el-input>
          </el-form-item>
          <!-- 归属项目 -->
          <el-form-item label="归属项目" prop="fromProject" style="display: inline-block;width: 27%">
            <el-select v-model="ruleForm.fromProject" placeholder="项目" @change='projectSelect'>
              <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromProject" :key="key"></el-option>
              <!-- <el-option label="区域二" value="beijing"></el-option> -->
            </el-select>
          </el-form-item>
          <!-- 编辑 -->
          <template v-if="this.$route.query.action === '1'">
            <!-- 仅仅只有版本 -->
            <template v-if="haveVersion">
              <el-form-item label="" prop="fromVersion" style="display: inline-block;width: 27%">
                <el-select v-model="ruleForm.fromVersion" placeholder="版本" @change='versionSelect' :disabled="versionBol">
                  <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromVersion" :key="key"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <!-- 仅仅只有产品（包括产品下的版本） -->
            <template v-if="haveProduct">
              <el-form-item label="" prop="fromProduct" style="display: inline-block;;width: 27%">
                <el-select v-model="ruleForm.fromProduct" placeholder="产品" @change='productSelect' :disabled="productBol">
                  <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromProduct" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="fromProductVersion" style="display: inline-block;width: 27%">
                <el-select v-model="ruleForm.fromProductVersion" placeholder="产品下版本" @change='productVersionSelect' :disabled="productVersionBol">
                  <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromProductVersion" :key="key"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <!-- 既有版本也有产品 -->
            <template v-if="haveVersionAndHaveProduct" style="display: block">
              <el-form-item label="" prop="fromVersion" style="display: inline-block;width: 27%">
                <el-select v-model="ruleForm.fromVersion" placeholder="版本" @change='versionSelect' :disabled="versionBol">
                  <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromVersion" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" class="newProject">
                <el-button type="primary" @click="addNewProject">新增项目</el-button>
              </el-form-item>
              <el-form-item label="" prop="fromProduct" style="display: inline-block;width: 27%;margin-left: 27.5%">
                <el-select v-model="ruleForm.fromProduct" placeholder="产品" @change='productSelect' :disabled="productBol">
                  <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromProduct" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="fromProductVersion" style="display: inline-block;width: 27%">
                <el-select v-model="ruleForm.fromProductVersion" placeholder="产品下版本" @change='productVersionSelect' :disabled="productVersionBol">
                  <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromProductVersion" :key="key"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item label="" class="newProject" v-if="!haveVersionAndHaveProduct">
              <el-button type="primary" @click="addNewProject">新增项目</el-button>
            </el-form-item>
            <!-- <el-form-item label="" prop="fromVersion" style="display: inline-block;width: 20%">
              <el-select v-model="ruleForm.fromVersion" placeholder="版本" @change='versionSelect' :disabled="versionBol" v-if="showVersion">
                <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromVersion" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" style="display: inline-block;width: 30%;margin-left: 0.5%">
              <el-button type="primary" @click="addNewProject">新增项目</el-button>
            </el-form-item>
            <el-form-item label="" prop="fromProduct" style="display: inline-block;width: 20%;margin-left: 20.5%">
              <el-select v-model="ruleForm.fromProduct" placeholder="产品" @change='productSelect' :disabled="productBol" v-if="showProduct">
                <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromProduct" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="fromProductVersion" style="display: inline-block;width: 20%">
              <el-select v-model="ruleForm.fromProductVersion" placeholder="产品下版本" @change='productVersionSelect' :disabled="productVersionBol" v-if="showProduct">
                <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromProductVersion" :key="key"></el-option>
              </el-select>
            </el-form-item> -->
          </template>
          <!-- 创建 -->
          <template v-else>
            <!-- 仅仅只有版本 -->
            <template v-if="haveVersion">
              <el-form-item label="" prop="fromVersion" style="display: inline-block;width: 27%">
                <el-select v-model="ruleForm.fromVersion" placeholder="版本" @change='versionSelect' :disabled="versionBol">
                  <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromVersion" :key="key"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <!-- 仅仅只有产品（包括产品下的版本） -->
            <template v-if="haveProduct">
              <el-form-item label="" prop="fromProduct" style="display: inline-block;;width: 27%">
                <el-select v-model="ruleForm.fromProduct" placeholder="产品" @change='productSelect' :disabled="productBol">
                  <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromProduct" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="fromProductVersion" style="display: inline-block;width: 27%">
                <el-select v-model="ruleForm.fromProductVersion" placeholder="产品下版本" @change='productVersionSelect' :disabled="productVersionBol">
                  <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromProductVersion" :key="key"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <!-- 既有版本也有产品 -->
            <template v-if="haveVersionAndHaveProduct" style="display: block">
              <el-form-item label="" prop="fromVersion" style="display: inline-block;width: 27%">
                <el-select v-model="ruleForm.fromVersion" placeholder="版本" @change='versionSelect' :disabled="versionBol">
                  <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromVersion" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" class="newProject">
                <el-button type="primary" @click="addNewProject">新增项目</el-button>
              </el-form-item>
              <el-form-item label="" prop="fromProduct" style="display: inline-block;width: 27%;margin-left: 27.5%">
                <el-select v-model="ruleForm.fromProduct" placeholder="产品" @change='productSelect' :disabled="productBol">
                  <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromProduct" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="fromProductVersion" style="display: inline-block;width: 27%">
                <el-select v-model="ruleForm.fromProductVersion" placeholder="产品下版本" @change='productVersionSelect' :disabled="productVersionBol">
                  <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromProductVersion" :key="key"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item label="" class="newProject" v-if="!haveVersionAndHaveProduct">
              <el-button type="primary" @click="addNewProject">新增项目</el-button>
            </el-form-item>
          </template>
          <!-- 开始时间与结束时间 -->
          <el-form-item label="时间选择" prop="dateRange" v-if="this.$route.query.action === '1'">
            <el-date-picker v-model="ruleForm.dateRange"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            @change="haveSelected"
                            disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="时间选择" prop="dateRange" v-else>
            <el-date-picker v-model="ruleForm.dateRange"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            @change="haveSelected"
                            :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <!-- 所属项目 -->
          <!-- <el-form-item label="所属项目" prop="projectName">
            <el-input :disabled="true" v-model="ruleForm.projectName"></el-input>
          </el-form-item> -->
          <!-- 测试人员 -->
          <el-form-item label="测试人员" prop="testerAccountName" class="testerAccountName">
            <el-button type="primary" @click="addTestPeople">新增</el-button>
            <el-button type="primary" @click="multipleDelete">删除</el-button>
          </el-form-item>
          <!-- 绑定测试人员 -->
          <SelectPeople :showSelectPeople="showSelectPeople" :bindUserData="bindUserData" :havebindUserData="havebindUserData" @changeShowSelectPeople='changeShowSelectPeople' @commitBindPeople="commitBindPeople" @searchFromComponent='getSearchFromComponent' :getSearch='sendSearch'></SelectPeople>
          <!-- <el-dialog :visible.sync="showBindTestPeople" :show-close="false" :before-close="clickOther" class="bindTestPeople">
            <div class="left">
              <h2>待添加人员列表</h2>
              <el-tree :data="allTestPeople" @node-click="handleNodeClick" accordion empty-text node-key="id"></el-tree>
            </div>
            <div class="middle">
              <el-button type="primary" plain @click="addTestPeopleTo">> 添加</el-button>
            </div>
            <div class="right">
              <h2>已添加人员列表</h2>
              <div class="table">
                <el-table :data="haveBindTestPeople" empty-text>
                  <el-table-column prop="role" label="人员" width="224" align="center"></el-table-column>
                  <el-table-column label="操作" width="224" align="center">
                    <template slot-scope="scope">
                      <el-button @click="deleteBindTestPeople(scope.$index)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeDialogBindTestPeople('close')">取 消</el-button>
              <el-button type="primary" @click="closeDialogBindTestPeople('confirm')">确 定</el-button>
            </div>
          </el-dialog> -->
          <!-- 测试人员列表 1071.16-->
          <el-form-item label="">
            <el-table ref="multipleTable" :data="testPeopleData" tooltip-effect="dark" style="width: 1070px" @selection-change="handleSelectionChange" border="" :header-cell-style="{background:'rgb(250, 250, 250)'}">
              <el-table-column type="selection" width="95" align="center"></el-table-column>
              <el-table-column prop="name" label="姓名" width="259" align="center"></el-table-column>
              <el-table-column prop="accountName" label="账户名" width="259"  align="center"></el-table-column>
              <el-table-column prop="department" label="部门" show-overflow-tooltip align="center" width="259"></el-table-column>
              <el-table-column label="操作" width="197" align="center" style="border-right: 1px solid #EBEEF5">
                <template slot-scope="scope">
                  <el-button @click="deltestPeople(scope.$index)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- 取消或者创建 -->
          <el-form-item label="">
            <el-button @click="returnMissionManage">取消</el-button>
            <el-button type="primary" @click="onSubmit('ruleForm')" v-if="this.$route.query.action === '0'">立即创建</el-button>
            <el-button type="primary" @click="onSubmitTwo('ruleForm')" v-if="this.$route.query.action === '0'">再建一个</el-button>
            <el-button type="primary" @click="upDate('ruleForm')" v-else>更新</el-button>
          </el-form-item>
        </el-form>
      </fieldset>
    </main>
  </div>
</template>

<script>
import SelectPeople from '../../components/selectPeople'
import { getUserPower, getAllProject, getChildrenItemByProject, addTaskPower, updateTaskPower, getTaskUserRelationInBufferPower, addTaskUserRelationInBufferPower, getUserByTaskPower, searchAndGetUsers } from '../../api/api'
export default {
  components: {
    SelectPeople
  },
  data () {
    return {
      ruleForm: {
        missionName: '',
        missionDesc: '',
        creator: '',
        dateRange: '',
        projectName: '',
        fromPorject: '',
        fromVersion: '',
        fromProduct: '',
        fromProductVersion: ''
      },
      rules: {
        missionName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个汉字', trigger: 'blur' }
        ],
        missionDesc: [
          { min: 1, max: 100, message: '长度在 1 到 100 个汉字', trigger: 'blur' }
        ],
        dateRange: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        fromProject: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ]
        // fromVersion: [
        //   { required: true, message: '请选择版本', trigger: 'change' }
        // ]
      },
      pickerOptions: {
      },
      testPeopleData: [
        // {
        //   id: 1001,
        //   name: '张三三',
        //   accountName: 'sansan.zhang',
        //   department: '测试部',
        //   assignedCaseSun: 50,
        //   workload: 5
        // }, {
        //   id: 1002,
        //   name: '李四',
        //   accountName: 'si.li',
        //   department: '测试部',
        //   assignedCaseSun: 50,
        //   workload: 5
        // }, {
        //   id: 1003,
        //   name: '王五',
        //   accountName: 'wu.wang',
        //   department: '测试部',
        //   assignedCaseSun: 50,
        //   workload: 5
        // }, {
        //   id: 1004,
        //   name: '赵六',
        //   accountName: 'liu.zhao',
        //   department: '测试部',
        //   assignedCaseSun: 50,
        //   workload: 5
        // }, {
        //   id: 1005,
        //   name: '钱七',
        //   accountName: 'qi.qian',
        //   department: '测试部',
        //   assignedCaseSun: 50,
        //   workload: 5
        // }, {
        //   id: 1006,
        //   name: '周八',
        //   accountName: 'ba.zhou',
        //   department: '测试部',
        //   assignedCaseSun: 50,
        //   workload: 5
        // }, {
        //   id: 1007,
        //   name: '黄九',
        //   accountName: 'jiu.huang',
        //   department: '测试部',
        //   assignedCaseSun: 50,
        //   workload: 5
        // }, {
        //   id: 1008,
        //   name: '郑十',
        //   accountName: 'shi.zheng',
        //   department: '测试部',
        //   assignedCaseSun: 50,
        //   workload: 5
        // }
      ],
      multipleSelect: [],
      showBindTestPeople: false,
      allTestPeople: [],
      haveBindTestPeople: [],
      preAddRole: '',
      timeChange: [],
      disabled: false,
      fromProject: [],
      fromVersion: [],
      fromProduct: [],
      fromProductVersion: [],
      selectStatus: true,
      projectId: '',
      versionId: '',
      showSelectPeople: false,
      bindUserData: [],
      havebindUserData: [],
      sendSearch: [],
      versionBol: false,
      versionBolBol: false,
      productBol: false,
      productBolBol: false,
      productVersionBol: false,
      productVersionId: '',
      showVersion: true,
      showProduct: true,
      haveVersion: false,
      haveProduct: false,
      haveVersionAndHaveProduct: false
    }
  },
  methods: {
    getSearchFromComponent (mes) {
      searchAndGetUsers({
        userName: mes.userName,
        searchType: mes.searchType
      }).then(res => {
        if (res.state === 1000) {
          // console.log(res.data.userList)
          this.sendSearch = res.data.userList
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试')
      })
    },
    commitBindPeople (user) {
      console.log(user)
      let member = []
      if (user.length === 0) {
        member = []
      } else {
        member = user.map(ele => ele.fullName.split('(')[1].split(')')[0]).join(',')
      }
      let tempTaskId = ''
      if (this.$route.query.action === '1') {
        tempTaskId = this.$route.query.id
      }
      addTaskUserRelationInBufferPower({
        taskId: tempTaskId,
        participantAccountNameList: member,
        creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName')
      }).then(res => {
        if (res.state === 1000) {
          this.showSelectPeople = false
          getTaskUserRelationInBufferPower({
            taskId: tempTaskId,
            creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName')
          }).then(res => {
            if (res.state === 1000) {
              this.testPeopleData = res.data.participantList
            } else {
              this.$message.error(res.message)
            }
          }, rej => {
            this.$message.error('网络错误')
          })
        } else {
          this.$message.error(res.message)
        }
      }, rej => [
        this.$message.error('网络错误')
      ])
    },
    changeShowSelectPeople (bol) {
      this.showSelectPeople = false
    },
    addNewProject () {
      this.$router.replace({
        path: '/createProject',
        query: {
          from: this.$route.query.from,
          action: ''
        }
      })
    },
    productVersionSelect (val) {
      if (val) {
        this.productVersionId = val
        this.versionId = ''
      }
    },
    productSelect (val) {
      if (val) {
        this.productVersionBol = false
        this.ruleForm.fromVersion = ''
        this.ruleForm.fromProductVersion = ''
      }
      this.productId = val
      getChildrenItemByProject({
        projectId: '',
        productId: val
      }).then(res => {
        if (res.state === 1000) {
          console.log(res)
          this.fromProductVersion = res.data.versionList.map(ele => {
            return {
              label: ele.versionName,
              value: ele.versionId
            }
          })
          // this.fromProduct = res.data.productList.map(ele => {
          //   return {
          //     label: ele.productName,
          //     value: ele.productId
          //   }
          // })
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('获取列表失败！')
      })
    },
    versionSelect (val) {
      if (val) {
        this.productVersionBol = true
      }
      this.ruleForm.fromProduct = ''
      this.productVersionId = ''
      this.versionId = val
    },
    // 项目选择
    projectSelect (val) {
      this.projectId = val
      this.ruleForm.fromVersion = ''
      this.ruleForm.fromProduct = ''
      this.ruleForm.fromProductVersion = ''
      this.productVersionBol = false
      // getVersionByProjectPower({id: val})
      //   .then(res => {
      //     if (res.state === 1000) {
      //       this.$set(this.ruleForm, 'fromVersion', '')
      //       this.fromVersion = res.data.versionList.map(ele => {
      //         return {
      //           label: ele.versionName,
      //           value: ele.versionId
      //         }
      //       })
      //       this.selectStatus = false
      //     } else {
      //       this.$message.error(res.message)
      //     }
      //   }, rej => {
      //     this.$message.error('获取该项目下的版本列表失败')
      //   })
      // 现根据项目展示版本或者产品
      getChildrenItemByProject({
        projectId: val,
        productId: ''
      }).then(res => {
        if (res.state === 1000) {
          this.fromVersion = res.data.versionList.map(ele => {
            return {
              label: ele.versionName,
              value: ele.versionId
            }
          })
          this.fromProduct = res.data.productList.map(ele => {
            return {
              label: ele.productName,
              value: ele.productId
            }
          })
          // 有版本，有产品
          if (this.fromVersion.length > 0 && this.fromProduct.length > 0) {
            this.haveVersion = false
            this.haveProduct = false
            this.haveVersionAndHaveProduct = true
          // 有版本，没有产品
          } else if (this.fromVersion.length > 0 && this.fromProduct.length === 0) {
            this.haveVersion = true
            this.haveProduct = false
            this.haveVersionAndHaveProduct = false
            // 没有版本，有产品
          } else if (this.fromVersion.length === 0 && this.fromProduct.length > 0) {
            this.haveVersion = false
            this.haveProduct = true
            this.haveVersionAndHaveProduct = false
            // 没有版本，没有产品
          } else {
            this.haveVersion = false
            this.haveProduct = false
            this.haveVersionAndHaveProduct = false
          }
          // if (this.fromVersion.length === 0) {
          //   this.versionBolBol = false
          //   this.showVersion = false
          // } else {
          //   this.versionBolBol = true
          //   this.showVersion = true
          // }
          // this.fromProduct = res.data.productList.map(ele => {
          //   return {
          //     label: ele.productName,
          //     value: ele.productId
          //   }
          // })
          // if (this.fromProduct.length === 0) {
          //   this.productBolBol = false
          //   this.showProduct = false
          // } else {
          //   this.productBolBol = true
          //   this.showProduct = true
          // }
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('获取列表失败！')
      })
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
    haveSelected (val) {
      this.timeChange = val
    },
    // 全选
    handleSelectionChange (val) {
      this.multipleSelect = val
    },
    onSubmit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let member = this.testPeopleData.map(ele => ele.id).join(',')
          let data = {
            taskName: this.ruleForm.missionName,
            taskDesc: this.ruleForm.missionDesc,
            creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
            projectId: this.projectId,
            versionId: this.versionId || this.productVersionId,
            startTime: this.timeChange[0],
            endTime: this.timeChange[1],
            testerId: member
          }
          addTaskPower(data)
            .then(res => {
              if (res.state === 1000) {
                this.$router.replace({
                  path: '/missionManage',
                  query: {
                    from: this.$route.query.from
                  }
                })
              } else {
                this.$message.error(res.message)
              }
            }, rej => {
              this.$message.error('网络错误')
            })
        } else {
          return false
        }
      })
    },
    onSubmitTwo (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let member = this.testPeopleData.map(ele => ele.id).join(',')
          let data = {
            taskName: this.ruleForm.missionName,
            taskDesc: this.ruleForm.missionDesc,
            creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
            projectId: this.projectId,
            versionId: this.versionId,
            startTime: this.timeChange[0],
            endTime: this.timeChange[1],
            testerId: member
          }
          addTaskPower(data)
            .then(res => {
              if (res.state === 1000) {
                this.$refs.ruleForm.resetFields()
                this.testPeopleData = []
              } else {
                this.$message.error(res.message)
              }
            }, rej => {
              this.$message.error('网络错误')
            })
        } else {
          return false
        }
      })
    },
    // 更新任务
    upDate (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let member = this.testPeopleData.map(ele => ele.id).join(',')
          let member2 = this.testPeopleData.map(ele => ele.accountName).join(',')
          let data = {
            id: this.$route.query.id,
            taskName: this.ruleForm.missionName,
            taskDesc: this.ruleForm.missionDesc,
            projectId: this.projectId,
            versionId: this.versionId || this.productVersionId,
            testerId: member,
            participantAccountNameList: member2,
            creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName')
          }
          updateTaskPower(data)
            .then(res => {
              if (res.state === 1000) {
                this.$router.replace({
                  path: '/missionManage',
                  query: {
                    from: this.$route.query.from
                  }
                })
              } else {
                this.$message.error(res.message)
              }
            }, rej => {
              this.$message.error('网络错误')
            })
        } else {
          return false
        }
      })
    },
    // 单独删除测试人员
    deltestPeople (index) {
      let tempDataA = JSON.parse(JSON.stringify(this.testPeopleData))
      tempDataA.splice(index, 1)
      let member = tempDataA.map(ele => ele.accountName)
      member = member.join(',')
      let tempTaskId = ''
      if (this.$route.query.action === '1') {
        tempTaskId = this.$route.query.id
      }
      addTaskUserRelationInBufferPower({
        taskId: tempTaskId,
        participantAccountNameList: member,
        creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName')
      }).then(res => {
        if (res.state === 1000) {
          this.testPeopleData.splice(index, 1)
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误')
      })
    },
    // 多选删除
    multipleDelete () {
      if (this.multipleSelect.length) {
        let prepareDeleteArr = this.multipleSelect.map(ele => ele.id)
        let _this = this
        let tempDataA = JSON.parse(JSON.stringify(this.testPeopleData))
        prepareDeleteArr.forEach(ele => {
          tempDataA.forEach((ele2, index) => {
            if (ele2.id === ele) {
              tempDataA.splice(index, 1)
            }
          })
        })
        let member = tempDataA.map(ele => ele.accountName).join(',')
        let tempTaskId = ''
        if (this.$route.query.action === '1') {
          tempTaskId = this.$route.query.id
        }
        addTaskUserRelationInBufferPower({
          taskId: tempTaskId,
          participantAccountNameList: member,
          creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName')
        }).then(res => {
          if (res.state === 1000) {
            prepareDeleteArr.forEach(ele => {
              _this.testPeopleData.forEach((ele2, index) => {
                if (ele2.id === ele) {
                  _this.testPeopleData.splice(index, 1)
                }
              })
            })
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
      }
    },
    // 取消返回上一个页面
    returnMissionManage () {
      this.$router.replace({
        path: '/missionManage',
        query: {
          from: this.$route.query.from
        }
      })
    },
    addTestPeople () {
      let data = {
        userName: '',
        accountName: '',
        department: '',
        startNum: 1,
        range: 0
      }
      let promise1 = getUserPower(data)
        .then(res => {
          if (res.state === 1000) {
            // 数据格式转换
            let arr = (Array.from(new Set(res.data.userList.map(ele => ele.department)))).map(ele => {
              return {
                label: ele,
                children: []
              }
            })
            res.data.userList.forEach(ele => {
              arr.forEach(ele2 => {
                if (ele2.label === ele.department) {
                  ele2.children.push(
                    {
                      accountName: ele.accountName,
                      label: ele.userName
                    }
                  )
                }
              })
            })
            return arr
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
      let tempTaskId = ''
      if (this.$route.query.action === '1') {
        tempTaskId = this.$route.query.id
      }
      let promise2 = getTaskUserRelationInBufferPower({
        taskId: tempTaskId,
        creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName')
      }).then(res => {
        if (res.state === 1000) {
          return res.data.participantList.map(ele => {
            return {
              accountName: ele.accountName,
              userName: ele.name
            }
          })
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误')
      })
      Promise.all([promise1, promise2]).then((res) => {
        // 显示选择用户列表的组件
        // console.log(res[0])
        // console.log(res[1])
        this.bindUserData = res[0]
        this.havebindUserData = res[1]
        this.showSelectPeople = true
      })
    },
    clickOther (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
    },
    handleNodeClick (data) {
      if (data.label !== '人员信息') {
        this.preAddRole = data.label
      }
    },
    addTestPeopleTo () {
      if (this.haveBindTestPeople.length === 0) {
        if (this.preAddRole !== '') {
          this.haveBindTestPeople.push({role: this.preAddRole})
        }
      } else {
        if (this.haveBindTestPeople.findIndex(ele => ele.role === this.preAddRole) === -1) {
          if (this.preAddRole !== '') {
            this.haveBindTestPeople.push({role: this.preAddRole})
          }
        } else {
          this.$message.error('绑定角色重复')
        }
      }
    },
    // 新建弹窗关闭
    // closeDialogBindTestPeople (action) {
    //   if (action === 'close') {
    //     this.showBindTestPeople = false
    //     this.haveBindTestPeople = []
    //   }
    //   if (action === 'confirm') {
    //     let member = []
    //     if (this.haveBindTestPeople.length === 0) {
    //       member = []
    //     } else {
    //       member = this.haveBindTestPeople.map(ele => ele.role.split('(')[1].split(')')[0]).join(',')
    //     }
    //     let tempTaskId = ''
    //     if (this.$route.query.action === '1') {
    //       tempTaskId = this.$route.query.id
    //     }
    //     addTaskUserRelationInBufferPower({
    //       taskId: tempTaskId,
    //       participantAccountNameList: member,
    //       creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName')
    //     }).then(res => {
    //       if (res.state === 1000) {
    //         this.showBindTestPeople = false
    //         getTaskUserRelationInBufferPower({
    //           taskId: tempTaskId,
    //           creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName')
    //         }).then(res => {
    //           if (res.state === 1000) {
    //             this.testPeopleData = res.data.participantList
    //           } else {
    //             this.$message.error(res.message)
    //           }
    //         }, rej => {
    //           this.$message.error('网络错误')
    //         })
    //       } else {
    //         this.$message.error(res.message)
    //       }
    //     }, rej => [
    //       this.$message.error('网络错误')
    //     ])
    //   }
    // },
    deleteBindTestPeople (index) {
      this.haveBindTestPeople.splice(index, 1)
    }
  },
  created () {
    // 1是编辑，0是创建，如果productName存在，那么就是项目下面绑定产品，产品下面绑定任务
    if (this.$route.query.action === '1') {
      this.projectId = this.$route.query.projectId
      this.versionId = this.$route.query.versionId
      if (this.$route.query.productName) {
        // this.showVersion = false
        this.haveVersion = false
        this.haveProduct = true
        this.haveVersionAndHaveProduct = false
        this.ruleForm = {
          missionName: this.$route.query.taskName,
          missionDesc: this.$route.query.taskDesc,
          dateRange: [this.$route.query.startTime, this.$route.query.endTime],
          fromProductVersion: this.$route.query.versionName,
          fromProject: this.$route.query.projectName,
          fromProduct: this.$route.query.productName
        }
        // this.ruleForm.fromProduct = this.$route.query.projectName
      } else {
        this.haveVersion = true
        this.haveProduct = false
        this.haveVersionAndHaveProduct = false
        this.ruleForm = {
          missionName: this.$route.query.taskName,
          missionDesc: this.$route.query.taskDesc,
          dateRange: [this.$route.query.startTime, this.$route.query.endTime],
          fromProductVersion: '',
          fromVersion: this.$route.query.versionName,
          fromProject: this.$route.query.projectName
        }
      }
      console.log(this.ruleForm)
      if (localStorage.getItem('userName')) {
        this.$set(this.ruleForm, 'creator', localStorage.getItem('userName') + '(' + localStorage.getItem('accountName') + ')')
      } else {
        this.$set(this.ruleForm, 'creator', sessionStorage.getItem('userName') + '(' + sessionStorage.getItem('accountName') + ')')
      }
      getUserByTaskPower({ taskId: this.$route.query.id, accountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName') })
        .then(res => {
          if (res.state === 1000) {
            this.testPeopleData = res.data.taskData
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
    } else {
      if (localStorage.getItem('userName')) {
        this.ruleForm.creator = localStorage.getItem('userName') + '(' + localStorage.getItem('accountName') + ')'
      } else {
        this.ruleForm.creator = sessionStorage.getItem('userName') + '(' + sessionStorage.getItem('accountName') + ')'
      }
    }
    this.getAllProject()
  }
}
</script>

<style>
  .createMissionApp {
    width: 100%
  }
  .createMissionApp > .header {
    width: 1188px;
    margin: 0 auto;
    height: 14px;
    padding: 10px 0px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc
  }
  .createMissionApp > .header > .breadcrumb {
    margin-left: 10px
  }
  .createMissionApp > .main {
    width: 1188px;
    margin: 10px auto
  }
  .createMissionApp > .main > fieldset {
    border: 1px solid #ccc
  }
  .createMissionApp > .main > fieldset > legend {
    margin-left: 20px
  }
  .createMissionApp > .main > fieldset > .versionForm {
    margin-top: 40px;
    padding-bottom: 40px;
    width: 100%
  }
  .createMissionApp > .main > fieldset > .versionForm > .el-form-item {
    width: 99%;
    margin-bottom: 40px
  }
  .createMissionApp > .main > fieldset > .versionForm > .testerAccountName {
    position: relative
  }
  .createMissionApp > .main > fieldset > .versionForm > .testerAccountName > .el-form-item__content > .el-button:nth-of-type(1) {
    position: absolute;
    right: 100px
  }
  .createMissionApp > .main > fieldset > .versionForm > .testerAccountName > .el-form-item__content > .el-button:nth-of-type(2) {
    position: absolute;
    right: 0px
  }
  .createMissionApp > .main > fieldset > .versionForm > .el-form-item:last-of-type {
    position: relative
  }
  .createMissionApp > .main > fieldset > .versionForm > .el-form-item:last-of-type > .el-form-item__content > .el-button:nth-last-of-type(3) {
    position: absolute;
    left: 30%
  }
  .createMissionApp > .main > fieldset > .versionForm > .el-form-item:last-of-type > .el-form-item__content > .el-button:nth-last-of-type(2) {
    position: absolute;
    left: 40%
  }
  .createMissionApp > .main > fieldset > .versionForm > .el-form-item:last-of-type > .el-form-item__content > .el-button:nth-last-of-type(1) {
    position: absolute;
    left: 54%
  }
  .createMissionApp > .main > fieldset > .versionForm > .el-form-item:nth-last-of-type(2) > .el-form-item__content > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th {
    padding: 0px 0px
  }
  .createMissionApp > .main > fieldset > .versionForm > .el-form-item:nth-last-of-type(2) > .el-form-item__content > .el-table > .el-table__body-wrapper {
    min-height: 49px;
    max-height: 490px;
    overflow-y: auto;
    overflow-x: hidden
  }
  .createMissionApp > .main > fieldset > .versionForm > .el-form-item:nth-last-of-type(2) > .el-form-item__content > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
    padding: 8.5px 0px
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog {
    width: 1000px;
    height: 600px
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 500px;
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .left {
    width: 300px;
    float: left;
    margin-left: 30px
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .left > h2 {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #ccc;
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .left > .el-tree {
    width: 298px;
    height: 448px;
    border: 1px solid #DCDFE6;
    overflow-y: auto;
    overflow-x: hidden
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .middle {
    width: 80px;
    float: left;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 50px
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .middle > .el-button {
    width: 80px;
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right {
    width: 450px;
    float: left;
    height: 500px;
    margin-left: 50px
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right > h2 {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #ccc;
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right > .table{
    width: 448px;
    height: 450px;
    border-left: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right > .table > .el-table {
    width: 448px;
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
    border-right: 1px solid #DCDFE6
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper {
    height: 402px;
    overflow-y: auto
  }
  .createMissionApp > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
    border-right: 1px solid #DCDFE6;
    height: 40px;
    padding: 3px 0
  }
  .createMissionApp > .main > fieldset > .versionForm > .newProject {
    /* display: inline-block; */
    width: 98px;
    float: right;
    margin-right: 110px
  }
</style>
