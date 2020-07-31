<!-- 模块详情 -->

<template>
  <div class="moduleDetailApp">
    <div class="left">
      <header class="header" v-if="moduleData.moduleType == 3">
        版本详情信息
      </header>
      <header class="header" v-if="moduleData.moduleType == 4">
        模块详情信息
      </header>
      <el-card shadow="always" class="box-card">
        <div class="text item">
            <el-form label-width="100px" :rules="rules" ref="moduleDetail" :model="moduleDetail.data" :key="moduleData.nodeId">
                <el-form-item v-if="moduleData.moduleType == 3" label="版本名称"  prop="moduleName">
                    <el-input v-model.trim="moduleDetail.data.moduleName" placeholder="请输入版本名称"></el-input>
                </el-form-item>
                <el-form-item v-else-if="moduleData.moduleType == 4" label="模块名称"  prop="moduleName">
                    <el-input v-model.trim="moduleDetail.data.moduleName" placeholder="请输入模块名称"></el-input>
                </el-form-item>

                <el-form-item v-if="moduleData.moduleType == 3" label="版本描述"  prop="moduleDesc">
                    <el-input type="textarea" v-model="moduleDetail.data.moduleDesc" placeholder="请输入版本描述"></el-input>
                </el-form-item>
                <el-form-item v-if="moduleData.moduleType == 4" label="模块描述"  prop="moduleDesc">
                    <el-input type="textarea" v-model="moduleDetail.data.moduleDesc" placeholder="请输入模块描述"></el-input>
                </el-form-item>

                <el-form-item label="预置条件"  prop="preCondition">
                    <el-input type="textarea" v-model="moduleDetail.data.preCondition" placeholder="请输入预置条件"></el-input>
                </el-form-item>

                <el-form-item label="创建人员"  prop="creator">
                    <el-input v-model="moduleDetail.data.creator" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="创建时间"  prop="createTime">
                    <el-input v-model="moduleDetail.data.createTime" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="修改人员"  prop="updator">
                    <el-input v-model="moduleDetail.data.updator" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="修改时间"  prop="updateTime">
                    <el-input v-model="moduleDetail.data.updateTime" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
        </div>
      </el-card>
    </div>
    <div class="right" style="font-size: 32px" v-if="$route.query.behaviour === 'all'">
      <i class="el-icon-check icon1" @click="submitData(3)"></i>
      <i class="el-icon-refresh icon2" @click="reloadData()"></i>
    </div>

  </div>
</template>
<script>
/* eslint-disable */
import { getModuleDetail,addModule,updateModule } from '../../api/api'
// import supendButton from './suspend-button.vue'
export default {
// components:{
//     SupendButton: supendButton
// },
// props: ['moduleData'],
props: ['moduleData', 'moduleScrollTop'],
watch: {
  moduleScrollTop (val) {
    console.log(val)
    document.getElementsByClassName('icon1')[0].style.top = 200 + val + 'px'
    document.getElementsByClassName('icon2')[0].style.top = 250 + val + 'px'
  }
},
data () {
    return {
      //props: ['caseSuiteId','fatherId','nodeId','nodeDepth','userAccount','userName','clickType','moduleType','belongRepository'],
      moduleDetail:{
          data:{
              caseSuiteId:'',
              fatherId:'',
              nodeDepth:'',
              moduleName:'',
              moduleDesc:'',
              preCondition:'',
              creator:'',
              createTime:'',
              updator:'',
              updateTime:''
          }
      },
      rules: {
          moduleName: [
          { required: true, message: '请输入模块名称', trigger: 'blur' },
          { min: 1, max: 100, message: '输入字符长度不合法', trigger: 'blur' }
        ],
        moduleDesc: [
          { min: 1, max: 100, message: '输入字符长度不合法', trigger: 'blur' }
        ],
        preCondition: [
            { min: 1, max: 500, message: '输入字符长度不合法', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{

    //页面右侧保存按钮点击事件
    submitData(num){
      if(this.moduleData.clickType == 1 && num === 3){
        this.updateModuleClick()
      }else if(this.moduleData.clickType == 2){
        this.addModuleClick()
      }
    },

    //页面右侧重置按钮点击事件
    reloadData(){
      this.moduleDetail.data.moduleName = '';
      this.moduleDetail.data.moduleDesc = '';
      this.moduleDetail.data.preCondition = '';
      this.moduleDetail.data.creator = this.moduleData.userName+'('+this.moduleData.userAccount+')';
      this.moduleDetail.data.createTime = '';
      this.moduleDetail.data.updator = this.moduleData.userName+'('+this.moduleData.userAccount+')';
      this.moduleDetail.data.updateTime = '';
    },

    //新增节点事件
    addModuleClick(){
      
      let addMoudleData = {
        caseSuiteId:this.moduleData.caseSuiteId,
        fatherId:this.moduleData.fatherId,
        nodeDepth:this.moduleData.nodeDepth,
        moduleName:this.moduleDetail.data.moduleName,
        moduleDesc:this.moduleDetail.data.moduleDesc,
        precondition:this.moduleDetail.data.preCondition,
        creatorAccountName:this.moduleData.userAccount,
        updateAccountName:this.moduleData.userAccount,
        belongRepository:this.moduleData.belongRepository,
        nodeType:this.moduleData.moduleType
      }
      //向服务器请求数据
      addModule(addMoudleData)
              .then(res => {
                if (res.state === 1000) {
                  //通知树形结构更新节点 需要向节点树返回 nodeId和nodeName
                  let data = {
                    id: res.data.nodeId,
                    nodeName: res.data.moduleName
                  }
                  this.$emit('emitNewAddModuleData', data)
                  //获取模块详情信息更新表单
                  getModuleDetail({nodeId: res.data.nodeId})
                  .then(res2 => {
                    if (res2.state === 1000) {
                      // alert('更新')
                      // console.log('更新')
                      // this.moduleDetail = {}
                      // this.$set(this.moduleDetail.data, 'moduleName', res2.data.moduleInfo.moduleName)
                      // this.$set(this.moduleDetail.moduleDesc, 'moduleName', res2.data.moduleInfo.moduleDesc)
                      // this.$set(this.moduleDetail.preCondition, 'moduleName', res2.data.moduleInfo.precondition)
                      // this.$set(this.moduleDetail.creator, 'moduleName', res2.data.moduleInfo.creator)
                      // this.$set(this.moduleDetail.createTime, 'moduleName', res2.data.moduleInfo.createTime)
                      // this.$set(this.moduleDetail.updator, 'moduleName', res2.data.moduleInfo.updator)
                      // this.$set(this.moduleDetail.updateTime, 'moduleName', res2.data.moduleInfo.updateTime)
                      this.moduleDetail.data.moduleName = res2.data.moduleInfo.moduleName;
                      this.moduleDetail.data.moduleDesc = res2.data.moduleInfo.moduleDesc;
                      this.moduleDetail.data.preCondition = res2.data.moduleInfo.precondition;
                      this.moduleDetail.data.creator = res2.data.moduleInfo.creator;
                      this.moduleDetail.data.createTime = res2.data.moduleInfo.createTime;
                      this.moduleDetail.data.updator = res2.data.moduleInfo.updater;
                      this.moduleDetail.data.updateTime = res2.data.moduleInfo.updateTime;
                      // this.moduleDetail.data.splice(0 ,0)
                      // this.moduleDetail = {}
                      this.moduleDetail = JSON.parse(JSON.stringify(this.moduleDetail))
                    } else {
                      this.$message.error('加载数据失败！');
                    }
                  }, rej => {
                    this.errorAjax()
                  })
                  this.$message.success('新增模块数据成功！');
                }else if(res.state === 3007){
                  this.$message.error('当前父节点下模块名已存在！');
                } else {
                  this.$message.error('新增数据失败！');
                }
              }, rej => {
                this.errorAjax()
              })
    },

    //更新节点事件
    updateModuleClick(){
      let updateModuleData = {
        id:this.moduleData.nodeId,
        caseSuiteId:this.$route.query.caseSuiteId,
        moduleName:this.moduleDetail.data.moduleName,
        moduleDesc:this.moduleDetail.data.moduleDesc,
        precondition:this.moduleDetail.data.preCondition,
        updateAccountName:window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName')
      }

      console.log(updateModuleData)

      updateModule(updateModuleData)
              .then(res => {
                if (res.state === 1000) {
                  //获取模块详情信息更新表单
                  getModuleDetail({nodeId: this.moduleData.nodeId})
                  .then(res => {
                    if (res.state === 1000) {
                      // alert('获取')
                      console.log('获取')
                      this.moduleDetail.data.moduleName = res.data.moduleInfo.moduleName;
                      this.moduleDetail.data.moduleDesc = res.data.moduleInfo.moduleDesc;
                      this.moduleDetail.data.preCondition = res.data.moduleInfo.precondition;
                      this.moduleDetail.data.creator = res.data.moduleInfo.creator;
                      this.moduleDetail.data.createTime = res.data.moduleInfo.createTime;
                      this.moduleDetail.data.updator = res.data.moduleInfo.updater;
                      this.moduleDetail.data.updateTime = res.data.moduleInfo.updateTime;
                    } else {
                      this.$message.error('加载数据失败！');
                    }
                  }, rej => {
                    this.errorAjax()
                  })
                  this.$message.success('更新数据成功！');
                  
                  this.$emit('updataModule', this.moduleDetail.data.moduleName)
                  console.log(this.moduleDetail.data.moduleName)
                }else if(res.state === 3007){
                  this.$message.error('当前父节点下模块名已存在！');
                } else {
                  this.$message.error('更新数据失败！');
                }
              }, rej => {
                this.errorAjax()
              })

    },
    errorAjax () {
      this.$message({
        type: 'error',
        message: '失败',
        duration: 1000
      })
    },

    initData(val){
      // alert('init')
      //click为1，左键点击节点，从后台获取表单数据，clickType为2，右键点击菜单，清空表单数据
        if(val.clickType == 1){
          getModuleDetail({nodeId: val.nodeId})
                  .then(res => {
                    if (res.state === 1000) {
                      // console.log('获取')
                      this.moduleDetail.data.moduleName = res.data.moduleInfo.moduleName;
                      this.moduleDetail.data.moduleDesc = res.data.moduleInfo.moduleDesc;
                      this.moduleDetail.data.preCondition = res.data.moduleInfo.precondition;
                      this.moduleDetail.data.creator = res.data.moduleInfo.creator;
                      this.moduleDetail.data.createTime = res.data.moduleInfo.createTime;
                      this.moduleDetail.data.updator = res.data.moduleInfo.updater;
                      this.moduleDetail.data.updateTime = res.data.moduleInfo.updateTime;
                      // console.log(this.moduleDetail)
                    } else {
                      this.$message.error('加载数据失败！');
                    }
                  }, rej => {
                    this.errorAjax()
                  })

        }else if(val.clickType == 2){
          // console.log('清空')
          this.moduleDetail.data.caseSuiteId = val.caseSuiteId
          this.moduleDetail.data.fatherId = val.fatherId
          this.moduleDetail.data.nodeDepth = val.nodeDepth

          this.moduleDetail.data.moduleName = '';
          this.moduleDetail.data.moduleDesc = '';
          this.moduleDetail.data.preCondition = '';
          this.moduleDetail.data.creator = val.userName+'('+val.userAccount+')';
          this.moduleDetail.data.createTime = '';
          this.moduleDetail.data.updator = val.userName+'('+val.userAccount+')';
          this.moduleDetail.data.updateTime = '';
        }
    }
    
    
  },
  watch: {
    moduleData (val) {
      console.log(val)
      this.initData(val)
    }
  },

  created(){
    console.log('aaa')
    this.initData(this.moduleData)
  }

}
</script>

<style>
.moduleDetailApp {
  width: 100%;
}
.moduleDetailApp > .left {
  width: 94%;
  float: left
}
.moduleDetailApp > .left > .header {
  height: 60px;
  border-bottom: 1px solid #ccc;
  line-height: 60px;
  font-size: 24px;
  text-indent: 30px
}
.moduleDetailApp > .right {
  float: left;
  position: relative
}
.moduleDetailApp > .right > .icon1 {
  position: absolute;
  top: 200px;
  left: 10px
}
.moduleDetailApp > .right > .icon1:hover {
  cursor: pointer;
}
.moduleDetailApp > .right > .icon2 {
  position: absolute;
  top: 250px;
  left: 10px
}
.moduleDetailApp > .right > .icon2:hover {
  cursor: pointer;
}
/* .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 60%;
  } */
</style>
