export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'default',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: false
  },
  mutations: {
    // 自动更新主体窗口高度
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    updateNavbarLayoutType (state, type) {
      state.navbarLayoutType = type
    },
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    updateSidebarLayoutSkin (state, skin) {
      state.sidebarLayoutSkin = skin
    },
    // 侧边栏, 折叠状态（true, 展开 ， false关闭）
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    }
  }
}
