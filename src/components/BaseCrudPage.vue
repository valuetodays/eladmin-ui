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

export default {
  name: 'BaseCrudPage',
  components: { rrOperation, crudOperation, udOperation, pagination },
  props: {
    crud: { type: Object, required: true },
    form: { type: Object, required: true }, // 对应 mixin 里的 form
    searchFields: { type: Array, default: () => [] },
    tableColumns: { type: Array, default: () => [] },
    formFields: { type: Array, default: () => [] },
    rules: { type: Object, default: () => ({}) },
    permission: { type: Object, default: () => ({}) }
  },
  mounted() {
    /**
     * 核心补丁：
     * crud.findVM('form') 找到的是 VtServer.vue。
     * 我们需要把 BaseCrudPage 这里的 el-form 引用，
     * 强行挂载到 VtServer 的 $refs 上。
     */
    const parentVm = this.crud.findVM('form')
    if (parentVm) {
      // 将当前组件(BaseCrudPage)的 ref["form"] 赋值给父组件的 $refs["form"]
      parentVm.$refs['form'] = this.$refs['form']
    }
  },
  // 建议加上销毁前的清理，防止内存溢出或引用混乱
  beforeDestroy() {
    const parentVm = this.crud.findVM('form')
    if (parentVm && parentVm.$refs['form'] === this.$refs['form']) {
      delete parentVm.$refs['form']
    }
  }
}
</script>