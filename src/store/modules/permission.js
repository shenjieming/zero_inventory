/**
 * DESC: 用来判断当前用户是否有权限
 */
const permission = {
  namespaced: true,
  state: {
    // 侧边栏, 菜单
    menuList: [],
    menuActiveName: '',
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: '',
    // 模块列表
    moduleList: [],
    // 默认模块
    moduleActive: '',
    // 按钮权限列表
    dynamicMenuRoutes: []
  },
  mutations: {
    // 左侧菜单列表
    updateMenuList (state, list) {
      state.menuList = list
    },
    // 当前默认打开菜单
    updateMenuActiveName (state, name) {
      state.menuActiveName = name
    },
    // 当前页面打开主体窗口list
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    // 当前激活tabs页面
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    },
    // // 追加窗口
    // appendMainTabs (state, tabs) {
    //   state.mainTabs.push(tabs)
    // },
    // 模块列表
    updateModuleList (state, moduleList) {
      state.moduleList = moduleList
    },
    updateModuleActive (state, moduleActive) {
      state.moduleActive = moduleActive.moduleCode
    },
    updateDynamicMenuRoutes (state, dynamicMenuRoutes) {
      state.dynamicMenuRoutes = dynamicMenuRoutes
    }
  }
}
export default permission
