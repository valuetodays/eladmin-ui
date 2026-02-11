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
      <el-form ref="form" :model="crud.form" :rules="rules" size="small" label-width="100px">
        <el-form-item v-for="f in formFields" :key="f.prop" :label="f.label" :prop="f.prop">
          <el-switch
            v-if="f.type === 'switch'"
            v-model="crud.form[f.prop]"
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-bind="f.props"
          />
          <component
            v-else
            :is="f.type || 'el-input'"
            v-model="crud.form[f.prop]"
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
  // 【核心修复】：改用 created 并在内部手动注册
  created() {
    const crud = this.crud
    
    // 1. 同步默认表单数据
    crud.defaultForm = this.defaultForm
    
    // 2. 手动注册所有 VM 角色
    // 因为 el-form, 表格, 搜索都在这个组件里，所以我们要承担所有身份
    crud.registerVM('presenter', this, 0) // 主页
    crud.registerVM('header', this, 1)    // 头部/搜索
    crud.registerVM('pagination', this, 2)// 分页
    crud.registerVM('form', this, 3)      // 表单 (关键点！)

    // 3. 执行重置，让 crud.form 响应式
    crud.resetForm()
  },

  beforeDestroy() {
    // 销毁时清理注册信息，防止内存泄漏或影响其他页面
    const crud = this.crud
    crud.unregisterVM('presenter', this)
    crud.unregisterVM('header', this)
    crud.unregisterVM('pagination', this)
    crud.unregisterVM('form', this)
  }
}
</script>