<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">编号</label>
        <el-input
          v-model="query.code"
          clearable
          placeholder="编号"
          style="width: 185px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">区域</label>
        <el-input
          v-model="query.region"
          clearable
          placeholder="区域"
          style="width: 185px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">名称</label>
        <el-input
          v-model="query.name"
          clearable
          placeholder="名称"
          style="width: 185px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">备注</label>
        <el-input
          v-model="query.remark"
          clearable
          placeholder="备注"
          style="width: 185px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="编号" prop="code">
            <el-input v-model="form.code" style="width: 370px" />
          </el-form-item>
          <el-form-item label="区域" prop="region">
            <el-select v-model="form.region" filterable placeholder="请选择">
              <el-option v-for="item in dict.stock_region" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="主键" />
        <el-table-column prop="code" label="编号" />
        <el-table-column prop="region" label="区域">
          <template slot-scope="scope">
            {{ dict.label.stock_region[scope.row.region] }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createUserId" label="创建者" />
        <el-table-column prop="updateUserId" label="更新者" />
        <el-table-column prop="createTime" label="创建日期" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column
          v-if="checkPer(['admin', 'stock:edit', 'stock:del'])"
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
  import crudStock from '@/api/stock'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    id: null,
    code: null,
    region: null,
    name: null,
    remark: null,
    createUserId: null,
    updateUserId: null,
    createTime: null,
    updateTime: null,
  }
  export default {
    name: 'Stock',
    components: { pagination, crudOperation, rrOperation, udOperation },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['stock_region'],
    cruds() {
      return CRUD({
        title: '股票信息服务',
        url: 'api/stock/query',
        idField: 'id',
        sort: 'id,desc',
        crudMethod: { ...crudStock },
      })
    },
    data() {
      return {
        permission: {
          add: ['admin', 'stock:add'],
          edit: ['admin', 'stock:edit'],
          del: ['admin', 'stock:del'],
        },
        rules: {
          id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
          code: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
          region: [{ required: true, message: '区域不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          createUserId: [{ required: true, message: '创建者不能为空', trigger: 'blur' }],
          updateUserId: [{ required: true, message: '更新者不能为空', trigger: 'blur' }],
          createTime: [{ required: true, message: '创建日期不能为空', trigger: 'blur' }],
          updateTime: [{ required: true, message: '更新时间不能为空', trigger: 'blur' }],
        },
        queryTypeOptions: [
          { key: 'code', display_name: '编号' },
          { key: 'region', display_name: '区域' },
          { key: 'name', display_name: '名称' },
          { key: 'remark', display_name: '备注' },
        ],
      }
    },
    methods: {
      // 钩子：在获取表格数据之前执行，false 则代表不获取数据
      [CRUD.HOOK.beforeRefresh]() {
        return true
      },
      [CRUD.HOOK.beforeToAdd]() {
        return true
      },
    },
  }
</script>

<style scoped></style>
