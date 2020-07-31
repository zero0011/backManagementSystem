<template>
  <div class="createUseCaseManagmentSmall">
    <header class="header">
      用例集信息
    </header>
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <!-- 用例集名称 -->
      <el-form-item label="用例集名称" prop="name">
        <el-input v-model.trim="ruleForm.name" :disabled="true"></el-input>
      </el-form-item>
      <!-- 用例集描述 -->
      <el-form-item label="用例集描述" prop="desc">
        <el-input type="textarea" :disabled="true" v-model.trim="ruleForm.desc"></el-input>
      </el-form-item>
      <!-- 创建人 -->
      <el-form-item label="创建人" prop="creator">
        <el-input :disabled="true" v-model="ruleForm.creator"></el-input>
      </el-form-item>
      <!-- 开始时间与结束时间 -->
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
                        disabled>
        </el-date-picker>
      </el-form-item>
      <!-- 用例标签 -->
      <el-form-item label="用例标签">
        <el-select v-model="ruleForm.tagArr" @visible-change="visibleChange" :loading="loading" size="medium" multiple filterable remote :remote-method="searchTagFromServer" allow-create default-first-option placeholder="" @change="change" disabled>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-table ref="multipleTable" :data="people" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" border="" :header-cell-style="{background:'rgb(250, 250, 250)'}">
            <el-table-column prop="userName" label="姓名" width="215" align="center"></el-table-column>
            <el-table-column prop="accountName" label="账户名" width="214"  align="center"></el-table-column>
            <el-table-column prop="department" label="部门" show-overflow-tooltip align="center" width="214"></el-table-column>
          </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addCaseSuitePower, getLabelsUsedByCaseSuitePower, updateCaseSuiteLabelPower, updateCaseSuiteUserPower, getUserPower, getLabelPower, getCaseSuiteUserPower, editCaseSuitePower } from '../../api/api'
export default {
  data () {
    return {
      showDialogUser: false,
      action: '',
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
      radio: '单人编写',
      picture: 'el-icon-arrow-up',
      timeRangeSelect: false,
      loading: false,
      // 创建的用例集id
      caseSuiteId: '',
      ruleForm: {
        name: '',
        desc: '',
        creator: window.sessionStorage.getItem('userName') || window.localStorage.getItem('userName'),
        dateRange: '',
        tagArr: []
      },
      rules: {
        name: [
          { required: true, message: '请输入用例集名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个汉字', trigger: 'blur' }
        ],
        desc: [
          { min: 1, max: 100, message: '长度在 1 到 100 个汉字', trigger: 'blur' }
        ],
        dateRange: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
        }
      },
      people: [],
      options: []
    }
  },
  methods: {
    reCreateFun (a, b) {
      if (a === 'reCreate') {
        this.reCreate = true
        this.submitForm('ruleForm')
      }
    },
    preventCode () {
      window.addEventListener('keydown', e => {
        if ((e.keyCode === 116) || (e.ctrlKey && e.keyCode === 82)) {
          e.keyCode = 0
          e.returnValue = false
        }
      })
    },
    preventOnload () {
      window.addEventListener('load', () => {
        return false
      })
    },
    cancelCreate () {
      this.$store.commit('changeActiveName', this.$route.query.activeName)
      this.$router.replace('/usecasesetlist')
      this.$store.commit('currentJoinPerson', [])
      this.$store.commit('transformPrePerson', [])
    },
    diffset (arr1, arr2) {
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
    // 多选删除
    multipleDelete () {
      if (this.multipleSelect.length === this.$store.state.joinPerson.length) {
        this.$store.commit('deleteAllJoinPerson', {
          startDelete: 0,
          endDelete: this.multipleSelect.length
        })
      } else {
        let arr = this.diffset(this.$store.state.joinPerson, this.multipleSelect)
        this.$store.commit('currentJoinPerson', arr)
        let newArr = []
        arr.forEach(ele => {
          newArr.push({role: ele.userName + '(' + ele.accountName + ')'})
        })
        this.$store.commit('transformPrePerson', newArr)
      }
    },
    // 表格的删除
    del (index) {
      this.$store.commit('updateCurrentJoinPerson', index)
    },
    // 关闭弹窗
    closeDialogBindUser (action) {
      // 根据之前临时存储的数据去比较vuex中的数据,找到要删除的索引以及要删除的长度
      if (action === 'close') {
        if (this.tempAddRole.length > 0) {
          let startIndex = null
          let deleteCount = this.tempAddRole.length
          this.$store.state.prePerson.forEach((ele, index) => {
            if (ele.role === this.tempAddRole[0].role) {
              startIndex = index
            }
          })
          this.$store.commit('editPrePerson', {
            startIndex,
            deleteCount
          })
        }
        if (this.deleteWindow) {
          this.$store.commit('transformPrePerson', this.haveBindUserTemp)
          this.deleteWindow = false
        }
      }
      if (action === 'confirm') {
        // 直接拿vuex中的数据
        this.count = 0
        let arr = []
        let arr2 = []
        this.$store.state.prePerson.forEach(ele => {
          arr.push(ele.role.split('(')[1].split(')')[0])
        })
        arr.forEach(ele => {
          this.allUser.forEach(ele2 => {
            if (ele2.accountName === ele) {
              arr2.push(ele2)
            }
          })
        })
        this.$store.commit('currentJoinPerson', arr2)
        this.haveBindUserTemp = []
      }
      this.tempAddRole = []
      this.showDialogUser = false
    },
    // 点击了弹窗的删除
    deleteBindUser (index) {
      this.deleteWindow = true
      if (this.count === 0) {
        this.haveBindUser.forEach(ele => {
          this.haveBindUserTemp.push(ele)
        })
        this.count = 1
      }
      this.haveBindUser.splice(index, 1)
    },
    addRole () {
      let tableDataArr = []
      this.haveBindUser.forEach(ele => {
        tableDataArr.push(ele.role)
      })
      if (tableDataArr.indexOf(this.preAddRole) === -1) {
        let data = {
          role: this.preAddRole
        }
        if (data.role !== '') {
          this.$store.commit('changeprePerson', data)
          this.tempAddRole.push(data)
        }
      } else {
        this.$message({
          type: 'warning',
          message: '绑定角色重复',
          duration: 1000
        })
      }
    },
    handleNodeClick (data) {
      if (data.label !== '人员信息') {
        this.preAddRole = data.label
      }
    },
    addPerson () {
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
              array[i] = {label: ''}
            }
            for (let i = 0; i < tempData.length; i++) {
              array[i].label = tempData[i].userName + '(' + tempData[i].accountName + ')'
            }
            this.bindRole = [{
              label: '人员信息',
              children: array
            }]
            this.haveBindUser = this.$store.state.prePerson
          }
        })
      setTimeout(() => {
        this.showDialogUser = true
      }, 100)
    },
    // 用例标签搜索
    searchTagFromServer (query) {
      if (query !== '') {
        this.loading = true
        getLabelPower({labelName: query})
          .then(res => {
            if (res.state === 1000) {
              this.loading = false
              if (res.data.labelNameList.length === 0) {
                document.getElementsByClassName('el-select-dropdown__item hover')[0].children[0].innerHTML = query + ' (new)'
              } else {
                let arr = res.data.labelNameList
                let newArr = arr.map(ele => {
                  return {
                    label: ele,
                    value: ele
                  }
                })
                this.options = newArr
              }
            } else {
              this.errorAjax()
            }
          }, rej => {
            this.errorAjax()
          })
      }
    },
    errorAjax () {
      this.$message({
        type: 'error',
        message: '网络异常',
        duration: 1000
      })
    },
    // 添加进去的标签
    change () {
    },
    // 全选
    handleSelectionChange (val) {
      this.multipleSelect = val
    },
    // 立即创建创建创建
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let arr = []
          for (var k in this.ruleForm.dateRange) {
            arr.push(this.ruleForm.dateRange[k])
          }
          let data = {}
          if (this.radio === '单人编写') {
            data = {
              caseSuiteName: this.ruleForm.name,
              caseSuiteDesc: this.ruleForm.desc,
              startTime: arr[0],
              endTime: arr[1],
              accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
              editType: 1
            }
          } else {
            data = {
              caseSuiteName: this.ruleForm.name,
              caseSuiteDesc: this.ruleForm.desc,
              startTime: arr[0],
              endTime: arr[1],
              accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
              editType: 2
            }
          }
          this.createCaseSuit(data)
        } else {
          return false
        }
      })
    },
    // 编辑已经创建的用例集
    submitFormEdit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let arr = []
          for (var k in this.ruleForm.dateRange) {
            arr.push(this.ruleForm.dateRange[k])
          }
          let data = {}
          if (this.radio === '单人编写') {
            data = {
              caseSuiteName: this.ruleForm.name,
              caseSuiteDesc: this.ruleForm.desc,
              startTime: arr[0],
              endTime: arr[1],
              accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
              editType: 1,
              caseSuiteId: this.$route.query.caseSuiteId
            }
          } else {
            data = {
              caseSuiteName: this.ruleForm.name,
              caseSuiteDesc: this.ruleForm.desc,
              startTime: arr[0],
              endTime: arr[1],
              accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
              editType: 2,
              caseSuiteId: this.$route.query.caseSuiteId
            }
          }
          this.editCaseSuit(data)
        } else {
          return false
        }
      })
    },
    // 提交编辑的用例集
    editCaseSuit (data) {
      editCaseSuitePower(data)
        .then(res => {
          if (res.state === 1000) {
            // 获得创建后的用例集id
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
    // 提交创建的用例集
    createCaseSuit (data) {
      // alert('提交创建')
      addCaseSuitePower(data)
        .then(res => {
          if (res.state === 1000) {
            // 获得创建后的用例集id
            this.caseSuiteId = res.data.caseSuiteId
            let arr = Object.values(this.ruleForm.tagArr)
            if (arr.length > 0) {
              this.updateCaseSuit(arr.join(','))
            } else {
              this.updateCaseSuit('')
            }
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.createCase()
        })
    },
    createCase () {
      this.$message({
        type: 'error',
        message: '创建用例集失败',
        duration: 1000
      })
    },
    // 更新用例集标签
    updateCaseSuit (labelIdList) {
      // alert('更新用例集与标签')
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
    updateUserSuit () {
      let data = {}
      if (this.radio === '单人编写') {
        data = {
          caseSuiteId: this.caseSuiteId,
          accountNameList: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
        }
      } else {
        let arr3 = []
        this.$store.state.joinPerson.forEach(ele => {
          arr3.push(ele.accountName)
        })
        data = {
          caseSuiteId: this.caseSuiteId,
          accountNameList: arr3.join(',')
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
    labelMouseenter (event) {
      event.target.style.cursor = 'pointer'
    },
    // 点击用例标签的向上箭头获取所有用例标签
    labelClick (event) {
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
    // 用例集标签下拉框是否显示
    visibleChange (val) {
      if (val === false) {
        setTimeout(() => {
          this.picture = 'el-icon-arrow-up'
        }, 50)
      }
    },
    haveSelected () {
      this.timeRangeSelect = true
    },
    clickOther (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
    }
  },
  created () {
    getLabelsUsedByCaseSuitePower({caseSuiteId: this.$route.query.caseSuiteId})
      .then(res => {
        if (res.state === 1000) {
          let arr = res.data.labelNameList
          this.ruleForm = {
            name: this.$route.query.label,
            desc: this.$route.query.caseSuiteDesc,
            creator: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
            dateRange: [this.$route.query.startTime, this.$route.query.endTime],
            tagArr: arr
          }
        } else {
        }
      })
    getCaseSuiteUserPower({caseSuiteId: this.$route.query.caseSuiteId})
      .then(res => {
        if (res.state === 1000) {
          this.people = res.data.userList
        } else {
        }
      })
  },
  watch: {
  },
  destroyed () {
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

<style>
.createUseCaseManagmentSmall {
  width: 100%;
}
.createUseCaseManagmentSmall > .header {
  height: 60px;
  border-bottom: 1px solid #ccc;
  line-height: 60px;
  font-size: 24px;
  text-indent: 30px
}
.createUseCaseManagmentSmall > .demo-ruleForm {
  margin-top: 10px
}
.createUseCaseManagmentSmall > .demo-ruleForm > .el-form-item {
    width: 95%;
    margin: 0 auto;
    margin-top: 20px
  }
</style>
