const getters = {
  sidebarLayoutSkin: state => state.common.sidebarLayoutSkin,
  documentClientHeight: state => state.common.documentClientHeight,
  navbarLayoutType: state => state.common.navbarLayoutType,
  sidebarFold: state => state.common.sidebarFold,
  menuList: state => state.permission.menuList,
  menuActiveName: state => state.permission.menuActiveName,
  mainTabs: state => state.permission.mainTabs,
  mainTabsActiveName: state => state.permission.mainTabsActiveName,
  moduleList: state => state.permission.moduleList,
  moduleActive: state => state.permission.moduleActive,
  dynamicMenuRoutes: state => state.permission.dynamicMenuRoutes,
  userInfo: state => state.user.userInfo
}
export default getters
