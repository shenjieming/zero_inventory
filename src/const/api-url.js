/**
 * DESC:
 */
// const basePort = ':8602'
const sysPort = ':8500'
export default {
  BASE_INFO: {
  },
  SYS_INFO: {
    MENU: {
      // 删除菜单
      MENU_DELETE: sysPort + '/sys/menu/delete',
      // 获取菜单详情
      MENU_INFO: sysPort + '/sys/menu/info',
      // 系统菜单列表
      MENU_LIST: sysPort + '/sys/menu/list',
      // 获取指定模块下的菜单权限
      MODULE_PERMIT_MENU: sysPort + '/sys/menu/modulePermitMenu',
      // 当前用户当前企业所拥有的菜单列表
      PERMIT_LIST: sysPort + '/sys/menu/permitList',
      // 有权限的模块列表
      PERMIT_MODULE: sysPort + '/sys/menu/permitModule',
      // 获取上级菜单
      MENU_SELECT: sysPort + '/sys/menu/select',
      // 菜单保存
      MENU_SAVE: sysPort + '/sys/menu/save',
      // 菜单修改
      MENU_UPDATE: sysPort + '/sys/menu/update'
    },
    LOGIN: {
      // 登录
      USER_LOGIN: sysPort + '/sys/login',
      // 登出
      USER_LOGOUT: sysPort + '/sys/logout'
    },
    USER: {
      // 用户删除
      USER_DELETE: sysPort + '/sys/user/delete',
      // 获取用户信息
      USER_INFO: sysPort + '/sys/user/info',
      // 用户列表
      USER_LIST: sysPort + '/sys/user/list',
      // 修改用户名密码
      USER_PASSWORD: sysPort + '/sys/user/password',
      // 用户新增
      USER_SAVE: sysPort + '/sys/user/save',
      // 用户修改
      USER_UPDATE: sysPort + '/sys/user/update'
    },
    ROLE: {
      // 删除角色
      ROLE_DELETE: sysPort + '/sys/role/delete',
      // 获取角色信息
      ROLE_INFO: sysPort + '/sys/role/info',
      // 获取角色列表
      ROLE_LIST: sysPort + '/sys/role/list',
      // 获取角色下拉框
      ROLE_SELECT: sysPort + '/sys/role/select',
      // 新增角色
      ROLE_SAVE: sysPort + '/sys/role/save',
      // 修改角色
      ROLE_UPDATE: sysPort + '/sys/role/update'
    },
    MODULE: {
    },
    SYETEM: {
      // 获取验证码图片
      CAPTCHA: sysPort + '/captcha.jpg'
    }
  }
}
