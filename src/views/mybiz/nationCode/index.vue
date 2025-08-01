<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">国家编码2位</label>
        <el-input v-model="query.code" clearable placeholder="国家编码2位" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">国家编码3位</label>
        <el-input v-model="query.alpha3Code" clearable placeholder="国家编码3位" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">国家数字编码</label>
        <el-input v-model="query.numeric" clearable placeholder="国家数字编码" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">国家名称（英文）</label>
        <el-input v-model="query.englishName" clearable placeholder="国家名称（英文）" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">国家名称（中文）</label>
        <el-input v-model="query.chineseName" clearable placeholder="国家名称（中文）" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">货币符号</label>
        <el-input v-model="query.symbol" clearable placeholder="货币符号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">货币</label>
        <el-input v-model="query.currency" clearable placeholder="货币" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">手机区号</label>
        <el-input v-model="query.phoneAreaCode" clearable placeholder="手机区号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-tooltip content="状态：1启用、0禁用" placement="top">
          <label class="el-form-item-label" style="cursor: help;">
            状态
            <i class="el-icon-question" style="margin-left: 4px; cursor: pointer;"></i>
          </label>
        </el-tooltip>  
        <el-select v-model="query.enabled" clearable size="small"
                placeholder="状态"
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
          <el-form-item label="国家编码2位" prop="code">
            <el-input v-model="form.code" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="国家编码3位" prop="alpha3Code">
            <el-input v-model="form.alpha3Code" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="国家数字编码" prop="numeric">
            <el-input v-model="form.numeric" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="国家名称（英文）" prop="englishName">
            <el-input v-model="form.englishName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="国家名称（中文）" prop="chineseName">
            <el-input v-model="form.chineseName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货币符号">
            <el-input v-model="form.symbol" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货币" prop="currency">
            <el-input v-model="form.currency" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="手机区号" prop="phoneAreaCode">
            <el-input v-model="form.phoneAreaCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="国旗" prop="flag">
            <el-input v-model="form.flag" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态" prop="enabled">
            <el-tooltip :content="'状态：1启用、0禁用'" placement="top">
              <el-switch
                active-color="#13ce66"
                active-text="启用"
                :active-value="1"
                inactive-color="#ff4949"
                inactive-text="停用"
                :inactive-value="0"
                v-model="form.enabled">
              </el-switch>
            </el-tooltip>
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
        <el-table-column prop="id" label="id" />
        <el-table-column prop="code" label="国家编码2位" />
        <el-table-column prop="alpha3Code" label="国家编码3位" />
        <el-table-column prop="numeric" label="国家数字编码" />
        <el-table-column prop="englishName" label="国家名称（英文）" />
        <el-table-column prop="chineseName" label="国家名称（中文）" />
        <el-table-column prop="symbol" label="货币符号" />
        <el-table-column prop="currency" label="货币" />
        <el-table-column prop="phoneAreaCode" label="手机区号" />
        <el-table-column prop="flag" label="国旗" />
        <el-table-column prop="enabled" label="状态">
          <template slot-scope="scope">
            <el-tooltip :content="'状态：1启用、0禁用'" placement="top">
              <el-switch
                v-model="scope.row.enabled"
                :disabled="true"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                :inactive-value="0"
                :active-value="1"
              />
            </el-tooltip>
          </template>
        </el-table-column>        
        <el-table-column prop="createTime" label="createTime" />
        <el-table-column prop="updateTime" label="updateTime" />
        <el-table-column v-if="checkPer(['admin','nationCode:edit','nationCode:del'])" label="操作" width="150px" align="center">
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
  </div>
</template>

<script>
import crudNationCode from '@/api/nationCode'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, code: null, alpha3Code: null, numeric: null, englishName: null, chineseName: null, symbol: null, currency: null, phoneAreaCode: null, flag: null, enabled: null, createTime: null, updateTime: null }
export default {
  name: 'NationCode',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['switch_status_1_0'],
  cruds() {
    return CRUD({ title: '国家编码', url: 'api/nationCode/query', idField: 'id', sort: 'id,desc', crudMethod: { ...crudNationCode }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'nationCode:add'],
        edit: ['admin', 'nationCode:edit'],
        del: ['admin', 'nationCode:del']
      },
      rules: {
        code: [
          { required: true, message: '国家编码2位不能为空', trigger: 'blur' }
        ],
        alpha3Code: [
          { required: true, message: '国家编码3位不能为空', trigger: 'blur' }
        ],
        numeric: [
          { required: true, message: '国家数字编码不能为空', trigger: 'blur' }
        ],
        englishName: [
          { required: true, message: '国家名称（英文）不能为空', trigger: 'blur' }
        ],
        chineseName: [
          { required: true, message: '国家名称（中文）不能为空', trigger: 'blur' }
        ],
        currency: [
          { required: true, message: '货币不能为空', trigger: 'blur' }
        ],
        phoneAreaCode: [
          { required: true, message: '手机区号不能为空', trigger: 'blur' }
        ],
        flag: [
          { required: true, message: '国旗不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '状态：1启用、0禁用不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'code', display_name: '国家编码2位' },
        { key: 'alpha3Code', display_name: '国家编码3位' },
        { key: 'numeric', display_name: '国家数字编码' },
        { key: 'englishName', display_name: '国家名称（英文）' },
        { key: 'chineseName', display_name: '国家名称（中文）' },
        { key: 'symbol', display_name: '货币符号' },
        { key: 'currency', display_name: '货币' },
        { key: 'phoneAreaCode', display_name: '手机区号' },
        { key: 'enabled', display_name: '状态：1启用、0禁用' }
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
  }
}
</script>

<style scoped>

</style>
