  <!-- 用例详情 -->

<template>
  <div class="caseDetailApp">
    <div class="left">
      <header class="header">用例基本信息</header>
      <el-card shadow="always" class="box-card">
        <div class="text item">
          <el-form label-width="100px" :rules="rules" ref="caseDetail" :model="caseDetail.data">
            <el-form-item label="用例编号">
              <el-input v-model="caseDetail.data.caseNum" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="用例id">
              <!-- caseSuiteId -->
              <el-input v-model="caseDetail.data.caseId" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="用例名称" prop="caseName">
              <el-input v-model.trim="caseDetail.data.caseName" placeholder="请输入用例名称"></el-input>
            </el-form-item>

            <el-row>
              <el-col :span="12">
                <el-form-item label="用例级别" prop="caseLevel">
                  <el-select v-model="caseDetail.data.caseLevel" placeholder="请选择">
                    <el-option
                      v-for="item in caseLevelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否自动化" prop="caseAuto" style="float:right;">
                  <el-select v-model="caseDetail.data.caseAuto" placeholder="请选择" @change="test">
                    <el-option
                      v-for="item in caseAutoOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="用例标签">
                  <el-select
                    v-model="caseDetail.data.caseLabelArr"
                    @visible-change="visibleChange"
                    :loading="loading"
                    size="large"
                    multiple
                    filterable
                    remote
                    :remote-method="searchCaseTagFromServer"
                    allow-create
                    default-first-option
                    placeholder="请选择标签"
                  >
                    <el-option
                      v-for="item in caseLabelData.caseLabelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <i :class="picture" @mouseenter="labelMouseenter" @click="labelClick"></i>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="适用阶段" style="float:right;">
                  <el-select
                    v-model="caseDetail.data.caseStage"
                    @visible-change="visibleChange"
                    :loading="loading"
                    size="large"
                    multiple
                    filterable
                    remote
                    :remote-method="searchCaseStageFromServer"
                    allow-create
                    default-first-option
                    placeholder="请选择适用阶段"
                  >
                    <el-option
                      v-for="item in caseStageData.caseStageOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    ></el-option>
                  </el-select>
                  <i :class="picture" @mouseenter="labelMouseenter" @click="stageClick"></i>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="是否合并" prop="merge">
              <el-select v-model="caseDetail.data.merge" placeholder="请选择" @change="test">
                <el-option
                  v-for="item in mergeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用例描述" prop="caseDesc">
              <el-input
                type="textarea"
                v-model="caseDetail.data.caseDesc"
                placeholder="请输入用例描述"
                rows="3"
              ></el-input>
            </el-form-item>
            <el-form-item label="预置条件" prop="preCondition">
              <el-input
                type="textarea"
                v-model="caseDetail.data.preCondition"
                placeholder="请输入预置条件"
                rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="测试数据" prop="testData">
              <el-input
                type="textarea"
                v-model="caseDetail.data.testData"
                placeholder="请输入测试数据"
                rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="测试步骤" prop="caseStep">
              <el-input
                type="textarea"
                v-model="caseDetail.data.caseStep"
                placeholder="请输入测试步骤"
                rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="预期结果" prop="expectResult">
              <el-input
                type="textarea"
                v-model="caseDetail.data.expectResult"
                placeholder="请输入预期结果"
                rows="5"
              ></el-input>
            </el-form-item>

            <el-form-item label="创建人员" prop="creator">
              <el-input v-model="caseDetail.data.creator" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
              <el-input v-model="caseDetail.data.createTime" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="修改人员" prop="updator">
              <el-input v-model="caseDetail.data.updator" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="修改时间" prop="updateTime">
              <el-input v-model="caseDetail.data.updateTime" :disabled="true"></el-input>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
          <!-- 表格模块 -->
          <div class="table">
            <p style="margin-left:40px">用例执行记录</p>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="taskName" label="任务名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column
                prop="executeResult"
                label="执行结果"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="executeMan" label="执行人" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="executeTime" label="执行时间" align="center" show-overflow-tooltip></el-table-column>
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
            ></el-pagination>
          </div>
        </div>
      </el-card>
    </div>
    <div class="right" style="font-size: 32px" v-if="$route.query.behaviour === 'all'">
      <i class="el-icon-check icon1" @click="submitData"></i>
      <i class="el-icon-refresh icon2" @click="reloadData"></i>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { getCaseLableByKeyWord, getCaseStage, getCaseDetail, addCase, updateCase, getLabelPower, getCaseNodeExcuteHistroy } from '../../api/api'
export default {
  //props: ['caseSuiteId','fatherId','nodeId','nodeDepth','userAccount','userName','clickType','belongRepository'],
  props: ['caseData', 'caseScrollTop'],
  watch: {
    caseScrollTop(val) {
      console.log(val)
      document.getElementsByClassName('icon1')[0].style.top = 200 + val + 'px'
      document.getElementsByClassName('icon2')[0].style.top = 250 + val + 'px'
    },
    caseData(val) {
      this.initData(val)
    }
  },
  data() {
    return {
      total: 0,
      tableData: [],
      startNum: 1,
      range: 5,          /**
       * 表单数据的渲染和填充
       *  */
      caseDetail: {
        data: {
          missionName: '',
          executionResult: '',
          executionPerson: '',
          caseNum: '',
          caseName: '',
          caseLevel: '',
          caseAuto: '',
          caseLabelArr: [],
          caseStage: [],
          merge: '',
          caseDesc: '',
          preCondition: '',
          testData: '',
          caseStep: '',
          expectResult: '',
          creator: '',
          createTime: '',
          updator: '',
          updateTime: ''
        }
      },

      //用例标签相关数据
      caseLabelData: {
        caseLabelOptions: []
      },

      //用例使用阶段相关数据
      caseStageData: {
        caseStageOptions: []
      },

      loading: false,
      picture: 'el-icon-arrow-up',

      //用例级别
      caseLevelOptions: [{
        value: 'L0',
        label: 'L0'
      }, {
        value: 'L1',
        label: 'L1'
      }, {
        value: 'L2',
        label: 'L2'
      }, {
        value: 'L3',
        label: 'L3'
      }, {
        value: 'L4',
        label: 'L4'
      }],

      //是否自动化
      caseAutoOptions: [{
        value: '1',
        label: '是'
      }, {
        value: '0',
        label: '否'
      }],

      //是否合并
      mergeOptions: [{
        value: '1',
        label: '是'
      }, {
        value: '0',
        label: '否'
      }],

      //校验规则
      rules: {
        caseName: [
          { required: true, message: '请输入用例名称', trigger: 'blur' },
          { min: 1, max: 100, message: '输入字符长度不合法', trigger: 'blur' }
        ],
        caseLevel: [
          { required: true, message: '请选择用例级别', trigger: 'change' }
        ],
        caseAuto: [
          { required: true, message: '请选择是否自动化', trigger: 'change' }
        ],
        merge: [
          { required: true, message: '请选择是否合并', trigger: 'change' }
        ],
        caseDesc: [
          { min: 1, max: 100, message: '输入字符长度不合法', trigger: 'blur' }
        ],
        preCondition: [
          { required: true, message: '请输入预置条件', trigger: 'blur' },
          { min: 1, max: 1000, message: '输入字符长度不合法', trigger: 'blur' }
        ],
        testData: [
          { min: 1, max: 1000, message: '输入字符长度不合法', trigger: 'blur' }
        ],
        caseStep: [
          { required: true, message: '请输入测试步骤', trigger: 'blur' },
          { min: 1, max: 2000, message: '输入字符长度不合法', trigger: 'blur' }
        ],
        expectResult: [
          { required: true, message: '请输入预期结果', trigger: 'blur' },
          { min: 1, max: 2000, message: '输入字符长度不合法', trigger: 'blur' }
        ]
      }


    }
  },
  methods: {
    //表格分页
    rangeChange(val) {
      console.log(val)
      this.range = val
      let data = {
        nodeId: this.caseData.nodeId,
        startNum: 1,
        range: val
      }
      this.getTableData(data)
    },
    //表格查询
    queryRNAN() {

    },
    //表格分页
    startNumChange(val) {
      this.startNum = val
      let data = {
        nodeId: this.caseData.nodeId,
        startNum: val,
        range: this.range
      }
      this.getTableData(data)
    },

    test(val) {
      console.log(val)
      console.log(typeof val)
    },

    //页面右侧保存按钮点击事件
    submitData() {
      if (this.caseData.clickType == 1) {
        this.updateCaseClick()
      } else if (this.caseData.clickType == 2) {

        this.addCaseClick()
      }
    },

    //页面右侧重置按钮点击事件
    reloadData() {
      this.caseDetail.data.caseNum = '';
      this.caseDetail.data.caseName = '';
      this.caseDetail.data.caseLevel = '';
      this.caseDetail.data.caseAuto = '';
      this.caseDetail.data.caseLabelArr = [];
      this.caseDetail.data.caseStage = [];
      this.caseDetail.data.merge = '';
      this.caseDetail.data.caseDesc = '';
      this.caseDetail.data.preCondition = '';
      this.caseDetail.data.testData = '';
      this.caseDetail.data.caseStep = '';
      this.caseDetail.data.expectResult = '';
      this.caseDetail.data.creator = this.caseData.userName + '(' + this.caseData.userAccount + ')';
      this.caseDetail.data.createTime = '';
      this.caseDetail.data.updator = this.caseData.userName + '(' + this.caseData.userAccount + ')';
      this.caseDetail.data.updateTime = '';
    },

    //新增节点事件
    addCaseClick() {

      let addCaseData = {
        caseSuiteId: this.caseData.caseSuiteId,
        fatherId: this.caseData.fatherId,
        nodeDepth: this.caseData.nodeDepth,
        caseName: this.caseDetail.data.caseName,
        caseDesc: this.caseDetail.data.caseDesc,
        caseLevel: this.caseDetail.data.caseLevel,
        caseAuto: this.caseDetail.data.caseAuto,
        merge: this.caseDetail.data.merge,
        stageLabelName: this.caseDetail.data.caseStage.join(','),
        labelName: this.caseDetail.data.caseLabelArr.join(','),
        precondition: this.caseDetail.data.preCondition,
        caseData: this.caseDetail.data.testData,
        caseStep: this.caseDetail.data.caseStep,
        expectResult: this.caseDetail.data.expectResult,
        creatorAccountName: this.caseData.userAccount,
        updateAccountName: this.caseData.userAccount,
        belongRepository: this.caseData.belongRepository,
        operationEvent: 1
      }
      console.log(this.caseDetail)
      console.log(addCaseData)

      //向服务器请求数据
      addCase(addCaseData)
        .then(res => {
          if (res.state === 1000) {
            //通知树形结构更新节点  需要向节点树返回 nodeId和nodeName
            let data = {
              id: res.data.nodeId,
              nodeName: this.caseDetail.data.caseName
            }
            this.$emit('emitNewAddCaseData', data)
            //获取用例详情信息更新表单
            getCaseDetail({ nodeId: res.data.nodeId })
              .then(res => {
                if (res.state === 1000) {
                  this.caseDetail.data.caseNum = res.data.caseInfo.caseNumber;
                  this.caseDetail.data.caseName = res.data.caseInfo.caseName;
                  this.caseDetail.data.caseLevel = res.data.caseInfo.caseLevel + "";
                  this.caseDetail.data.caseAuto = res.data.caseInfo.caseAuto + "";
                  this.caseDetail.data.caseLabelArr = res.data.caseInfo.caseLabelName;
                  this.caseDetail.data.caseStage = res.data.caseInfo.stageLabelName;
                  this.caseDetail.data.merge = res.data.caseInfo.merge + "";
                  this.caseDetail.data.caseDesc = res.data.caseInfo.caseDesc;
                  this.caseDetail.data.preCondition = res.data.caseInfo.precondition;
                  this.caseDetail.data.testData = res.data.caseInfo.caseData;
                  this.caseDetail.data.caseStep = res.data.caseInfo.caseStep;
                  this.caseDetail.data.expectResult = res.data.caseInfo.expectResult;
                  this.caseDetail.data.creator = res.data.caseInfo.creator;
                  this.caseDetail.data.createTime = res.data.caseInfo.createrTime;
                  this.caseDetail.data.updator = res.data.caseInfo.updater;
                  this.caseDetail.data.updateTime = res.data.caseInfo.updateTime;
                  // this.caseDetail.data.caseId = res.data.caseInfo.caseId;
                  // console.log(caseDetail)
                } else {
                  this.$message.error('加载数据失败！');
                }
              }, rej => {
                this.errorAjax()
              })
            this.$message.success('新增用例数据成功！');
          } else if (res.state === 4023) {
            this.$message.error('标签长度不能超过10');
          } else {
            this.$message.error('新增数据失败！')
          }
        }, rej => {
          this.errorAjax()
        })
    },

    //更新节点事件
    updateCaseClick() {
      let updateCaseData = {
        id: this.caseData.nodeId,
        // caseSuiteId:this.caseData.caseSuiteId,
        caseSuiteId: this.$route.query.caseSuiteId,
        caseName: this.caseDetail.data.caseName,
        caseDesc: this.caseDetail.data.caseDesc,
        caseLevel: this.caseDetail.data.caseLevel,
        caseAuto: this.caseDetail.data.caseAuto,
        merge: this.caseDetail.data.merge,
        stageLabelName: this.caseDetail.data.caseStage.join(','),
        labelName: this.caseDetail.data.caseLabelArr.join(','),
        precondition: this.caseDetail.data.preCondition,
        caseData: this.caseDetail.data.testData,
        caseStep: this.caseDetail.data.caseStep,
        expectResult: this.caseDetail.data.expectResult,
        updateAccountName: window.localStorage.getItem('accountName') || window.sessionStorage.getItem('accountName')
      }
      console.log(updateCaseData)
      updateCase(updateCaseData)
        .then(res => {
          if (res.state === 1000) {
            //获取用例详情信息更新表单
            getCaseDetail({ nodeId: this.caseData.nodeId })
              .then(res => {
                if (res.state === 1000) {
                  this.caseDetail.data.caseNum = res.data.caseInfo.caseNumber;
                  this.caseDetail.data.caseName = res.data.caseInfo.caseName;
                  this.caseDetail.data.caseLevel = res.data.caseInfo.caseLevel + "";
                  this.caseDetail.data.caseAuto = res.data.caseInfo.caseAuto + "";
                  this.caseDetail.data.caseLabelArr = res.data.caseInfo.caseLabelName;
                  this.caseDetail.data.caseStage = res.data.caseInfo.stageLabelName;
                  this.caseDetail.data.merge = res.data.caseInfo.merge + "";
                  this.caseDetail.data.caseDesc = res.data.caseInfo.caseDesc;
                  this.caseDetail.data.preCondition = res.data.caseInfo.precondition;
                  this.caseDetail.data.testData = res.data.caseInfo.caseData;
                  this.caseDetail.data.caseStep = res.data.caseInfo.caseStep;
                  this.caseDetail.data.expectResult = res.data.caseInfo.expectResult;
                  this.caseDetail.data.creator = res.data.caseInfo.creator;
                  this.caseDetail.data.createTime = res.data.caseInfo.createrTime;
                  this.caseDetail.data.updator = res.data.caseInfo.updater;
                  this.caseDetail.data.updateTime = res.data.caseInfo.updateTime;
                } else {
                  this.$message.error('加载数据失败！');
                }
              }, rej => {
                this.errorAjax()
              })
            this.$message.success('更新用例数据成功！');
            this.$emit('updataCase', this.caseDetail.data.caseName)
          } else {
            this.$message.error('更新数据失败！');
          }
        }, rej => {
          this.errorAjax()
        })

    },

    // 用例标签搜索
    searchCaseTagFromServer(query) {
      console.log(query)
      if (query !== '') {
        this.loading = true
        if (query.length > 10) {
          this.$message.error('标签长度不能超过10个字符')
          // this.caseDetail.data.caseLabelArr = ''
        } else {
          getLabelPower({ labelName: query })
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
                  this.caseLabelData.caseLabelOptions = newArr
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
        //       if (res.data.labelNameList.length === 0) {
        //         // console.log(document.getElementsByClassName('el-select-dropdown__item hover')[0].children[0])
        //         // console.log(document.getElementsByClassName('el-select-dropdown__item hover')[0].children[0].innerHTML)
        //         document.getElementsByClassName('el-select-dropdown__item hover')[0].children[0].innerHTML = query + ' (new)'
        //       } else {
        //         let arr = res.data.labelNameList
        //         let newArr = arr.map(ele => {
        //           return {
        //             label: ele,
        //             value: ele
        //           }
        //         })
        //         this.caseLabelData.caseLabelOptions = newArr
        //       }
        //     } else {
        //       this.errorAjax()
        //     }
        //   }, rej => {
        //     this.errorAjax()
        //   })
      }
    },

    //用例使用阶段搜索
    searchCaseStageFromServer(query) {
      if (query !== '') {
        this.loading = true
        if (query.length > 10) {
          this.$message.error('标签长度不能超过10个字符')
          // this.caseDetail.data.caseLabelArr = ''
        } else {
          getCaseStage({ stageLabelName: query })
            .then(res => {
              if (res.state === 1000) {
                this.loading = false
                if (res.data.stageLabelNameList.length === 0) {

                  document.getElementsByClassName('el-select-dropdown__item hover')[0].children[0].innerHTML = query + ' (new)'
                } else {
                  let arr = res.data.stageLabelNameList
                  let newArr = arr.map(ele => {
                    return {
                      label: ele,
                      value: ele
                    }
                  })
                  this.caseStageData.caseStageOptions = newArr
                }
              } else {
                this.errorAjax()
              }
            }, rej => {
              this.errorAjax()
            })
        }
        // getCaseStage({stageLabelName: query})
        //   .then(res => {
        //     if (res.state === 1000) {
        //       this.loading = false
        //       if (res.data.stageLabelNameList.length === 0) {

        //         document.getElementsByClassName('el-select-dropdown__item hover')[0].children[0].innerHTML = query + ' (new)'
        //       } else {
        //         let arr = res.data.stageLabelNameList
        //         let newArr = arr.map(ele => {
        //           return {
        //             label: ele,
        //             value: ele
        //           }
        //         })
        //         this.caseStageData.caseStageOptions = newArr
        //       }
        //     } else {
        //       this.errorAjax()
        //     }
        //   }, rej => {
        //     this.errorAjax()
        //   })
      }
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
              this.caseLabelData.caseLabelOptions = arr1
            } else {
              this.errorAjax()
            }
          }, rej => {
            this.errorAjax()
          })
        event.target.previousElementSibling.children[1].children[0].focus()
      }
    },
    // 点击用例使用阶段的向上箭头获取所有的使用阶段值
    stageClick(event) {
      if (this.picture === 'el-icon-arrow-up') {
        this.picture = 'el-icon-arrow-down'
        getCaseStage({})
          .then(res => {
            if (res.state === 1000) {
              let arr = res.data.stageLabelNameList
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
              this.caseStageData.caseStageOptions = arr1
            } else {
              this.errorAjax()
            }
          }, rej => {
            this.errorAjax()
          })
        event.target.previousElementSibling.children[1].children[0].focus()
      }
    },
    //获取表格数据及分页
    getTableData(data) {

      getCaseNodeExcuteHistroy(data)
        .then(res => {
          if (res.state === 1000) {
            this.total = res.data.total
            this.tableData = res.data.caseExecuteResult
          } else {
            this.$message.error(res.message);
          }
        }, rej => {
          this.errorAjax()
        })
    },
    //element提供的事件，当下拉菜单隐藏，箭头向下，显示，箭头向上
    visibleChange(val) {
      if (val === false) {
        setTimeout(() => {
          this.picture = 'el-icon-arrow-up'
        }, 50)
      }
    },
    errorAjax() {
      this.$message({
        type: 'error',
        message: '失败',
        duration: 1000
      })
    },

    //初始化数据
    initData(val) {

      //click为1，左键点击节点，从后台获取表单数据，clickType为2，右键点击菜单，清空表单数据
      if (val.clickType == 1) {
        getCaseDetail({ nodeId: val.nodeId })
          .then(res => {
            if (res.state === 1000) {
              this.caseDetail.data.caseNum = res.data.caseInfo.caseNumber;
              this.caseDetail.data.caseName = res.data.caseInfo.caseName;
              this.caseDetail.data.caseLevel = res.data.caseInfo.caseLevel + "";
              this.caseDetail.data.caseAuto = res.data.caseInfo.caseAuto + "";
              this.caseDetail.data.caseLabelArr = res.data.caseInfo.caseLabelName;
              this.caseDetail.data.caseStage = res.data.caseInfo.stageLabelName;
              this.caseDetail.data.merge = res.data.caseInfo.merge + ""
              this.caseDetail.data.caseDesc = res.data.caseInfo.caseDesc;
              this.caseDetail.data.preCondition = res.data.caseInfo.precondition;
              this.caseDetail.data.testData = res.data.caseInfo.caseData;
              this.caseDetail.data.caseStep = res.data.caseInfo.caseStep;
              this.caseDetail.data.expectResult = res.data.caseInfo.expectResult;
              this.caseDetail.data.creator = res.data.caseInfo.creator;
              this.caseDetail.data.createTime = res.data.caseInfo.createrTime;
              this.caseDetail.data.updator = res.data.caseInfo.updater;
              this.caseDetail.data.updateTime = res.data.caseInfo.updateTime;
              this.caseDetail.data.caseId = res.data.caseInfo.caseId;
            } else {
              this.$message.error('加载数据失败！');
            }
          }, rej => {
            this.errorAjax()
          })
        //拉取表单数据
        let data = {
          nodeId: val.nodeId,
          startNum: 1,
          range: 5,
        }
        this.getTableData(data)

        /* var xmlHttp = new XMLHttpRequest()
        xmlHttp.onreadystatechange = () => {
          if (xmlHttp.readyState == 4) {
            
            var data = xmlHttp.responseText
            var dataobj = JSON.parse(data)
            console.log(JSON.parse(data))
            if (dataobj.state === 1000) {
                  
                  this.caseDetail.data.caseNum = dataobj.data.caseInfo.caseNumber;
                  this.caseDetail.data.caseName = dataobj.data.caseInfo.caseName;
                  this.caseDetail.data.caseLevel = dataobj.data.caseInfo.caseLevel+"";
                  this.caseDetail.data.caseAuto = dataobj.data.caseInfo.caseAuto+"";
                  this.caseDetail.data.caseLabelArr = dataobj.data.caseInfo.caseLabelName;
                  this.caseDetail.data.caseStage = dataobj.data.caseInfo.stageLabelName;
                  this.caseDetail.data.merge = dataobj.data.caseInfo.merge+""
                  this.caseDetail.data.caseDesc = dataobj.data.caseInfo.caseDesc;
                  this.caseDetail.data.preCondition = dataobj.data.caseInfo.precondition;
                  this.caseDetail.data.testData = dataobj.data.caseInfo.caseData;
                  this.caseDetail.data.caseStep = dataobj.data.caseInfo.caseStep;
                  this.caseDetail.data.expectResult = dataobj.data.caseInfo.exceptResult;
                  this.caseDetail.data.creator = dataobj.data.caseInfo.creator;
                  this.caseDetail.data.createTime = dataobj.data.caseInfo.createTime;
                  this.caseDetail.data.updator = dataobj.data.caseInfo.updater;
                  this.caseDetail.data.updateTime = dataobj.data.caseInfo.updateTime;
                } else {
                  this.$message.error('加载数据失败！');
                }
          }
        }
        xmlHttp.open('post', 'http://localhost:8082/front/open/case/getLibraryHistroryRecord.action', true)
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        xmlHttp.send({nodeId: val.nodeId}) */
      } else if (val.clickType == 2) {
        this.caseDetail.data.caseSuiteId = val.caseSuiteId
        this.caseDetail.data.fatherId = val.fatherId
        this.caseDetail.data.nodeDepth = val.nodeDepth

        this.caseDetail.data.caseNum = '';
        this.caseDetail.data.caseName = '';
        this.caseDetail.data.caseLevel = '';
        this.caseDetail.data.caseAuto = '';
        this.caseDetail.data.caseLabelArr = [];
        this.caseDetail.data.caseStage = [];
        this.caseDetail.data.merge = '';
        this.caseDetail.data.caseDesc = '';
        this.caseDetail.data.preCondition = '';
        this.caseDetail.data.testData = '';
        this.caseDetail.data.caseStep = '';
        this.caseDetail.data.expectResult = '';
        this.caseDetail.data.creator = val.userName + '(' + val.userAccount + ')';
        this.caseDetail.data.createTime = '';
        this.caseDetail.data.updator = val.userName + '(' + val.userAccount + ')';
        this.caseDetail.data.updateTime = '';
      }

    }
  },

  created() {
    this.initData(this.caseData)
  }

}
</script>

<style>
.caseDetailApp {
  width: 100%;
  /* height: 1000px;
  overflow-y: auto */
}
.caseDetailApp > .left {
  width: 94%;
  float: left;
}
.caseDetailApp > .left > .header {
  height: 60px;
  border-bottom: 1px solid #ccc;
  line-height: 60px;
  font-size: 24px;
  text-indent: 30px;
}
.caseDetailApp > .right {
  float: left;
  position: relative;
}
.caseDetailApp > .right > .icon1 {
  position: absolute;
  top: 200px;
  left: 10px;
}
.caseDetailApp > .right > .icon1:hover {
  cursor: pointer;
}
.caseDetailApp > .right > .icon2 {
  position: absolute;
  top: 250px;
  left: 10px;
}
.caseDetailApp > .right > .icon2:hover {
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

.caseDetailApp .el-table {
  margin-left: 40px;
  margin-top: 13px;
}
.caseDetailApp .el-pagination {
  margin-left: 30px;
}
</style>
