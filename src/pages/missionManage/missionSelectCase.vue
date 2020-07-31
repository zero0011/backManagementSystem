<template>
  <div class="missionSelectCase">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/missionManage' }">任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>分配用例</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <div class="top">
        <el-select v-model="selectValue" placeholder="选择人员" @change="currentChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size='small' @click="seeAllTester">查看人员信息</el-button>
        <el-button type="primary" size='small' @click="multipleDeleteNew">批量删除</el-button>
        <el-button type="primary" size="small" @click="oneEmpty">一键清空</el-button>
        <el-button type="primary" size='small' @click="getCases" v-if="showButton">分配用例</el-button>
        <el-button type="primary" size='small' @click="translateCases">转移用例</el-button>
      </div>
      <div class="container">
        <template v-if="!noData">
          <el-card class="box-card" v-for="(val, key) in haveCase" :key="key">
            <div slot="header" class="clearfix">
              <span>{{ val.name }}</span>
              <el-switch v-model="val.value" active-text="全选" inactive-text="取消全选" @change="getCheck(key, $event)" style="float: right" :key="key"></el-switch>
              <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="multipleDelete(key)">批量删除</el-button> -->
            </div>
            <el-table ref="'multipleTable' + key" :id="'multipleTable' + key" :data="val.list" tooltip-effect="dark" style="width: 1146px" @selection-change="handleSelectionChange($event, key)" border="" :header-cell-style="{background:'rgb(250, 250, 250)'}">
              <el-table-column type="selection" width="50" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.isChecked" @change="statusChange(scope.row, $event, key)"></el-checkbox>
                  <!-- <el-checkbox v-model="isChecked" @change="statusChange(scope.row, $event, key)" v-if="scope.row.isChecked === '1'"></el-checkbox> -->
                  <!-- <el-checkbox v-model="notChecked" @change="statusChange(scope.row, $event, key)" v-else></el-checkbox> -->
                </template>
              </el-table-column>
              <el-table-column prop="nodeName" label="用例名称" width="259" align="center"></el-table-column>
              <!-- <el-table-column prop="caseNumber" label="用例编号" width="259" align="center"></el-table-column> -->
              <el-table-column prop="caseId" label="用例id" width="259" align="center"></el-table-column>
              <el-table-column prop="belongCaseSuite" label="所属用例集" width="200"  align="center"></el-table-column>
              <el-table-column prop="belongRepository" label="所属库" show-overflow-tooltip align="center" width="145"></el-table-column>
              <el-table-column label="操作" width="192" align="center" style="border-right: 1px solid #EBEEF5">
                <template slot-scope="scope">
                  <el-button @click="deltestPeople(key, scope.$index, scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination :current-page.sync="val.startNum"
                           :page-sizes="[5, 10, 20, 100]"
                           :page-size="val.range"
                           :total="val.total"
                           layout="total, sizes, prev, pager, next"
                           @size-change="rangeChange(key, $event)"
                           @current-change="startNumChange(key, $event)"
                           style="margin-top: 20px">
            </el-pagination>
          </el-card>
        </template>
        <div style="text-align: center;margin-bottom: 100px;margin-top: 150px;font-size: 24px" v-if="noData">暂无数据</div>
        <!-- <el-button type="primary" @click="getMore">获取更多</el-button> -->
        <footer>
          <el-button type="primary" @click="getMore" v-if="showMore">获取更多</el-button>
          <el-button type="primary" @click="returnLastePage">返回</el-button>
        </footer>
      </div>
    </main>
    <!-- 查看人员信息 -->
    <el-dialog title="测试人员列表" :visible.sync="seeMoreUser" class="seeTestPeople" width="870px">
      <el-table :data="seeTestPeopleData" style="" border>
        <el-table-column prop="name" label="姓名" width="150" align="center"></el-table-column>
        <el-table-column prop="accountName" label="账户名" width="150" align="center"></el-table-column>
        <el-table-column prop="department" label="部门" width="150" align="center"></el-table-column>
        <el-table-column prop="caseCount" label="分配用例数" width="200" align="center"></el-table-column>
        <el-table-column prop="workpd" label="工作量（条/天）" width="179" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 可以分配的用例 -->
    <el-dialog title="可分配用例" :visible.sync="dialogTableVisible" class="canCases" :before-close="closeDiaBefore">
      <el-tree :data="data"
               :props="props"
               show-checkbox
               node-key="id"
               :load="loadNode"
               lazy
               :expand-on-click-node="true"
               @node-expand="clickExpand"
               @check-change="getChecked"
               ref="tree">
      </el-tree>
      <!-- @node-click='clickNode' -->
      <footer>
        <el-button type="primary" @click="commitCase">分配</el-button>
      </footer>
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
// import { getAssigneeByTaskPower, getAssignedCaseByUser, deleteTaskUserCaseRelationOP, getMysuite, getAssignableCase, insertTaskUserCaseRelationOP, getCaseSuiteByProject } from '../../api/api'
import { getAssigneeByTaskPower, getAssignedCaseByUsernew, deleteTaskUserCaseRelationOP, getAssignableCase, insertTaskUserCaseRelationOP, getCaseSuiteByProject, getCaseToDelete, deleteTaskUserCaseRelationOPNew, translateTaskUserCaseRelation, deleteTaskUserCaseRelationAll } from '../../api/api'
export default {
  data () {
    return {
      selectValue: '',
      options: [],
      seeTestPeopleData: [],
      seeMoreUser: false,
      selectTester: {
        caseCount: 0,
        workpd: 0
      },
      haveCase: [],
      preDeleteCase: [],
      dialogTableVisible: false,
      gridData: [],
      showButton: false,
      data: [],
      addCase: [],
      noData: false,
      // startNum: 1,
      // range: 10,
      // 存放勾选的用例
      tempArr: [],
      // 标识哪个用例集的分页改变了
      caseTable: -1,
      userId: '',
      sum: 1,
      rangeArr: [],
      value1: true,
      tempData: [],
      props: {
        label: 'label',
        id: 'id',
        nodeId: 'nodeId',
        power: 'power'
        // children: 'children'
      },
      showMore: false,
      showSelectSingleUser: false,
      data2: [],
      trueName: '',
      isChecked: true,
      notChecked: false
    }
  },
  methods: {
    clickExpand (obj, node, self) {
      this.clickNode(obj, node, self)
    },
    getCheckedAccountName () {
      let arr = document.getElementsByClassName('singleSelect')
      let newArr = Array.from(arr)
      console.log(newArr)
      let str = ''
      newArr.forEach(ele => {
        if (ele.checked) {
          // str = ele.attributes[2].nodeValue.split('(')[1].split(')')[0]
          str = ele.attributes[3].nodeValue.split('(')[1].split(')')[0]
        }
      })
      translateTaskUserCaseRelation({
        taskId: this.$route.query.taskId,
        userId: this.userId,
        transAccountName: str
      }).then(res => {
        if (res.state === 1000) {
          getAssignedCaseByUsernew({
            taskId: window.sessionStorage.getItem('taskId'),
            userId: this.userId,
            nodeName: '',
            startNum: 1,
            range: 10,
            showNum: 10
          }).then(res => {
            if (res.state === 1000) {
              if (JSON.stringify(res.data.assignedCases) === '[]') {
                this.noData = true
                this.showMore = false
                this.showSelectSingleUser = false
              } else {
                this.noData = false
                this.showMore = true
                this.haveCase = res.data.assignedCases
                this.showSelectSingleUser = false
              }
            }
          })
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
      })
    },
    translateCases () {
      this.showSelectSingleUser = true
    },
    // 转移按钮弹层关闭前
    beforecloseSingleUser () {
      this.showSelectSingleUser = false
    },
    // 树形懒加载
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(node.data)
      } else {
        return resolve(node.childNodes.map(ele => ele.data))
      }
    },
    getCheck (key, val) {
      this.haveCase[key].list.forEach(ele => {
        ele.isChecked = val
      })
      let nodeIdArr = this.haveCase[key].list.map(ele => ele.nodeId)
      getCaseToDelete({
        nodeId: nodeIdArr.join(','),
        state: val,
        userId: this.userId,
        nodeName: this.haveCase[key].name,
        taskId: this.$route.query.taskId
      }).then(res => {
        if (res.state === 1000) {
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
      })
    },
    // 新的批量删除
    multipleDeleteNew () {
      deleteTaskUserCaseRelationOPNew({
        taskId: this.$route.query.taskId,
        userId: this.userId
      }).then(res => {
        if (res.state === 1000) {
          this.$message.success(res.message)
          setTimeout(() => {
            getAssignedCaseByUsernew({
              taskId: window.sessionStorage.getItem('taskId'),
              userId: this.userId,
              nodeName: '',
              startNum: 1,
              range: 10,
              showNum: 10 * this.sum
            }).then(res => {
              if (res.state === 1000) {
                if (JSON.stringify(res.data.assignedCases) === '[]') {
                  this.noData = true
                  this.showMore = false
                } else {
                  this.noData = false
                  this.showMore = true
                  this.tempData = res.data.assignedCases.map(ele => {
                    return {
                      total: ele.total,
                      name: ele.name,
                      list: ele.list,
                      value: false,
                      startNum: 1,
                      range: 10
                    }
                  })
                  this.haveCase = this.tempData
                }
              }
            })
          }, 500)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 一键清空
    oneEmpty() {
      deleteTaskUserCaseRelationAll({
        taskId: this.$route.query.taskId,
        userId: this.userId
      }).then(res => {
        if (res.state === 1000) {
          this.$message.success(res.message)
          setTimeout(() => {
            getAssignedCaseByUsernew({
              taskId: window.sessionStorage.getItem('taskId'),
              userId: this.userId,
              nodeName: '',
              startNum: 1,
              range: 10,
              showNum: 10 * this.sum
            }).then(res => {
              if (res.state === 1000) {
                if (JSON.stringify(res.data.assignedCases) === '[]') {
                  this.noData = true
                  this.showMore = false
                } else {
                  this.noData = false
                  this.showMore = true
                  this.tempData = res.data.assignedCases.map(ele => {
                    return {
                      total: ele.total,
                      name: ele.name,
                      list: ele.list,
                      value: false,
                      startNum: 1,
                      range: 10
                    }
                  })
                  this.haveCase = this.tempData
                }
              }
            })
          }, 500)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取更多
    getMore () {
      this.sum++
      getAssignedCaseByUsernew({
        taskId: window.sessionStorage.getItem('taskId'),
        userId: this.userId,
        nodeName: '',
        startNum: 1,
        range: 10,
        showNum: 10 * this.sum
      }).then(res => {
        if (res.state === 1000) {
          if (res.data.assignedCases.length === 0) {
            this.showMore = false
            this.$message.success('已加载完毕，没有更多用例！')
          } else {
            // this.haveCase.push(...res.data.assignedCases)
            let tempData = res.data.assignedCases.map(ele => {
              return {
                total: ele.total,
                name: ele.name,
                list: ele.list,
                value: false,
                startNum: 1,
                range: 10
              }
            })
            this.haveCase.push(...tempData)
          }
        }
      })
    },
    // 多选框的状态
    statusChange (rowData, val, key) {
      // 第几张表
      // console.log(key)
      // console.log(rowData)
      // console.log(this.haveCase)
      let getIndex
      this.haveCase[key].list.forEach((ele, index) => {
        if (ele.nodeId === rowData.nodeId) {
          getIndex = index
        }
      })
      this.$set(this.haveCase[key].list[getIndex], 'isChecked', val)
      // console.log(typeof val)
      // console.log(rowData)
      getCaseToDelete({
        nodeId: rowData.nodeId,
        state: val,
        userId: this.userId,
        nodeName: this.haveCase[key].name,
        taskId: this.$route.query.taskId
        // range: this.rangeArr[key] || 10
      }).then(res => {
        if (res.state === 1000) {
          // getAssignedCaseByUsernew({
          //   taskId: window.sessionStorage.getItem('taskId'),
          //   userId: this.userId,
          //   nodeName: '',
          //   startNum: 1,
          //   range: 10,
          //   showNum: 10 * this.sum
          // }).then(res => {
          //   if (res.state === 1000) {
          //     if (JSON.stringify(res.data.assignedCases) === '{}') {
          //       this.noData = true
          //     } else {
          //       this.noData = false
          //       this.haveCase = res.data.assignedCases
          //     }
          //   }
          // })
        }
      })
    },
    // 记录点击的是哪个用例集表格，key表示table索引，index表示该table的当前分页
    startNumChange (key, index) {
      let data = {
        taskId: window.sessionStorage.getItem('taskId'),
        userId: this.userId,
        nodeName: this.haveCase[key].name,
        startNum: index,
        range: this.rangeArr[key] || 10,
        showNum: 10
      }
      this.getCurrentData(key, data, index)
    },
    // 范围选择
    rangeChange (key, val) {
      this.rangeArr[key] = val
      getAssignedCaseByUsernew({
        taskId: window.sessionStorage.getItem('taskId'),
        userId: this.userId,
        nodeName: this.haveCase[key].name,
        startNum: 1,
        range: val,
        showNum: 10
      }).then(res => {
        if (res.state === 1000) {
          if (JSON.stringify(res.data.assignedCases) === '{}') {
            this.noData = true
          } else {
            this.noData = false
            this.$nextTick(() => {
              let transData = []
              res.data.assignedCases[0].list.forEach(ele => {
                if (ele.isChecked === '1') {
                  transData.push({
                    fullPath: ele.fullPath,
                    caseNumber: ele.caseNumber,
                    caseId: ele.caseId,
                    belongRepository: ele.belongResp,
                    nodeName: ele.caseName,
                    nodeId: ele.nodeId,
                    isChecked: true,
                    belongCaseSuite: ele.belongCaseSuite
                  })
                } else {
                  transData.push({
                    fullPath: ele.fullPath,
                    caseNumber: ele.caseNumber,
                    caseId: ele.caseId,
                    belongRepository: ele.belongResp,
                    nodeName: ele.caseName,
                    nodeId: ele.nodeId,
                    isChecked: false,
                    belongCaseSuite: ele.belongCaseSuite
                  })
                }
              })
              let transObj = {
                total: res.data.assignedCases[0].total,
                name: res.data.assignedCases[0].name,
                // value: false,
                // startNum: index,
                // range: 10,
                list: transData
              }
              this.$nextTick(() => {
                this.$set(this.haveCase, key, transObj)
              })
              // this.$set(this.haveCase, key, res.data.assignedCases[0])
            })
          }
        }
      })
    },
    // 根据索引去获取数据，再去添加属性
    getCurrentData (key, data, index) {
      getAssignedCaseByUsernew(data)
        .then(res => {
          if (res.state === 1000) {
            let transData = []
            res.data.assignedCases[0].list.forEach(ele => {
              if (ele.isChecked === '1') {
                transData.push({
                  fullPath: ele.fullPath,
                  caseNumber: ele.caseNumber,
                  caseId: ele.caseId,
                  belongRepository: ele.belongResp,
                  nodeName: ele.caseName,
                  nodeId: ele.nodeId,
                  isChecked: true,
                  belongCaseSuite: ele.belongCaseSuite
                })
              } else {
                transData.push({
                  fullPath: ele.fullPath,
                  caseNumber: ele.caseNumber,
                  caseId: ele.caseId,
                  belongRepository: ele.belongResp,
                  nodeName: ele.caseName,
                  nodeId: ele.nodeId,
                  isChecked: false,
                  belongCaseSuite: ele.belongCaseSuite
                })
              }
            })
            let transObj = {
              total: res.data.assignedCases[0].total,
              name: res.data.assignedCases[0].name,
              value: false,
              startNum: index,
              range: 10,
              list: transData
            }
            this.$nextTick(() => {
              this.$set(this.haveCase, key, transObj)
            })
          }
        })
    },
    closeDiaBefore () {
      this.dialogTableVisible = false
      setTimeout(() => {
        this.data = []
      }, 500)
    },
    // 初始化默认选择第一个
    initePeopleInfo () {
      getAssigneeByTaskPower({ taskId: window.sessionStorage.getItem('taskId') })
        .then(res => {
          if (res.state === 1000) {
            this.seeTestPeopleData = res.data.taskData
            let depArr = []
            let perArr = []
            res.data.taskData.forEach((ele, index) => {
              if (depArr.indexOf(ele.department) === -1) {
                depArr.push(ele.department)
                perArr.push({
                  label: ele.department,
                  children: [
                    {
                      label: ele.name,
                      accountName: ele.accountName
                    }
                  ]
                })
              }
              if (depArr.indexOf(ele.department) > -1) {
                perArr[depArr.indexOf(ele.department)].children.push({
                  label: ele.name,
                  accountName: ele.accountName
                })
              }
            })
            perArr.forEach(ele => {
              ele.children.shift()
            })
            this.data2 = perArr
            // let objArr = depArr.map(ele => {
            //   return {
            //     label: ele,
            //     children: []
            //   }
            // })
            // console.log(objArr)
            // objArr.forEach(ele => {
            // })
            // res.data.taskData.forEach((ele, index) => {
            //   if (tempArr.indexOf(ele.department) === -1) {

            //   }
            // })
            this.options = res.data.taskData.map(ele => {
              return {
                value: ele.id,
                label: ele.name + '(' + ele.accountName + ')'
              }
            })
            if (this.options.length > 0) {
              this.showButton = true
            }
            this.selectValue = this.options[0] && this.options[0].value
            this.selectTester = {
              accountName: this.options[0] && this.options[0].label.split('(')[1].split(')')[0]
            }
            this.userId = this.options[0] && this.options[0].value
            getAssignedCaseByUsernew({
              taskId: window.sessionStorage.getItem('taskId'),
              userId: this.userId,
              nodeName: '',
              startNum: 1,
              range: 10,
              showNum: 10 * this.sum
            }).then(res => {
              if (res.state === 1000) {
                if (JSON.stringify(res.data.assignedCases) === '[]') {
                  this.noData = true
                  this.showMore = false
                } else {
                  this.noData = false
                  this.showMore = true
                  this.tempData = res.data.assignedCases.map(ele => {
                    return {
                      total: ele.total,
                      name: ele.name,
                      list: ele.list,
                      value: false,
                      startNum: 1,
                      range: 10
                    }
                  })
                  this.haveCase = this.tempData
                }
              }
            })
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误！')
        })
    },
    seeAllTester () {
      this.initePeopleInfo()
      this.seeMoreUser = true
    },
    // 选择分配的人
    currentChange (val) {
      // console.log(val)
      // console.log(this.options)
      let name = ''
      this.options.forEach(ele => {
        if (ele.value === val) {
          name = ele.label
        }
      })
      // console.log(name)
      this.selectTester = {
        accountName: name.split('(')[1].split(')')[0]
      }
      this.userId = val
      getAssignedCaseByUsernew({
        taskId: window.sessionStorage.getItem('taskId'),
        userId: val,
        nodeName: '',
        startNum: 1,
        range: 10,
        showNum: 10
      }).then(res => {
        if (res.state === 1000) {
          if (JSON.stringify(res.data.assignedCases) === '[]') {
            this.noData = true
            this.showMore = false
          } else {
            this.noData = false
            this.showMore = true
            this.haveCase = res.data.assignedCases.map(ele => {
              return {
                total: ele.total,
                name: ele.name,
                list: ele.list,
                value: false,
                startNum: 1,
                range: 10
              }
            })
          }
        }
      })
      // getAssignedCaseByUser({
      //   taskId: window.sessionStorage.getItem('taskId'),
      //   accountName: this.selectTester.accountName
      // }).then(res => {
      //   if (res.state === 1000) {
      //     if (JSON.stringify(res.data.assignedCases) === '{}') {
      //       this.noData = true
      //     } else {
      //       this.noData = false
      //       let arr1 = Object.keys(res.data.assignedCases)
      //       let arr2 = Object.values(res.data.assignedCases)
      //       let arr3 = []
      //       arr1.map((ele, index) => {
      //         arr3.push({
      //           path: arr1[index],
      //           caseArray: arr2[index]
      //         })
      //       })
      //       this.haveCase = arr3
      //     }
      //   }
      // })
    },
    // 触发多选框状态
    handleSelectionChange (selection, key) {
      // console.log(selection)
      // this.tempArr[key] = selection.map(ele => ele.nodeId)
      // console.log(key)
      // this.tempArr[key] = selection.map(ele => ele.nodeId)
      // 如果点击的分页与当前触发的多选框是同一个用例集表格
      // if (this.caseTable === key) {
      //   let newArr = []
      //   selection.forEach(ele => {
      //     if (this.tempArr[key].indexOf(ele.nodeId) === -1) {
      //       newArr.push(ele.nodeId)
      //     }
      //   })
      //   this.tempArr[key].push(...newArr)
      // } else {
      //   this.tempArr[key] = selection.map(ele => ele.nodeId)
      // }
      // tempArr[key].splice(0, tempArr[key].length)
      // this.tempArr[key] = selection
      // temp[key].forEach(ele => {
      //   aa
      // })
      // if (tempArr)
      // console.log(selection)
      // console.log(key)
      // let data = {
      // }
      // this.preDeleteCase[key] = selection
      // getCaseToDelete
      // console.log(this.tempArr)
    },
    // key表示第几个路径
    // 单个删除
    deltestPeople (key, index, val) {
      this.$confirm('此操作将永久删除该用例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTaskUserCaseRelationOP({
          accountName: this.selectTester.accountName,
          taskId: window.sessionStorage.getItem('taskId'),
          nodeId: val.nodeId
        }).then(res => {
          if (res.state === 1000) {
            setTimeout(() => {
              this.initePeopleInfo()
            })
            // this.haveCase[key].caseArray.splice(index, 1)
          } else {
            this.$message.error('删除失败')
          }
        }, rej => {
          this.$message.error('删除失败')
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    // 批量删除
    multipleDelete (index) {
      this.$confirm('此操作将永久删除选择的用例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteTaskUserCaseRelationOPNew({
        //   taskId: '',
        //   userId: ''
        // })
        // if (this.preDeleteCase[index]) {
        //   deleteTaskUserCaseRelationOP({
        //     accountName: this.selectTester.accountName,
        //     taskId: window.sessionStorage.getItem('taskId'),
        //     nodeId: this.preDeleteCase[index].map(ele => ele.nodeId).join(',')
        //   }).then(res => {
        //     if (res.state === 1000) {
        //       getAssignedCaseByUser({
        //         taskId: window.sessionStorage.getItem('taskId'),
        //         accountName: this.selectTester.accountName
        //       }).then(res => {
        //         if (res.state === 1000) {
        //           let arr1 = Object.keys(res.data.assignedCases)
        //           let arr2 = Object.values(res.data.assignedCases)
        //           let arr3 = []
        //           arr1.map((ele, index) => {
        //             arr3.push({
        //               path: arr1[index],
        //               caseArray: arr2[index]
        //             })
        //           })
        //           this.haveCase = arr3
        //         }
        //       })
        //     } else {
        //       this.$message.error('删除失败')
        //     }
        //   }, rej => {
        //     this.$message.error('删除失败')
        //   })
        // }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击了分配用例按钮
    getCases () {
      this.data = []
      // this.data = [
      //   {
      //     label: 'AAAA',
      //     id: 1,
      //     nodeId: -1,
      //     power: true
      //   }, {
      //     label: 'BBBB',
      //     id: 2,
      //     nodeId: -1,
      //     power: true
      //   }
      // ]
      getCaseSuiteByProject({
        taskId: this.$route.query.taskId
      }).then(res => {
        if (res.state === 1000) {
          this.data = res.data.caseSuite.map(ele => {
            return {
              label: ele.name,
              id: ele.caseSuiteId,
              nodeId: -1,
              power: true
            }
          })
          // this.data = [
          //   {
          //     label: 'AAAA',
          //     id: 1,
          //     nodeId: -1,
          //     power: true
          //   }, {
          //     label: 'BBBB',
          //     id: 2,
          //     nodeId: -1,
          //     power: true
          //   }
          // ]
          // console.log(this.data)
          setTimeout(() => {
            this.dialogTableVisible = true
          })
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络错误，请稍后再试！')
      })
      // getMysuite({
      //   accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      // }).then(res => {
      //   if (res.state === 1000) {
      //     console.log(res)
      //   }
      // })
    },
    clickNode (data, node, self) {
      // alert(11111)
      let suiteId = ''
      if (data.id) {
        suiteId = data.id
      } else {
        suiteId = data.suiteId
      }
      if (data.power) {
        getAssignableCase({
          taskId: window.sessionStorage.getItem('taskId'),
          suiteId,
          nodeId: data.nodeId
        }).then(res => {
          if (res.state === 1000) {
            this.$set(data, 'power', false)
            if (!data.children) {
              this.$set(data, 'children', [])
            }
            data.children.push(...res.data.treeList.map(ele => {
              if (ele.testerFullName !== '') {
                return {
                  label: '[ ' + ele.testerFullName.split('(')[0] + ' ]' + ele.nodeName,
                  nodeId: ele.id,
                  nodeType: ele.nodeType,
                  suiteId,
                  power: true,
                  disabled: true
                }
              } else {
                return {
                  label: ele.nodeName,
                  nodeId: ele.id,
                  nodeType: ele.nodeType,
                  suiteId,
                  power: true
                }
              }
            }))
          }
        })
      }
    },
    getChecked () {
      let arr = []
      this.$refs.tree.getCheckedNodes().forEach(ele => {
        // 如果是-1表示该节点是用例集，用例集本身没有nodeId这个属性，采用-1 * id作为nodeId便于后端可以快速识别
        if (ele.nodeId === '-1') {
          arr.push(Number(ele.nodeId) * ele.id)
        } else {
          arr.push(ele.nodeId)
        }
      })
      this.addCase = arr
    },
    // 点击完玩分配任务之后刷新列表
    commitCase () {
      if (this.$refs.tree.getCheckedNodes().length > 0) {
        insertTaskUserCaseRelationOP({
          accountName: this.selectTester.accountName,
          taskId: window.sessionStorage.getItem('taskId'),
          nodeId: this.addCase.join(',')
        }).then(res => {
          if (res.state === 1000) {
            this.dialogTableVisible = false
            this.$nextTick(() => {
              setTimeout(() => {
                getAssignedCaseByUsernew({
                  taskId: window.sessionStorage.getItem('taskId'),
                  userId: this.userId,
                  nodeName: '',
                  startNum: 1,
                  range: 10,
                  showNum: 10
                }).then(res => {
                  if (res.state === 1000) {
                    if (JSON.stringify(res.data.assignedCases) === '[]') {
                      this.noData = true
                      this.showMore = false
                    } else {
                      this.noData = false
                      this.showMore = true
                      this.haveCase = res.data.assignedCases
                    }
                  }
                })
              }, 500)
            })
          } else if (res.state === 2038) {
            this.$message.error(res.message)
          } else {
            this.$message.error('分配失败，请稍后再试')
          }
        }, rej => {
          this.$message.error('分配失败，请稍后再试')
        })
      }
    },
    returnLastePage () {
      this.$router.replace({
        path: '/missionManage',
        query: {
          from: this.$route.query.from
        }
      })
    }
  },
  created () {
    this.initePeopleInfo()
  }
}
</script>

<style scoped>
.missionSelectCase {
  width: 100%
}
.missionSelectCase > .header {
  width: 1188px;
  margin: 0 auto;
  height: 14px;
  padding: 10px 0px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc
}
.missionSelectCase > .header > .breadcrumb {
  margin-left: 10px
}
.missionSelectCase > main {
  width: 1188px;
  margin: 10px auto;
  border: 1px solid #ccc;
  min-height: 100px
}
.missionSelectCase > main > .top {
  margin-top: 20px;
  margin-bottom: 20px;
  position: relative
}
.missionSelectCase > main > .top > .el-select {
  float: left;
  margin-left: 20px
}
.missionSelectCase > main > .top > .el-select > .el-input > .el-input__inner {
  height: 32px
}
.missionSelectCase > main > .top > .el-select > .el-input .el-input__icon {
  line-height: 0px
}
.missionSelectCase > main > .top > .el-button:nth-of-type(1) {
  float: left;
  margin-left: 100px
}
.missionSelectCase > main > .top > .el-button:nth-of-type(2) {
  float: left;
  position: absolute;
  right: 20px
}
.missionSelectCase > main > .top > .el-button:nth-of-type(3) {
  float: left;
  position: absolute;
  right: 110px;
}
/* .missionSelectCase > main > .top > .el-button:nth-of-type(3) {
  float: left;
  margin-left: 200px
} */
.missionSelectCase > main > .middle {
  margin-top: 80px;
  margin-bottom: 20px
}
.missionSelectCase > main > .middle > div > ul {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-left: 20px
}
.missionSelectCase > main > .middle > div > ul > li {
  width: 1148px;
  background-color: #F2F6FC;
  font-size: 18px;
  padding: 3px 0px
}
.missionSelectCase > .seeTestPeople > .el-dialog > .el-dialog__body > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th {
  padding: 8.5px 0px
}
.missionSelectCase > .seeTestPeople > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper {
  min-height: 50px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden
}
.missionSelectCase > .seeTestPeople > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
  padding: 13px 0px
}
.missionSelectCase > main > .container {
  width: 1148px;
  margin: 80px 0 20px 20px;
  min-height: 200px
}
.missionSelectCase > main > .container > .el-card {
  margin-bottom: 20px
}
.missionSelectCase > main > .container > .el-card > .el-card__header {
  padding: 5px 20px
}
.missionSelectCase > main > .container > .el-card > .el-card__body > .el-table th {
  padding: 4px 0
}
.missionSelectCase > main > .container > .el-card > .el-card__body > .el-table td {
  padding: 4px 0
}
.missionSelectCase > main > .container > footer {
  text-align: center
}
.missionSelectCase > .canCases > .el-dialog > .el-dialog__body > .el-tree {
  max-height: 500px;
  overflow-x: auto;
  overflow-y: auto
}
.missionSelectCase > .canCases > .el-dialog > .el-dialog__body > footer {
  margin-top: 20px;
  height: 30px
}
.missionSelectCase > .canCases > .el-dialog > .el-dialog__body > footer > .el-button {
  float: right
}
/* 隐藏标题栏多选框 */
.missionSelectCase .el-table__header-wrapper .cell .el-checkbox__input {
  display: none
}
input[type="radio"] {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 1px solid #999;
  outline: 0px solid transparent
  /* background-color: rgb(32, 17, 235); */
}
input[type="radio"]:hover {
  cursor: pointer;
}
input[type="radio"]:checked {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #409EFF;
}
</style>
