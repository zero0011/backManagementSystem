<template>
  <div class="joinVersionApp">
    <!-- 搜索 -->
    <div class="search">
      <el-input v-model.trim="taskName" placeholder="任务名称"></el-input>
      <el-input v-model.trim="creator" placeholder="创建人域账号" v-if="!(tabName === 'create')"></el-input>
      <div class="block">
        <el-date-picker v-model="searchTime"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        @change="getTime">
        </el-date-picker>
      </div>
      <el-button type="primary" @click="search">查询</el-button>
      <el-button type="primary" @click="createMission" v-if="!(tabName === 'all' || tabName === 'finish')">创建任务</el-button>
    </div>
    <!-- 列表宽度1157px，最大高度530px -->
    <!-- <el-table :data="tableData" border style="width: 100%" max-height="530"> -->
    <el-table :data="tableData" border style="width: 100%" :header-cell-style="{background:'rgb(250, 250, 250)'}">
      <el-table-column prop="taskName" label="任务名称" align="center" show-overflow-tooltip v-if="tabName === 'join'">
        <template slot-scope="scope">
          <el-button @click="jumpToexecuteMission(scope.row)" type="text" size="small">{{ scope.row.taskName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="taskName" label="任务名称" align="center" show-overflow-tooltip v-if="tabName === 'finish'">
        <!-- <template slot-scope="scope">
          <el-button @click="jumpToexecuteMission(scope.row)" type="text" size="small">{{ scope.row.taskName }}</el-button>
        </template> -->
      </el-table-column>
      <el-table-column prop="taskName" label="任务名称" align="center" show-overflow-tooltip v-if="tabName === 'create'">
        <template slot-scope="scope">
          <el-button @click="jumpToexecuteMission(scope.row)" type="text" size="small">{{ scope.row.taskName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="taskName" label="任务名称" align="center" show-overflow-tooltip v-if="tabName === 'all'">
        <template slot-scope="scope">
          <span v-if="scope.row.progress === '终止' || scope.row.progress === '完成'">{{ scope.row.taskName }}</span>
          <el-button @click="jumpToexecuteMission(scope.row)" type="text" size="small" v-else>{{ scope.row.taskName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column type="expand" v-if="tabName === 'create'">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="创建人">
              <span>{{ scope.row.creator }}</span>
            </el-form-item>
            <el-form-item label="任务描述">
              <span>{{ scope.row.taskDesc }}</span>
            </el-form-item>
            <el-form-item label="所属项目">
              <span>{{ scope.row.belongProject }}</span>
            </el-form-item>
            <el-form-item label="所属版本">
              <span>{{ scope.row.belongVersion }}</span>
            </el-form-item>
        </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="taskDesc" label="任务描述" width="80" align="center" show-overflow-tooltip v-if="tabName === 'all' || tabName === 'finish' || tabName === 'join'"></el-table-column>
      <el-table-column prop="creator" label="创建人" width="70" align="center" show-overflow-tooltip v-if="tabName === 'join'"></el-table-column>
      <el-table-column prop="creator" label="创建人" width="70" align="center" show-overflow-tooltip v-if="tabName === 'all' || tabName === 'finish'"></el-table-column>
      <el-table-column prop="progress" label="进度" width="80" align="center" v-if="tabName === 'join'" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.progress === '终止'">终止</span>
          <span v-if="scope.row.progress === '未开始'">{{ scope.row.progress }}</span>
          <span v-if="scope.row.progress === '进行中'" @mouseenter="goingMouseenter" @mouseleave="goingMouseleave" @click="goingClick(scope.row, $event)">{{ scope.row.progress }}</span>
          <span v-if="scope.row.progress === '完成' && scope.row.delayDays === 0">{{ scope.row.progress }}</span>
          <span v-if="scope.row.progress === '完成' && scope.row.delayDays !== 0" style="color: red">{{ scope.row.progress + '(' + scope.row.delayDays + ')' }}</span>
          <span v-if="scope.row.progress === '延期'" style="color: red" @mouseenter="delayMouseenter" @mouseleave="delayMouseleave" @click="delayClick(scope.row, $event)">{{ scope.row.progress + '(' + scope.row.delayDays + ')' }}</span>
        </template>
      </el-table-column>
      <!-- 创建的任务 -->
      <el-table-column label="进度" width="80" align="center" v-if="tabName === 'create' || tabName === 'all' || tabName === 'finish'" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.progress === '终止'">终止</span>
          <span v-if="scope.row.progress === null" @click="seeTestPeopleStatus(scope.row)" style="cursor: pointer">未开始</span>
          <span v-if="scope.row.progress === '未开始'" @click="seeTestPeopleStatus(scope.row)" style="cursor: pointer">未开始</span>
          <span v-if="scope.row.progress === '进行中'" @click="seeTestPeopleStatus(scope.row)" style="cursor: pointer">进行中</span>
          <span v-if="(scope.row.progress === '完成') && (scope.row.delayDays === 0)" @click="seeTestPeopleStatus(scope.row)" style="cursor: pointer">完成</span>
          <span v-if="(scope.row.progress === '完成') && (scope.row.delayDays > 0)" @click="seeTestPeopleStatus(scope.row)" :style="'cursor: pointer;color: ' + scope.row.color">完成({{ scope.row.delayDays }})</span>
          <span v-if="(scope.row.progress === '延期') && (scope.row.delayDays > 0)" @click="seeTestPeopleStatus(scope.row)" :style="'cursor: pointer;color: ' + scope.row.color">延期({{ scope.row.delayDays }})</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="110" align="center" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="110" align="center" sortable show-overflow-tooltip></el-table-column>
      <el-table-column label="统计信息" width="80" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click="seeStatisticalMessage(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="belongProject" label="所属项目" width="80" align="center" show-overflow-tooltip v-if="tabName === 'all' || tabName === 'finish' || tabName === 'join'"></el-table-column>
      <el-table-column prop="belongVersion" label="所属版本" width="80" align="center" show-overflow-tooltip v-if="tabName === 'all' || tabName === 'finish' || tabName === 'join'"></el-table-column>
      <el-table-column prop="workpd" label="工作量(条/天)" width="110" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="round" label="当前轮次" width="80" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="110" align="center" sortable show-overflow-tooltip v-if="tabName === 'join'"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="110" align="center" sortable show-overflow-tooltip v-if="tabName === 'create' || tabName === 'all' || tabName === 'finish'"></el-table-column>
      <el-table-column label="操作" width="80" align="center" v-if="tabName === 'join'">
        <template slot-scope="scope">
          <!-- <el-button type="text" v-if="scope.row.status === 1 && scope.row.progress !== '未开始'">报告</el-button> -->
          <!-- <el-button type="text" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">报告</el-button> -->
          <!-- <el-button type="text" disabled v-if="scope.row.status === 1 && scope.row.progress === '完成'">报告</el-button> -->
          <!-- <el-button type="text" disabled v-if="scope.row.progress === '未开始'">报告</el-button> -->
          <el-button type="text" disabled v-if="scope.row.progress === '未开始' || scope.row.progress === null">报告</el-button>
          <el-button type="text" v-else @click="jumpToMissionReport(scope.row)">报告</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center" v-if="tabName === 'create' || tabName === 'finish'">
        <template slot-scope="scope">
            <el-dropdown placement="bottom">
            <span class="el-dropdown-link">...</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="editMission(scope.row)" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">编辑</el-dropdown-item>
              <el-dropdown-item disabled v-if="scope.row.status === 1 && scope.row.progress === '完成'">编辑</el-dropdown-item>
              <el-dropdown-item disabled v-if="scope.row.status === 0">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="deleteTask(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item @click.native="assign(scope.row)" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">分配</el-dropdown-item>
              <el-dropdown-item disabled v-if="scope.row.status === 1 && scope.row.progress === '完成'">分配</el-dropdown-item>
              <el-dropdown-item disabled v-if="scope.row.status === 0">分配</el-dropdown-item>
              <el-dropdown-item @click.native="reTest(scope.row)" v-if="scope.row.status === 0 || scope.row.progress === '完成'">复测</el-dropdown-item>
              <el-dropdown-item v-else disabled>复测</el-dropdown-item>
              <el-dropdown-item @click.native="stopStatus(scope.row)" v-if="scope.row.status === 1 && (scope.row.progress !== '完成')">终止</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status === 1 && (scope.row.progress === '完成')" disabled>终止</el-dropdown-item>
              <el-dropdown-item v-if="(scope.row.status === 0)" disabled>终止</el-dropdown-item>
              <el-dropdown-item disabled v-if="scope.row.progress === '未开始' || scope.row.progress === null">报告</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToMissionReport(scope.row)" v-else>报告</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button type="text" @click="editMission(scope.row)" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">编辑</el-button>
          <el-button type="text" disabled v-if="scope.row.status === 1 && scope.row.progress === '完成'">编辑</el-button>
          <el-button type="text" disabled @click="editMission(scope.row)" v-if="scope.row.status === 0">编辑</el-button> -->
          <!-- <el-button type="text" @click="deleteTask(scope.row)" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">删除</el-button> -->
          <!-- <el-button type="text" @click="deleteTask(scope.row)">删除</el-button> -->
          <!-- <el-button type="text" disabled v-if="scope.row.status === 1 && scope.row.progress === '完成'">删除</el-button> -->
          <!-- <el-button type="text" disabled v-if="scope.row.status === 0">删除</el-button> -->
          <!-- <el-button type="text" @click="assign(scope.row)" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">分配</el-button>
          <el-button type="text" disabled v-if="scope.row.status === 1 && scope.row.progress === '完成'">分配</el-button>
          <el-button type="text" disabled @click="assign(scope.row)" v-if="scope.row.status === 0">分配</el-button>
          <el-button type="text" v-if="scope.row.status === 0 || scope.row.progress === '完成'" @click="reTest(scope.row)">复测</el-button>
          <el-button type="text" disabled v-else>复测</el-button> -->
          <!-- <el-button type="text" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">复测</el-button>
          <el-button type="text" disabled v-if="scope.row.status === 1 && scope.row.progress === '完成'">复测</el-button>
          <el-button type="text" disabled v-if="scope.row.status === 0">复测</el-button> -->
          <!-- <el-button type="text" @click="stopStatus(scope.row)" v-if="scope.row.status === 1 && (scope.row.progress !== '完成')">终止</el-button>
          <el-button type="text" @click="stopStatus(scope.row)" disabled v-if="scope.row.status === 1 && (scope.row.progress === '完成')">终止</el-button>
          <el-button type="text" disabled @click="stopStatus(scope.row)" v-if="(scope.row.status === 0)">终止</el-button>
          <el-button type="text" disabled v-if="scope.row.progress === '未开始' || scope.row.progress === null">报告</el-button>
          <el-button type="text" v-else @click="jumpToMissionReport(scope.row)">报告</el-button> -->
          <!-- <el-button type="text" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">报告</el-button>
          <el-button type="text" disabled v-if="scope.row.status === 1 && scope.row.progress === '完成'">报告</el-button>
          <el-button type="text" disabled v-if="scope.row.status === 0">报告</el-button> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center" v-if="tabName === 'all'">
      <template slot-scope="scope">          <el-dropdown placement="bottom">
            <span class="el-dropdown-link">...</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="deleteTask(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item @click.native="assign(scope.row)" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">分配</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status === 1 && scope.row.progress === '完成'" disabled>分配</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status === 0" disabled>分配</el-dropdown-item>
              <el-dropdown-item @click.native="reTest(scope.row)" v-if="scope.row.status === 0 || scope.row.progress === '完成'">复测</el-dropdown-item>
              <el-dropdown-item disabled v-else>复测</el-dropdown-item>
              <el-dropdown-item @click.native="stopStatus(scope.row)" v-if="scope.row.status === 1 && (scope.row.progress !== '完成')">终止</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status === 1 && (scope.row.progress === '完成')" disabled>终止</el-dropdown-item>
              <el-dropdown-item v-if="(scope.row.status === 0)" disabled>终止</el-dropdown-item>
              <el-dropdown-item disabled v-if="scope.row.progress === '未开始' || scope.row.progress === null">报告</el-dropdown-item>
              <el-dropdown-item @click.native="jumpToMissionReport(scope.row)" v-else>报告</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        <!-- <el-button type="text" @click="deleteTask(scope.row)" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">删除</el-button>
        <el-button type="text" disabled v-if="scope.row.status === 1 && scope.row.progress === '完成'">删除</el-button>
        <el-button type="text" disabled v-if="scope.row.status === 0">删除</el-button> -->
        <!-- <el-button type="text" @click="deleteTask(scope.row)">删除</el-button>
        <el-button type="text" @click="assign(scope.row)" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">分配</el-button>
        <el-button type="text" disabled v-if="scope.row.status === 1 && scope.row.progress === '完成'">分配</el-button>
        <el-button type="text" disabled @click="assign(scope.row)" v-if="scope.row.status === 0">分配</el-button>
        <el-button type="text" v-if="scope.row.status === 0 || scope.row.progress === '完成'" @click="reTest(scope.row)">复测</el-button>
        <el-button type="text" disabled v-else>复测</el-button> -->
        <!-- <el-button type="text" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">复测</el-button>
        <el-button type="text" disabled v-if="scope.row.status === 1 && scope.row.progress === '完成'">复测</el-button>
        <el-button type="text" disabled v-if="scope.row.status === 0">复测</el-button> -->
        <!-- <el-button type="text" @click="stopStatus(scope.row)" v-if="scope.row.status === 1 && (scope.row.progress !== '完成')">终止</el-button>
        <el-button type="text" @click="stopStatus(scope.row)" disabled v-if="scope.row.status === 1 && (scope.row.progress === '完成')">终止</el-button>
        <el-button type="text" disabled @click="stopStatus(scope.row)" v-if="(scope.row.status === 0)">终止</el-button> -->
        <!-- <el-button type="text" disabled v-if="scope.row.progress === '未开始'">报告</el-button> -->
        <!-- <el-button type="text" disabled v-if="scope.row.progress === '未开始' || scope.row.progress === null">报告</el-button>
        <el-button type="text" v-else @click="jumpToMissionReport(scope.row)">报告</el-button> -->
        <!-- <el-button type="text" v-if="scope.row.status === 1 && scope.row.progress !== '完成'">报告</el-button>
        <el-button type="text" disabled v-if="scope.row.status === 1 && scope.row.progress === '完成'">报告</el-button>
        <el-button type="text" disabled v-if="scope.row.status === 0">报告</el-button> -->
      </template>
    </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :current-page.sync="startNum"
                   :page-sizes="[5, 10, 20]"
                   :page-size="range"
                   :total="total"
                   layout="total, sizes, prev, pager, next"
                   @size-change="rangeChange"
                   @current-change="startNumChange">
    </el-pagination>
    <!-- 查看测试人员 -->
    <el-dialog title="测试人员列表" :visible.sync="seeMoreUser" class="seeTestPeople" width="870px">
      <el-table :data="seeTestPeopleData" style="" border>
        <el-table-column prop="testerName" label="人员" width="200" align="center"></el-table-column>
        <el-table-column prop="caseSum" label="总用例数" width="80" align="center"></el-table-column>
        <el-table-column prop="assignedCaseSum" label="分配用例数" width="100" align="center"></el-table-column>
        <el-table-column prop="caseSumToExecute" label="待执行" width="70" align="center"></el-table-column>
        <el-table-column prop="passedCaseSum" label="成功" width="50" align="center"></el-table-column>
        <el-table-column prop="failedCaseSum" label="失败" width="50" align="center"></el-table-column>
        <el-table-column prop="blockedCaseSum" label="阻塞" width="50" align="center"></el-table-column>
        <el-table-column prop="skippedCaseSum" label="跳过" width="50" align="center"></el-table-column>
        <el-table-column prop="executionRate" label="执行率(%)" width="90" align="center"></el-table-column>
        <el-table-column prop="passRate" label="通过率(%)" width="90" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 创建者查看进度 -->
    <el-dialog title="" :visible.sync="seeAllUserStatus" class="allUserStatus">
      <el-table :data="gridData" border>
        <el-table-column prop="accountName" label="成员名称" align="center"></el-table-column>
        <el-table-column prop="status" label="成员状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '未开始'">未开始</span>
            <span v-if="scope.row.status === '进行中'">进行中</span>
            <span v-if="(scope.row.status === '完成') && (scope.row.delayDays === 0)">完成</span>
            <span v-if="(scope.row.status === '完成') && (scope.row.delayDays > 0)" style="color: red">{{ '完成' + '(' + scope.row.delayDays + ')' }}</span>
            <span v-if="(scope.row.status === '延期')" style="color: red">{{ '延期' + '(' + scope.row.delayDays + ')' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 分配 -->
    <el-dialog title="可分配任务的测试人员" :visible.sync="outerVisible">
      <el-dialog title="用例分配" :visible.sync="innerVisible" append-to-body class="bindCase">
        <div class="left">
          <h2>待选择用例</h2>
          <el-table :data="allCaseData"
              ref="multipleTable"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              border
              :default-expand-all="showChildren"
              :expand-row-keys="expandArr"
              @select="selectCheckbox"
              @expand-change="expandRow"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column type="selection"
                            width="50"
                            align="center"
                            :selectable='selectable'
                            disabled>
            </el-table-column>
            <el-table-column prop="nodeName"
                            label="名称"
                            align="left"
                            show-overflow-tooltip
                            width="349">
            </el-table-column>
          </el-table>
        </div>
        <div class="middle">
          <el-button type="primary" plain @click="addCase">> 添加</el-button>
        </div>
        <div class="right">
          <h2>已选择用例</h2>
          <div class="table">
            <el-table :data="haveBindCase" empty-text>
              <el-table-column prop="caseNumber" label="用例编号" width="112" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="nodeName" label="名称" width="112" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="belongCaseSuite" label="所属用例集" width="112" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="112" align="center">
                <template slot-scope="scope">
                  <el-button @click="deleteBindCase(scope.$index)" type="text" size="small" v-if="scope.row.executed === 0">删除</el-button>
                  <el-button disabled type="text" size="small" v-if="scope.row.executed !== 0 || scope.row.executed === undefined">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialogBindCase('close')">取 消</el-button>
          <el-button type="primary" @click="closeDialogBindCase('confirm')">确 定</el-button>
        </div>
      </el-dialog>
      <el-table :data="assignData" border :header-cell-style="{background:'rgb(250, 250, 250)'}">
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="accountName" label="账户名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="department" label="部门" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="caseCount" label="分配用例数" align="center"></el-table-column>
        <el-table-column prop="workpd" label="工作量（条/天）" align="center" width="150"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="openInner(scope.row)">分配</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 复测修改日期 -->
    <el-dialog title="复测" :visible.sync="dialogReTest" :before-close="reTestClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="时间选择" :label-width="formLabelWidth" prop="timeRange">
          <el-date-picker v-model="ruleForm.timeRange"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd"
                          :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelReTest('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitReTest('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskByParticipantPower, getTaskByCreatorPower, getFinishedTaskPower, getAllTaskPower, getTaskStatisticInfoPower, updateTaskProgressPower, getTaskAllParticipantStatusPower, stopTaskPower, getAssignableCasePower, getAssignedCaseByUserPower, addTaskUserCaseRelationPower, getAssigneeByTaskPower, deleteTask, repeatTask } from '../../api/api'
export default {
  props: {
    'tabName': {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // notShow: false,
      allCaseData: [],
      tableData: [],
      taskName: '',
      creator: '',
      searchTime: '',
      startNum: 1,
      range: 10,
      total: 0,
      seeTestPeopleData: [],
      seeMoreUser: false,
      goingMouseenterContent: '',
      mouseleave: true,
      seeAllUserStatus: false,
      gridData: [],
      outerVisible: false,
      innerVisible: false,
      assignData: [],
      haveBindCase: [],
      tempTaskId: '',
      selectionArr: [],
      selectionDataArr: [],
      multipleSelection: [],
      tempAccountName: '',
      showChildren: false,
      expandArr: ['1230000010'],
      dialogReTest: false,
      ruleForm: {
        timeRange: []
      },
      rules: {
        timeRange: [
          { type: 'array', required: true, message: '请选择日期', trigger: 'change' },
          { required: true, message: '请选择日期', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      reTestMissionData: {}
    }
  },
  methods: {
    // 点击报告操作按钮
    jumpToMissionReport (rowData) {
      this.$router.push({
        path: '/missionReport',
        query: {
          taskId: rowData.taskId,
          taskName: rowData.taskName,
          round: rowData.round
        }
      })
    },
    // 点击复测弹窗的X关闭弹窗
    reTestClose () {
      this.dialogReTest = false
      this.$refs.ruleForm.resetFields()
    },
    // 点击复测弹框的取消
    cancelReTest (formName) {
      this.dialogReTest = false
      this.$refs[formName].resetFields()
    },
    // 点击复测弹框的确定
    submitReTest (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm.timeRange)
          repeatTask({
            taskId: this.reTestMissionData.taskId,
            startDate: this.ruleForm.timeRange[0],
            endDate: this.ruleForm.timeRange[0]
          }).then(res => {
            if (res.state === 1000) {
              this.dialogReTest = false
              this.$refs.ruleForm.resetFields()
              setTimeout(() => {
                this.discriminate()
              })
            }
          })
          // alert('submit!')
        } else {
          return false
        }
      })
    },
    // 点击复测按钮
    reTest (rowData) {
      console.log(rowData)
      this.reTestMissionData = rowData
      this.dialogReTest = true
    },
    deleteTask (rowData) {
      console.log(rowData)
      this.$confirm('确定要删除任务？', '重要操作警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTask({
          taskId: rowData.taskId
        }).then(res => {
          if (res.state === 1000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            setTimeout(() => {
              this.discriminate()
            }, 500)
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.errorAjax()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // deleteTask({
      //   taskId: rowData.taskId
      // }).then(res => {
      //   if (res.state === 1000) {
      //     setTimeout(() => {
      //       this.discriminate()
      //     }, 500)
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // }, rej => {
      //   this.$message.error('网络错误，请稍后再试！')
      // })
    },
    expandRow (row, expanded) {
      console.log(row)
      console.log(expanded)
    },
    closeDialogBindCase (action) {
      if (action === 'close') {
        this.innerVisible = false
      } else {
        let caseIDArr = this.haveBindCase.map(ele => ele.caseId).join(',')
        addTaskUserCaseRelationPower({
          taskId: this.tempTaskId,
          accountName: this.tempAccountName,
          caseId: caseIDArr
        }).then(res => {
          if (res.state === 1000) {
            getAssigneeByTaskPower(
              {
                taskId: this.tempTaskId
              }
            ).then(res => {
              if (res.state === 1000) {
                this.assignData = res.data.taskData
                this.outerVisible = true
              } else {
                this.$message.error(res.message)
              }
            }, rej => {
              this.$message.error('网络错误')
            })
            this.innerVisible = false
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
      }
      this.$nextTick(() => {
        this.showChildren = false
      })
    },
    deleteBindCase (index) {
      this.haveBindCase.splice(index, 1)
    },
    selectable (row, index) {
      if (this.haveBindCase.some(ele => { return ele.id === row.id })) {
        return false
      } else {
        return true
      }
    },
    addCase () {
      if (this.multipleSelection.length > 0) {
        let idArr = this.haveBindCase.map(ele => ele.id)
        let addArr = []
        let canAddCase = []
        this.multipleSelection.map(ele => {
          if (ele.nodeType === 5) {
            canAddCase.push(ele)
          }
        })
        canAddCase.map(ele => {
          if (idArr.indexOf(ele.id) === -1) {
            addArr.push(ele)
          }
        })
        this.haveBindCase = [...this.haveBindCase, ...addArr]
      }
      this.multipleSelection = []
    },
    selectCheckbox (selection, row) {
      console.log(selection)
      this.multipleSelection = selection
      this.selectionDataArr = selection
      if (this.selectionArr.length === 0) {
        this.addIdToSelectionArr(row)
      } else {
        let index = this.selectionArr.indexOf(row.id)
        if (index > -1) {
          this.deleteFromSelectionArr(row, index)
        } else {
          this.addIdToSelectionArr(row)
        }
      }
    },
    // 添加选中的拥有子元素的元素的id
    addIdToSelectionArr (row) {
      this.selectionArr.push(row.id)
      this.$refs.multipleTable.toggleRowSelection(row, true)
      if (row.children) {
        this.pushId(row)
      }
    },
    // 添加选中的拥有子元素的元素的所有拥有子元素的子元素
    pushId (row) {
      row.children.forEach(ele => {
        this.$refs.multipleTable.toggleRowSelection(ele, true)
      })
    },
    deleteFromSelectionArr (row, index) {
      this.selectionArr.splice(index, 1)
      this.$refs.multipleTable.toggleRowSelection(row, false)
      if (row.children) {
        this.deleteId(row)
      }
    },
    deleteId (row) {
      row.children.forEach(ele => {
        this.$refs.multipleTable.toggleRowSelection(ele, false)
      })
    },
    // recursionData (data) {
    //   let filterArr = []
    //   data.map(ele => {
    //     if (ele.children.length > 0) {
    //       if (ele.children.every(ele => ele.children.length > 0)) {
    //         filterArr.push(ele)
    //       }
    //     }
    //   })
    //   this.allCaseData = filterArr
    // },
    // 选择用例界面，内层弹窗
    openInner (rowData) {
      // console.log(this.showChildren)
      this.expandArr = []
      // console.log(this.expandArr)
      this.tempAccountName = rowData.accountName
      getAssignableCasePower({
        accountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
        taskId: this.tempTaskId
      }).then(res => {
        if (res.state === 1000) {
          this.allCaseData = res.data.frontTotalData
          // console.log(11111)
          // let firstData = res.data.frontTotalData
          // console.log(res.data)
          // this.recursionData(firstData)
        } else {
          // console.log(222222)
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络问题')
      })
      getAssignedCaseByUserPower({
        taskId: this.tempTaskId,
        accountName: rowData.accountName
      }).then(res => {
        if (res.state === 1000) {
          this.haveBindCase = res.data.assignedCases
        } else {
          this.$message.error(res.message)
        }
      }, rej => {
        this.$message.error('网络问题')
      })
      this.innerVisible = true
    },
    // 分配
    assign (rowData) {
      // console.log(rowData)
      // console.log(this.tabName)
      window.sessionStorage.setItem('taskId', JSON.parse(JSON.stringify(rowData.taskId)))
      this.$router.push({
        path: '/missionSelectCase',
        query: {
          from: this.tabName,
          taskId: rowData.taskId
        }
      })
      // this.tempTaskId = rowData.taskId
      // getAssigneeByTaskPower(
      //   {
      //     taskId: rowData.taskId
      //   }
      // ).then(res => {
      //   if (res.state === 1000) {
      //     this.assignData = res.data.taskData
      //     this.outerVisible = true
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // }, rej => {
      //   this.$message.error('网络错误')
      // })
    },
    // 任务执行
    jumpToexecuteMission (rowData) {
      this.$router.push({
        path: '/excuteMission',
        query: {
          taskId: rowData.taskId,
          taskName: rowData.taskName
        }
      })
    },
    // 编辑任务
    editMission (rowData) {
      this.$router.push({
        path: '/createmission',
        query: {
          from: this.tabName,
          action: '1',
          taskName: rowData.taskName,
          taskDesc: rowData.taskDesc,
          startTime: rowData.startTime,
          endTime: rowData.endTime,
          versionName: rowData.belongVersion,
          versionId: rowData.versionId,
          projectName: rowData.belongProject,
          projectId: rowData.projectId,
          id: rowData.taskId,
          productName: rowData.productName
        }
      })
    },
    // 终止
    stopStatus (rowData) {
      this.$confirm('此操作将终止该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stopTaskPower({taskId: rowData.taskId})
          .then(res => {
            if (res.state === 1000) {
              setTimeout(() => {
                this.discriminate()
              }, 500)
            } else {
              this.$message.error(res.message)
            }
          }, rej => {
            this.$message.error('网络错误')
          })
      }).catch(() => {
      })
    },
    seeTestPeopleStatus (rowData) {
      getTaskAllParticipantStatusPower({taskId: rowData.taskId})
        .then(res => {
          if (res.state === 1000) {
            let tempData = res.data.participantStatus
            this.gridData = tempData.map(ele => {
              return {
                accountName: ele.realName + '(' + ele.accountName + ')',
                status: ele.status,
                delayDays: ele.delayDays,
                color: ele.color
              }
            })
            this.seeAllUserStatus = true
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
    },
    // 进行中鼠标悬停
    goingMouseenter (event) {
      event.target.style.cursor = 'pointer'
      this.goingMouseenterContent = event.target.innerHTML
      event.target.innerHTML = '完成'
      event.target.style.color = '#409EFF'
    },
    // 进行中鼠标移出
    goingMouseleave (event) {
      if (this.mouseleave) {
        event.target.innerHTML = this.goingMouseenterContent
        this.goingMouseenterContent = ''
        event.target.style.color = ''
        event.target.style.cursor = ''
      }
    },
    // 进行中鼠标悬停点击
    goingClick (rowData, event) {
      this.mouseleave = false
      updateTaskProgressPower({
        taskId: rowData.taskId,
        accountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
        status: 1,
        delayDays: ''
      }).then(res => {
        if (res.state === 1000) {
          this.$nextTick(() => {
            this.discriminate()
          })
          this.mouseleave = true
        } else {
          this.$message.error(res.message)
          this.mouseleave = true
        }
      }, rej => {
        this.$message.error('网络错误')
        this.mouseleave = true
      })
    },
    delayMouseenter (event) {
      event.target.style.cursor = 'pointer'
      this.goingMouseenterContent = event.target.innerHTML
      event.target.innerHTML = '完成'
      event.target.style.color = '#409EFF'
    },
    delayMouseleave (event) {
      if (this.mouseleave) {
        event.target.innerHTML = this.goingMouseenterContent
        this.goingMouseenterContent = ''
        event.target.style.color = 'red'
        event.target.style.cursor = ''
      }
    },
    delayClick (rowData, event) {
      this.mouseleave = false
      updateTaskProgressPower({
        taskId: rowData.taskId,
        accountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
        status: 2,
        delayDays: rowData.delayDays
      }).then(res => {
        if (res.state === 1000) {
          this.tableData = []
          this.$nextTick(() => {
            this.discriminate()
          })
          this.mouseleave = true
        } else {
          this.$message.error(res.message)
          this.mouseleave = true
        }
      }, rej => {
        this.$message.error('网络错误')
        this.mouseleave = true
      })
    },
    discriminate () {
      if (this.searchTime === '') {
        this.searchTime = ['', '']
      }
      if (this.searchTime === null) {
        this.searchTime = ['', '']
      }
      if (this.tabName === 'join') {
        this.initDataJoin({
          accountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
          taskName: this.taskName,
          creator: this.creator,
          startTime: this.searchTime[0],
          endTime: this.searchTime[1],
          startNumber: this.startNum,
          range: this.range
        })
      }
      if (this.tabName === 'create') {
        this.initDataCreate({
          accountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
          taskName: this.taskName,
          startTime: this.searchTime[0],
          endTime: this.searchTime[1],
          startNumber: this.startNum,
          range: this.range
        })
      }
      if (this.tabName === 'finish') {
        this.initDataFinished({
          accountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
          taskName: this.taskName,
          creator: this.creator,
          startTime: this.searchTime[0],
          endTime: this.searchTime[1],
          startNumber: this.startNum,
          range: this.range
        })
      }
      if (this.tabName === 'all') {
        this.initDataAll({
          accountName: localStorage.getItem('accountName') || sessionStorage.getItem('accountName'),
          taskName: this.taskName,
          creator: this.creator,
          startTime: this.searchTime[0],
          endTime: this.searchTime[1],
          startNumber: this.startNum,
          range: this.range
        })
      }
    },
    search () {
      this.startNum = 1
      this.discriminate()
    },
    createMission () {
      this.$router.push({
        path: '/createMission',
        query: {
          from: this.tabName,
          action: '0'
        }
      })
    },
    getTime (val) {
      if (val === null) {
        this.searchTime = ''
      } else {
        if (Date.parse(val[1]) - Date.parse(val[0]) > 3600 * 1000 * 24 * 90) {
          this.$message.error('时间范围不能超过三个月！')
          this.searchTime = ''
        } else {
          this.searchTime = val
        }
      }
    },
    // 查看统计信息
    seeStatisticalMessage (rowData) {
      let data = {
        taskId: rowData.taskId
      }
      getTaskStatisticInfoPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.seeTestPeopleData = res.data.caseExecutionStatistic
            this.seeMoreUser = true
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
    },
    editVersion (rowData) {
      this.$router.push({
        path: '/createVersion',
        query: {
          from: this.tabName,
          action: '1',
          projectName: this.$route.query.projectName,
          projectId: this.$route.query.projectId,
          versionId: rowData.versionId,
          versionName: rowData.versionName,
          versionDesc: rowData.versionDesc,
          startTime: rowData.startTime,
          endTime: rowData.endTime
        }
      })
    },
    rangeChange (range) {
      this.range = range
      this.discriminate()
    },
    startNumChange (count) {
      this.startNum = count
      this.discriminate()
    },
    initDataJoin (data) {
      getTaskByParticipantPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.taskData
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
    },
    initDataCreate (data) {
      getTaskByCreatorPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.taskData
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
    },
    initDataFinished (data) {
      getFinishedTaskPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.taskData
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
    },
    initDataAll (data) {
      getAllTaskPower(data)
        .then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.taskData
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }, rej => {
          this.$message.error('网络错误')
        })
    }
  },
  created () {
    let refreshTime = (23 - new Date().getHours()) * 60 * 60 + (59 - new Date().getMinutes()) * 60 + 59 - new Date().getSeconds()
    let _this = this
    setTimeout(() => {
      _this.discriminate()
    }, refreshTime)
    this.discriminate()
  }
}
</script>

<style scoped>
.joinVersionApp {
  width: 100%
}
.joinVersionApp > .search {
  width: 100%;
  position: relative
}
.joinVersionApp > .search > .el-input {
  width: 150px;
  margin-right: 20px
}
.joinVersionApp > .search > .block {
  display: inline-block;
  margin-right: 20px
}
.joinVersionApp > .search > .el-button:nth-last-of-type(2) {
  position: absolute;
  right: 118px
}
.joinVersionApp > .search > .el-button:nth-last-of-type(1) {
  position: absolute;
  right: 0px
}
.joinVersionApp > .el-table {
  margin-top: 10px
}
/* 标题 */
.joinVersionApp > .el-table > .el-table__header-wrapper > .el-table__header > .has-gutter > tr > th {
  padding: 8.5px 0px
}
.joinVersionApp > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
  padding: 8px 0px
}
.joinVersionApp > .el-pagination {
  margin-top: 10px
}
.joinVersionApp > .seeTestPeople > .el-dialog > .el-dialog__body > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th {
  padding: 8.5px 0px
}
.joinVersionApp > .seeTestPeople > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper {
  min-height: 50px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden
}
.joinVersionApp > .seeTestPeople > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
  padding: 13px 0px
}
.joinVersionApp > .allUserStatus > .el-dialog > .el-dialog__body > .el-table > .el-table__header-wrapper > .el-table__header {
  width: 100%;
}
.joinVersionApp > .allUserStatus > .el-dialog > .el-dialog__body > .el-table > .el-table__header-wrapper > .el-table__header > .has-gutter > tr > th{
  width: 50%
}
.joinVersionApp > .allUserStatus > .el-dialog > .el-dialog__body > .el-table > .el-table__body-wrapper{
  min-height: 40px;
  max-height: 200px;
  overflow-y: auto
}
.bindCase > .el-dialog {
  width: 1100px;
  height: 700px
}
.bindCase > .el-dialog > .el-dialog__body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 500px;
}
.bindCase > .el-dialog > .el-dialog__body > .left {
  width: 400px;
  float: left;
  margin-left: 30px
}
.bindCase > .el-dialog > .el-dialog__body > .left > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.bindCase > .el-dialog > .el-dialog__body > .left > .el-table {
  width: 298px;
  height: 448px;
  /* border: 1px solid #DCDFE6; */
  overflow-y: auto;
  overflow-x: hidden
}
.bindCase > .el-dialog > .el-dialog__body > .middle {
  width: 80px;
  float: left;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px
}
.bindCase > .el-dialog > .el-dialog__body > .middle > .el-button {
  width: 80px;
}
.bindCase > .el-dialog > .el-dialog__body > .right {
  width: 450px;
  float: left;
  height: 500px;
  margin-left: 50px
}
.bindCase > .el-dialog > .el-dialog__body > .right > h2 {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #ccc;
}
.bindCase > .el-dialog > .el-dialog__body > .right > .table{
  width: 448px;
  height: 450px;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6
}
.bindCase > .el-dialog > .el-dialog__body > .right > .table > .el-table {
  width: 448px;
}
.bindCase > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th{
  border-right: 1px solid #DCDFE6
}
.bindCase > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:nth-last-of-type(1){
  border-right-width: 0px
}
.bindCase > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper {
  height: 402px;
  overflow-y: auto
}
.bindCase > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td {
  border-right: 1px solid #DCDFE6;
  height: 40px;
  padding: 3px 0
}
.bindCase > .el-dialog > .el-dialog__footer {
  margin-top: 20px
}
.bindCase > .el-dialog > .el-dialog__footer > .dialog-footer > .el-button--primary {
  margin-right: 20px
}
.bindCase > .el-dialog > .el-dialog__body > .left > .el-table > .el-table__header-wrapper > .el-table__header .el-checkbox__inner {
  display: none
}
.joinVersionApp .table-expand {
  font-size: 0;
}
.joinVersionApp .table-expand label {
  width: 180px;
  color: #99a9bf;
  margin-left: 55px
}
.joinVersionApp .table-expand .el-form-item {
  margin-right: 0px;
  margin-bottom: 0px;
  width: 50%
}
.el-dropdown{
  font-size: 24px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-dropdown-menu{
  width: 80px;
}
.el-table td{
  padding:13px 0;
}
</style>
