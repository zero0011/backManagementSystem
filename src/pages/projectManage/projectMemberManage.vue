<template>
  <div class="projectMemberManageApp">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/projectControl' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{projectName}}</el-breadcrumb-item>
        <el-breadcrumb-item>项目人力</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="container">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>当前资源</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div>
            <el-button
              type="primary"
              @click="addPersonNew"
              style="float:right;margin-bottom: 10px;"
            >新增</el-button>
            <el-button
              type="primary"
              @click="multipleDelete"
              style="float:right;margin-right:20px;margin-bottom: 10px;"
            >删除</el-button>
            <el-table
              ref="memeberTable"
              :data="memeberTable"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              border
              :header-cell-style="{background:'rgb(250, 250, 250)'}"
            >
              <el-table-column type="selection" width="95" align="center"></el-table-column>
              <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
              <el-table-column prop="accountName" label="账户名" align="center"></el-table-column>
              <el-table-column prop="department" label="部门" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column prop="type" label="人员类型" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column
                prop="manpowerPutIn"
                label="投入值"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.manpowerPutIn"
                    placeholder="请输入数字"
                    @blur="submitManPowerPutIn(scope.row,scope.row.accountName,scope.row.manpowerPutIn)"
                    style="width:100px;"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="statusPutIn" label="投入状态" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.statusPutIn == 1" class="circlered"></span>
                  <span v-if="scope.row.statusPutIn == 2" class="circleorange"></span>
                  <span v-if="scope.row.statusPutIn == 3" class="circlegreen"></span>
                  <span v-if="scope.row.statusPutIn == 4" class="circleblue"></span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="delMember(scope.row.accountName)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
              :current-page.sync="startNum"
              :page-sizes="[5, 10, 20]"
              :page-size="range"
              :total="total"
              layout="total, sizes, prev, pager, next"
              @size-change="rangeChange"
              @current-change="startNumChange"
              style="margin-top: 10px;margin-left: -10px"
            ></el-pagination>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>期望资源</span>
          </div>
          <div>
            <el-table
              ref="expectMemberTable"
              :data="expectMemberTable"
              tooltip-effect="dark"
              style="width: 100%"
              border
              :header-cell-style="{background:'rgb(250, 250, 250)'}"
            >
              <el-table-column prop="regular" label="正式（人力）" align="center">
                <!-- <input type="text" placeholder="请输入"> -->
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.regular"
                    placeholder="请输入数字"
                    @blur="submitRegularExpectNumber(scope.row, scope.row.regular, 1)"
                    style="width:100px;"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="partner" label="合作方（人力）" align="center">
                <template slot-scope="scope">
                  <!-- <el-button @click="jumpToVersionList(scope.row)" type="text" size="small">{{ scope.row.projectName }}</el-button> -->
                  <el-input
                    v-model="scope.row.partner"
                    placeholder="请输入数字"
                    @blur="submitRegularExpectNumber(scope.row, scope.row.partner, 2)"
                    style="width:100px;"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="intern" label="实习（人力）" align="center">
                <template slot-scope="scope">
                  <!-- <el-button @click="jumpToVersionList(scope.row)" type="text" size="small">{{ scope.row.projectName }}</el-button> -->
                  <el-input
                    v-model="scope.row.intern"
                    placeholder="请输入数字"
                    @blur="submitRegularExpectNumber(scope.row, scope.row.intern, 3)"
                    style="width:100px;"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>

        <footer>
          <el-button type="primary" @click="returnLastePage">返回</el-button>
        </footer>
      </div>
    </main>

    <!-- 绑定角色弹层 -->
    <!-- <el-dialog :visible.sync="showDialogUser" :show-close="hide" :before-close="clickOther" class="bindUser">
            <div class="left">
              <h2>待添加人员列表</h2>
              <el-tree :data="bindRole" @node-click="handleNodeClick" accordion empty-text node-key="id"></el-tree>
            </div>
            <div class="middle">
              <el-button type="primary" plain @click="addRole">> 添加</el-button>
            </div>
            <div class="right">
              <h2>已添加人员列表</h2>
              <div class="table">
                <el-table :data="haveBindUser" empty-text>
                  <el-table-column prop="role" label="人员" width="224" align="center"></el-table-column>
                  <el-table-column label="操作" width="224" align="center">
                    <template slot-scope="scope">
                      <el-button @click="deleteBindUser(scope.$index)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeDialogBindUser('close')">取 消</el-button>
              <el-button type="primary" @click="closeDialogBindUser('confirm')">确 定</el-button>
            </div>
    </el-dialog>-->
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
import { getManPowerInProject, getExpectManPowerInProject, updateManPowerInProject, updateExpectManPowerInProject,
  getUserPower, getPorjectParticipant, updatePorjectParticipant, addManPowerWithProject, deleteManPowerWithProject, getUserListPower, searchAndGetUsers} from '../../api/api'
import SelectPeople from '../../components/selectPeople'
export default {
  components: {
    SelectPeople
  },
  data() {
    return {
      memeberTable: [],
      regularInput: '',

      // 角色弹层
      showDialogUser: false,
      allUser: [],
      bindRole: [],
      haveBindUser: [],
      haveBindUserTemp: [],
      hide: false,
      preAddRole: '',
      tempAddRole: [],
      deleteWindow: false,
      count: 0,

      expectMemberTable: [
        {
          regular: '',
          partner: '',
          intern: ''
        }
      ],
      multipleSelect: [],
      projectId: '',
      projectName: '',
      // 分页
      startNum: 1,
      range: 10,
      total: null,

      showSelectPeople: false,
      bindUserData: [],
      havebindUserData: [],
      sendSearch: [],
      closeDialogBindUserParam: true
    }
  },
  methods: {

    getSearchFromComponent(mes) {
      console.log(mes)
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

    // 新版人员选择控件，提交已绑定人员数据
    commitBindPeople(val) {
      console.log(val)
      if (!this.closeDialogBindUserParam) {
        this.closeDialogBindUser('close')
      } else {
        this.closeDialogBindUser('confirm', val)
      }
    },
    changeShowSelectPeople(val) {
      // this.closeDialogBindUserParam = val;
      this.showSelectPeople = false
      console.log(val)
    },
    // 期望资源输入框校验
    submitRegularExpectNumber(row, regular, type) {
      // 校验非空
      if (regular === '' || regular === null) {
        this.$message.error('期望人力不能为为空，请重新输入')
        row.regular = ''
        // 校验非数字
      } else if (Number.isNaN(Number.parseFloat(regular))) {
        this.$message.error('期望人力不能为非数字，请重新输入')
        row.regular = ''
      } else {
        let queryData = {
          projectId: this.projectId,
          memberNumber: (Number.parseFloat(regular)).toFixed(1).toString(),
          memberType: type
        }
        if (type === 1) {
          updateExpectManPowerInProject(queryData)
            .then(res => {
              if (res.state === 1000) {
                this.$message.success('更新成功')
                row.regular = queryData.memberNumber
              } else {
                setTimeout(() => {
                  this.$message.error(res.message)
                }, 100)
              }
            }, rej => {
              this.errorAjax()
            })
        }
        if (type === 2) {
          updateExpectManPowerInProject(queryData)
            .then(res => {
              if (res.state === 1000) {
                this.$message.success('更新成功')
                row.partner = queryData.memberNumber
              } else {
                setTimeout(() => {
                  this.$message.error(res.message)
                }, 100)
              }
            }, rej => {
              this.errorAjax()
            })
        }
        if (type === 3) {
          updateExpectManPowerInProject(queryData)
            .then(res => {
              if (res.state === 1000) {
                this.$message.success('更新成功')
                row.intern = queryData.memberNumber
              } else {
                setTimeout(() => {
                  this.$message.error(res.message)
                }, 100)
              }
            }, rej => {
              this.errorAjax()
            })
        }
      }
      // else {
      //   console.log(Number.parseFloat(regular))
      //   console.log(typeof Number.parseFloat(regular))
      // }
      //   if(/^[0-9]*$/i.test(regular)){
      //     if(regular == '' || regular == null){
      //       this.$message.error("期望人数不能为为空，请重新输入");
      //       row.regular = ''
      //       return
      //     }

      //   //向后台提交投入值数据
      //   let queryData = {
      //     projectId:this.projectId,
      //     memberNumber:regular,
      //     memberType:1
      //   }
      // updateExpectManPowerInProject(queryData)
      // .then(res => {
      //     if (res.state === 1000) {
      //       this.$message.success("更新成功");
      //     }else{
      //           setTimeout(() => {
      //           this.$message.error(res.message);
      //           }, 100)
      //       }}, rej => {
      //             this.errorAjax()
      //             }
      //       )

      //   }else{
      //     this.$message.error("期望人数只能为数字，请重新输入");
      //     row.regular = ''
      //     return
      //   }
    },
    // submitPartnerExpectNumber(row,partner){
    //   console.log(partner)
    //   console.log(typeof partner)
    //   console.log(partner == '' || partner == null)
    //   if(/^[0-9]*$/i.test(partner)){
    //         if(partner == '' || partner == null){
    //           this.$message.error("期望人数不能为为空，请重新输入");
    //           row.partner = ''
    //           return
    //         }

    //       //向后台提交投入值数据
    //       let queryData = {
    //         projectId:this.projectId,
    //         memberNumber:partner,
    //         memberType:2
    //       }
    //       updateExpectManPowerInProject(queryData)
    //       .then(res => {
    //           if (res.state === 1000) {
    //             this.$message.success("更新成功");
    //           }else{
    //                 setTimeout(() => {
    //                 this.$message.error(res.message);
    //                 }, 100)
    //             }}, rej => {
    //                   this.errorAjax()
    //                   }
    //             )

    //       }else{
    //         this.$message.error("期望人数只能为数字，请重新输入");
    //         row.partner = ''
    //         return
    //       }
    // },
    // submitInternExpectNumber(row,intern){

    //     if(/^[0-9]*$/i.test(intern)){
    //         if(intern == '' || intern == null){
    //           this.$message.error("期望人数不能为为空，请重新输入");
    //           row.intern = ''
    //           return
    //         }

    //       //向后台提交投入值数据
    //       let queryData = {
    //         projectId:this.projectId,
    //         memberNumber:intern,
    //         memberType:3
    //       }

    //     updateExpectManPowerInProject(queryData)
    //     .then(res => {
    //         if (res.state === 1000) {
    //           this.$message.success("更新成功");
    //         }else{
    //               setTimeout(() => {
    //               this.$message.error(res.message);
    //               }, 100)
    //           }}, rej => {
    //                 this.errorAjax()
    //                 }
    //           )

    //     }else{
    //       this.$message.error("期望人数只能为数字，请重新输入");
    //       row.intern = ''
    //       return
    //     }

    // },

    // v1.5.1版本 人员选择控件弹层（New）
    addPersonNew() {
      // this.showSelectPeople = true
      // console.log(this.showSelectPeople)
      // this.userGroupId = rowData.userGroupId
      // this.showDialogBindUser = true
      let promise1 = getUserListPower({
        startNum: 1,
        range: 0
      }).then(res => {
        if (res.state === 1000) {
          // this.bindUserData = res.data.userList
          return res.data.userList
        } else {
          this.errorAjax()
        }
      }, rej => {
        this.errorAjax()
      })
      // let promise2 = getGroupUserRelationPower({
      //   userGroupId: this.userGroupId
      // }).then(res => {
      //   if (res.state === 1000) {
      //     // this.havebindUserData = res.data.userList
      //     // console.log(this.havebindUserData)
      //     return res.data.userList
      //   } else {
      //     this.errorAjax()
      //   }
      // }, rej => {
      //   this.errorAjax()
      // })
      // 这里显示已绑定人员数据，获取数据
      // 这里显示已绑定人员数据
      let queryData = {
        projectId: this.projectId,
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      }
      let promise2 = getPorjectParticipant(queryData)
        .then(res1 => {
          if (res1.state === 1000) {
            this.haveBindUser.length = 0
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
        this.showSelectPeople = true
      })
    },

    // addPerson方法已废弃
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
            // console.log(res.data.userList)
            let tempData = res.data.userList
            this.allUser = res.data.userList
            // console.log(tempData)
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

      // 这里显示已绑定人员数据
      let queryData = {
        projectId: this.projectId,
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      }

      getPorjectParticipant(queryData)
        .then(res1 => {
          if (res1.state === 1000) {
            this.haveBindUser.length = 0
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
    addRole() {
      // console.log(this.preAddRole.split('(')[1].split(')')[0])
      let tableDataArr = []
      this.haveBindUser.forEach(ele => {
        tableDataArr.push(ele.role)
      })
      if (tableDataArr.indexOf(this.preAddRole) === -1) {
        let data = {
          role: this.preAddRole
        }
        if (data.role !== '') {
          // this.$store.commit('changeprePerson', data)
          this.tempAddRole.push(data)
          this.haveBindUser.push(data)
          // this.preAddRoleArr.push(this.preAddRole.split('(')[1].split(')')[0])
        }
      } else {
        this.$message({
          type: 'warning',
          message: '绑定角色重复',
          duration: 1000
        })
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

    multipleDelete() {
      // 定义临时数组，用于存放勾选数据的索引

      let tempPreDelDataIndex = []
      if (this.multipleSelect.length) {
        this.multipleSelect.forEach(ele => {
          // tempPreDelData.push(ele.userName+"("+ele.accountName+")")
          let delIndex = this.memeberTable.findIndex(item => {
            return item.accountName === ele.accountName
          })
          tempPreDelDataIndex.push(delIndex)
        })
      } else {
        return
      }

      let selectArr = []
      for (let i = 0; i < this.memeberTable.length; i++) {
        if (this.containsInArr(tempPreDelDataIndex, i)) {
          selectArr.push(this.memeberTable[i].accountName)
        } else {
          continue
        }
      }

      let queryData = {}
      queryData.accountName = selectArr.join(';')
      queryData.projectId = this.projectId

      // 向后台更新数据
      deleteManPowerWithProject(queryData)
        .then(res => {
          if (res.state === 1000) {
            // 重新从后台获取数据
            this.initCurrentManPow()
            this.$message.success('删除成功')
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
    handleSelectionChange(val) {
      this.multipleSelect = val
    },
    returnLastePage() {
      this.$router.replace({
        path: '/projectControl',
        query: {
          activeName: 'create'
        }
      })
    },
    submitManPowerPutIn(row, accountName, manpowerPutIn) {
      // 用正则过滤带有非数字的字符
      if (/^(([1-9]{1}\d*)|(0{1}))(\.\d{1})$/i.test(manpowerPutIn)) {
        // if(parseFloat(manpowerPutIn)*10 > 10){
        //   this.$message.error("投入值最大值不能大于1，请重新输入");
        //   row.manpowerPutIn = ''
        //   return
        // }
        // if(manpowerPutIn === '0.0'){
        //   this.$message.error("投入值必须大于0，请重新输入");
        //   row.manpowerPutIn = ''
        //   return
        // }

        let queryData = {
          projectId: this.projectId,
          accountName: accountName,
          manPower: manpowerPutIn
        }
        // 向后台提交投入值数据
        updateManPowerInProject(queryData)
          .then(res => {
            if (res.state === 1000) {
              // 更新数据状态
              row.statusPutIn = res.data.statusColor
              this.$message.success('更新成功')
            } else {
              setTimeout(() => {
                this.$message.error(res.message)
              }, 100)
            }
          }, rej => {
            this.errorAjax()
          }
          )
      } else {
        this.$message.error('投入值只能输入长度为1位的小数，请重新输入')
        row.manpowerPutIn = ''
      }
    },
    delMember(accountName) {
      let quertData = {
        accountName: accountName,
        projectId: this.projectId
      }

      // 向后台提交删除数据
      deleteManPowerWithProject(quertData)
        .then(res => {
          if (res.state === 1000) {
            // 更新数据状态
            // row.statusPutIn = res.data.statusColor
            this.initCurrentManPow()
            this.$message.success('删除成功')
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
    // 点击第几页
    startNumChange(val) {
      this.startNum = val
      // this.searchProject()
      this.initCurrentManPow()
    },
    // 选择每页展示多少条数据
    rangeChange(val) {
      this.range = val
      // this.searchProject()
      this.initCurrentManPow()
    },

    handleNodeClick(data) {
      // console.log(data)
      if (data.label !== '人员信息') {
        this.preAddRole = data.label
      }
    },

    clickOther(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
    },
    // 点击了弹窗的删除
    deleteBindUser(index) {
      // console.log(this.haveBindUserTemp)
      this.deleteWindow = true
      if (this.count === 0) {
        this.haveBindUser.forEach(ele => {
          this.haveBindUserTemp.push(ele)
        })
        this.count = 1
        // console.log(this.haveBindUser)
        // console.log(this.haveBindUserTemp)
      }
      this.haveBindUser.splice(index, 1)
      // console.log(this.haveBindUser)
      // console.log(this.haveBindUserTemp)
    },
    // 关闭弹窗
    closeDialogBindUser(action, realData) {
      // 根据之前临时存储的数据去比较vuex中的数据,找到要删除的索引以及要删除的长度
      if (action === 'close') {
        this.haveBindUser.length = 0
        // 关闭弹层
        this.showDialogUser = false
      }
      if (action === 'confirm') {
        // 首选提交当前数据到后台，关闭弹层，从后台再次取得数据并刷新table
        let queryData = {}
        // queryData.accountName = window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
        let selectedMember = []
        if (realData.length > 0) {
          realData.forEach(ele => {
            selectedMember.push(ele.fullName)
          })
        } else {
          this.$message.error('请至少选择一个成员！')
          return
        }
        queryData.accountName = selectedMember.join(';')
        // queryData.action = "1"

        queryData.projectId = this.projectId
        // 向后台更新数据
        addManPowerWithProject(queryData)
          .then(res => {
            if (res.state === 1000) {
              // 重新从后台获取数据
              getManPowerInProject({ projectId: queryData.projectId, startNum: 1, range: 10 })
                .then(res1 => {
                  if (res1.state === 1000) {
                    // 先清空外部数据
                    this.memeberTable.length = 0
                    if (res1.data.currentMemberList.length > 0) {
                      for (var i = 0; i < res1.data.currentMemberList.length; i++) {
                        let memberTempInfo = {
                          // role:res1.data.projectMembers[i].realName+"("+res1.data.projectMembers[i].accountName+")",
                          userName: res1.data.currentMemberList[i].userName,
                          accountName: res1.data.currentMemberList[i].accountName,
                          department: res1.data.currentMemberList[i].department,
                          type: res1.data.currentMemberList[i].memberType,
                          manpowerPutIn: res1.data.currentMemberList[i].manPower,
                          statusPutIn: res1.data.currentMemberList[i].statusColor

                        }
                        this.memeberTable.push(memberTempInfo)
                      }
                    }
                    this.total = res1.data.total
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
    initCurrentManPow() {
      this.projectId = this.$route.query.projectId
      this.projectName = this.$route.query.projectName
      let queryData = {
        projectId: this.projectId,
        startNum: this.startNum,
        range: this.range
      }
      // 从后台获取当前资源信息
      getManPowerInProject(queryData)
        .then(res => {
          if (res.state === 1000) {
            // 先清空数据

            res.data.currentMemberList.map(ele => {
              if (ele.manPower === 1) {
                ele.manPower = '1.0'
              }
            })
            this.memeberTable.length = 0
            if (res.data.currentMemberList.length > 0) {
              for (var i = 0; i < res.data.currentMemberList.length; i++) {
                let memberType = ''
                switch (res.data.currentMemberList[i].memberType) {
                  case 1:
                    memberType = '正式员工'
                    break
                  case 2:
                    memberType = '合作方员工'
                    break
                  case 3:
                    memberType = '实习员工'
                    break
                }
                let memberTempInfo = {
                  // role:res1.data.projectMembers[i].realName+"("+res1.data.projectMembers[i].accountName+")",
                  userName: res.data.currentMemberList[i].userName,
                  accountName: res.data.currentMemberList[i].accountName,
                  department: res.data.currentMemberList[i].department,
                  type: memberType,
                  manpowerPutIn: res.data.currentMemberList[i].manPower,
                  statusPutIn: res.data.currentMemberList[i].statusColor
                }
                this.memeberTable.push(memberTempInfo)
              }

              this.total = res.data.total
            } else {
              this.memeberTable.splice(0, this.memeberTable.length)
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
    },
    initExpectManPow() {
      // 从后台获取期望资源信息
      getExpectManPowerInProject({ projectId: this.projectId })
        .then(res => {
          if (res.state === 1000) {
            if (res.data.expectMemberNumber != null) {
              this.expectMemberTable[0].regular = res.data.expectMemberNumber.regularNumber
              this.expectMemberTable[0].partner = res.data.expectMemberNumber.partnerNumber
              this.expectMemberTable[0].intern = res.data.expectMemberNumber.internNumber
            } else {
              this.expectMemberTable[0].regular = ''
              this.expectMemberTable[0].partner = ''
              this.expectMemberTable[0].intern = ''
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
    }
  },
  mounted() {

  },
  created() {
    this.initCurrentManPow()
    this.initExpectManPow()
  }
}
</script>

<style scoped>
@import url('../../assets/css/project-member-manager.css');
</style>
