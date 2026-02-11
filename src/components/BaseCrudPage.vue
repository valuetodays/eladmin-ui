<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle" style="display: flex; flex-wrap: wrap; gap: 8px;">
        <div style="display: inline-flex; align-items: center;" v-for="f in searchFields" :key="f.prop">
          <label class="el-form-item-label">
            {{ f.label }}
            <el-tooltip v-if="f.tooltip" :content="f.tooltip" placement="top">
              <i class="el-icon-question" style="margin-left: 4px; cursor: help;"></i>
            </el-tooltip>
          </label>
          <component
            :is="f.type === 'select' ? 'el-select' : 'el-input'"
            v-model="crud.query[f.prop]"
            v-bind="f.props"
            class="filter-item"
            @keyup.enter.native="f.type !== 'select' && crud.toQuery()"
            @change="f.type === 'select' && crud.toQuery()"
          >
            <el-option
              v-for="o in f.options"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </component>
        </div>
        <rrOperation :crud="crud" />
      </div>

      <crudOperation :permission="permission" />
    </div>

    <el-dialog 
      :close-on-click-modal="false" 
      :before-close="crud.cancelCU" 
      :visible.sync="crud.status.cu > 0" 
      :title="crud.status.title" 
      width="580px"
    >
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item v-for="f in formFields" :key="f.prop" :label="f.label" :prop="f.prop">
          <el-switch
            v-if="f.type === 'switch'"
            v-model="form[f.prop]"
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-bind="f.props"
          />
          <component
            v-else
            :is="f.type || 'el-input'"
            v-model="form[f.prop]"
            v-bind="f.props"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>

    <el-table 
      ref="table" 
      v-loading="crud.loading" 
      :data="crud.data" 
      size="small" 
      style="width: 100%;" 
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      
      <el-table-column v-for="c in tableColumns" :key="c.prop" v-bind="c">
        <template v-if="c.headerTooltip" slot="header">
          <span>{{ c.label }}
            <el-tooltip :content="c.headerTooltip"><i class="el-icon-question" /></el-tooltip>
          </span>
        </template>
        
        <template slot-scope="scope">
          <slot :name="'col-' + c.prop" :row="scope.row">
            <el-switch
              v-if="c.type === 'switch'"
              v-model="scope.row[c.prop]"
              disabled
              active-color="#409EFF"
              inactive-color="#F56C6C"
            />
            <span v-else>{{ scope.row[c.prop] }}</span>
          </slot>
        </template>
      </el-table-column>

      <el-table-column v-if="permission.edit || permission.del" label="操作" width="150px" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
          <slot name="table-operation" :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>

    <pagination />
  </div>
</template>

<script>
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { presenter, header, form, crud } from '@crud/crud'
export default {
  name: 'BaseCrudPage',
  // 关键：在这里直接使用混入
  // 注意：因为 form() 是一个返回 mixin 对象的函数，我们需要动态处理
  mixins: [form(), header(), crud()],
  components: { rrOperation, crudOperation, udOperation, pagination },
  props: {
    crud: { type: Object, required: true },
    // 业务组件传进来的默认表单结构
    defaultForm: { type: Object, default: () => ({}) },
    searchFields: { type: Array, default: () => [] },
    tableColumns: { type: Array, default: () => [] },
    formFields: { type: Array, default: () => [] },
    rules: { type: Object, default: () => ({}) },
    permission: { type: Object, default: () => ({}) }
  },
  // 模拟 CRUD.js 中 form() 混入的行为
  beforeCreate() {
    // 1. 寻找 crud 实例（如果 props 没传，就向上找）
    this.crud = this.crud || lookupCrud(this)
    // 2. 注册当前组件为 'form' 类型的 VM，占据第 4 个槽位 (index 为 3)
    this.crud.registerVM('form', this, 3)
  },
  created() {
    // 覆盖混入中的 defaultForm
    this.crud.defaultForm = this.defaultForm
    this.crud.resetForm()
  },
  beforeDestroy() {
    // 销毁时记得注销，避免影响其他页面
    //this.crud.unregisterVM('form', this)
  }
}
</script>