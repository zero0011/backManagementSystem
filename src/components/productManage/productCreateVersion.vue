<template>
  <div class="productCreateVersion">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/projectControl' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="jumpProductList">产品列表</el-breadcrumb-item>
        <el-breadcrumb-item v-html="$route.query.action === '1'?'编辑版本':'创建版本'"></el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main class="main">
      <fieldset>
        <!-- <legend>版本基本信息</legend> -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="versionForm">
          <!-- 版本名称 -->
          <el-form-item label="版本名称" prop="versionName">
            <el-input v-model.trim="ruleForm.versionName" placeholder="字符长度限制30"></el-input>
          </el-form-item>
          <!-- 版本描述 -->
          <el-form-item label="版本描述" prop="versionDesc">
            <el-input type="textarea" v-model.trim="ruleForm.versionDesc" placeholder="字符长度限制100"></el-input>
          </el-form-item>
          <!-- 创建人 -->
          <el-form-item label="创建人" prop="creator">
            <el-input :disabled="true" v-model="ruleForm.creator"></el-input>
          </el-form-item>
          <!-- 开始时间与结束时间 -->
          <!-- <el-form-item label="时间选择" prop="dateRange">
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
          </el-form-item> -->
          <el-form-item label="时间选择" prop="dateRange">
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
          <el-form-item label="所属项目" prop="projectName">
            <el-input :disabled="true" v-model="ruleForm.projectName"></el-input>
          </el-form-item>
          <!-- 所属产品 -->
          <el-form-item label="所属产品" prop="productName">
            <el-input :disabled="true" v-model="ruleForm.productName"></el-input>
          </el-form-item>
          <!-- 测试人员 -->
          <!-- <el-form-item label="测试人员" prop="testerAccountName" class="testerAccountName">
            <el-button type="primary" @click="addTestPeople">新增</el-button>
            <el-button type="primary" @click="multipleDelete">删除</el-button>
          </el-form-item> -->
          <!-- 绑定测试人员 -->
          <!-- <SelectPeople :showSelectPeople="showSelectPeople" :bindUserData="bindUserData" :havebindUserData="havebindUserData" @changeShowSelectPeople='changeShowSelectPeople' @commitBindPeople="commitBindPeople" @searchFromComponent='getSearchFromComponent' :getSearch='sendSearch'></SelectPeople> -->
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
          <!-- <el-form-item label="">
            <el-table ref="multipleTable" :data="testPeopleData" tooltip-effect="dark" style="width: 1070px" @selection-change="handleSelectionChange" border="">
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
          </el-form-item> -->
          <!-- 取消或者创建 -->
          <el-form-item label="">
            <el-button @click="returnVersionManage">取消</el-button>
            <el-button type="primary" @click="onSubmit('ruleForm')" v-if="this.$route.query.action === '0'">立即创建</el-button>
            <el-button type="primary" @click="upDate('ruleForm')" v-else>更新</el-button>
          </el-form-item>
        </el-form>
      </fieldset>
    </main>
  </div>
</template>

<script>
import SelectPeople from '../../components/selectPeople'
import { getUserPower, getVersionParticipantInBufferPower, updateVersionParticipantInBufferPower, addVersionOfProduct, getVersionParticipantPower, updateVersionOfProduct, searchAndGetUsers } from '../../api/api'
export default {
  components: {
    SelectPeople
  },
  data () {
    return {
      ruleForm: {
        versionName: '',
        versionDesc: '',
        creator: '',
        dateRange: '',
        projectName: '',
        productName: '',
        jumpProductList: {}
      },
      rules: {
        versionName: [
          { required: true, message: '请输入用例集名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个汉字', trigger: 'blur' }
        ],
        versionDesc: [
          { min: 1, max: 100, message: '长度在 1 到 100 个汉字', trigger: 'blur' }
        ],
        dateRange: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
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
      showSelectPeople: false,
      bindUserData: [],
      havebindUserData: [],
      sendSearch: []
    }
  },
  methods: {
    // returnToProductList () {
    //   this.returnVersionManage()
    // },
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
      // console.log(user)
      let member = []
      if (user.length === 0) {
        member = []
      } else {
        member = user.map(ele => ele.fullName.split('(')[1].split(')')[0]).join(',')
      }
      let verId = ''
      if (this.$route.query.action === '1') {
        verId = this.$route.query.versionId
      }
      updateVersionParticipantInBufferPower({
        projectId: this.$route.query.projectId,
        versionId: verId,
        creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
        participantAccountNameList: member
      }).then(res => {
        if (res.state === 1000) {
          this.showSelectPeople = false
          getVersionParticipantInBufferPower({
            projectId: this.$route.query.projectId,
            versionId: verId,
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
    // ["2019-08-08", "2019-09-20", __ob__: Observer]
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
          let member = this.testPeopleData.map(ele => ele.accountName).join(',')
          let data = {
            productId: this.$route.query.productId,
            versionName: this.ruleForm.versionName,
            versionDesc: this.ruleForm.versionDesc,
            creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
            startTime: this.timeChange[0],
            endTime: this.timeChange[1],
            participantAccountNameList: member
          }
          addVersionOfProduct(data)
            .then(res => {
              if (res.state === 1000) {
                // this.$router.replace({
                //   path: '/versionManage',
                //   query: {
                //     from: this.$route.query.from,
                //     projectName: this.$route.query.projectName,
                //     projectId: this.$route.query.projectId
                //   }
                // })
                this.$router.push({
                  path: '/productVersion',
                  query: {
                    projectName: this.$route.query.projectName,
                    projectId: this.$route.query.projectId,
                    productName: this.$route.query.productName,
                    productId: this.$route.query.productId
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
    // 更新版本
    upDate (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // let member = this.testPeopleData.map(ele => ele.accountName).join(',')
          // let data = {
          //   projectId: this.$route.query.projectId,
          //   versionName: this.ruleForm.versionName,
          //   versionDesc: this.ruleForm.versionDesc,
          //   creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
          //   startTime: this.timeChange[0],
          //   endTime: this.timeChange[1],
          //   participantAccountNames: member
          // }
          // addVersionPower(data)
          //   .then(res => {
          //     if (res.state === 1000) {
          //       this.$router.replace({
          //         path: '/versionManage',
          //         query: {
          //           from: this.$route.query.from,
          //           projectName: this.$route.query.projectName,
          //           projectId: this.$route.query.projectId
          //         }
          //       })
          //     } else {
          //       this.$message.error(res.message)
          //     }
          //   }, rej => {
          //     this.$message.error('网络错误')
          //   })
          let member = this.testPeopleData.map(ele => ele.accountName).join(',')
          let data = {
            id: this.$route.query.versionId,
            versionName: this.ruleForm.versionName,
            versionDesc: this.ruleForm.versionDesc,
            creatorAccountName: this.ruleForm.creator.split('(')[1].split(')')[0],
            startTime: this.ruleForm.dateRange[0],
            endTime: this.ruleForm.dateRange[1],
            participantAccountNameList: member
          }
          updateVersionOfProduct(data)
            .then(res => {
              if (res.state === 1000) {
                // this.$router.replace({
                //   path: '/versionManage',
                //   query: {
                //     from: this.$route.query.from,
                //     projectName: this.$route.query.projectName,
                //     projectId: this.$route.query.projectId
                //   }
                // })
                this.$router.push({
                  path: '/productVersion',
                  query: {
                    projectName: this.$route.query.projectName,
                    projectId: this.$route.query.projectId,
                    productName: this.$route.query.productName,
                    productId: this.$route.query.productId
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
      let verId = ''
      if (this.$route.query.action === '1') {
        verId = this.$route.query.versionId
      }
      updateVersionParticipantInBufferPower({
        projectId: this.$route.query.projectId,
        versionId: verId,
        creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
        participantAccountNameList: member
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
        let verId = ''
        if (this.$route.query.action === '1') {
          verId = this.$route.query.versionId
        }
        updateVersionParticipantInBufferPower({
          projectId: this.$route.query.projectId,
          versionId: verId,
          creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
          participantAccountNameList: member
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
    returnVersionManage () {
      if (this.$route.query.action === '0') {
        this.$router.push({
          path: '/productList',
          query: {
            projectName: this.$route.query.projectName,
            projectId: this.$route.query.projectId
          }
        })
      } else {

      }
      // this.$router.replace({
      //   path: '/versionManage',
      //   query: {
      //     from: this.$route.query.from,
      //     projectName: this.$route.query.projectName,
      //     projectId: this.$route.query.projectId
      //   }
      // })
    },
    // 点击新增
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
            // let obj = {}
            // return res.data.userList.forEach(ele => {
            //   new Set()
            // })
            // let tempData = res.data.userList
            // let newArray = tempData.map(ele => {
            //   return {
            //     label: ele.userName + '(' + ele.accountName + ')'
            //   }
            // })
            // this.allTestPeople = [{
            //   label: '人员信息',
            //   children: newArray
            // }]
            // this.showBindTestPeople = true
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
      let verId = ''
      if (this.$route.query.action === '1') {
        verId = this.$route.query.versionId
      }
      // let promise2 = getTaskUserRelationInBufferPower({
      //   taskId: tempTaskId,
      //   creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName')
      // }).then(res => {
      //   if (res.state === 1000) {
      //     return res.data.participantList.map(ele => {
      //       return {
      //         accountName: ele.accountName,
      //         userName: ele.name
      //       }
      //     })
      //     // let tempData = res.data.participantList
      //     // this.haveBindTestPeople = tempData.map(ele => {
      //     //   return {
      //     //     role: ele.name + '(' + ele.accountName + ')'
      //     //   }
      //     // })
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // }, rej => {
      //   this.$message.error('网络错误')
      // })
      let promise2 = getVersionParticipantInBufferPower({
        projectId: this.$route.query.projectId,
        versionId: verId,
        creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName')
      }).then(res => {
        if (res.state === 1000) {
          return res.data.participantList.map(ele => {
            return {
              accountName: ele.accountName,
              userName: ele.name
            }
          })
          // let tempData = res.data.participantList
          // this.haveBindTestPeople = tempData.map(ele => {
          //   return {
          //     role: ele.name + '(' + ele.accountName + ')'
          //   }
          // })
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误')
        // let tempData = [
        //   {
        //     id: 3333,
        //     name: '周午超',
        //     accountName: 'v-wuchao.zhou',
        //     department: '测试部'
        //   }, {
        //     id: 4444,
        //     name: '高克非',
        //     accountName: 'kefei.gao',
        //     department: '测试部'
        //   }
        // ]
        // this.haveBindTestPeople = tempData.map(ele => {
        //   return {
        //     role: ele.name + '(' + ele.accountName + ')'
        //   }
        // })
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
    // 关闭选择测试人员的弹窗
    closeDialogBindTestPeople (action) {
      if (action === 'close') {
        this.showBindTestPeople = false
        this.haveBindTestPeople = []
      }
      if (action === 'confirm') {
        let member = []
        if (this.haveBindTestPeople.length === 0) {
          member = []
        } else {
          member = this.haveBindTestPeople.map(ele => ele.role.split('(')[1].split(')')[0]).join(',')
        }
        let verId = ''
        if (this.$route.query.action === '1') {
          verId = this.$route.query.versionId
        }
        updateVersionParticipantInBufferPower({
          projectId: this.$route.query.projectId,
          versionId: verId,
          creatorAccountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
          participantAccountNameList: member
        }).then(res => {
          if (res.state === 1000) {
            this.showBindTestPeople = false
            getVersionParticipantInBufferPower({
              projectId: this.$route.query.projectId,
              versionId: verId,
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
        // this.showBindTestPeople = false
      }
    },
    deleteBindTestPeople (index) {
      this.haveBindTestPeople.splice(index, 1)
    }
  },
  created () {
    // 1是编辑，0是创建
    if (this.$route.query.action === '1') {
      this.ruleForm = {
        versionName: this.$route.query.versionName,
        versionDesc: this.$route.query.versionDesc,
        dateRange: [this.$route.query.startTime, this.$route.query.endTime],
        projectName: this.$route.query.projectName,
        productName: this.$route.query.productName
      }
      if (localStorage.getItem('userName')) {
        this.$set(this.ruleForm, 'creator', localStorage.getItem('userName') + '(' + localStorage.getItem('accountName') + ')')
      } else {
        this.$set(this.ruleForm, 'creator', sessionStorage.getItem('userName') + '(' + sessionStorage.getItem('accountName') + ')')
      }
      getVersionParticipantPower({versionId: this.$route.query.versionId})
        .then(res => {
          if (res.state === 1000) {
            this.testPeopleData = res.data.participantList
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
    } else {
      this.jumpProductList = {
        path: '/productList',
        query: {
          projectName: this.$route.query.projectName,
          projectId: this.$route.query.projectId
        }
      }
      this.ruleForm.projectName = this.$route.query.projectName
      this.ruleForm.productName = this.$route.query.productName
      if (localStorage.getItem('userName')) {
        this.ruleForm.creator = localStorage.getItem('userName') + '(' + localStorage.getItem('accountName') + ')'
      } else {
        this.ruleForm.creator = sessionStorage.getItem('userName') + '(' + sessionStorage.getItem('accountName') + ')'
      }
    }
  }
}
</script>

<style>
  .productCreateVersion {
    width: 100%
  }
  .productCreateVersion > .header {
    width: 1188px;
    margin: 0 auto;
    height: 14px;
    padding: 10px 0px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc
  }
  .productCreateVersion > .header > .breadcrumb {
    margin-left: 10px
  }
  .productCreateVersion > .main {
    width: 1188px;
    margin: 10px auto
  }
  .productCreateVersion > .main > fieldset {
    border: 1px solid #ccc
  }
  .productCreateVersion > .main > fieldset > legend {
    margin-left: 20px
  }
  .productCreateVersion > .main > fieldset > .versionForm {
    margin-top: 40px;
    padding-bottom: 40px;
    width: 100%
  }
  .productCreateVersion > .main > fieldset > .versionForm > .el-form-item {
    width: 99%;
    margin-bottom: 40px
  }
  .productCreateVersion > .main > fieldset > .versionForm > .testerAccountName {
    position: relative
  }
  .productCreateVersion > .main > fieldset > .versionForm > .testerAccountName > .el-form-item__content > .el-button:nth-of-type(1) {
    position: absolute;
    right: 100px
  }
  .productCreateVersion > .main > fieldset > .versionForm > .testerAccountName > .el-form-item__content > .el-button:nth-of-type(2) {
    position: absolute;
    right: 0px
  }
  .productCreateVersion > .main > fieldset > .versionForm > .el-form-item:last-of-type {
    position: relative
  }
  .productCreateVersion > .main > fieldset > .versionForm > .el-form-item:last-of-type > .el-form-item__content > .el-button:nth-last-of-type(2) {
    position: absolute;
    left: 40%
  }
  .productCreateVersion > .main > fieldset > .versionForm > .el-form-item:last-of-type > .el-form-item__content > .el-button:nth-last-of-type(1) {
    position: absolute;
    left: 50%
  }
  .productCreateVersion > .main > fieldset > .versionForm > .el-form-item:nth-last-of-type(2) > .el-form-item__content > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th {
    padding: 0px 0px
  }
  .productCreateVersion > .main > fieldset > .versionForm > .el-form-item:nth-last-of-type(2) > .el-form-item__content > .el-table > .el-table__body-wrapper {
    min-height: 49px;
    max-height: 490px;
    overflow-y: auto;
    overflow-x: hidden
  }
  .productCreateVersion > .main > fieldset > .versionForm > .el-form-item:nth-last-of-type(2) > .el-form-item__content > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
    padding: 8.5px 0px
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog {
    width: 1000px;
    height: 600px
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 500px;
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .left {
    width: 300px;
    float: left;
    margin-left: 30px
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .left > h2 {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #ccc;
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .left > .el-tree {
    width: 298px;
    height: 448px;
    border: 1px solid #DCDFE6;
    overflow-y: auto;
    overflow-x: hidden
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .middle {
    width: 80px;
    float: left;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 50px
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .middle > .el-button {
    width: 80px;
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right {
    width: 450px;
    float: left;
    height: 500px;
    margin-left: 50px
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right > h2 {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #ccc;
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right > .table{
    width: 448px;
    height: 450px;
    border-left: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right > .table > .el-table {
    width: 448px;
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
    border-right: 1px solid #DCDFE6
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper {
    height: 402px;
    overflow-y: auto
  }
  .productCreateVersion > .main > fieldset > .versionForm > .bindTestPeople > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
    border-right: 1px solid #DCDFE6;
    height: 40px;
    padding: 3px 0
  }
</style>
