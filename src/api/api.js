import { post, postObj, get, put, postFormData } from '../util/http.js'
// 免登录鉴权
export const noLoginAuthPower = p => post('open/user/noLoginAuth.action', p)
// 登录
export const loginPower = p => post('open/user/login.action', p)
// 获取所有菜单栏
export const getAllMenusPower = p => post('open/user/getAllMenus.action')
// 用户管理-用户列表(包含查询)
export const getUserPower = p => post('open/user/getUser.action', p)
// 用户管理-用户列表-编辑&禁用账号
export const updateUserPower = p => post('open/user/updateUser.action', p)
// 用户管理-用户列表-角色(左侧)
export const getRoleListPower = p => post('open/user/getRoleList.action', p)
// 用户管理-用户列表-角色(右侧)已绑定
export const getUserRoleRelationPower = p => post('open/user/getUserRoleRelation.action', p)
// 用户管理-用户列表-角色(右侧)更新
export const updateUserRoleRelationPower = p => post('open/user/updateUserRoleRelation.action', p)
// 用户管理-用户列表-用户组(左侧)
export const getGroupListPower = p => post('open/user/getGroupList.action', p)
// 用户管理-用户列表-用户组(右侧)已绑定
export const getUserGroupRelationPower = p => post('open/user/getUserGroupRelation.action', p)
// 用户管理-用户列表-用户组更新
export const updateUserGroupRelationPower = p => post('open/user/updateUserGroupRelation.action', p)
// 用户管理-用户组列表
export const getGroupPower = p => post('open/user/getGroup.action', p)
// 用户管理-用户组管理编辑
export const updateGroupPower = p => post('open/user/updateGroup.action', p)
// 新增用户组
export const addGroupPower = p => post('open/user/addGroup.action', p)
// 删除用户组
export const deleteGroupPower = p => post('open/user/deleteGroup.action', p)
// 用户管理-用户组管理-用户
export const getUserListPower = p => post('open/user/getUserList.action', p)
// 用户管理-用户组管理-用户(右侧)
export const getGroupUserRelationPower = p => post('open/user/getGroupUserRelation.action', p)
// 用户管理-用户组管理-用户-更新
export const updateGroupUserRelationPower = p => post('open/user/updateGroupUserRelation.action', p)
// 用户管理-用户组-角色(左侧)
export const getGroupRoleListPower = p => post('open/user/getGroupRoleList.action', p)
// 用户管理-用户组-角色(右侧)
export const getGroupRoleRelationPower = p => post('open/user/getGroupRoleRelation.action', p)
// 用户管理-用户组-角色-更新
export const updateGroupRoleRelationPower = p => post('open/user/updateGroupRoleRelation.action', p)
// 角色管理-角色列表
export const getRolePower = p => post('open/user/getRole.action', p)
// 角色管理-新增角色
export const addRolePower = p => post('open/user/addRole.action', p)
// 角色管理-查看资源
export const getRoleResourceRelationPower = p => post('open/user/getRoleResourceRelation.action', p)
// 角色管理-编辑
export const updateRolePower = p => post('open/user/updateRole.action', p)
// 角色管理-删除
export const deleteRolePower = p => post('open/user/deleteRole.action', p)
// 资源列表
export const getResourceListPower = p => post('open/user/getResourceList.action', p)
// 资源绑定更新
export const updateRoleResourceRelationPower = p => post('open/user/updateRoleResourceRelation.action', p)
// 资源管理列表
export const getPowerPower = p => post('open/user/getPower.action', p)
// 新增资源
export const addPower = p => post('open/user/addPower.action', p)
// 编辑更新资源
export const updatePower = p => post('open/user/updatePower.action', p)
// 编辑更新资源
export const deletePower = p => post('open/user/deletePower.action', p)
// 角色管理复制
export const copyRolePower = p => post('open/user/copyRole.action', p)
// 分页的用户权限
export const getAllPowerByUserPower = p => post('open/user/getAllPowerByUser.action', p)
// 展示参与者的用例集信息
export const getCaseSuiteByParticipantPower = p => post('open/case/getCaseSuiteByParticipant.action', p)
// 展示创建者的用例集信息
export const getCaseSuiteByCreatorPower = p => post('open/case/getCaseSuiteByCreator.action', p)
// 从服务器获取当前时间
export const getCurrentTimePower = p => post('open/case/getCurrentTime.action')
// 更新用户的用例集状态
export const updateSuiteStatusByUserPower = p => post('open/case/updateSuiteStatusByUser.action', p)
// 新建用例集
export const addCaseSuitePower = p => post('open/case/addCaseSuite.action', p)
// 获取用例集标签
export const getLabelsUsedByCaseSuitePower = p => post('open/case/getLabelsUsedByCaseSuite.action', p)
// 更新用例集标签
export const updateCaseSuiteLabelPower = p => post('open/case/updateCaseSuiteLabel.action', p)
// 新增(创建)用例集人员信息
export const updateCaseSuiteUserPower = p => post('open/case/updateCaseSuiteUser.action', p)
// 删除用例集
export const deleteCaseSuitePower = p => post('open/case/deleteCaseSuite.action', p)
// 获取所有标签
export const getLabelPower = p => post('open/label/getLabel.action', p)
// 获取用例集的成员信息
export const getCaseSuiteUserPower = p => post('open/case/getCaseSuiteUser.action', p)
// 获取用例集的所有参与者的完成状态
export const getParticipantStatusBySuiteIdPower = p => post('open/case/getParticipantStatusBySuiteId.action', p)
// 编辑用例集
export const editCaseSuitePower = p => post('open/case/editCaseSuite.action', p)
// 获取用户的用例集状态
// export const getSuiteStatusByUserPower = p => post('open/case/getSuiteStatusByUser.action', p)
// 获取用例的标签
export const getCaseLableByKeyWord = p => post('open/label/getCaseLabel.action', p)
// 获取用例的使用阶段
export const getCaseStage = p => post('open/label/getStageLabel.action', p)
// 跳转到用例库获取回归库与版本库信息
export const getNodeTreeByCaseSuitePower = p => post('open/case/getNodeTreeByCaseSuite.action', p)
// 点击树形图获取当前点击元素的子元素
export const getNodeTreeByModulePower = p => post('open/case/getNodeTreeByModule.action', p)
// 获取树形图全量元素
export const getFullNodeTreePower = p => post('open/case/getFullNodeTree.action', p)
// 获取版本历史信息
export const getLibraryHistroryRecordPower = p => post('open/case/getLibraryHistroryRecord.action', p)
// 新增模块
export const addModule = p => post('open/case/addModuleNode.action', p)
// 获取模块详情
export const getModuleDetail = p => post('open/case/getModuleNodeDetailInfo.action', p)
// 更新模块
export const updateModule = p => post('open/case/updateModuleNode.action', p)
// 新增用例
export const addCase = p => post('open/case/addCaseNode.action', p)
// 更新用例
export const updateCase = p => post('open/case/updateCaseNode.action', p)
// 获取用例详情
export const getCaseDetail = p => post('open/case/getCaseNodeDetailInfo.action', p)
// 删除模块
export const deleteModuleNodePower = p => post('open/case/deleteModuleNode.action', p)
// 删除用例
export const deleteCaseNodePower = p => post('open/case/deleteCaseNode.action', p)
// 合并到回归库
export const mergeCaseNodePower = p => post('open/case/mergeCaseNode.action', p)
// 撤销合并
export const cancelCaseMergeNodePower = p => post('open/case/cancelCaseMergeNode.action', p)
// 获取版本列表(参与者)
export const getVersionByParticipantPower = p => post('open/version/getVersionByParticipant.action', p)
// 获取版本列表(创建者)
export const getVersionByCreatorPower = p => post('open/version/getVersionByCreator.action', p)
// 获取所有版本
export const getAllVersionPower = p => post('open/version/getAllVersion.action', p)
// 获取版本测试人员(MySQL)
export const getVersionParticipantPower = p => post('open/version/getVersionParticipant.action', p)
// 获取版本测试人员(Redis)
export const getVersionParticipantInBufferPower = p => post('open/version/getVersionParticipantInBuffer.action', p)
// 更新版本测试人员(Redis)
export const updateVersionParticipantInBufferPower = p => post('open/version/updateVersionParticipantInBuffer.action', p)
// 创建版本
export const addVersionPower = p => post('open/version/addVersion.action', p)
// 更新版本
export const updateVersionPower = p => post('open/version/updateVersion.action', p)
// 获取任务列表(参与者)
export const getTaskByParticipantPower = p => post('open/task/getTaskByParticipant.action', p)
// 获取任务列表(创建者)
export const getTaskByCreatorPower = p => post('open/task/getTaskByCreator.action', p)
// 获取已完成的任务列表
export const getFinishedTaskPower = p => post('open/task/getFinishedTask.action', p)
// 获取所有任务列表
export const getAllTaskPower = p => post('open/task/getAllTask.action', p)
// 获取任务的统计信息
export const getTaskStatisticInfoPower = p => post('open/task/getTaskStatisticInfo.action', p)
// 更新任务状态
export const updateTaskProgressPower = p => post('open/task/updateTaskProgress.action', p)
// 查看某个任务下所有参与者的任务状态
export const getTaskAllParticipantStatusPower = p => post('open/task/getTaskAllParticipantStatus.action', p)
// 获取任务测试人员(redis)
export const getTaskUserRelationInBufferPower = p => post('open/task/getTaskUserRelationInBuffer.action', p)
// 任务点击分配的弹窗获取测试人员信息
export const getAssigneeByTaskPower = p => post('open/task/getAssigneeByTask.action', p)
// 新增任务测试人员(redis)
export const addTaskUserRelationInBufferPower = p => post('open/task/addTaskUserRelationInBuffer.action', p)
// 获取项目下的所有的版本
export const getVersionByProjectPower = p => post('open/version/getVersionByProject.action', p)
// 新增任务
export const addTaskPower = p => post('open/task/addTask.action', p)
// 更新任务
export const updateTaskPower = p => post('open/task/updateTask.action', p)
// 终止任务
export const stopTaskPower = p => post('open/task/stopTask.action', p)
// 获取用例集待执行列表
export const getCaseToExecutePower = p => post('open/task/getCaseToExecute.action', p)
// 获取用例集已执行列表
export const getCaseExecutedPower = p => post('open/task/getCaseExecuted.action', p)
// 更新用例的测试结果
export const updateCaseResultPower = p => postFormData('open/task/updateCaseResult.action', p)
// 查看用例历史记录
export const getCaseExecuteResultHistoryPower = p => post('open/task/getCaseExecuteResultHistory.action', p)
// 获任务的测试人员信息
export const getUserByTaskPower = p => post('open/task/getUserByTask.action', p)
// 获取可以分配的测试用例
export const getAssignableCasePower = p => post('open/task/getAssignableCase.action', p)
// 获取已经分配给某个用户的用例集
export const getAssignedCaseByUserPower = p => post('open/task/getAssignedCaseByUser.action', p)
// 更新用户分配的用例
export const addTaskUserCaseRelationPower = p => post('open/task/addTaskUserCaseRelation.action', p)
// 获取我参与的项目
export const getProjectByParticipant = p => post('open/project/getProjectByParticipant.action', p)
// 获取我创建的项目
export const getProjectByCreator = p => post('open/project/getProjectByCreator.action', p)
// 获取项目成员
export const getProjectMembers = p => post('open/project/getPorjectParticipanet.action', p)
// 获取所有项目
export const getAllProject = p => post('open/project/getAllProject.action', p)
// 获取所有的项目阶段
export const getAllProjectStage = p => post('open/project/getAllProjectStage.action', p)
// 新增项目阶段（redis操作）
export const updateProjectStageNode = p => post('open/project/updateProjectStageNode.action', p)
// 获取已绑定人员数据（redis操作)
export const getPorjectParticipant = p => post('open/project/getPorjectParticipant.action', p)
// 更新项目参与人员数据（redis操作）
export const updatePorjectParticipant = p => post('open/project/updatePorjectParticipant.action', p)
// 创建项目
export const addProject = p => post('open/project/addProject.action', p)
// 更新项目
export const updateProject = p => post('open/project/updateProject.action', p)
// 获取项目的IPD阶段
export const getProjectStageInfo = p => post('open/project/getProjectStageInfo.action', p)
// 获取已分配给某个用户的测试用例
export const getAssignedCaseByUser = p => post('open/task/getAssignedCaseByUser.action', p)
// 删除分配给某人的用例
export const deleteTaskUserCaseRelationOP = p => post('open/task/deleteTaskUserCaseRelationOP.action', p)
// 获取我创建的和我参与的用例列表
export const getMysuite = p => post('open/task/getMysuite.action', p)
// 获取可以分配的用例
export const getAssignableCase = p => post('open/task/getAssignableCase.action', p)
// 给某人新增用例
export const insertTaskUserCaseRelationOP = p => post('open/task/insertTaskUserCaseRelationOP.action', p)
// 获取人员按部门和负载分类的人力资源信息
export const getStaffLoadByOrginzation = p => post('open/hr/getStaffLoadByOrganization.action', p)
// 获取人员按项目和负载分类的人力资源信息
export const getStaffLoadByProject = p => post('open/hr/getStaffLoadByProject.action', p)
// 获取某人的历史负载记录
export const getStaffHistoryLoad = p => post('open/hr/getStaffHistoryLoad.action', p)
// 获取项目下的人力信息
export const getManPowerInProject = p => post('open/project/viewCurrentResource.action', p)
// 获取项目下的期望人力信息
export const getExpectManPowerInProject = p => post('open/project/viewExpectResource.action', p)
// 项目人力管理-当前资源-编辑人力值
export const updateManPowerInProject = p => post('open/project/updateHumanResoure.action', p)
// 更新项目员工期望人力
export const updateExpectManPowerInProject = p => post('open/project/updateUserExpectHR.action', p)
// 新增项目当前人力
export const addManPowerWithProject = p => post('open/project/addHumanResoure.action', p)
// 删除项目当前人力
export const deleteManPowerWithProject = p => post('open/project/deleteHumanResoure.action', p)
// 获取人员负载信息
export const queryStaffLoad = p => post('open/hr/queryStaffLoad.action', p)
// 获取某人的历史负载记录
export const queryStaffHistoryLoad = p => post('open/hr/queryStaffHistoryLoad.action', p)
// 获取项目管理的报表
export const getProjectReport = p => post('open/project/getProjectReport.action', p)
// 获取图表的周数
export const getReportWeekNumber = p => post('open/resource/getReportWeekNumber.action', p)
// 获取资源管理的报表
export const getHRReport = p => post('open/hr/getHRReport.action', p)
// 获取人员报表(项目)
export const getEmployeeReportByProject = p => post('open/resource/getEmployeeReportByProject.action', p)
// 获取人员报表(部门)
export const getEmployeeReportByDepartment = p => post('open/resource/getEmployeeReportByDepartment.action', p)
// 获取人员报表(地区)
export const getEmployeeReportByArea = p => post('open/resource/getEmployeeReportByArea.action', p)
// 按部门获取正式人员信息
export const getRegularEmployeeByDepartment = p => post('open/resource/getRegularEmployeeByDepartment.action', p)
// 按部门获取合作方人员信息
export const getVendorEmployeeByDepartment = p => post('open/resource/getVendorEmployeeByDepartment.action', p)
// 按部门获取实习人员信息
export const getInternEmployeeByDepartment = p => post('open/resource/getInternEmployeeByDepartment.action', p)
// 按项目获取正式人员信息
export const getRegularEmployeeByProject = p => post('open/resource/getRegularEmployeeByProject.action', p)
// 按项目获取合作方人员信息
export const getVendorEmployeeByProject = p => post('open/resource/getVendorEmployeeByProject.action', p)
// 按项目获取实习人员信息
export const getInternEmployeeByProject = p => post('open/resource/getInternEmployeeByProject.action', p)
// 按地区获取正式人员信息
export const getRegularEmployeeByArea = p => post('open/resource/getRegularEmployeeByArea.action', p)
// 按地区获取合作方人员信息
export const getVendorEmployeeByArea = p => post('open/resource/getVendorEmployeeByArea.action', p)
// 按地区获取实习人员信息
export const getInternEmployeeByArea = p => post('open/resource/getInternEmployeeByArea.action', p)
// 提交人员的入职/离职时间
export const submitEmployJobTime = p => post('open/resource/setEntryAndDimissionTime.action', p)
// 查询可选择用户列表
export const searchAndGetUsers = p => post('open/user/searchAndGetUsers.action', p)
// 项目是否需要参与统计
export const needStatistic = p => post('open/project/needStatistic.action', p)
//  资源管理-获得所有的项目名称
export const getProjectList = p => post('open/project/getProjectList.action', p)
//  资源管理-获得当前选择的所有项目
export const getSelectedProjects = p => post('open/project/getSelectedProjects.action', p)
//  资源管理-更新选择的项目
export const updateSelectedProjects = p => post('open/project/updateSelectedProjects.action', p)
//  获取所有人力资源数据(对应 所有人员 Tab页)
export const getAllStaffLoad = p => post('open/hrmanager/getStaffLoad.action', p)
//  获取所有的部门信息
export const getAllDepartment = p => post('open/hrmanager/getAllDepartment.action', p)
//  获取所有项目信息
export const getAllProjectList = p => post('open/hrmanager/getAllProject.action', p)
//  获取人力资源数据
export const getAllStaffManagementLoad = p => post('open/hrmanager/getAllStaff.action', p)
// 测试部人员总体分类情况
export const getStaffNumberByType = p => post('open/hrrecord/getStaffNumberByType.action', p)
// 测试部人员数量情况
export const getStaffNumberByDepartment = p => post('open/hrrecord/getStaffNumberByDepartment.action', p)
// 项目人力缺口情况
export const getStaffNumberByProject = p => post('open/hrrecord/getStaffNumberByProject.action', p)
// 获取项目人力投入情况
export const getHrPutInAndExpectByProject = p => post('open/hrrecord/getHrPutInAndExpectByProject.action', p)
// 报表页面获取帮助信息
export const getHelpTips = p => post('open/help/record/getHelpTips.action')
// 项目创建人转移
export const transferCreator = p => post('open/project/transferCreator.action', p)
// 项目人力管理
export const getAllHumanResource = p => post('open/hrmanager/getAllHumanResource.action', p)
// 人力管理汇总数据查询接口
export const gestaffStatistics = p => post('open/hrmanager/gestaffStatistics.action', p)
// 人力管理汇总获取历史记录接口
export const getstaffHistoryList = p => post('open/hrmanager/getstaffHistoryList.action', p)
// 更新人员的地区数据
export const updateStaffArea = p => post('open/hrmanager/updateStaffArea.action', p)
// 更新人员的类型数据
export const updateStaffType = p => post('open/hrmanager/updateStaffType.action', p)
// 所有的测试用例集
export const getAllCaseSuite = p => post('open/case/getAllCaseSuite.action', p)
// 测试接口
// export const testWebSocket = p => post('/open/test/websocketPush.action', p)
// 获取webSocket地址
export const getWebSocketPath = p => post('/open/system/getWebSocketPath.action')
// 按照部门获取人员的参与项目
export const getParticipantProjectDetailByDepartment = p => post('/open/hr/getParticipantProjectDetailByDepartment.action', p)
// 获取用例执行记录
export const getCaseNodeExcuteHistroy = p => post('open/case/getCaseNodeExcuteHistroy.action', p)
// 版本删除
export const deleteVersion = p => post('open/project/deleteVersion.action', p)
// 项目删除
export const deleteProject = p => post('open/project/deleteProject.action', p)
// 工作台展示的动态信息
export const getWorkPadNews = p => post('open/system/getWorkPadNews.action')
// 获取下载模板的地址
export const getImportTempleteUrl = p => post('open/case/getImportTempleteUrl.action')
// 获取模块或者版本下面的所有用例（前提已经判断过必须都是用例，之后用于批量修改用例）
export const getCaseListsByNodeId = p => post('open/case/getCaseListsByNodeId.action', p)
// 批量修改用例
export const batchUpdateCase = p => postObj('open/case/batchUpdateCase.action', p)
// 任务删除
export const deleteTask = p => post('open/task/deleteTask.action', p)
// 分配用例，根据项目ID
export const getCaseSuiteByProject = p => post('open/task/getCaseSuiteByProject.action', p)
// 项目下的用例集
export const getCaseSuite = p => post('open/project/getCaseSuite.action', p)
// 项目下的任务
export const getTask = p => post('open/project/getTask.action', p)
// 任务完成或者终止后复测
export const repeatTask = p => post('open/task/repeatTask.action', p)
// 任务报告
export const taskreport = p => post('open/task/taskreport.action', p)
// 项目报告
export const projectReport = p => post('open/project/projectReport.action', p)
// 转移用例集
export const transferCaseSuite = p => post('open/case/transferCaseSuite.action', p)
// 获取产品列表
export const getProductList = p => post('open/product/getProductList.action', p)
// 创建产品
export const addProduct = p => post('open/product/addProduct.action', p)
// 更新产品
export const updateProduct = p => post('open/product/updateProduct.action', p)
// 删除产品
export const deleteproduct = p => post('open/product/deleteProduct.action', p)
// 产品下的版本(参与者)
export const getProductVersionByParticipant = p => post('open/product/getProductVersionByParticipant.action', p)
// 产品下的版本(创建者)
export const getProductVersionByCreator = p => post('open/product/getProductVersionByCreator.action', p)
// 产品下的版本(所有)
export const getProductAllVersion = p => post('open/product/getProductAllVersion.action', p)
// 产品下创建版本
export const addVersionOfProduct = p => post('open/product/addVersionOfProduct.action', p)
// 删除产品下的版本
export const deleteVersionOfProduct = p => post('open/product/deleteVersionOfProduct.action', p)
// 编辑产品下的版本
export const updateVersionOfProduct = p => post('open/product/updateVersionOfProduct.action', p)
// 创建任务根据项目查询版本
export const getChildrenItemByProject = p => post('open/task/getChildrenItemByProject.action', p)
// 任务分配的用例
export const getAssignedCaseByUsernew = p => post('open/task/getAssignedCaseByUsernew.action', p)
// 勾选用例或者取消用例向后端发送状态
export const getCaseToDelete = p => post('open/task/getCaseToDelete.action', p)
// 批量删除分配的用例（新）
export const deleteTaskUserCaseRelationOPNew = p => post('open/task/deleteTaskUserCaseRelationOPNew.action', p)
// 一键清空分配的的用例
export const deleteTaskUserCaseRelationAll = p => post('open/task/deleteTaskUserCaseRelationAll.action', p)
// 任务执行明细
export const getAssignedCaseDetailByUser = p => post('open/task/getAssignedCaseDetailByUser.action', p)
// 转移勾选的用例
export const translateTaskUserCaseRelation = p => post('open/task/translateTaskUserCaseRelation.action', p)
// 生成任务报告
export const exportCaseExecutedResultWithExcel = p => post('open/task/exportCaseExecutedResultWithExcel.action', p)
// 人员管理/资源管理生成Excel报告
export const exportEmployeeResourceManage = p => post('open/resource/exportEmployeeResourceManage.action', p)
// 定时将所有人员信息入库
export const setUserReport = p => post('open/resource/setUserReport.action', p)
// 获取在职（待离职）人员信息报告
export const getUserStaticsInfo = p => post('open/resource/getUserStaticsInfo.action', p)
// 生成在职人员（待离职）人员信息Excel报告
export const exportUserResource = p => post('open/resource/exportUserResource.action', p)
// 查看任务执行的结果(根据轮次)
export const getReportCaseExecuteResultHistory = p => post('open/task/getReportCaseExecuteResultHistory.action', p)
// 根据用户信息查询消息页面的消息记录
export const getAllMessage = p => get('open/notice/allMessage.action', p)
// 未读消息转变为已读消息
export const changeMessageStatus = p => put('open/notice/message.action', p)
// 创建用例集右键导出用例
export const getCaseExcelFilePath = p => get('open/case/caseExcelFilePath.action', p)
// 资源池管理-年度项目投入-获取年度项目投入数据
export const getProjectInputDataByYear = p => get('open/hrmanager/projectInputYear.action', p)
// 年度某个具体项目的人员年度投入值
export const getAllPersonInputDataByProject = p => get('open/hrmanager/projectMemberInputYear.action', p)
// 修改了项目的值或者修改项目下的参与人员的值
export const editInputData = p => post('open/hrmanager/editInputRsData.action', p)
// 保存之前修改项目的值或者项目下参与人员的值
export const saveInputData = p => post('open/hrmanager/saveInputRsData.action', p)
// 年度人力明细
export const getStaffInputDataByYear = p => get('open/hrmanager/staffInputYear.action', p)
// 查看年度项目投入历史记录
export const getHistoryInputData = p => get('open/hrmanager/viewhistory.action')
// 恢复到指定的年度项目投入历史记录
export const recoverHistory = p => get('open/hrmanager/recoverHistory.action', p)
// 查看具体的历史记录
export const getTrueHistoryInputData = p => get('open/hrmanager/historyDetail.action', p)
// 历史记录下查询当前项目下绑定的人员的信息
export const getPersonInputDataByHistoryProject = p => get('open/hrmanager/historyMemberDetail.action', p)
// 给当前年度项目投入新增人员
export const addMemberInCurrentProjectByYearInput = p => post('open/hrmanager/updateProjectMemberHr.action', p)
// 启动编辑模式
export const startEditModel = p => post('/open/hrmanager/editModel.action', p)
// 编辑项目每月的规划值或者项目的人力需求值
export const editProjectMonthPlanOrPlanYearTotal = p => post('/open/hrmanager/editProjectPlanTotalData.action', p)
