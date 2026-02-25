<template>
  <base-crud-page
    :crud="crud"
    :default-form="defaultForm"
    :permission="permission"
    :rules="rules"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :form-fields="formFields"
  >
    <template #crud-operation-more>
      <el-button
          slot="right"
          v-permission="['admin', 'stockInfo:saveLatest30Days']"
          class="filter-item"
          size="mini"
          type="primary"
          @click="saveLatest30Days()"
          >同步popular记录的近30天行情数据
        </el-button>
        <el-button
          slot="right"
          v-permission="['admin', 'stockInfo:computeLatest30DaysCci']"
          class="filter-item"
          size="mini"
          type="primary"
          @click="computeLatest30DaysCci()"
          >计算popular记录的近30天的Cci
        </el-button>
    </template>

    <template #table-operation="{ row }">
      <el-dropdown size="mini" type="primary">
        <el-button type="primary" size="mini"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="saveAllDailyStat(row.id)"> 同步所有日k数据 </el-dropdown-item>
          <el-dropdown-item @click.native="computeAllCciById(row.id)"> 计算所有cci </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </base-crud-page>
</template>

<script>
  import BaseCrudPage from '@/components/BaseCrudPage.vue'
  import crudStockInfo from '@/api/mybiz/stockInfo'
  import CRUD, { presenter, crud } from '@crud/crud'

  export default {
    name: 'StockInfo',
    components: { BaseCrudPage },
    mixins: [presenter()],
    dicts: ['switch_status_1_0'],
    cruds() {
      return CRUD({
        title: 'dd',
        url: 'api/stockInfo/query',
        idField: 'id',
        sort: 'id,desc',
        crudMethod: { ...crudStockInfo },
      })
    },
    data() {
      return {        
        defaultForm: {
          id: null,
          code: null,
          shortName: null,
          region: null,
          popularFlag: null,
          scale: null,
          releaseDate: null,
          huanShouPtg: null,
          totalShares: null,
          fenhong: null,
          manageRadio: null,
          holderRadio: null,
          sellRadio: null,
          busiCompareBase: null,
          followIndex: null,
          createTime: null,
          updateTime: null,
          createUserId: null,
          updateUserId: null,
        },
        permission: {
          add: ['admin', 'stockInfo:add'],
          edit: ['admin', 'stockInfo:edit'],
          del: ['admin', 'stockInfo:del'],
        },
        rules: {
          code: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
          shortName: [{ required: true, message: '简称不能为空', trigger: 'blur' }],
          region: [{ required: true, message: '区域：SH/SZ不能为空', trigger: 'blur' }],
          popularFlag: [{ required: true, message: '是否流行不能为空', trigger: 'blur' }],
        },
        searchFields: [
          { label: '编号', prop: 'code', props: { clearable: true, size: 'small', style: 'width:90px' } },
          { label: '简称', prop: 'shortName', props: { clearable: true, size: 'small', style: 'width:90px' } },
          {
            label: '区域：',
            prop: 'region',
            tooltip: '可用值：SH/SZ',
            props: { clearable: true, size: 'small', style: 'width:90px' },
          },
          {
            label: '是否流行',
            prop: 'popularFlag',
            type: 'select',
            options: [],
            props: { clearable: true, size: 'small', style: 'width:90px' },
          },
        ],
        tableColumns: [
          { prop: 'id', label: '主键' },
          { prop: 'code', label: '编号' },
          { prop: 'shortName', label: '简称' },
          { prop: 'region', label: '区域', headerTooltip: 'SH/SZ' },
          { prop: 'popularFlag', label: '是否流行', type: 'switch' },
          { prop: 'scale', label: '规模（亿元）' },
          { prop: 'releaseDate', label: '发行日期' },
          { prop: 'huanShouPtg', label: '换手率' },
          { prop: 'totalShares', label: '总股本(万份)' },
          { prop: 'fenhong', label: '分红' },
          { prop: 'manageRadio', label: '管理费率%' },
          { prop: 'holderRadio', label: '托管费率%' },
          { prop: 'sellRadio', label: '销售服务费%' },
          { prop: 'busiCompareBase', label: '业绩比较基准%' },
          { prop: 'followIndex', label: '跟踪指数%' },
          { prop: 'createUserId', label: '创建人id' },
          { prop: 'updateUserId', label: '更新人id' },
          { prop: 'createTime', label: '创建日期' },
          { prop: 'updateTime', label: '更新时间' },
        ],
        formFields: [
          { label: '编号', prop: 'code' },
          { label: '简称', prop: 'shortName' },
          { label: '区域SH/SZ', prop: 'region' },
          { label: '是否流行', prop: 'popularFlag', type: 'switch'  },
          { label: '规模（亿元）', prop: 'scale' },
          { label: '发行日期', prop: 'releaseDate' },
          { label: '换手率', prop: 'huanShouPtg' },
          { label: '总股本(万份)', prop: 'totalShares' },
          { label: '分红', prop: 'fenhong' },
          { label: '管理费率%', prop: 'manageRadio' },
          { label: '托管费率%', prop: 'holderRadio' },
          { label: '销售服务费%', prop: 'sellRadio' },
          { label: '销售服务费%', prop: 'sellRadio' },
          { label: '业绩比较基准', prop: 'busiCompareBase' },
          { label: '跟踪指数', prop: 'followIndex' },
        ]
        // <el-date-picker v-model="form.releaseDate" type="datetime" style="width: 370px" />
      }
    },
    created() {
      // 组件初始化后，dict 已经加载
      this.searchFields.find((f) => f.prop === 'popularFlag').options = this.dict['switch_status_1_0']
    },
    methods: {
      // 钩子：在获取表格数据之前执行，false 则代表不获取数据
      [CRUD.HOOK.beforeRefresh]() {
        return true
      },
      [CRUD.HOOK.beforeToAdd]() {
        return true
      },
      saveAllDailyStat(id) {
        crudStockInfo
          .saveAllDailyStat(id)
          .then((response) => {
            this.$message.success('发起成功，请稍后查看同步结果')
          })
          .catch(() => {
            this.$message.error('操作失败')
          })
      },
      saveLatest30Days() {
        crudStockInfo
          .saveLatest30Days()
          .then((response) => {
            this.$message.success('发起成功，请稍后查看同步结果')
          })
          .catch(() => {
            this.$message.error('操作失败')
          })
      },
      computeAllCciById(id) {
        crudStockInfo
          .computeAllCciById(id)
          .then((response) => {
            this.$message.success('发起计算一个指数的所有cci，请稍后查看同步结果')
          })
          .catch(() => {
            this.$message.error('操作失败')
          })
      },
      computeLatest30DaysCci() {
        crudStockInfo
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
