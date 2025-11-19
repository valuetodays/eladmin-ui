<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from "@/utils/validate";

export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        /*  return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }*/
        // 当检测到是外部链接时，不返回 <a> 标签，而是返回 router-link 配置
        // 将原始的外部链接 url 作为参数传递给 /iframe-page 路由
        return {
          is: "router-link",
          to: {
            path: "/iframe-page", // 跳转到你的统一 iframe 路由
            query: {
              url: url, // 将原始的外部链接作为 url 参数传递过去
              // title: '' todo 从外部传title进来
            }
          }
        };
      }
      return {
        is: "router-link",
        to: url,
      };
    },
  },
};
</script>
