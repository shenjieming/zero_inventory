<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">

    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuActiveName || 'home'"
        :collapse="sidebarFold"
        :collapseTransition="false"
        class="site-sidebar__menu">
        <el-menu-item index="home" @click="$router.push({ name: 'home' })">
          <icon-svg name="shouye" class="site-sidebar__menu-icon"></icon-svg>
          <span slot="title">首页</span>
        </el-menu-item>
        <!--<el-submenu index="demo">-->
          <!--<template slot="title">-->
            <!--<icon-svg name="shoucang" class="site-sidebar__menu-icon"></icon-svg>-->
            <!--<span>demo</span>-->
          <!--</template>-->
          <!--<el-menu-item index="demo-echarts" @click="$router.push({ name: 'demo-echarts' })">-->
            <!--<icon-svg name="tubiao" class="site-sidebar__menu-icon"></icon-svg>-->
            <!--<span slot="title">echarts</span>-->
          <!--</el-menu-item>-->
          <!--<el-menu-item index="demo-ueditor" @click="$router.push({ name: 'demo-ueditor' })">-->
            <!--<icon-svg name="editor" class="site-sidebar__menu-icon"></icon-svg>-->
            <!--<span slot="title">ueditor</span>-->
          <!--</el-menu-item>-->
        <!--</el-submenu>-->
        <sub-menu
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu>
      </el-menu>
    </div>
  </aside>
</template>

<script>
  import SubMenu from './main-sidebar-sub-menu'
  import { isURL } from '@/utils/validate'

  export default {
    data () {
      return {
      }
    },
    components: {
      SubMenu
    },
    computed: {
      // 菜单背景色设置
      sidebarLayoutSkin () {
        return this.$store.state.common.sidebarLayoutSkin
      },
      // 菜单栏是否折叠
      sidebarFold (val) {
        return this.$store.state.common.sidebarFold
      },
      menuList: {
        get () { return this.$store.state.permission.menuList },
        set (val) {
          this.$store.commit('permission/updateMenuList', val)
        }
      },
      menuActiveName: {
        get () { return this.$store.state.permission.menuActiveName },
        set (val) {
          this.$store.commit('permission/updateMenuActiveName', val)
        }
      },
      mainTabs: {
        get () { return this.$store.state.permission.mainTabs },
        set (val) { this.$store.commit('permission/updateMainTabs', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.permission.mainTabsActiveName },
        set (val) { this.$store.commit('permission/updateMainTabsActiveName', val) }
      },
      dynamicMenuRoutes: {
        get () { return this.$store.state.permission.dynamicMenuRoutes },
        set (val) { this.$store.commit('permission/dynamicMenuRoutes', val) }
      }
    },
    watch: {
      $route: 'routeHandle'
    },
    created () {
      this.routeHandle(this.$route)
    },
    methods: {
      // 路由操作
      routeHandle (route) {
        // console.log(route)
        if (route.meta.isTab) {
          // tab选中, 不存在先添加
          var tab = this.mainTabs.filter(item => item.name === route.name)[0]
          // let tab = route.name
          if (!tab) {
            if (route.meta.isDynamic) {
              route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
              if (!route) {
                return console.error('未能找到可用标签页!')
              }
            }
            tab = {
              menuId: route.meta.menuId || route.name,
              name: route.name,
              title: route.meta.title,
              type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
              iframeUrl: route.meta.iframeUrl || ''
            }
            this.$store.commit('permission/updateMainTabs', this.mainTabs.concat(tab))
          }
          // 点击菜单后激活tabs页面
          this.$store.commit('permission/updateMainTabsActiveName', tab.name)
        }
      }
    }
  }
</script>
