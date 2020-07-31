import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import('../pages/general-view.vue'),
      meta: {
        requireAuth: false
      }
    }, {
      path: '/login',
      component: () => import('../pages/login-view.vue'),
      meta: {
        requireAuth: false
      }
    }, {
      path: '/worktable',
      component: () => import('../pages/workTable-view.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/controlcenter',
      component: () => import('../pages/control-center.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/usecasesetlist',
      component: () => import('../pages/useCaseManagement/use-case-set-list.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/createusecasemanagment',
      component: () => import('../pages/useCaseManagement/create-use-case-managment.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/usecaselibrary',
      component: () => import('../pages/use-case-library.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/casedetail',
      component: () => import('../components/case-repository/case-detail.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/moduledetail',
      component: () => import('../components/case-repository/module-detail.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/returnrecord',
      component: () => import('../components/case-repository/return-repository-history-record.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/versionrecord',
      component: () => import('../components/case-repository/version-repository-history-record.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/versionManage',
      component: () => import('../pages/projectManage/versionManage.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/projectControl',
      component: () => import('../pages/projectManage/projectControl.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/createProject',
      component: () => import('../pages/projectManage/createProject.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/createVersion',
      component: () => import('../pages/projectManage/createVersion.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/missionManage',
      component: () => import('../pages/missionManage/missionManage.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/projectControl',
      component: () => import('../pages/projectManage/projectControl.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/createMission',
      component: () => import('../pages/missionManage/createMission.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/excuteMission',
      component: () => import('../pages/missionManage/executeMission.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/missionSelectCase',
      component: () => import('../pages/missionManage/missionSelectCase.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/echarts',
      component: () => import('../pages/echarts.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/staffManagement',
      component: () => import('../pages/staffManagement/staff-Management.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/resourseManagement',
      component: () => import('../pages/resourseManagement/resourse-Management'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/projectStatistics',
      component: () => import('../pages/projectManage/project-Statistics'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/resourseStatistics',
      component: () => import('../pages/resourseManagement/resourse-Statistics'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/staffStatistics',
      component: () => import('../pages/staffManagement/staff-Statistics'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/projectManPowerManagement',
      component: () => import('../pages/projectManage/projectMemberManage'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/selectPeople',
      component: () => import('../components/selectPeople.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '*',
      redirect: '/'
    }, {
      path: '/resource-low',
      component: () => import('../components/resource/resource-low.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/regular',
      component: () => import('../components/StaffManage/regular.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/statisticsPicture',
      component: () => import('../pages/statistics-picture.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/dataStatistics',
      component: () => import('../components/data-statistics.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/projectHumanRosourceManagement',
      component: () => import('../pages/projectHumanRosourceManagement/projectHumanRosourceManagement.vue')
    }, {
      path: '/humanPipelineData',
      component: () => import('../pages/humanPipelineData/humanPipelineData.vue')
    }, {
      path: '/departmentResourseDetails',
      component: () => import('../pages/resourseManagement/departmentResourseDetails.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/projectUseCaseManagment',
      component: () => import('../components/useCaseManagement/projectUseCaseManagement.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/projectMission',
      component: () => import('../components/missionManage/projectMission.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/projectReport',
      component: () => import('../components/projectManagement/projectReport.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/missionReport',
      component: () => import('../components/missionManage/missionReport.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/productList',
      component: () => import('../components/productManage/productList.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/productVersion',
      component: () => import('../components/productManage/productVersion.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/productCreateVersion',
      component: () => import('../components/productManage/productCreateVersion.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/historyDataDetails',
      component: () => import('../components/historyDataDetails.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/readMessage',
      component: () => import('../pages/readMessage/readMessage.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/annualProjectInvestment',
      component: () => import('../pages/annualProjectInvestment.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/editHistory',
      component: () => import('../pages/editHistory.vue'),
      meta: {
        requireAuth: true
      }
    }, {
      path: '/roughHistory',
      component: () => import('../components/annualProjectInvestment/roughHistory.vue')
    }
  ]
})
