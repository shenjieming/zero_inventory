/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
  // 外网服务地址 http://renren.zhangsean.cn:1108/renren-fast/
  window.SITE_CONFIG['baseUrl'] = 'http://10.18.59.186';
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.31.196:8500';
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();
