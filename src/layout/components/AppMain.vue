<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" v-if="!$route.meta.isExternal" />
        <!-- iframe 页面 -->
        <iframe
          v-else
          :src="iframeUrl"
          :key="$route.fullPath"
          class="iframe-container"
          frameborder="0"
          scrolling="auto"
        />
      </keep-alive>
    </transition>
    <el-backtop :bottom="50" :right="40"
      ><i class="el-icon-caret-top"
    /></el-backtop>
    <div v-if="$store.state.settings.showFooter" id="el-main-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span v-if="$store.state.settings.caseNumber"> ⋅ </span>
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{
        $store.state.settings.caseNumber
      }}</a>
    </div>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  data() {
    return {
      iframeUrl: ''
    }
  },
  watch: {
    // 深度监听路由变化
    $route(to, from) {
      if (to.meta.isExternal) {
        this.handleIframeRoute(to);
      }
    }
  },
  created() {
    // 初始化时检查是否是 iframe 路由
    if (this.$route.meta.isExternal) {
      this.handleIframeRoute(this.$route);
    }
  },  
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    },
  },
    methods: {
    handleIframeRoute(route) {
      // 1. 从路由参数中获取目标 URL
      const targetUrl = route.query.url;
      
      if (targetUrl) {
        console.log(targetUrl)
        this.iframeUrl = decodeURIComponent(targetUrl);
        console.log('iframeUrl', this.iframeUrl)
        // 2. 动态修改路由的 meta 信息（关键步骤）
        // 这样做可以让多标签页的标题和图标正确显示
        // 注意：这里我们假设菜单配置时，将标题和图标也通过参数传递过来，例如：
        // /iframe-page?url=http://erp.com&title=ERP系统&icon=el-icon-s-shop
        const title = route.query.title || '外部页面';
        const icon = route.query.icon || 'el-icon-link';

        // 使用 $router.push 或者直接修改 $route.meta（不推荐）
        // 推荐使用 $router.push 来触发一次路由更新，这样最稳妥
        this.$router.push({
          path: route.path,
          query: {
            ...route.query
          },
          // 动态添加 meta 信息
          meta: {
            ...route.meta,
            title: title,
            icon: icon
          }
        });
      } else {
        // 如果没有 url 参数，可以跳转到 404 或给出提示
        this.$router.push('/404');
      }
    }
  } // end of methods
};
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}

/* iframe 样式：占满内容区，高度适配 ELadmin 布局 */
.iframe-container {
  width: 100%;
  /* 高度 = 视窗高度 - 顶部导航栏(50px) - 多标签栏(44px) - 底部边距(6px)，按需微调 */
  height: calc(100vh - 100px);
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
