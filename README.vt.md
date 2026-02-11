# ELADMIN-UI

eladmin-web名称有歧义，可以代表后端服务，也可以代表前端页面。改成eladmin-ui更合适。
后来又修改为portal-ui。

后端所有接口都要以/api开头。方便在nginx里统一配置。
目前/avatar和/file没有配置为/api/*，等遇到错误了统一配置。 see [容器部署方式 | ELADMIN 在线文档](https://eladmin.vip/pages/010402/)


## 优化项

- 页面的index.vue （v1）
  + [x] 查询条件配置化
  + [x] 列表项配置化
  + [x] 新增/修改表单项配置化
- 页面的index.vue schema配置化（v2）
  + 新建一个BaseCrudPage.vue，把通用代码放里面。每个业务代码引用它。
  + [x] 查询条件配置化v2
  + [x] 列表项配置化v2
  + [x] 新增/修改表单项配置化v2