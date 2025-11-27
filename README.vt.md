# ELADMIN-UI

eladmin-web名称有歧义，可以代表后端服务，也可以代表前端页面。改成eladmin-ui更合适。

后端所有接口都要以/api开头。方便在nginx里统一配置。
目前/avatar和/file没有配置为/api/*，等遇到错误了统一配置。 see [容器部署方式 | ELADMIN 在线文档](https://eladmin.vip/pages/010402/)
