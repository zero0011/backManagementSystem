<template>
  <div class="rough">
    <div class="top" v-if="!$route.query.isHistory">
      <el-button type="primary" class="button" @click="jumpToEditHistory">修改历史</el-button>
      <el-button type="primary" class="button" @click="canEdit">编辑数据</el-button>
      <el-button type="primary" class="button" @click="saveData" :disabled="saveButtonBol">保存数据</el-button>
      <div class="rectangleBox">
        <!-- 不显示清除按钮 -->
        <el-date-picker
          v-model="selectYear"
          type="year"
          placeholder="请选择年份"
          :picker-options="notSelectYear"
          :clearable="showClearable"
          @change="getChangeYear"
          class="rectangle"
        ></el-date-picker>
        <!-- 项目 -->
        <el-select
          v-model="projectName"
          placeholder="请选择项目"
          class="rectangle"
          @change="changeProject"
        >
          <el-option
            v-for="item in projectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- 类别 -->
        <el-select
          v-model="peopleType"
          placeholder="请选择人员类别"
          class="rectangle"
          @change="changePeopleType"
        >
          <el-option
            v-for="item in peopleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="body" v-loading="loading">
      <el-card class="box-card" v-for="(val, key) in totalTableData" :key="key">
        <div slot="header" class="clearfix">
          <span>{{ val.buName }}</span>
        </div>
        <el-table
          :data="val.details"
          style="width: 100%"
          row-key="projectId"
          border
          height="600"
          lazy
          :span-method="arraySpanMethod"
          :load="load"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            fixed
            prop="projectName"
            label="项目名称"
            width="180"
            align="left"
            show-overflow-tooltip
          ></el-table-column>
          <!-- 一月 -->
          <el-table-column prop="jan" label="Jan" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isproject">
                  <el-input
                    v-model="scope.row.jan.planVal"
                    :disabled="disabledBol"
                    @change="editValue(scope.row, '01', $event)"
                  ></el-input>
                </template>
                <el-input
                  v-model="scope.row.jan.planVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '01', key, 'planVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jan.manVal" v-if="scope.row.isproject" disabled></el-input>
                <el-input
                  v-model="scope.row.jan.manVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '01', key, 'manVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 二月 -->
          <el-table-column prop="feb" label="Feb" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isproject">
                  <el-input
                    v-model="scope.row.feb.planVal"
                    :disabled="disabledBol"
                    @change="editValue(scope.row, '02', $event)"
                  ></el-input>
                </template>
                <el-input
                  v-model="scope.row.feb.planVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '02', key, 'planVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.feb.manVal" v-if="scope.row.isproject" disabled></el-input>
                <el-input
                  v-model="scope.row.feb.manVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '02', key, 'manVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 三月 -->
          <el-table-column prop="mar" label="Mar" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isproject">
                  <el-input
                    v-model="scope.row.mar.planVal"
                    :disabled="disabledBol"
                    @change="editValue(scope.row, '03', $event)"
                  ></el-input>
                </template>
                <el-input
                  v-model="scope.row.mar.planVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '03', key, 'planVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.mar.manVal" v-if="scope.row.isproject" disabled></el-input>
                <el-input
                  v-model="scope.row.mar.manVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '03', key, 'manVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 四月 -->
          <el-table-column prop="apr" label="Apr" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isproject">
                  <el-input
                    v-model="scope.row.apr.planVal"
                    :disabled="disabledBol"
                    @change="editValue(scope.row, '04', $event)"
                  ></el-input>
                </template>
                <el-input
                  v-model="scope.row.apr.planVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '04', key, 'planVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.apr.manVal" v-if="scope.row.isproject" disabled></el-input>
                <el-input
                  v-model="scope.row.apr.manVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '04', key, 'manVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 五月 -->
          <el-table-column prop="may" label="May" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isproject">
                  <el-input
                    v-model="scope.row.may.planVal"
                    :disabled="disabledBol"
                    @change="editValue(scope.row, '05', $event)"
                  ></el-input>
                </template>
                <el-input
                  v-model="scope.row.may.planVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '05', key, 'planVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.may.manVal" v-if="scope.row.isproject" disabled></el-input>
                <el-input
                  v-model="scope.row.may.manVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '05', key, 'manVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 六月 -->
          <el-table-column prop="jun" label="Jun" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isproject">
                  <el-input
                    v-model="scope.row.jun.planVal"
                    :disabled="disabledBol"
                    @change="editValue(scope.row, '06', $event)"
                  ></el-input>
                </template>
                <el-input
                  v-model="scope.row.jun.planVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '06', key, 'planVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jun.manVal" v-if="scope.row.isproject" disabled></el-input>
                <el-input
                  v-model="scope.row.jun.manVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '06', key, 'manVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 七月 -->
          <el-table-column prop="jul" label="Jul" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isproject">
                  <el-input
                    v-model="scope.row.jul.planVal"
                    :disabled="disabledBol"
                    @change="editValue(scope.row, '07', $event)"
                  ></el-input>
                </template>
                <el-input
                  v-model="scope.row.jul.planVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '07', key, 'planVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jul.manVal" v-if="scope.row.isproject" disabled></el-input>
                <el-input
                  v-model="scope.row.jul.manVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '07', key, 'manVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 八月 -->
          <el-table-column prop="aug" label="Aug" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isproject">
                  <el-input
                    v-model="scope.row.aug.planVal"
                    :disabled="disabledBol"
                    @change="editValue(scope.row, '08', $event)"
                  ></el-input>
                </template>
                <el-input
                  v-model="scope.row.aug.planVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '08', key, 'planVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.aug.manVal" v-if="scope.row.isproject" disabled></el-input>
                <el-input
                  v-model="scope.row.aug.manVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '08', key, 'manVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 九月 -->
          <el-table-column prop="sep" label="Sep" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isproject">
                  <el-input
                    v-model="scope.row.sep.planVal"
                    :disabled="disabledBol"
                    @change="editValue(scope.row, '09', $event)"
                  ></el-input>
                </template>
                <el-input
                  v-model="scope.row.sep.planVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '09', key, 'planVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sep.manVal" v-if="scope.row.isproject" disabled></el-input>
                <el-input
                  v-model="scope.row.sep.manVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '09', key, 'manVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 十月 -->
          <el-table-column prop="oct" label="Oct" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isproject">
                  <el-input
                    v-model="scope.row.oct.planVal"
                    :disabled="disabledBol"
                    @change="editValue(scope.row, '10', $event)"
                  ></el-input>
                </template>
                <el-input
                  v-model="scope.row.oct.planVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '10', key, 'planVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.oct.manVal" v-if="scope.row.isproject" disabled></el-input>
                <el-input
                  v-model="scope.row.oct.manVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '10', key, 'manVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 十一月 -->
          <el-table-column prop="nov" label="Nov" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isproject">
                  <el-input
                    v-model="scope.row.nov.planVal"
                    :disabled="disabledBol"
                    @change="editValue(scope.row, '11', $event)"
                  ></el-input>
                </template>
                <el-input
                  v-model="scope.row.nov.planVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '11', key, 'planVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.nov.manVal" v-if="scope.row.isproject" disabled></el-input>
                <el-input
                  v-model="scope.row.nov.manVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '11', key, 'manVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 十二 -->
          <el-table-column prop="dec" label="Dec" align="center">
            <el-table-column prop="planVal" label="规划" width="80" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isproject">
                  <el-input
                    v-model="scope.row.dec.planVal"
                    :disabled="disabledBol"
                    @change="editValue(scope.row, '12', $event)"
                  ></el-input>
                </template>
                <el-input
                  v-model="scope.row.dec.planVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '12', key, 'planVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="manVal" label="实际" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.dec.manVal" v-if="scope.row.isproject" disabled></el-input>
                <el-input
                  v-model="scope.row.dec.manVal"
                  v-else
                  :disabled="disabledBol"
                  @change="changeInputValue(scope.row, '12', key, 'manVal', $event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="planYearTotal" label="全年人力需求" width="120" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.isproject">
                <el-input
                  v-model="scope.row.planYearTotal"
                  :disabled="disabledBol"
                  v-if="scope.row.projectName !== '总计'"
                  @change="editValue(scope.row, '', $event)"
                ></el-input>
                <el-input v-model="scope.row.planYearTotal" disabled v-else></el-input>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="planYearCurrentTotal" label="当前规划需求" width="120" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.planYearCurrentTotal" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="yearTotal" label="当前实际发生" width="120" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.yearTotal" disabled></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="action" label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                @click="addPerson(scope.row)"
                type="text"
                size="small"
                v-if="scope.row.isproject"
              >
                <span v-if="scope.row.projectName === '总计'"></span>
                <span v-else-if="scope.row.projectName === '总人力'"></span>
                <span v-else>管理人员</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="val.startNum"
          :page-sizes="[5, 20, 100]"
          :page-size="val.range"
          :total="val.total"
          layout="total, sizes, prev, pager, next"
          @size-change="rangeChange(key, $event)"
          @current-change="startNumChange(key, $event)"
        ></el-pagination>
      </el-card>
    </div>
    <SelectPeople
      :showSelectPeople="showSelectPeople"
      :bindUserData="bindUserData"
      :havebindUserData="havebindUserData"
      @changeShowSelectPeople="changeShowSelectPeople"
      @commitBindPeople="commitBindPeople"
      @searchFromComponent="getSearchFromComponent"
      :getSearch="sendSearch"
    ></SelectPeople>
    <div class="picture" v-if="showPic">
      <div id="main" style="width: 100%;height: 2000px"></div>
    </div>
  </div>
</template>

<script>
import SelectPeople from '../../components/selectPeople'
import { getAllProjectList, getProjectInputDataByYear, getAllPersonInputDataByProject, editInputData, saveInputData, getTrueHistoryInputData, getUserPower, getPorjectParticipant, searchAndGetUsers, addMemberInCurrentProjectByYearInput, startEditModel, editProjectMonthPlanOrPlanYearTotal } from '../../api/api'
export default {
  components: {
    SelectPeople
  },
  data() {
    return {
      saveButtonBol: true,
      loading: true,
      selectYear: '',
      notSelectYear: {
        disabledDate(time) {
          // 只能选择从2020年开始到当前的年份
          return time.getFullYear() > new Date().getFullYear() || time.getFullYear() <= '1970'
        }
      },
      showClearable: false,
      projectName: '所有项目',
      projectOptions: [],
      peopleType: 0,
      peopleOptions: [
        {
          value: 0,
          label: '所有人员'
        }, {
          value: 1,
          label: '正式'
        }, {
          value: 2,
          label: '合作方'
        }, {
          value: 3,
          label: '实习'
        }
      ],
      totalTableData: [],
      // 控制表格月份输入框是否禁止输入
      disabledBol: true,
      bu: '',
      startNum: 1,
      range: 5,
      total: 0,
      normalOrHistory: false,
      showSelectPeople: false,
      bindUserData: [],
      havebindUserData: [],
      sendSearch: [],
      projectId: null,
      projectNameArr: [],
      fullYearInputArr: [],
      planYearCurrentTotal: [],
      needResourceArr: [],
      timeTotal: [],
      manTotal: [],
      showPic: false,
      pretotal: []
    }
  },
  methods: {
    changeShowSelectPeople(bol) {
      this.showSelectPeople = false
    },
    commitBindPeople(user) {
      let projectMember = []
      if (user.length === 0) {
        projectMember = ''
      } else {
        projectMember = user.map(ele => ele.fullName.split('(')[1].split(')')[0]).join(',')
      }
      addMemberInCurrentProjectByYearInput({
        projectId: this.projectId,
        projectMember
      }).then(res => {
        if (res.state === 1000) {
          this.showSelectPeople = false
          setTimeout(() => {
            this.initGetYearData()
          })
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
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
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.projectName === '总人力') {
        if (columnIndex === 1) {
          return [1, 2]
        }
        if (columnIndex === 2) {
          return [1, 2]
        }
        if (columnIndex === 3) {
          return [1, 2]
        }
        if (columnIndex === 4) {
          return [1, 2]
        }
        if (columnIndex === 5) {
          return [1, 2]
        }
        if (columnIndex === 6) {
          return [1, 2]
        }
        if (columnIndex === 7) {
          return [1, 2]
        }
        if (columnIndex === 8) {
          return [1, 2]
        }
        if (columnIndex === 9) {
          return [1, 2]
        }
        if (columnIndex === 10) {
          return [1, 2]
        }
        if (columnIndex === 11) {
          return [1, 2]
        }
        if (columnIndex === 12) {
          return [1, 2]
        }
        if (columnIndex === 15) {
          return [0, 0]
        }
        if (columnIndex === 16) {
          return [0, 0]
        }
        if (columnIndex === 17) {
          return [0, 0]
        }
        if (columnIndex === 18) {
          return [0, 0]
        }
        if (columnIndex === 19) {
          return [0, 0]
        }
        if (columnIndex === 20) {
          return [0, 0]
        }
        if (columnIndex === 21) {
          return [0, 0]
        }
        if (columnIndex === 22) {
          return [0, 0]
        }
        if (columnIndex === 23) {
          return [0, 0]
        }
        if (columnIndex === 24) {
          return [0, 0]
        }
        if (columnIndex === 25) {
          return [0, 0]
        }
        if (columnIndex === 26) {
          return [0, 0]
        }
      }
    },
    // 初始化年份为当前年份
    initCurrentYear() {
      this.selectYear = (new Date().getFullYear()).toString()
    },
    getChangeYear(year) {
      if (year === null) {
        this.initCurrentYear()
      } else {
        this.selectYear = year.getFullYear().toString()
        this.showPic = false
        this.totalTableData = []
        this.initGetYearData()
      }
    },
    changeProject(projectName) {
      this.projectName = projectName
      this.loading = true
      this.showPic = false
      this.totalTableData = []
      this.initGetYearData()
    },
    changePeopleType(peopleType) {
      this.peopleType = peopleType
      this.loading = true
      this.showPic = false
      this.totalTableData = []
      this.initGetYearData()
    },
    // 获取所有项目名称
    getAllProjectNameList() {
      getAllProjectList({}).then(res => {
        if (res.state === 1000) {
          let tempData = res.data.projects
          tempData.unshift('所有项目')
          tempData.forEach(ele => {
            this.projectOptions.push({
              value: ele,
              label: ele
            })
          })
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    // 获取年度投入值
    initGetYearData() {
      this.showPic = true
      // 获取所有项目 + 明细项目
      getProjectInputDataByYear({
        projectName: this.projectName,
        userType: this.peopleType,
        year: this.selectYear,
        startNum: this.startNum,
        range: this.range,
        bu: ''
      }).then(res => {
        if (res.state === 1000) {
          this.totalTableData = []
          this.totalTableData.push(res.data.projectHumanResource.find(ele => ele.buName === '所有项目'))
          this.timeTotal = this.totalTableData[0].timeTotal
          this.timeTotal.projectName = '总计'
          this.timeTotal.projectId = '1000001'
          this.timeTotal.hasChildren = false
          this.timeTotal.isproject = true
          this.manTotal = this.totalTableData[0].manTotal
          this.handleData()
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
      // 获取所有项目
      getProjectInputDataByYear({
        projectName: '所有项目',
        userType: this.peopleType,
        year: this.selectYear,
        startNum: 1,
        range: 10000,
        bu: '所有项目'
      }).then(res => {
        if (res.state === 1000) {
          this.projectNameArr = []
          this.fullYearInputArr = []
          this.needResourceArr = []
          this.planYearCurrentTotal = []
          res.data.projectHumanResource.forEach(ele => {
            if (ele.details.length) {
              ele.details.forEach((item, index) => {
                this.projectNameArr.push(item.projectName)
                this.fullYearInputArr.push(item.yearTotal)
                this.needResourceArr.push(item.planYearTotal)
                this.planYearCurrentTotal.push(item.planYearCurrentTotal)
              })
            }
          })
          let myChartOne = this.$echarts.init(document.getElementById('main'))
          let option = {
            title: {
              text: '投入需求总计'
            },
            color: ['#F56C6C', '#FFD33D', '#409EFF'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: this.projectNameArr
            },
            series: [
              {
                name: '全年人力需求',
                type: 'bar',
                barWidth: 5,
                data: this.needResourceArr
              },
              {
                name: '当前规划需求',
                type: 'bar',
                barWidth: 5,
                data: this.planYearCurrentTotal
              },
              {
                name: '当前实际发生',
                type: 'bar',
                barWidth: 5,
                data: this.fullYearInputArr
              }
            ]
          }
          myChartOne.setOption(option, true)
        }
      })
    },
    handleData() {
      // 部门绑定索引,项目绑定索引,便于后期鼠标单击可以直接知道该项目在当前部门的索引,当前部门在总数据的索引.expandBol用于判断是否有权向后端请求子数据
      this.totalTableData.map((ele, index) => {
        ele.range = 5
        ele.startNum = 1
        if (ele.details.length) {
          let obj = {
            jan: {
              planVal: '',
              manVal: ''
            },
            feb: {
              planVal: '',
              manVal: ''
            },
            mar: {
              planVal: '',
              manVal: ''
            },
            apr: {
              planVal: '',
              manVal: ''
            },
            may: {
              planVal: '',
              manVal: ''
            },
            jun: {
              planVal: '',
              manVal: ''
            },
            jul: {
              planVal: '',
              manVal: ''
            },
            aug: {
              planVal: '',
              manVal: ''
            },
            sep: {
              planVal: '',
              manVal: ''
            },
            oct: {
              planVal: '',
              manVal: ''
            },
            nov: {
              planVal: '',
              manVal: ''
            },
            dec: {
              planVal: '',
              manVal: ''
            },
            yearTotal: '/',
            planYearTotal: '/',
            projectName: '总人力',
            projectId: '1000002',
            hasChildren: false,
            isproject: true
          }
          obj.jan.planVal = this.manTotal.jan + '人'
          obj.jan.manVal = this.manTotal.feb + '人'
          obj.feb.planVal = this.manTotal.mar + '人'
          obj.feb.manVal = this.manTotal.apr + '人'
          obj.mar.planVal = this.manTotal.may + '人'
          obj.mar.manVal = this.manTotal.jun + '人'
          obj.apr.planVal = this.manTotal.jul + '人'
          obj.apr.manVal = this.manTotal.aug + '人'
          obj.may.planVal = this.manTotal.sep + '人'
          obj.may.manVal = this.manTotal.oct + '人'
          obj.jun.planVal = this.manTotal.nov + '人'
          obj.jun.manVal = this.manTotal.dec + '人'
          ele.details.map((ele2, index2) => {
            ele2.projectIndex = index2
            ele2.expandBol = true
            ele2.isproject = true
            ele2.hasChildren = true
          })
          ele.details.push(...[this.timeTotal, obj])
        }
      })
      this.loading = false
    },
    initHistoryData() {
      getTrueHistoryInputData({
        historyId: this.$route.query.historyId
      }).then(res => {
        if (res.state === 1000) {
          this.totalTableData = res.data.projectHumanResource
        }
      })
    },
    // 切换分页或者选择显示范围获取部分年度投入值
    getPartProjectInputDataByYear(key) {
      this.bu = this.totalTableData[key].buName
      getProjectInputDataByYear({
        projectName: this.projectName,
        userType: this.peopleType,
        year: this.selectYear,
        startNum: this.startNum,
        range: this.range,
        bu: this.bu
      }).then(res => {
        if (res.state === 1000) {
          // 先清空数据,再填充数据
          this.totalTableData[key].details = []
          this.totalTableData[key].details = res.data.projectHumanResource[0].details
          this.totalTableData[key].details.map((ele, index) => {
            ele.projectIndex = index
            ele.expandBol = true
            ele.isproject = true
            ele.hasChildren = true
          })
          this.totalTableData[key].details.push(this.timeTotal)
        }
      })
    },
    load(tree, treeNode, resolve) {
      getAllPersonInputDataByProject({
        projectId: tree.projectId,
        userType: this.peopleType,
        year: this.selectYear
      }).then(res => {
        if (res.state === 1000) {
          if (res.data.projectMemberInput.length === 0) {
            setTimeout(() => {
              resolve([])
              this.$message.info('该项目下没有绑定任何人员!')
            }, 1000)
          } else {
            setTimeout(() => {
              let tempData = []
              res.data.projectMemberInput.forEach((ele, index) => {
                // 转换属性名称（userName => projectName）以及增加属性（projectId），手动带上真实的projectId（trueProjectId）
                tempData.push({
                  projectName: ele.name,
                  projectId: ele.userId,
                  trueProjectId: tree.projectId,
                  jan: {
                    planVal: ele.jan.planVal,
                    manVal: ele.jan.manVal
                  },
                  feb: {
                    planVal: ele.feb.planVal,
                    manVal: ele.feb.manVal
                  },
                  mar: {
                    planVal: ele.mar.planVal,
                    manVal: ele.mar.manVal
                  },
                  apr: {
                    planVal: ele.apr.planVal,
                    manVal: ele.apr.manVal
                  },
                  may: {
                    planVal: ele.may.planVal,
                    manVal: ele.may.manVal
                  },
                  jun: {
                    planVal: ele.jun.planVal,
                    manVal: ele.jun.manVal
                  },
                  jul: {
                    planVal: ele.jul.planVal,
                    manVal: ele.jul.manVal
                  },
                  aug: {
                    planVal: ele.aug.planVal,
                    manVal: ele.aug.manVal
                  },
                  sep: {
                    planVal: ele.sep.planVal,
                    manVal: ele.sep.manVal
                  },
                  oct: {
                    planVal: ele.oct.planVal,
                    manVal: ele.oct.manVal
                  },
                  nov: {
                    planVal: ele.nov.planVal,
                    manVal: ele.nov.manVal
                  },
                  dec: {
                    planVal: ele.dec.planVal,
                    manVal: ele.dec.manVal
                  },
                  yearTotal: ele.yearTotal,
                  planYearTotal: '',
                  isproject: false
                })
              })
              resolve(tempData)
            })
          }
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    // 新增人员
    addPerson(rowData) {
      // 先获取全员信息
      let promise1 = getUserPower({
        userName: '',
        accountName: '',
        department: '',
        startNum: 1,
        range: 0
      }).then(res => {
        if (res.state === 1000) {
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
        this.netError()
      })
      // 再获取当前已经绑定在该项目的人员信息
      let promise2 = getPorjectParticipant({
        projectId: rowData.projectId,
        accountName: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName')
      }).then(res => {
        if (res.state === 1000) {
          if (res.data.projectMembers.length) {
            return res.data.projectMembers.map(ele => {
              return {
                userName: ele.realName,
                accountName: ele.accountName
              }
            })
          } else {
            return []
          }
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.netError()
      })
      Promise.all([promise1, promise2]).then((res) => {
        this.bindUserData = res[0]
        this.havebindUserData = res[1]
        this.showSelectPeople = true
      })
      this.projectId = rowData.projectId
    },
    // 可以编辑数据
    canEdit() {
      startEditModel({
        userAccount: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        year: this.selectYear
      }).then(res => {
        if (res.state === 1000) {
          this.disabledBol = false
          this.saveButtonBol = false
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    // 当前行数据，月份，当前部门的索引，修改后的值，如果是project那么projectId就是projectId这个字段，如果不是projectId就是trueProjectId这个字段
    changeInputValue(rowData, month, key, type, newValue) {
      let projectId = ''
      let userId = ''
      let value = ''
      let planVal = ''
      if (rowData.isproject) {
        projectId = rowData.projectId
      } else {
        projectId = rowData.trueProjectId
        userId = rowData.projectId
      }
      if (type === 'planVal') {
        planVal = newValue
      } else {
        value = newValue
      }
      editInputData({
        projectId,
        userId,
        month,
        value,
        planVal,
        userAccount: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        year: this.selectYear
      }).then(res => {
        if (res.state === 1000) {
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    editValue(rowData, month, newValue) {
      const projectId = rowData.projectId
      let planVal = ''
      let planYearTotal = ''
      if (month !== '') {
        planVal = newValue
      } else {
        planYearTotal = newValue
      }
      editProjectMonthPlanOrPlanYearTotal({
        projectId,
        month,
        planVal,
        planYearTotal,
        userAccount: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        year: this.selectYear
      }).then(res => {
        if (res.state === 1000) {
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    saveData() {
      saveInputData({
        userAccount: window.sessionStorage.getItem('accountName') || window.localStorage.getItem('accountName'),
        year: this.selectYear
      }).then(res => {
        if (res.state === 1000) {
          this.$message.success(res.message)
          setTimeout(() => {
            this.$router.go(0)
          }, 1000)
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    rangeChange(key, range) {
      this.range = range
      this.getPartProjectInputDataByYear(key)
    },
    startNumChange(key, startNum) {
      this.startNum = startNum
      this.getPartProjectInputDataByYear(key)
    },
    netError() {
      this.$message.error('网络错误!')
    },
    jumpToEditHistory() {
      this.$router.push({
        path: '/editHistory'
      })
    }
  },
  created() {
    this.initCurrentYear()
    this.getAllProjectNameList()
    if (this.$route.query.isHistory) {
      this.normalOrHistory = true
      this.initHistoryData()
    } else {
      this.initGetYearData()
      this.normalOrHistory = false
    }
  }
}
</script>

<style lang="scss">
.rough {
  width: 100%;
  > .top::before {
    content: '';
    display: block;
    clear: both;
  }
  > .top::after {
    content: '';
    display: block;
    clear: both;
  }
  > .top {
    width: 100%;
    position: relative;
    .rectangleBox {
      float: right;
    }
  }
  > .body {
    margin-top: 20px;
    > .box-card {
      margin-bottom: 20px;
      > .el-card__body {
        > .el-pagination {
          margin-top: 10px;
        }
      }
    }
  }
  > .picture {
    width: 100%;
  }
}
</style>
