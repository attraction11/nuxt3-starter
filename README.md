## 一、关于上线两个站点需要的修改点!!!（默认马来）

<!-- - 1、nuxt.config.ts 
    href 修改:
      en-favicon.ico    (马来)
      th-favicon.ico    (泰国)

    header.title 修改
      HomingClub – Small changes make your dream life       (马来)
      Homingday – ใฝ่ฝันชีวิตอันสวยงาม                            (泰国) -->



## 二、本地联调

- 1、修改 api\request.ts 中请求接口地址:
  "http://120.48.56.30:8060"       (测试环境)
  "https://api.zhiming-inc.com"    (线上环境)


- 2、pages\index.vue  移除测试环境，token.value 
  配置 eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9...
