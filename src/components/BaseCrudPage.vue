BaseCrudPage.vue
<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="crud.props.searchToggle" style="display: flex; flex-wrap: wrap; gap: 8px;">
        <!-- 搜索 -->
        <div style="display: inline-flex; align-items: center;" v-for="f in searchFields" :key="f.prop">
          <el-tooltip v-if="f.tooltip" :content="f.tooltip" placement="top">
            <label class="el-form-item-label" style="cursor: help;">{{ f.label }}
              <i class="el-icon-question" style="margin-left: 4px; cursor: pointer;"></i>
            </label>
          </el-tooltip>
          <template v-else>
            <label class="el-form-item-label">{{ f.label }}</label>
          </template>

          <component
            :is="f.type === 'select' ? 'el-select' : 'el-input'"
            v-model="crud.query[f.prop]"
            v-bind="f.props"
            class="filter-item"
            @keyup.enter.native="f.type !== 'select' && crud.toQuery()"
            @change="f.type === 'select' && crud.toQuery()"
          >
            <el-option
              v-if="f.options"
              v-for="o in f.options"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </component>
        </div>

        <rrOperation :crud="crud" />
      </div>

      <!-- 插槽操作按钮 -->
      <slot name="crud-operation" />
    </div>
  </div>
</template>

<script>
import rrOperation from '@crud/RR.operation'

export default {
  name: 'BaseCrudPage',
  components: { rrOperation },
  props: {
    crud: { type: Object, required: true },
    searchFields: { type: Array, default: () => [] },
  }
}
</script>
