<template>
  <div class="detailed">
    <div class="top">
      <div class="rectangleBox">
        <!-- 不显示清除按钮 -->
        <el-date-picker
          v-model="selectYear"
          type="year"
          placeholder="请选择年份"
          :picker-options="notSelectYear"
          :clearable="showClearable"
          @change="getChangeYear"
          class="rectangle">
        </el-date-picker>
        <!-- 项目 -->
        <el-select v-model="departmentName" placeholder="请选择部门" class="rectangle" @change="changeDepartment">
          <el-option
            v-for="item in departmentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!-- 类别 -->
        <el-select v-model="peopleType" placeholder="请选择人员类别" class="rectangle" @change="changePeopleType">
          <el-option
            v-for="item in peopleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="body">
      <el-card class="box-card" v-for="(val, key) in tableData" :key="key">
        <div slot="header" class="clearfix">
          <span>{{ val.deName }}</span>
        </div>
        <el-table
          :data="val.details"
          style="width: 100%"
          border>
          <el-table-column prop="userName" label="姓名" width="220" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p v-if="scope.row.positionStatus === 1" style="text-align: center">待离职</p>
                <p v-if="scope.row.positionStatus === 2" style="text-align: center">已离职</p>
                <p v-if="scope.row.positionStatus === 3" style="text-align: center">在职</p>
                <!-- <p v-if="scope.row.positionStatus === 1">待离职</p> -->
                <!-- <p>住址: {{ scope.row.address }}</p> -->
                <div slot="reference" class="name-wrapper">
                  <!-- <el-tag size="medium">{{ scope.row.name }}</el-tag> -->
                  <span v-if="scope.row.positionStatus === 1" style="color: orange">{{ scope.row.userName }}</span>
                  <span v-else-if="scope.row.positionStatus === 2" style="color: red">{{ scope.row.userName }}</span>
                  <span v-else>{{ scope.row.userName }}</span>
                </div>
              </el-popover>
              <!-- <span v-if="scope.row.positionStatus === 1" style="color: orange">{{ scope.row.userName }}</span>
              <span v-else-if="scope.row.positionStatus === 2" style="color: red">{{ scope.row.userName }}</span>
              <span v-else>{{ scope.row.userName }}</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="jan" label="Jan" align="center" :width="tableWidth">
            <template slot-scope="scope">
              <!-- 只有lt这个值 -->
              <!-- <span v-if="scope.row.jan.length === 1">{{ scope.row.jan[0] }}</span> -->
              <span v-if="scope.row.jan.length === 1"></span>
              <span v-else>
                <span v-if="scope.row.jan[scope.row.jan.length - 1] === 'lt'">
                  <div v-for="(val, key) in scope.row.jan" :key="key" style="color: rgb(255, 0, 0)">
                    <div v-if="val !== 'lt'">{{ val }}</div>
                  </div>
                </span>
                <span v-if="scope.row.jan[scope.row.jan.length - 1] === 'gt'">
                  <div v-for="(val, key) in scope.row.jan" :key="key">
                    <div v-if="val !== 'gt'">{{ val }}</div>
                  </div>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="feb" label="Feb" align="center" :width="tableWidth">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.feb.length === 1">{{ scope.row.feb[0] }}</span> -->
              <span v-if="scope.row.feb.length === 1"></span>
              <span v-else>
                <span v-if="scope.row.feb[scope.row.feb.length - 1] === 'lt'">
                  <div v-for="(val, key) in scope.row.feb" :key="key" style="color: rgb(255, 0, 0)">
                    <div v-if="val !== 'lt'">{{ val }}</div>
                  </div>
                </span>
                <span v-if="scope.row.feb[scope.row.feb.length - 1] === 'gt'">
                  <div v-for="(val, key) in scope.row.feb" :key="key">
                    <div v-if="val !== 'gt'">{{ val }}</div>
                  </div>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="mar" label="Mar" align="center" :width="tableWidth">
            <template slot-scope="scope">
              <span v-if="scope.row.mar.length === 1"></span>
              <span v-else>
                <span v-if="scope.row.mar[scope.row.mar.length - 1] === 'lt'">
                  <div v-for="(val, key) in scope.row.mar" :key="key" style="color: rgb(255, 0, 0)">
                    <div v-if="val !== 'lt'">{{ val }}</div>
                  </div>
                </span>
                <span v-if="scope.row.mar[scope.row.mar.length - 1] === 'gt'">
                  <div v-for="(val, key) in scope.row.mar" :key="key">
                    <div v-if="val !== 'gt'">{{ val }}</div>
                  </div>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="apr" label="Apr" align="center" :width="tableWidth">
            <template slot-scope="scope">
              <span v-if="scope.row.apr.length === 1"></span>
              <span v-else>
                <span v-if="scope.row.apr[scope.row.apr.length - 1] === 'lt'">
                  <div v-for="(val, key) in scope.row.apr" :key="key" style="color: rgb(255, 0, 0)">
                    <div v-if="val !== 'lt'">{{ val }}</div>
                  </div>
                </span>
                <span v-if="scope.row.apr[scope.row.apr.length - 1] === 'gt'">
                  <div v-for="(val, key) in scope.row.apr" :key="key">
                    <div v-if="val !== 'gt'">{{ val }}</div>
                  </div>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="may" label="May" align="center" :width="tableWidth">
            <template slot-scope="scope">
              <span v-if="scope.row.may.length === 1"></span>
              <span v-else>
                <span v-if="scope.row.may[scope.row.may.length - 1] === 'lt'">
                  <div v-for="(val, key) in scope.row.may" :key="key" style="color: rgb(255, 0, 0)">
                    <div v-if="val !== 'lt'">{{ val }}</div>
                  </div>
                </span>
                <span v-if="scope.row.may[scope.row.may.length - 1] === 'gt'">
                  <div v-for="(val, key) in scope.row.may" :key="key">
                    <div v-if="val !== 'gt'">{{ val }}</div>
                  </div>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="jun" label="Jun" align="center" :width="tableWidth">
            <template slot-scope="scope">
              <span v-if="scope.row.jun.length === 1"></span>
              <span v-else>
                <span v-if="scope.row.jun[scope.row.jun.length - 1] === 'lt'">
                  <div v-for="(val, key) in scope.row.jun" :key="key" style="color: rgb(255, 0, 0)">
                    <div v-if="val !== 'lt'">{{ val }}</div>
                  </div>
                </span>
                <span v-if="scope.row.jun[scope.row.jun.length - 1] === 'gt'">
                  <div v-for="(val, key) in scope.row.jun" :key="key">
                    <div v-if="val !== 'gt'">{{ val }}</div>
                  </div>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="jul" label="Jul" align="center" :width="tableWidth">
            <template slot-scope="scope">
              <span v-if="scope.row.jul.length === 1"></span>
              <span v-else>
                <span v-if="scope.row.jul[scope.row.jul.length - 1] === 'lt'">
                  <div v-for="(val, key) in scope.row.jul" :key="key" style="color: rgb(255, 0, 0)">
                    <div v-if="val !== 'lt'">{{ val }}</div>
                  </div>
                </span>
                <span v-if="scope.row.jul[scope.row.jul.length - 1] === 'gt'">
                  <div v-for="(val, key) in scope.row.jul" :key="key">
                    <div v-if="val !== 'gt'">{{ val }}</div>
                  </div>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="aug" label="Aug" align="center" :width="tableWidth">
            <template slot-scope="scope">
              <span v-if="scope.row.aug.length === 1"></span>
              <span v-else>
                <span v-if="scope.row.aug[scope.row.aug.length - 1] === 'lt'">
                  <div v-for="(val, key) in scope.row.aug" :key="key" style="color: rgb(255, 0, 0)">
                    <div v-if="val !== 'lt'">{{ val }}</div>
                  </div>
                </span>
                <span v-if="scope.row.aug[scope.row.aug.length - 1] === 'gt'">
                  <div v-for="(val, key) in scope.row.aug" :key="key">
                    <div v-if="val !== 'gt'">{{ val }}</div>
                  </div>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="sep" label="Sep" align="center" :width="tableWidth">
            <template slot-scope="scope">
              <span v-if="scope.row.sep.length === 1"></span>
              <span v-else>
                <span v-if="scope.row.sep[scope.row.sep.length - 1] === 'lt'">
                  <div v-for="(val, key) in scope.row.sep" :key="key" style="color: rgb(255, 0, 0)">
                    <div v-if="val !== 'lt'">{{ val }}</div>
                  </div>
                </span>
                <span v-if="scope.row.sep[scope.row.sep.length - 1] === 'gt'">
                  <div v-for="(val, key) in scope.row.sep" :key="key">
                    <div v-if="val !== 'gt'">{{ val }}</div>
                  </div>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="oct" label="Oct" align="center" :width="tableWidth">
            <template slot-scope="scope">
              <span v-if="scope.row.oct.length === 1"></span>
              <span v-else>
                <span v-if="scope.row.oct[scope.row.oct.length - 1] === 'lt'">
                  <div v-for="(val, key) in scope.row.oct" :key="key" style="color: rgb(255, 0, 0)">
                    <div v-if="val !== 'lt'">{{ val }}</div>
                  </div>
                </span>
                <span v-if="scope.row.oct[scope.row.oct.length - 1] === 'gt'">
                  <div v-for="(val, key) in scope.row.oct" :key="key">
                    <div v-if="val !== 'gt'">{{ val }}</div>
                  </div>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="nov" label="Nov" align="center" :width="tableWidth">
            <template slot-scope="scope">
              <span v-if="scope.row.nov.length === 1"></span>
              <span v-else>
                <span v-if="scope.row.nov[scope.row.nov.length - 1] === 'lt'">
                  <div v-for="(val, key) in scope.row.nov" :key="key" style="color: rgb(255, 0, 0)">
                    <div v-if="val !== 'lt'">{{ val }}</div>
                  </div>
                </span>
                <span v-if="scope.row.nov[scope.row.nov.length - 1] === 'gt'">
                  <div v-for="(val, key) in scope.row.nov" :key="key">
                    <div v-if="val !== 'gt'">{{ val }}</div>
                  </div>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="dec" label="Dec" align="center" :width="tableWidth">
            <template slot-scope="scope">
              <span v-if="scope.row.dec.length === 1"></span>
              <span v-else>
                <span v-if="scope.row.dec[scope.row.dec.length - 1] === 'lt'">
                  <div v-for="(val, key) in scope.row.dec" :key="key" style="color: rgb(255, 0, 0)">
                    <div v-if="val !== 'lt'">{{ val }}</div>
                  </div>
                </span>
                <span v-if="scope.row.dec[scope.row.dec.length - 1] === 'gt'">
                  <div v-for="(val, key) in scope.row.dec" :key="key">
                    <div v-if="val !== 'gt'">{{ val }}</div>
                  </div>
                </span>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page.sync="val.startNum"
                       :page-sizes="[10, 50, 100]"
                       :page-size="val.range"
                       :total="val.total"
                       layout="total, sizes, prev, pager, next"
                       @size-change="rangeChange(key, $event)"
                       @current-change="startNumChange(key, $event)">
        </el-pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getAllDepartment, getStaffInputDataByYear } from '../../api/api'
export default {
  data () {
    return {
      selectYear: '',
      notSelectYear: {
        disabledDate (time) {
          // 只能选择从2020年开始到当前的年份
          return time.getFullYear() > new Date().getFullYear() || time.getFullYear() <= '1970'
        }
      },
      showClearable: false,
      departmentName: '所有部门',
      departmentOptions: [],
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
      tableData: [],
      startNum: 1,
      range: 10,
      total: 0,
      tableWidth: 220
    }
  },
  methods: {
    // 初始化年份为当前年份
    initCurrentYear () {
      this.selectYear = (new Date().getFullYear()).toString()
    },
    getChangeYear (year) {
      if (year === null) {
        this.initCurrentYear()
      } else {
        this.selectYear = year.getFullYear().toString()
        this.initTableData()
      }
    },
    changeDepartment (departmentName) {
      this.departmentName = departmentName
      this.initTableData()
    },
    changePeopleType (peopleType) {
      this.peopleType = peopleType
      this.initTableData()
    },
    // 获取所有部门名称
    getAllDepartmentNameList () {
      getAllDepartment({}).then(res => {
        if (res.state === 1000) {
          let tempData = res.data.departments
          tempData.unshift({ name: '所有部门' })
          tempData.forEach(ele => {
            this.departmentOptions.push({
              value: ele.name,
              label: ele.name
            })
          })
        } else {
          this.netError()
        }
      }, rej => {
        this.netError()
      })
    },
    initTableData () {
      getStaffInputDataByYear({
        departmentName: this.departmentName,
        userType: this.peopleType,
        year: this.selectYear,
        startNum: this.startNum,
        range: this.range
      }).then(res => {
        if (res.state === 1000) {
          this.tableData = res.data.staffInput
          this.tableData.map((ele, index) => {
            ele.range = 10
            ele.startNum = 1
            if (ele.details.length) {
              ele.details.map((ele2, index2) => {
                ele2.jan = ele2.jan.split(';')
                ele2.feb = ele2.feb.split(';')
                ele2.mar = ele2.mar.split(';')
                ele2.apr = ele2.apr.split(';')
                ele2.may = ele2.may.split(';')
                ele2.jun = ele2.jun.split(';')
                ele2.jul = ele2.jul.split(';')
                ele2.aug = ele2.aug.split(';')
                ele2.sep = ele2.sep.split(';')
                ele2.oct = ele2.oct.split(';')
                ele2.nov = ele2.nov.split(';')
                ele2.dec = ele2.dec.split(';')
                ele2.positionStatus = ele2.positionStatus
                ele2.userName = ele2.userName
              })
            }
          })
        }
      })
    },
    // 切换分页
    getPartStaffInputDataByYear (key) {
      getStaffInputDataByYear({
        departmentName: this.tableData[key].deName,
        userType: this.peopleType,
        year: this.selectYear,
        startNum: this.startNum,
        range: this.range
      }).then(res => {
        if (res.state === 1000) {
          this.tableData[key].details = []
          this.tableData[key].details = res.data.staffInput[0].details
          this.tableData[key].details.map(ele => {
            ele.jan = ele.jan.split(';')
            ele.feb = ele.feb.split(';')
            ele.mar = ele.mar.split(';')
            ele.apr = ele.apr.split(';')
            ele.may = ele.may.split(';')
            ele.jun = ele.jun.split(';')
            ele.jul = ele.jul.split(';')
            ele.aug = ele.aug.split(';')
            ele.sep = ele.sep.split(';')
            ele.oct = ele.oct.split(';')
            ele.nov = ele.nov.split(';')
            ele.dec = ele.dec.split(';')
            ele.positionStatus = ele.positionStatus
            ele.userName = ele.userName
          })
        }
      })
    },
    rangeChange (key, range) {
      this.range = range
      this.getPartStaffInputDataByYear(key)
    },
    startNumChange (key, startNum) {
      this.startNum = startNum
      this.getPartStaffInputDataByYear(key)
    },
    netError () {
      this.$message.error('网络错误!')
    }
  },
  created () {
    this.initCurrentYear()
    this.getAllDepartmentNameList()
    this.initTableData()
  }
}
</script>

<style lang="scss">
.detailed {
  width: 100%;
  > .top {
    width: 100%;
    height: 40px;
    position: relative;
    .rectangleBox {
      float: right
    }
  }
  > .body {
    margin-top: 20px;
    > .box-card {
      margin-bottom: 20px;
      > .el-card__body {
        > .el-pagination {
          margin-top: 10px
        }
      }
    }
  }
}
</style>
