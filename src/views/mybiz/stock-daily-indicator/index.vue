<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <el-button
          slot="right"
          v-permission="['admin','stockDailyIndicator:getAllCciLt_100ByStatDate']"
          class="filter-item"
          size="mini"
          type="primary"
          @click="toggleCci14DataDlg()"
        >获取指定时间内cci14小于-100的数据
        </el-button>        
      </crudOperation>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="code" label="code" />
        <el-table-column prop="statDate" label="统计日期" />
        <el-table-column prop="cci14" label="cci14" />
        <el-table-column v-if="checkPer(['admin','stockDailyIndicator:edit','stockDailyIndicator:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>

    <el-dialog :close-on-click-modal="false" :visible.sync="showCci14DataDlg" title="show cci14Data" width="500px">
      <div>
        <el-input v-model="cci14DataQueryForm.statDate" clearable placeholder="日期" style="width: 185px;" class="filter-item" @keyup.enter.native="cci14DataQuery" />
      </div>
      <el-table ref="cci14Table" v-loading="cci14Dataloading" :data="cci14Data" size="small" style="width: 100%;">
        <el-table-column prop="code" label="code" />
        <el-table-column prop="name" label="name" />
        <el-table-column prop="statDate" label="统计日期" />
        <el-table-column prop="cci14" label="cci14" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import crudStockDailyIndicator from '@/api/mybiz/stock-daily-indicator'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { code: null, statDate: null, cci14: null }
export default {
  name: 'StockDailyIndicator',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '股票每日指标', url: 'api/stockDailyIndicator/query', idField: 'statDate', sort: 'statDate,desc', crudMethod: { ...crudStockDailyIndicator }})
  },
  data() {
    return {
      permission: {
      },
      rules: {
        code: [
          { required: true, message: 'code不能为空', trigger: 'blur' }
        ],
        statDate: [
          { required: true, message: '统计日期不能为空', trigger: 'blur' }
        ],
        cci14: [
          { required: true, message: 'cci14不能为空', trigger: 'blur' }
        ]
      },
      cci14DataQueryForm: {
        statDate: ''
      },
      showCci14DataDlg: false,
      cci14Data: [],
      cci14Dataloading: false
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
    toggleCci14DataDlg() {
      this.showCci14DataDlg = !this.showCci14DataDlg
    },
    cci14DataQuery() {
      this.cci14Dataloading = true
      crudStockDailyIndicator.getAllCciLt_100ByStatDate(this.cci14DataQueryForm).then(response => {
        console.log("response:", response)
        this.cci14Data = response.data
        this.cci14Dataloading = false
      }).catch(() => {
        this.$message.error('操作失败')
        this.cci14Dataloading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
