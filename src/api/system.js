/*
*  desc: 这是业务系统模块api
* */
import request from '@/utils/request'

// 用户登录
export function login (data) {
  return request({
    url: '/sys/login',
    method: 'get',
    data
  })
}
