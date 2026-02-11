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
        <label class="el-form-item-label">名称</label>
        <el-input
          v-model="query.name"
          clearable
          placeholder="名称"
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
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <el-button
          slot="right"
          v-permission="['admin', 'indexInfo:saveLatest30Days']"
          class="filter-item"
          size="mini"
          type="primary"
          @click="saveLatest30Days()"
          >同步popular记录的近30天行情数据
        </el-button>
        <el-button
          slot="right"
          v-permission="['admin', 'stockDailyQuote:computeLatest30DaysCci']"
          class="filter-item"
          size="mini"
          type="primary"
          @click="computeLatest30DaysCci()"
          >计算popular记录的近30天的Cci
        </el-button>
      </crudOperation>
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px" />
          </el-form-item>
          <el-form-item label="区域" prop="region">
            <el-input v-model="form.region" style="width: 370px" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" :rows="3" type="textarea" style="width: 370px" />
          </el-form-item>
          <el-form-item label="发布日期">
            <el-date-picker v-model="form.releaseDate" type="date" style="width: 370px" />
          </el-form-item>
          <el-form-item label="数据基准日期">
            <el-date-picker v-model="form.dataBaseDate" type="date" style="width: 370px" />
          </el-form-item>
          <el-form-item label="是否常见" prop="popularFlag">
            <el-tooltip :content="'Switch value: ' + form.popularFlag" placement="top">
              <el-switch
                active-color="#13ce66"
                active-text="是"
                :active-value="true"
                inactive-color="#ff4949"
                inactive-text="否"
                :inactive-value="false"
                v-model="form.popularFlag"
              >
              </el-switch>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="建议的etf列表">
            <el-input v-model="form.suggestEtfs" :rows="3" type="textarea" style="width: 370px" />
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
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="region" label="区域" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="releaseDate" label="发布日期" />
        <el-table-column prop="dataBaseDate" label="数据基准日期" />
        <el-table-column prop="popularFlag" label="是否常见">
          <template slot-scope="scope">
            {{ dict.label.switch_status_1_0[scope.row.popularFlag] }}
          </template>
        </el-table-column>
        <el-table-column prop="suggestEtfs" label="建议的etf列表" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="修改日期" />
        <el-table-column prop="createUserId" label="创建者id" />
        <el-table-column prop="updateUserId" label="更新者id" />
        <el-table-column
          v-if="checkPer(['admin', 'indexInfo:edit', 'indexInfo:del'])"
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
            <el-dropdown size="mini" split-button type="primary">
              更多操作
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="saveAllDailyStat(scope.row.id)"> 同步所有日k数据 </el-dropdown-item>
                <el-dropdown-item @click.native="updateMissingFields(scope.row.id)"> 同步指数信息 </el-dropdown-item>
                <el-dropdown-item @click.native="computeAllCciById(scope.row.id)"> 计算所有cci </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
  import crudIndexInfo from '@/api/mybiz/indexInfo'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    id: null,
    code: null,
    name: null,
    region: null,
    description: null,
    releaseDate: null,
    dataBaseDate: null,
    popularFlag: false,
    suggestEtfs: null,
    createTime: null,
    updateTime: null,
    createUserId: null,
    updateUserId: null,
  }
  export default {
    name: 'IndexInfo',
    components: { pagination, crudOperation, rrOperation, udOperation },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['switch_status_1_0'],
    cruds() {
      return CRUD({
        title: '指数信息',
        url: 'api/indexInfo/query',
        idField: 'id',
        sort: 'id,desc',
        crudMethod: { ...crudIndexInfo },
      })
    },
    data() {
      return {
        permission: {
          add: ['admin', 'indexInfo:add'],
          edit: ['admin', 'indexInfo:edit'],
          del: ['admin', 'indexInfo:del'],
        },
        rules: {
          code: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          region: [{ required: true, message: '区域不能为空', trigger: 'blur' }],
        },
        queryTypeOptions: [
          { key: 'code', display_name: '编号' },
          { key: 'name', display_name: '名称' },
          { key: 'region', display_name: '区域' },
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
      updateMissingFields(id) {
        crudIndexInfo
          .updateMissingFields(id)
          .then((response) => {
            this.$message.success('操作成功')
          })
          .catch(() => {
            this.$message.error('操作失败')
          })
      },
      saveAllDailyStat(id) {
        crudIndexInfo
          .saveAllDailyStat(id)
          .then((response) => {
            this.$message.success('发起成功，请稍后查看同步结果')
          })
          .catch(() => {
            this.$message.error('操作失败')
          })
      },
      saveLatest30Days() {
        crudIndexInfo
          .saveLatest30Days()
          .then((response) => {
            this.$message.success('发起成功，请稍后查看同步结果')
          })
          .catch(() => {
            this.$message.error('操作失败')
          })
      },
      computeAllCciById(id) {
        crudIndexInfo
          .computeAllCciById(id)
          .then((response) => {
            this.$message.success('发起计算一个指数的所有cci，请稍后查看同步结果')
          })
          .catch(() => {
            this.$message.error('操作失败')
          })
      },
      computeLatest30DaysCci() {
        crudIndexInfo
          .computeLatest30DaysCci()
          .then((response) => {
            this.$message.success('发起计算近30天cci，请稍后查看同步结果')
          })
          .catch(() => {
            this.$message.error('操作失败')
          })
      },
    },
  }
</script>

<style scoped></style>
