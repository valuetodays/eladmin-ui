<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">编号</label>
        <el-input v-model="query.code" clearable placeholder="编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">简称</label>
        <el-input v-model="query.shortName" clearable placeholder="简称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">区域</label>
        <el-input v-model="query.region" clearable placeholder="区域：SH/SZ" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">是否流行</label>
        <el-select v-model="query.popularFlag" clearable size="small"
                placeholder="是否流行"
                class="filter-item"
                style="width: 90px"
                @change="crud.toQuery">
          <el-option v-for="item in dict.switch_status_1_0"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="编号" prop="code">
            <el-input v-model="form.code" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="简称" prop="shortName">
            <el-input v-model="form.shortName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="区域：SH/SZ" prop="region">
            <el-input v-model="form.region" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否流行" prop="popularFlag">
            <el-tooltip :content="'Switch value: ' + form.popularFlag" placement="top">
              <el-switch
                active-color="#13ce66"
                active-text="启用"
                :active-value="true"
                inactive-color="#ff4949"
                inactive-text="停用"
                :inactive-value="false"
                v-model="form.popularFlag">
              </el-switch>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="规模（亿元）">
            <el-input v-model="form.scale" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="发行日期">
            <el-date-picker v-model="form.releaseDate" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="换手率">
            <el-input v-model="form.huanShouPtg" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="总股本(万份)">
            <el-input v-model="form.totalShares" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分红">
            <el-input v-model="form.fenhong" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="管理费率%">
            <el-input v-model="form.manageRadio" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="托管费率%">
            <el-input v-model="form.holderRadio" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="销售服务费%">
            <el-input v-model="form.sellRadio" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="业绩比较基准">
            <el-input v-model="form.busiCompareBase" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="跟踪指数">
            <el-input v-model="form.followIndex" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="主键" />
        <el-table-column prop="code" label="编号" />
        <el-table-column prop="shortName" label="简称" />
        <el-table-column prop="region" label="区域：SH/SZ" />
        <el-table-column prop="popularFlag" label="是否流行">
          <template slot-scope="scope">
            {{ dict.label.switch_status_1_0[scope.row.popularFlag] }}
          </template>
        </el-table-column>
        <el-table-column prop="scale" label="规模（亿元）" />
        <el-table-column prop="releaseDate" label="发行日期" />
        <el-table-column prop="huanShouPtg" label="换手率" />
        <el-table-column prop="totalShares" label="总股本(万份)" />
        <el-table-column prop="fenhong" label="分红" />
        <el-table-column prop="manageRadio" label="管理费率%" />
        <el-table-column prop="holderRadio" label="托管费率%" />
        <el-table-column prop="sellRadio" label="销售服务费%" />
        <el-table-column prop="busiCompareBase" label="业绩比较基准" />
        <el-table-column prop="followIndex" label="跟踪指数" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column prop="createUserId" label="创建人id" />
        <el-table-column prop="updateUserId" label="更新人id" />
        <el-table-column v-if="checkPer(['admin','stockInfo:edit','stockInfo:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
            <el-dropdown size="mini" split-button type="primary">
              更多操作
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="saveAllDailyStat(scope.row.id)">
                  同步所有日k数据
                </el-dropdown-item>
                <el-dropdown-item @click.native="updateMissingFields(scope.row.id)">
                  同步指数信息
                </el-dropdown-item>
                <el-dropdown-item @click.native="computeAllCciById(scope.row.id)">
                  计算所有cci
                </el-dropdown-item>
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
import crudStockInfo from '@/api/stockInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, code: null, shortName: null, region: null, popularFlag: null, scale: null, releaseDate: null, huanShouPtg: null, totalShares: null, fenhong: null, manageRadio: null, holderRadio: null, sellRadio: null, busiCompareBase: null, followIndex: null, createTime: null, updateTime: null, createUserId: null, updateUserId: null }
export default {
  name: 'StockInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['switch_status_1_0'],
  cruds() {
    return CRUD({ title: 'dd', url: 'api/stockInfo/query', idField: 'id', sort: 'id,desc', crudMethod: { ...crudStockInfo }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'stockInfo:add'],
        edit: ['admin', 'stockInfo:edit'],
        del: ['admin', 'stockInfo:del']
      },
      rules: {
        code: [
          { required: true, message: '编号不能为空', trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: '简称不能为空', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '区域：SH/SZ不能为空', trigger: 'blur' }
        ],
        popularFlag: [
          { required: true, message: '是否流行不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'code', display_name: '编号' },
        { key: 'shortName', display_name: '简称' },
        { key: 'region', display_name: '区域：SH/SZ' },
        { key: 'popularFlag', display_name: '是否流行' }
      ]
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
    saveAllDailyStat(id) {
      crudStockInfo.saveAllDailyStat(id).then(response => {
        this.$message.success('发起成功，请稍后查看同步结果')
      }).catch(() => {
        this.$message.error('操作失败')
      })
    },
    saveLatest30Days() {
      crudStockInfo.saveLatest30Days().then(response => {
        this.$message.success('发起成功，请稍后查看同步结果')
      }).catch(() => {
        this.$message.error('操作失败')
      })
    },
    computeAllCciById(id) {
      crudStockInfo.computeAllCciById(id).then(response => {
        this.$message.success('发起计算一个指数的所有cci，请稍后查看同步结果')
      }).catch(() => {
        this.$message.error('操作失败')
      })
    },
    computeLatest30DaysCci() {
      crudStockInfo.computeLatest30DaysCci().then(response => {
        this.$message.success('发起计算近30天cci，请稍后查看同步结果')
      }).catch(() => {
        this.$message.error('操作失败')
      })
    }
  }
}
</script>

<style scoped>

</style>
