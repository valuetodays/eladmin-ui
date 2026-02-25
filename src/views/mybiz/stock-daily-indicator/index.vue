<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <el-button
          slot="right"
          v-permission="['admin', 'stockDailyIndicator:getAllCciLt_100ByStatDate']"
          class="filter-item"
          size="mini"
          type="primary"
          @click="toggleCci14DataDlg()"
          >获取指定时间内cci14小于-100的数据
        </el-button>
        <el-button
          slot="right"
          v-permission="['admin', 'stockDailyIndicator:getStockToBuyByKdj']"
          class="filter-item"
          size="mini"
          type="primary"
          @click="toggleKdjDataDlg()"
          >根据kdj获取超买
        </el-button>
      </crudOperation>
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
        <el-table-column prop="code" label="code" />
        <el-table-column prop="statDate" label="统计日期" />
        <el-table-column prop="cci14" label="cci14" />
        <el-table-column prop="kdjK" label="k" />
        <el-table-column prop="kdjD" label="d" />
        <el-table-column prop="kdjj" label="j" />
        <el-table-column
          v-if="checkPer(['admin', 'stockDailyIndicator:edit', 'stockDailyIndicator:del'])"
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

    <el-dialog :close-on-click-modal="false" :visible.sync="showCci14DataDlg" title="show cci14Data" width="500px">
      <div>
        <el-date-picker
          v-model="cci14DataQueryForm.statDate"
          type="date"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          clearable
          style="width: 185px"
          class="filter-item"
          @change="cci14DataQuery"
        />
        <el-button size="mini" type="primary" @click="downloadAsExcel()" :disabled="cci14Data.length === 0"
          >下载为Excel</el-button
        >
      </div>
      <el-table
        ref="cci14Table"
        v-loading="cci14Dataloading"
        :data="cci14Data"
        size="small"
        height="400"
        @sort-change="handleSortChange"
        style="width: 100%"
      >
        <el-table-column prop="code" label="code" sortable="custom" />
        <el-table-column prop="name" label="name" />
        <el-table-column prop="statDate" label="统计日期" />
        <el-table-column prop="cci14" label="cci14" sortable="custom" />
      </el-table>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :visible.sync="showKdjDataDlg" title="show stock by kdj" width="700px">
      <div>
        <el-date-picker
          v-model="kdjDataQueryForm.statDate"
          type="date"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          clearable
          style="width: 185px"
          class="filter-item"
          @change="kdjDataQuery"
        />
        <el-button size="mini" type="primary" @click="downloadAsExcel()" :disabled="kdjData.length === 0"
          >下载为Excel</el-button
        >
      </div>
      <el-table
        ref="kdjTable"
        v-loading="kdjDataloading"
        :data="kdjData"
        size="small"
        height="400"
        @sort-change="handleSortChange"
        style="width: 100%"
      >
        <el-table-column prop="code" label="code" sortable="custom" />
        <el-table-column prop="name" label="name" />
        <el-table-column prop="statDate" label="统计日期" />
        <el-table-column prop="k" label="k" sortable="custom" />
        <el-table-column prop="d" label="d" sortable="custom" />
        <el-table-column prop="j" label="j" sortable="custom" />
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
  import * as XLSX from 'xlsx'
  import { saveAs } from 'file-saver'

  const defaultForm = { code: null, statDate: null, cci14: null }
  export default {
    name: 'StockDailyIndicator',
    components: { pagination, crudOperation, rrOperation, udOperation },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({
        title: '股票每日指标',
        url: 'api/stockDailyIndicator/query',
        idField: 'statDate',
        sort: 'statDate,desc',
        crudMethod: { ...crudStockDailyIndicator },
      })
    },
    data() {
      return {
        permission: {},
        rules: {
          code: [{ required: true, message: 'code不能为空', trigger: 'blur' }],
          statDate: [{ required: true, message: '统计日期不能为空', trigger: 'blur' }],
          cci14: [{ required: true, message: 'cci14不能为空', trigger: 'blur' }],
        },
        cci14DataQueryForm: {
          statDate: '',
        },
        kdjDataQueryForm: {
          statDate: '',
        },
        showCci14DataDlg: false,
        cci14Data: [],
        cci14Dataloading: false,
        showKdjDataDlg: false,
        kdjData: [],
        kdjDataloading: false,
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
      toggleKdjDataDlg() {
        this.showKdjDataDlg = !this.showKdjDataDlg
      },
      cci14DataQuery() {
        this.cci14Dataloading = true
        crudStockDailyIndicator
          .getAllCciLt_100ByStatDate(this.cci14DataQueryForm)
          .then((data) => {
            this.cci14Data = data
            this.cci14Dataloading = false
          })
          .catch(() => {
            this.$message.error('操作失败')
            this.cci14Dataloading = false
          })
      },
      kdjDataQuery() {
        this.kdjDataloading = true
        crudStockDailyIndicator
          .getStocksToBuyByKdj(this.kdjDataQueryForm)
          .then((data) => {
            this.kdjData = data
            this.kdjDataloading = false
          })
          .catch(() => {
            this.$message.error('操作失败')
            this.kdjDataloading = false
          })
      },
      downloadCci14DataAsCsv() {
        if (!this.cci14Data || this.cci14Data.length === 0) return

        const header = ['Code', 'Name', 'Date', 'CCI14']
        const rows = this.cci14Data.map((item) => [item.code, item.name, item.statDate, item.cci14])

        let csvContent = header.join(',') + '\n'
        rows.forEach((row) => {
          csvContent += row.join(',') + '\n'
        })

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', `cci14Data.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
      // 下载 Excel
      downloadAsExcel() {
        if (this.showCci14DataDlg) {
          this.downloadCci14DataAsExcel();
        } else if (this.showKdjDataDlg) {
          this.downloadKdjDataAsExcel();
        }
      }, // end of downloadAsExcel()
      downloadCci14DataAsExcel() {
        if (!this.cci14Data || this.cci14Data.length === 0) return;
        const fileName = 'cci14Data-' + this.cci14DataQueryForm.statDate + '.xlsx'
        this.downloadDataAsExcel(this.cci14Data, ['code', 'name', 'statDate', 'cci14'], 'CCI14', fileName)
      },
      downloadKdjDataAsExcel() {
        if (!this.kdjData || this.kdjData.length === 0) return;
        const fileName = 'kdjData-' + this.kdjDataQueryForm.statDate + '.xlsx'
        this.downloadDataAsExcel(this.kdjData, ['code', 'name', 'statDate', 'k', 'd', 'j'], 'kdj', fileName)
      },
      downloadDataAsExcel(dataList, headerArray, sheetName, fileName) {
        if (!dataList || dataList.length === 0) return;

        // 生成 worksheet
        const ws = XLSX.utils.json_to_sheet(dataList, { header: headerArray })

        // 强制 code 列为文本，防止 Excel 去掉前导零
        Object.keys(ws).forEach((cell) => {
          if (cell.startsWith('A') && cell !== 'A1') ws[cell].z = '@'
        })

        // 创建 workbook 并追加 worksheet
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, sheetName)

        // 导出 Excel
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName)
      },
      handleSortChange({ prop, order }) {
        if (!order) return // 取消排序
        let dataList = null;
        if (this.showCci14DataDlg) {
          dataList = this.cci14Data
        } else if (this.showKdjDataDlg) {
          dataList = this.kdjData
        }
        if (dataList) {
          dataList.sort((a, b) => {
            let valA = a[prop]
            let valB = b[prop]
            if (typeof valA === 'string') valA = valA.toLowerCase()
            if (typeof valB === 'string') valB = valB.toLowerCase()
            if (order === 'ascending') {
              return valA > valB ? 1 : -1
            } else {
              return valA < valB ? 1 : -1
            }
          })
        }
      },
    }, // end of methods
  }
</script>

<style scoped></style>
