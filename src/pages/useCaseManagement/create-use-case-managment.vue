<template>
  <div class="createUseCaseManagment">
    <header class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/usecasesetlist' }">用例管理</el-breadcrumb-item>
        <el-breadcrumb-item v-html="this.$route.query.action === 'edit'?'编辑用例集':'创建用例集'"></el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <!-- 用例集名称 -->
      <el-form-item label="用例集名称" prop="name">
        <el-input v-model.trim="ruleForm.name"></el-input>
      </el-form-item>
      <!-- 用例集描述 -->
      <el-form-item label="用例集描述" prop="desc">
        <el-input type="textarea" v-model.trim="ruleForm.desc"></el-input>
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
                        :picker-options="pickerOptions">
        </el-date-picker>
        <!-- <div style="color: red" v-show="timeRangeSelect">注意: 时间选定后不可修改</div> -->
      </el-form-item>
      <!-- <el-form-item label="时间选择" prop="dateRange" v-if="action">
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
        <div style="color: red" v-show="timeRangeSelect">注意: 时间选定后不可修改</div>
      </el-form-item> -->
      <!-- 用例标签 -->
      <el-form-item label="用例标签">
        <el-select v-model="ruleForm.tagArr" @visible-change="visibleChange" :loading="loading" size="medium" multiple filterable remote :remote-method="searchTagFromServer" allow-create default-first-option placeholder="请选择标签" @change="change">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
        <i :class="picture" @mouseenter="labelMouseenter" @click="labelClick"></i>
        <!-- <div style="color: red">注意: 单个标签限制10个汉字</div> -->
      </el-form-item>
      <!-- 归属项目 -->
      <el-form-item label="归属项目" prop="belongProject" class="belongProject">
        <el-select v-model="ruleForm.belongProject" placeholder="请选择项目" @change="projectChange()"  style="width:100px">
          <el-option :label="val.label" :value="val.value" v-for="(val, key) in fromProject" :key="key"></el-option>
          <!-- <el-option label="区域二" value="beijing"></el-option> -->
        </el-select>
      </el-form-item>
      <!-- 编写方式 -->
      <el-form-item label="编写方式" prop="function">
        <el-radio-group v-model="radio">
          <el-radio label="多人协作"></el-radio>
          <el-radio label="单人编写"></el-radio>
          <template v-if="!(radio === '单人编写')">
            <el-button type="primary" @click="addPerson">新增</el-button>
            <el-button type="primary" @click="multipleDelete">删除</el-button>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" v-if="!(radio === '单人编写')">
        <el-table ref="multipleTable" :data="$store.state.joinPerson" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" border="" :header-cell-style="{background:'rgb(250, 250, 250)'}">
            <el-table-column type="selection" width="95" align="center"></el-table-column>
            <el-table-column prop="userName" label="姓名" width="245" align="center"></el-table-column>
            <el-table-column prop="accountName" label="账户名" width="245"  align="center"></el-table-column>
            <el-table-column prop="department" label="部门" show-overflow-tooltip align="center" width="245"></el-table-column>
            <el-table-column label="操作" width="198" align="center">
              <template slot-scope="scope">
                <el-button @click="del(scope.$index)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-form-item>
      <el-form-item class="build">
        <el-button type="primary" @click="submitForm('ruleForm')" v-if="action === ''">立即创建</el-button>
        <el-button type="primary" @click="submitFormEdit('ruleForm')" v-if="action === 'edit'">编辑完成</el-button>
        <el-button type="primary" @click="cancelCreate">取消</el-button>
        <el-button type="primary" v-if="action === ''" @click="reCreateFun('reCreate', 'ruleForm')">再建一个</el-button>
      </el-form-item>
    </el-form>
    <!-- 绑定角色 -->
    <!-- <SelectPeople :showSelectPeople="showSelectPeople" :bindUserData="bindUserData" :havebindUserData="havebindUserData" @changeShowSelectPeople='changeShowSelectPeople' @commitBindPeople="commitBindPeople" @searchFromComponent='getSearchFromComponent' :getSearch='sendSearch'></SelectPeople> -->
    <el-dialog :visible.sync="showDialogUser" :show-close="hide" :before-close="clickOther" class="bindUser">
      <div class="left">
        <h2>待添加人员列表</h2>
          <div class="query">
          <el-select v-model="PersonValue" clearable placeholder="请选择" size="mini"  style="float:left;width:100px;margin-right:5px ">
            <el-option
              v-for="item in personOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="inputPerson" placeholder="请输入内容，回车键搜索" size="mini" @keyup.native.enter="queryPerson" style="float:left;width:188px;margin-right:7px "></el-input>
          </div>
        <el-tree :data="bindRole" show-checkbox @check-change="handleNodeClick" accordion empty-text node-key="id" ref="tree"></el-tree>
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
    </el-dialog>
  </div>
</template>

<script>
import SelectPeople from '../../components/selectPeople'
import { getAllProject, getUserListPower, addCaseSuitePower, getLabelsUsedByCaseSuitePower, searchAndGetUsers, updateCaseSuiteLabelPower, updateCaseSuiteUserPower, getUserPower, getLabelPower, getCaseSuiteUserPower, editCaseSuitePower } from '../../api/api'
export default {
  components: {
    SelectPeople
  },
  data () {
    return {
      belongProjectName: '',
      fromProject: [],
      inputPerson: '',
      personOptions: [
        {
          value: 1,
          label: '按用户名'
        }, {
          value: 2,
          label: '按域账户'
        }
      ],
      PersonValue: 1,
      showDialogUser: false,
      action: '',
      allUser: [],
      hide: false,
      bindRole: [],
      haveBindUser: [],
      haveBindUserTemp: [],
      count: 0,
      preAddRole: [],
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
      // 创建的用例集id
      caseSuiteId: '',
      ruleForm: {
        name: '',
        desc: '',
        creator: window.sessionStorage.getItem('userName') || window.localStorage.getItem('userName'),
        dateRange: '',
        tagArr: [],
        belongProject: ''
        // tagArr: ['UI界面', '接口', '硬件', '算法']
      },
      rules: {
        name: [
          { required: true, message: '请输入用例集名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个汉字', trigger: 'blur' }
        ],
        desc: [
          { min: 1, max: 100, message: '长度在 1 到 100 个汉字', trigger: 'blur' }
        ],
        dateRange: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        belongProject: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ]
        // belongProjectName: [
        //   { required: true, message: '请选择项目', trigger: 'change' }
        // ],
      },
      pickerOptions: {
        disabledDate (time) {
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
      sendSearch: []
      // tableData: []
    }
  },
  methods: {
    // 所属项目变动
    projectChange () {
      console.log(this.ruleForm.belongProject)
    },
    // 查询用户（或域账号）名称
    queryPerson () {
      // alert(this.personValue)
      // alert(this.inputPerson)
      let Data = {
        userName: this.inputPerson,
        searchType: this.PersonValue
      }
      searchAndGetUsers(Data)
        .then(res => {
          if (res.state === 1000) {
          // 下面的代码总体为把查询到的数据显示在待选择列表上
            let array = []
            console.log(res.data.userList)
            console.log(this.bindRole)

            // 把取出来的数据一个一个推到arr里
            res.data.userList.forEach(eleOne => {
              eleOne.children.forEach(eleTwo => {
                let tempStr = eleTwo.label + '(' + eleTwo.accountName + ')'
                let tempObj = { label: tempStr, disabled: false, type: 'person' }
                // 检测每个待选数据是不是已选，要是已选直接Ban掉
                this.haveBindUser.forEach(ele1 => {
                  if (ele1.role == tempStr) {
                    tempObj.disabled = true
                  }
                })

                array.push(tempObj)
              })
            })
            this.bindRole = [{
              label: '人员信息',
              children: array
            }]
            console.log(this.bindRole)

            // //把已选择的在选项里ban掉
            // res.data.userList.forEach(eleOne=>{
            //   eleOne.children.forEach(eleTwo=>{
            //     let temp=eleTwo.label+'('+eleTwo.accountName+')'
            //     this.bindRole[0].children.forEach(eleHaveBind=> {
            //       if(eleHaveBind.label==temp){
            //         this.$set(eleHaveBind,'disabled',true)
            //       }
            //     })
            //     })

            //   })
          } else {
            this.$message(res.message)
          }
        }, rej => {
          this.errorAjax()
        })
    },

    getSearchFromComponent (mes) {
      console.log(mes)
    },
    commitBindPeople (user) {
      console.log(user)
    },
    changeShowSelectPeople (bol) {
      this.showSelectPeople = false
    },
    reCreateFun (a, b) {
      if (a === 'reCreate') {
        this.reCreate = true
        this.submitForm('ruleForm')
      }
      // console.log(a)
      // console.log(b)
    },
    preventCode () {
      window.addEventListener('keydown', e => {
        // console.log(e.keyCode)
        if ((e.keyCode === 116) || (e.ctrlKey && e.keyCode === 82)) {
          // return false
          e.keyCode = 0
          e.returnValue = false
        }
      })
    },
    preventOnload () {
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
    cancelCreate () {
      // this.
      this.$store.commit('changeActiveName', this.$route.query.activeName)
      this.$router.replace('/usecasesetlist')
      this.$store.commit('currentJoinPerson', [])
      this.$store.commit('transformPrePerson', [])
      // this.$router.replace({
      //   path: '/usecasesetlist'
      // })
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
        // function diffset (arr1, arr2) {
        //   var l, shortArr, longArr
        //   if (arr1.length > arr2.length) {
        //     shortArr = arr2
        //     longArr = JSON.parse(JSON.stringify(arr1))
        //   } else {
        //     shortArr = arr1
        //     longArr = JSON.parse(JSON.stringify(arr2))
        //   }
        //   l = shortArr.length
        //   for (var i = l - 1; i >= 0; i--) {
        //     let { accountName, userName } = shortArr[i]
        //     let t = longArr.findIndex(item => item.accountName === accountName && item.userName === userName)
        //     if (t < 0) {
        //       longArr.push(arr2[i])
        //     } else {
        //       longArr.splice(t, 1)
        //     }
        //   }
        //   return longArr
        // }
        let arr = this.diffset(this.$store.state.joinPerson, this.multipleSelect)
        this.$store.commit('currentJoinPerson', arr)
        // console.log(this.$store.state.joinPerson)
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
        // console.log(this.$store.state.prePerson)
        this.count = 0
        let arr = []
        let arr2 = []
        console.log(this.$store.state.prePerson)
        // 取域账号合计放在arr里
        this.$store.state.prePerson.forEach(ele => {
          arr.push(ele.role.split('(')[1].split(')')[0])
        })
        console.log(arr)
        console.log(this.allUser)
        arr.forEach(ele => {
          this.allUser.forEach(ele2 => {
            ele2.children.forEach(ele3 => {
              if (ele3.accountName === ele) {
                arr2.push({userName: ele3.label, accountName: ele3.accountName, department: ele2.label})
              }
            })
          })
        })
        console.log(arr2)
        // this.tableData = arr2
        // this.$store.commit('currentJoinPerson', arr)
        this.$store.commit('currentJoinPerson', arr2)
        this.haveBindUserTemp = []
      }
      // console.log(arr)
      // this.preAddRoleArr = []
      this.tempAddRole = []
      this.showDialogUser = false
      // this.preAddRoleArr = []
      // this.haveBindUser = []
      // this.preAddRoleArr = []
      // this.showDialogUser = false
    },
    // 点击了弹窗的删除
    deleteBindUser (index) {
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
      // console.log(this.haveBindUser)
      // console.log(this.haveBindUserTemp)

      // 把已选择的选项恢复掉

      console.log(this.haveBindUser[index])
      this.bindRole.forEach(ele => {
        ele.children.forEach(eleOne => {
          if (eleOne.label == this.haveBindUser[index].role) {
            console.log(1)
            this.$set(eleOne, 'disabled', false)
          }
        })
      })

      this.haveBindUser.splice(index, 1)
      this.$store.commit('transformPrePerson', this.haveBindUser)
      console.log(this.$store.state.prePerson)
      console.log(this.haveBindUser)
    },
    addRole () {
      // console.log(this.preAddRole.split('(')[1].split(')')[0])
      // let tableDataArr = []
      // //初始创建haveBindUser为空，然后编辑的话haveBindUser就有值
      // this.haveBindUser.forEach(ele => {
      //   tableDataArr.push(ele.role)
      // })
      // if (tableDataArr.indexOf(this.preAddRole) === -1) {
      //   let data = {
      //     role: this.preAddRole
      //   }
      //   if (data.role !== '') {
      //     this.$store.commit('changeprePerson', data)
      //     this.tempAddRole.push(data)
      //     // this.haveBindUser.push(data)
      //     // this.preAddRoleArr.push(this.preAddRole.split('(')[1].split(')')[0])
      //   }

    // if (tableDataArr.indexOf(this.preAddRole) === -1) {

      // } else {
      //   this.$message({
      //     type: 'warning',
      //     message: '绑定角色重复',
      //     duration: 1000
      //   })
      // }
      // 1.把preAddRole加到haveBindUser里去,还要去掉已经推入的
      // this.preAddRole.forEach(ele=>{
      //   this.haveBindUser.some(eleTwo => {
      //     if(ele.label==eleTwo.role)
      //     {
      //       return true;
      //     }
      //   })
      //   this.haveBindUser.push({role:ele.label})
      // })
      let arr = []
      // 先把已选的变成数组
      this.haveBindUser.forEach(ele => {
        arr.push(ele.role)
      })
      // 在待选的判断是否重复
      let arr2 = []
      this.preAddRole.forEach(ele => {
        if (arr.indexOf(ele.label) < 0) {
          arr2.push({role: ele.label})
        }
      })
      this.haveBindUser.push(...arr2)
      // 如果是新增缓存也添加
      // if(this.$route.query.action !== 'edit')
      // {
      this.$store.commit('transformPrePerson', this.haveBindUser)
      // }
      // arr2.forEach(ele => {
      //   this.$store.commit('changeprePerson', ele)
      // })
      console.log(this.haveBindUser)
      console.log(this.$store.state.prePerson)

      // 2.把preAddRole那几个对象在bindRole中选项设为true
      this.preAddRole.forEach(eleOne => {
        this.bindRole.forEach(eleTwo => {
          eleTwo.children.forEach(eleThree => {
            if (eleOne.label == eleThree.label) {
              this.$set(eleThree, 'disabled', true)
            }
          })
        })
      })
      // 3.把this.preAddRole给我清空了
      this.preAddRole = []
    },
    handleNodeClick () {
      //  console.log(data)

      this.preAddRole = []
      console.log(this.$refs.tree.getCheckedNodes())
      this.$refs.tree.getCheckedNodes().forEach(ele => {
        if (ele.type == 'person') {
          this.preAddRole.push(ele)
        }
      })
    },
    addPerson () {
      console.log(this.$store.state.prePerson)// 空
      console.log(this.$store.state.joinPerson)// 有值
      console.log(this.haveBindUser)// 有值
      let data = {
        startNum: 1,
        range: 0
      }
      getUserListPower(data)
        .then(res => {
          if (res.state === 1000) {
            // console.log(res.data.userList)
            // 初始化左边所有人员
            let tempData = res.data.userList
            // this.allUser是初始数据
            this.allUser = res.data.userList
            console.log(tempData)
            tempData = tempData.map(ele => {
              let tempArr = {
                label: ele.label,
                children: []
              }
              ele.children.forEach(ele => {
                tempArr.children.push({label: ele.label + '(' + ele.accountName + ')', disabled: false, type: 'person'})
              })
              return tempArr
            })
            // this.bindRole是美化后的数据
            this.bindRole = tempData
            console.log(tempData)

            // if (this.$route.query.action === 'edit') {
            this.haveBindUser = this.$store.state.prePerson
            console.log(this.haveBindUser)
            // 把已选择的选项禁止掉
            this.haveBindUser.forEach(eleOne => {
              this.bindRole.forEach(eleTwo => {
                eleTwo.children.forEach(eleThree => {
                  if (eleOne.role == eleThree.label) {
                    eleThree.disabled = true
                  }
                })
              })
            })
            // }
            // else{
            //   this.haveBindUser = []
            // }
            console.log(this.$store.state.prePerson)
            console.log(this.haveBindUser)

            // console.info('弹窗开始:' + this.$store.state.prePerson)
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
    errorAjax () {
      this.$message({
        type: 'error',
        message: '网络异常',
        duration: 1000
      })
    },
    // 添加进去的标签
    change () {
      console.log(this.ruleForm.tagArr)
      // document.getElementsByClassName('el-select-dropdown__item hover')[0].children[0].innerHTML = ''
    },
    // 全选
    handleSelectionChange (val) {
      this.multipleSelect = val
    },
    // 立即创建创建创建
    submitForm (formName) {
      // console.log(action)
      // alert(action)
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
              belongProjectId: this.ruleForm.belongProject
            }
          } else {
            data = {
              caseSuiteName: this.ruleForm.name,
              caseSuiteDesc: this.ruleForm.desc,
              startTime: arr[0],
              endTime: arr[1],
              accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
              editType: 2,
              belongProjectId: this.ruleForm.belongProject
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
      // 下面再进行正常处理
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
              caseSuiteId: this.$route.query.caseSuiteId,
              belongProjectId: this.ruleForm.belongProject
              // belongProjectId:this.$route.query.belongProject
            }
          } else {
            data = {
              caseSuiteName: this.ruleForm.name,
              caseSuiteDesc: this.ruleForm.desc,
              startTime: arr[0],
              endTime: arr[1],
              accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
              editType: 2,
              caseSuiteId: this.$route.query.caseSuiteId,
              belongProjectId: this.ruleForm.belongProject
              // belongProjectId:this.$route.query.belongProject
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
            console.log(this.caseSuiteId)
            let arr = Object.values(this.ruleForm.tagArr)
            if (arr.length > 0) {
              this.updateCaseSuit(arr.join(','))
            } else {
              this.updateCaseSuit('')
              // this.updateUserSuit('')
            }
          } else {
            console.log(Object.values(this.ruleForm.tagArr))
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
            console.log(res)
            this.caseSuiteId = res.data.caseSuiteId
            let arr = Object.values(this.ruleForm.tagArr)
            console.log(arr)
            if (arr.length > 0) {
              this.updateCaseSuit(arr.join(','))
            } else {
              this.updateCaseSuit('')
              // this.updateUserSuit('')
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
      console.log(this.caseSuiteId)
      let data = {
        caseSuiteId: this.caseSuiteId,
        labelNameList: labelIdList,
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      }
      console.log(data)
      updateCaseSuiteLabelPower(data)
        .then(res => {
          if (res.state === 1000) {
            console.log('更新用例集与标签成功')
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
              // this.ruleForm = {
              //   name: '',
              //   desc: '',
              //   creator: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
              //   dateRange: '',
              //   tagArr: []
              // }
              // alert(this.reCreate)
              // console.log('再建一个')
              this.$store.commit('changeActiveName', this.$route.query.activeName)
              this.$router.replace({
                path: '/usecasesetlist',
                query: {
                  reCreate: true
                }
              })
              this.$store.commit('currentJoinPerson', [])
            } else {
              // alert(this.reCreate)
              // console.log('立即创建')
              this.$store.commit('changeActiveName', this.$route.query.activeName)
              this.$router.replace({
                path: '/usecasesetlist',
                query: {
                  reCreate: false
                }
              })
              this.$store.commit('currentJoinPerson', [])
            }
            // this.action = ''
            // this.ruleForm = {
            //   name: '',
            //   desc: '',
            //   creator: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
            //   dateRange: '',
            //   tagArr: ['UI界面', '接口', '硬件', '算法']
            // }
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
    }
  },

  created () {
    this.getAllProject()
    this.preventCode()
    this.preventOnload()
    let arr = []
    this.action = this.$route.query.action
    if (this.$route.query.action === 'edit') {
      this.caseSuiteId = this.$route.query.caseSuiteId
      if (this.$route.query.editType === 1) {
        this.radio = '单人编写'
        getCaseSuiteUserPower({caseSuiteId: this.$route.query.caseSuiteId})
          .then(res => {
            if (res.state === 1000) {
              this.$store.commit('currentJoinPerson', res.data.userList)
            } else {
            }
          })
      } else {
        this.radio = '多人协作'
        getCaseSuiteUserPower({caseSuiteId: this.$route.query.caseSuiteId})
          .then(res => {
            if (res.state === 1000) {
              console.log(res.data.userList)
              // let arr123 = res.data.userList.map(ele => {
              //   return{
              //     accountName : ele.accountName,
              //     department : ele.department,
              //     label : ele.userName
              //   }
              // })
              this.$store.commit('currentJoinPerson', res.data.userList)
              let arr = res.data.userList.map(ele => {
                return {
                  role: ele.userName + '(' + ele.accountName + ')'
                }
              })
              this.$store.commit('transformPrePerson', arr)
            } else {
            }
          })
      }
      // 查询当前用例集所拥有的用例标签
      getLabelsUsedByCaseSuitePower({caseSuiteId: this.$route.query.caseSuiteId})
        .then(res => {
          if (res.state === 1000) {
            arr = res.data.labelNameList
            this.ruleForm = {
              name: this.$route.query.caseSuiteName,
              desc: this.$route.query.caseSuiteDesc,
              creator: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
              dateRange: [this.$route.query.startTime, this.$route.query.endTime],
              tagArr: arr,
              belongProject: this.$route.query.belongProject
            }
          } else {
          }
        })
    }
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
/* @import url('../../assets/css/create-use-case-managment.css') */
.createUseCaseManagment {
    width: 100%;
    /* margin: 0 auto; */
    /* overflow-y: auto */
    /* max-height: 800px;
    overflow-y: auto; */
  }
  .createUseCaseManagment .color {
    color: #409EFF;
    cursor: pointer
  }
  .createUseCaseManagment > .header {
    width: 1188px;
    height: 40px;
    margin: 0 auto;
    padding: 10px 0px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc
  }
  .createUseCaseManagment > .header > .breadcrumb {
    margin-left: 10px
  }
  .createUseCaseManagment > .demo-ruleForm {
    width: 1188px;
    margin: 0 auto;
    margin-top: 10px;
    border: 1px solid #ccc
  }
  .createUseCaseManagment > .demo-ruleForm > .el-form-item {
    width: 95%;
    margin: 0 auto;
    margin-top: 20px
  }
  .createUseCaseManagment > .demo-ruleForm > .el-form-item:nth-of-type(4) > .el-form-item__content > .el-form-item {
    display: inline-block
  }
  .createUseCaseManagment > .demo-ruleForm > .el-form-item:nth-of-type(4) > .el-form-item__content > .el-form-item > .el-form-item__content {
    display: inline-block
  }
  .createUseCaseManagment > .demo-ruleForm > .el-form-item:nth-of-type(4) > .el-form-item__content > .el-form-item > .el-form-item__content > .el-input {
    width: 450px;
    display: inline-block
  }
  .createUseCaseManagment > .demo-ruleForm > .el-form-item:nth-of-type(4) > .el-form-item__content > span {
    display: inline-block;
    width: 20px;
    height: 1px;
    background-color: #000;
    margin: 0px 50px
  }
  .createUseCaseManagment > .demo-ruleForm > .el-form-item:nth-of-type(5) > .el-form-item__content > .el-select > .el-input {
    width: 400px;
  }
  .createUseCaseManagment > .demo-ruleForm > .el-form-item:nth-of-type(6) > .el-form-item__content > .el-select > .el-input {
    width: 200px;
  }
  .createUseCaseManagment > .demo-ruleForm > .el-form-item:nth-of-type(7) > .el-form-item__content > .el-radio-group > .el-button:nth-of-type(1) {
    position: absolute;
    top: 0px;
    right: 120px
  }
  .createUseCaseManagment > .demo-ruleForm > .el-form-item:nth-of-type(7) > .el-form-item__content > .el-radio-group > .el-button:nth-of-type(2) {
    position: absolute;
    top: 0px;
    right: 0px
  }
  .el-table td, .el-table th {
    padding: 8.5px 0px
  }
  .createUseCaseManagment > .demo-ruleForm > .el-form-item:nth-of-type(8) > .el-form-item__content > .el-table > .el-table__body-wrapper {
    min-height: 49px;
    max-height: 147px;
    overflow-y: auto
  }
  .createUseCaseManagment > .demo-ruleForm > .build {
    margin-bottom: 20px
  }
  .createUseCaseManagment > .demo-ruleForm > .build > .el-form-item__content > .el-button {
    margin-right: 20px
  }

  .createUseCaseManagment > .bindUser > .el-dialog {
    width: 1000px;
    height: 600px
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 500px;
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body > .left {
    width: 300px;
    float: left;
    margin-left: 30px
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body > .left > h2 {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #ccc;
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body > .left > .el-tree {
    width: 298px;
    height: 448px;
    border: 1px solid #DCDFE6;
    overflow-y: auto;
    overflow-x: hidden
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body > .middle {
    width: 80px;
    float: left;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 50px
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body > .middle > .el-button {
    width: 80px;
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body > .right {
    width: 450px;
    float: left;
    height: 500px;
    margin-left: 50px
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body > .right > h2 {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #ccc;
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body > .right > .table{
    width: 448px;
    height: 450px;
    border-left: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table {
    width: 448px;
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
    border-right: 1px solid #DCDFE6
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper {
    height: 402px;
    overflow-y: auto
  }
  .createUseCaseManagment > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
    border-right: 1px solid #DCDFE6;
    height: 40px;
    padding: 3px 0
  }
</style>
