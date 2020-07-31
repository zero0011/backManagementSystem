<template>
  <div class="selectSingleUser">
    <el-dialog :visible.sync="showCanSelectUser" :show-close="hide" :before-close="clickOther" class="bindUser">
      <div class="left">
        <h2>{{ title1 }}</h2>
        <el-select v-model="value" clearable placeholder="请选择" size="mini" @change='getSelect'>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="input" placeholder="请输入内容，回车键搜索" size="mini" @keyup.native.enter="searchUsers"></el-input>
        <el-tree :data="canSelectUser" show-checkbox @node-click="handleNodeClick" empty-text node-key="id" @node-expand="openList" @check-change="getSelectNode" ref="tree"></el-tree>
      </div>
      <!-- <div class="middle">
        <el-button type="primary" plain @click="addSelectUser">> 添加</el-button>
      </div> -->
      <!-- <div class="right">
        <h2>{{ title2 }}</h2>
        <div class="table">
          <el-table :data="haveSelectedUser" empty-text>
            <el-table-column prop="fullName" label="用户名称" width="224" align="center"></el-table-column>
            <el-table-column label="操作" width="224" align="center">
              <template slot-scope="scope">
                <el-button @click="deleteBindResourse(scope.$index)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogBindUser('close')">取 消</el-button>
        <el-button type="primary" @click="closeDialogBindUser('confirm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    'showSelectSingleUser': {
      type: Boolean,
      required: true
    },
    'bindUserData': {
      type: Array,
      required: true
    },
    'havebindUserData': {
      type: Array,
      required: true
    },
    'getSearch': {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // 显示弹窗
      showCanSelectUser: false,
      hide: false,
      // 可以选择的用户
      canSelectUser: [],
      // 临时存储可以选择的用户
      tempCanSelectUser: [],
      // 已经选择的用户
      haveSelectedUser: [],
      // 准备选择的用户
      prepareSelectUser: [],
      // 标题名称
      title1: '待选择用户列表',
      // 标题名称
      title2: '已选择用户列表',
      options: [
        {
          value: 1,
          label: '按用户名'
        }, {
          value: 2,
          label: '按域账户'
        }
      ],
      value: 1,
      input: '',
      total: 0,
      searchType: 0
    }
  },
  methods: {
    // 查询，从子组件内调用父组件的方法
    searchUsers () {
      // 判断search是什么类型，如果没有不用管
      if (this.searchType > 0) {
        this.$emit('searchFromComponent', {
          userName: this.input,
          searchType: this.searchType
        })
      }
    },
    getSelect (val) {
      if (val === '') {
        this.canSelectUser = this.tempCanSelectUser
        this.input = ''
      }
      this.searchType = val
    },
    deleteBindResourse (index) {
      // 恢复禁用选项
      this.canSelectUser.map(ele => {
        return {
          label: ele.label,
          children: ele.children.map(eleTwo => {
            if (eleTwo.label === this.haveSelectedUser[index].fullName) {
              this.$set(eleTwo, 'disabled', false)
            }
          })
        }
      })
      this.haveSelectedUser.splice(index, 1)
    },
    // 显示弹窗
    showDialog () {
      this.showCanSelectUser = true
    },
    // 初始化时判断已经勾选的在可选择的列表中禁止选择
    stopSelect () {
      this.haveSelectedUser.forEach(eleOne => {
        this.canSelectUser.map(eleTwo => {
          return {
            label: eleTwo.label,
            children: eleTwo.children.map(eleThree => {
              if (eleOne.fullName === eleThree.label) {
                this.$set(eleThree, 'disabled', true)
              }
            })
          }
        })
      })
      this.total = 0
    },
    clickOther () {
      console.log()
    },
    handleNodeClick () {
      console.log()
    },
    openList () {
      console.log()
    },
    addSelectUser () {
      if (this.prepareSelectUser.length > 0) {
        console.log(this.haveSelectedUser)
        console.log(this.prepareSelectUser)
        let arr = []
        this.haveSelectedUser.forEach(ele => {
          arr.push(ele.fullName)
        })
        let arr2 = []
        this.prepareSelectUser.forEach(ele => {
          if (arr.indexOf(ele.label) < 0) {
            arr2.push({
              fullName: ele.label
            })
          }
        })
        this.haveSelectedUser.push(...arr2)
        // 有个问题
        // this.haveSelectedUser.splice(0, this.haveSelectedUser.length)
        // this.haveSelectedUser.push()
        // this.haveSelectedUser.push(...Array.from(new Set(this.haveSelectedUser.map(ele => {
        //   this.prepareSelectUser.map(ele2 => {
        //     if (ele2.label !== ele.fullName) {
        //       return {
        //         fullName: ele.label
        //       }
        //     }
        //   })
        // }))))
        // this.haveSelectedUser.push(...this.haveSelectedUser.map(ele => {
        //   if (this.haveSelectedUser.indexOf(ele.label) < 0) {
        //     return {
        //       fullName: ele.label
        //     }
        //   }
        // }))
        // 禁用已经选择的
        // this.haveSelectedUser.splice(0, this.haveSelectedUser.length)
        // setTimeout(() => {
        //   this.haveSelectedUser.forEach(eleOne => {
        //     this.canSelectUser.map(eleTwo => {
        //       return {
        //         label: eleTwo.label,
        //         children: eleTwo.children.map(eleThree => {
        //           if (eleOne.fullName === eleThree.label) {
        //             this.$set(eleThree, 'disabled', true)
        //           }
        //         })
        //       }
        //     })
        //   })
        // })
        this.haveSelectedUser.forEach(eleOne => {
          this.canSelectUser.map(eleTwo => {
            return {
              label: eleTwo.label,
              children: eleTwo.children.map(eleThree => {
                if (eleOne.fullName === eleThree.label) {
                  this.$set(eleThree, 'disabled', true)
                }
              })
            }
          })
        })
        this.prepareSelectUser = []
      }
      // this.haveSelectedUser.push(...this.prepareSelectUser.map(ele => {
      //   return {
      //     fullName: ele.label
      //   }
      // }))
      // // 禁用已经选择的
      // this.haveSelectedUser.forEach(eleOne => {
      //   this.canSelectUser.map(eleTwo => {
      //     return {
      //       label: eleTwo.label,
      //       children: eleTwo.children.map(eleThree => {
      //         if (eleOne.fullName === eleThree.label) {
      //           this.$set(eleThree, 'disabled', true)
      //         }
      //       })
      //     }
      //   })
      // })
      // this.prepareSelectUser = []
    },
    closeDialogBindUser (action) {
      if (action === 'close') {
        this.showCanSelectUser = false
        this.$emit('changeShowSelectPeople', false)
        this.$nextTick(() => {
          this.canSelectUser = []
          this.haveSelectedUser = []
          this.prepareSelectUser = []
          this.tempCanSelectUser = []
        })
      }
      if (action === 'confirm') {
        this.$emit('commitBindPeople', this.haveSelectedUser)
      }
    },
    // 待选择的用户数组
    getSelectNode () {
      this.prepareSelectUser = []
      this.$refs.tree.getCheckedNodes().forEach(ele => {
        if (ele.type === 'user') {
          this.prepareSelectUser.push(ele)
        }
      })
      console.log(this.prepareSelectUser)
    }
  },
  watch: {
    showSelectSingleUser (val) {
      if (!val) {
        this.value = null
        this.input = ''
      }
      this.showCanSelectUser = val
      this.value = 1
      this.searchType = 1
    },
    bindUserData (val) {
      this.canSelectUser = []
      this.canSelectUser = val.map(ele => {
        return {
          label: ele.label,
          children: ele.children.map(eleChildren => {
            return {
              label: eleChildren.label + '(' + eleChildren.accountName + ')',
              type: 'user',
              disabled: false
            }
          })
        }
      })
      this.tempCanSelectUser = this.canSelectUser
      this.total += 1
    },
    havebindUserData (val) {
      this.haveSelectedUser = []
      this.haveSelectedUser.push(...val.map(ele => {
        return {
          fullName: ele.userName + '(' + ele.accountName + ')'
        }
      }))
      this.total += 1
    },
    total (val) {
      if (val === 2) {
        this.stopSelect()
      }
    },
    // 从父组件传递过来的值
    getSearch (val) {
      this.canSelectUser = []
      this.canSelectUser = val.map(ele => {
        return {
          label: ele.label,
          children: ele.children.map(eleChildren => {
            return {
              label: eleChildren.label + '(' + eleChildren.accountName + ')',
              type: 'user',
              disabled: false
            }
          })
        }
      })
      this.stopSelect()
    }
  }
}
</script>

<style>
.selectSingleUser > .bindUser > .el-dialog {
  width: 1000px;
  height: 600px
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 500px;
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .left {
  width: 300px;
  float: left;
  margin-left: 30px
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .left > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .left > .el-tree {
  width: 298px;
  height: 448px;
  border: 1px solid #DCDFE6;
  overflow-y: auto;
  overflow-x: hidden
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .middle {
  width: 80px;
  float: left;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .middle > .el-button {
  width: 80px;
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .right {
  width: 450px;
  float: left;
  height: 500px;
  margin-left: 50px
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .right > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .right > .table{
  width: 448px;
  height: 432px;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table {
  height: 432px;
  width: 448px;
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
  border-right: 1px solid #DCDFE6
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper {
  height: 402px;
  overflow-y: auto
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
  border-right: 1px solid #DCDFE6;
  height: 40px;
  padding: 3px 0
}
.selectSingleUser .el-input--mini .el-input__inner {
  width: 100px
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .left > .el-select {
  margin-top: 10px;
  display: inline-block
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .left > .el-input {
  display: inline-block;
  width: 195px;
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .left > .el-input > .el-input__inner {
  width: 100%;
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__body > .left > .el-tree {
  margin-top: 10px
}
.selectSingleUser > .bindUser > .el-dialog > .el-dialog__footer > .dialog-footer > .el-button:nth-of-type(2) {
  margin-right: 18px
}
</style>
