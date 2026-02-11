<template>
  <div class="page">
    <h1>v-particle Demo</h1>

    <!-- Hover -->
    <section>
      <h2>Hover 触发</h2>
      <div class="row">
        <button v-particle.hover>hover 默认</button>
        <button v-particle.hover.success>hover success</button>
        <button v-particle.hover.error>hover error</button>
      </div>
    </section>

    <!-- Click -->
    <section>
      <h2>Click 触发</h2>
      <div class="row">
        <button v-particle>click 默认</button>
        <button v-particle.success>click success</button>
        <button v-particle.error>click error</button>
      </div>
    </section>

    <!-- 粒子数量 -->
    <section>
      <h2>粒子数量</h2>
      <div class="row">
        <button v-particle="{ count: 10 }">count 10</button>
        <button v-particle="{ count: 30 }">count 30</button>
        <button v-particle="{ count: 60 }">count 60</button>
      </div>
    </section>

    <!-- 自定义颜色 -->
    <section>
      <h2>自定义颜色</h2>
      <div class="row">
        <button v-particle="{ count: 30, color: '#1890ff' }">蓝色</button>
        <button v-particle="{ count: 30, color: '#722ed1' }">紫色</button>
        <button v-particle="{ count: 30, color: '#fa8c16' }">橙色</button>
        <button v-particle="{ count: 30, color: 'success' }">success</button>
      </div>
    </section>

    <!-- 推荐组合 -->
    <section>
      <h2>推荐用法（登录按钮）</h2>
      <div class="row">
        <button class="primary" v-particle.hover.success="{ count: 32 }" @click="login">登录（hover + success）</button>

        <button class="danger" v-particle.error="{ count: 24 }">提交失败</button>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    methods: {
      login() {
        console.log('login click')
      },
    },
  }
</script>

<style scoped>
  .page {
    padding: 40px;
    font-family: Arial, sans-serif;
  }

  section {
    margin-bottom: 32px;
  }

  h1 {
    margin-bottom: 24px;
  }

  h2 {
    margin-bottom: 12px;
    font-size: 18px;
  }

  .row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  button {
    padding: 12px 20px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    background: #fff;
    border-radius: 6px;
  }

  button.primary {
    background: #1677ff;
    color: #fff;
    border-color: #1677ff;
  }

  button.danger {
    background: #ff4d4f;
    color: #fff;
    border-color: #ff4d4f;
  }
</style>
