import http from '@/utils/httpRequest'
import API from '@/const/api-url'
import router from '@/router/index'
import Vue from 'vue'
import {fnCurrentRouteType, fnAddDynamicMenuRoutes} from '@/utils/webRouter'
import store from '@/store/index'
const _import = require('@/router/import-' + process.env.NODE_ENV)
// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }
]
router.addRoutes(globalRoutes)
router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    if (Vue.cookie.get('token')) {
      http({
        url: http.adornUrl(API.SYS_INFO.USER.USER_INFO),
        method: 'get',
        params: http.adornParams()
      }).then((data) => {
        this.loading = false
        console.log(data)
        store.commit('user/SET_USERINFO', data.user)
      }).then(() => {
        http({
          url: http.adornUrl(API.SYS_INFO.MENU.PERMIT_MODULE),
          method: 'get'
        }).then((data) => {
          const moduleList = data.data
          store.commit('permission/updateModuleList', moduleList)
          store.commit('permission/updateModuleActive', moduleList[0])
        }).then(() => {
          http({
            url: http.adornUrl(API.SYS_INFO.MENU.MODULE_PERMIT_MENU),
            method: 'get',
            params: http.adornParams({moduleCode: store.getters.moduleActive})
          }).then(({data}) => {
            fnAddDynamicMenuRoutes(data.menuList)
            router.options.isAddDynamicMenuRoutes = true
            store.commit('permission/updateMenuList', data.menuList)
            sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
            next({ ...to, replace: true })
          }).catch((e) => {
            console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
            router.push({ name: 'login' })
          })
        })
      })
    } else {
      router.push({ name: 'login' })
    }
  }
})
