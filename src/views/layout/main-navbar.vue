<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand"  @click="$router.push({ name: 'home' })">
        <!--<a class="site-navbar__brand-lg" href="javascript:;"></a>-->
        <!--<a class="site-navbar__brand-mini" href="javascript:;"></a>-->
      </h1>
    </div>

    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu :default-active="moduleActive"  class="site-navbar__menu" mode="horizontal" @select="handleSelect">
        <el-menu-item :index='item.moduleCode' name="system" v-for="(item, index) in moduleList" :key="item.moduleCode"> {{item.moduleName}}</el-menu-item>
      </el-menu>
      <el-menu
        menu-trigger="click"
        class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
        <el-submenu index="1">
        <template slot="title">{{userInfo.companyName}}</template>
        <el-menu-item :index="item.companyCode"   v-for="item,index in permitList" :key="item.companyCode" ><a  @click="changeCompany(item.companyName)">{{item.companyName}}</a></el-menu-item>
        </el-submenu>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png">
              {{ userInfo.username}}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePasswordVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import { clearLoginInfo } from '@/utils'
  import { mapGetters } from 'vuex'
  import { fnAddDynamicMenuRoutes } from '@/utils/webRouter'
  export default {
    data () {
      return {
        // 密码弹出框显示隐藏
        updatePasswordVisible: false,
        permitList: []
      }
    },
    components: {
      UpdatePassword
    },
    computed: {
      ...mapGetters([
        'navbarLayoutType',
        'sidebarFold',
        'mainTabs',
        'userInfo',
        'moduleList',
        'moduleActive',
        'dynamicMenuRoutes'
      ])
    },
    methods: {
      // 修改密码
      updatePasswordHandle () {
        this.updatePasswordVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 不同应用中心平台进行切换
      handleSelect (moduleCode) {
        this.$http({
          url: this.$http.adornUrl(this.$API.SYS_INFO.MENU.MODULE_PERMIT_MENU),
          method: 'get',
          params: this.$http.adornParams({moduleCode: moduleCode})
        }).then(({data}) => {
          fnAddDynamicMenuRoutes(data.menuList)
          this.$router.options.isAddDynamicMenuRoutes = true
          this.$store.commit('permission/updateMenuList', data.menuList)
          sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        }).catch((e) => {
          console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
          this.$router.push({ name: 'login' })
        })
        this.$store.commit('permission/updateMenuList', [])
        this.$store.commit('permission/updateMainTabs', [])
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(this.$API.SYS_INFO.LOGIN.USER_LOGOUT),
            method: 'post',
            data: this.$http.adornData()
          }).then((data) => {
            clearLoginInfo()
            this.$router.push({ name: 'login' })
          })
        }).catch(() => {})
      },
      // 切换主体企业信息
      changeCompany (item) {
        console.log(item)
        // if (item !== this.userInfo.companyName) {
        //
        // }
        this.userInfo.companyName = item
        // this.$store.dispatch('getModuleList')
      }
    },
    mounted () {
      // 获取有权限的企业列表
      this.$http({
        url: this.$http.adornUrl(this.$API.SYS_INFO.MENU.PERMIT_LIST),
        method: 'get',
        data: this.$http.adornData()
      }).then(({data}) => {
        this.permitList = data
      })
    }
  }
</script>
