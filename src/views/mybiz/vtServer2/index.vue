<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
    <base-crud-page :crud="crud" :searchFields="searchFields">
      <template #crud-operation>
        <crudOperation :permission="permission" />
      </template>
    </base-crud-page>


      <!-- 表单弹窗 -->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item v-for="f in formFields" :key="f.prop" :label="f.label" :prop="f.prop">
            <!-- switch -->
            <el-tooltip
              v-if="f.type === 'switch'"
              :content="'Switch value: ' + form[f.prop]"
              placement="top"
            >
              <el-switch
                active-color="#13ce66"
                active-text="启用"
                :active-value="true"
                inactive-color="#ff4949"
                inactive-text="停用"
                :inactive-value="false" 
                v-model="form[f.prop]"
                v-bind="f.props">
              </el-switch>
            </el-tooltip>

            <!-- 其它组件 -->
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
      
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />

        <el-table-column v-for="c in tableColumns" :key="c.prop" :prop="c.prop" :label="c.label">
          <!-- header -->
          <template v-if="c.headerTooltip" slot="header">
            <span>
              {{ c.label }}
              <el-tooltip :content="c.headerTooltip">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
          </template>

          <template slot-scope="scope">
            <!-- switch 类型 -->
            <el-tooltip
              v-if="c.type === 'switch'"
              :content="'current value: ' + dict.label.switch_status_1_0[scope.row[c.prop]]"
              placement="top"
            >
              <el-switch
                v-model="scope.row[c.prop]"
                :disabled="true"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                :inactive-value="false"
                :active-value="true"
              />
            </el-tooltip>

            <!-- 普通字段 -->
            <span v-else>
              {{ scope.row[c.prop] }}
            </span>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column v-if="checkPer(['admin','vtServer:edit','vtServer:del'])" label="操作" width="150px" align="center">
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
import BaseCrudPage from '@/components/BaseCrudPage.vue'
import crudVtServer from '@/api/vtServer'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, portBindings: null, timeZoneEnabled: 1, domain: null, httpsEnabled: null, imageName: null, enabled: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'VtServer',
  components: { BaseCrudPage, pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['switch_status_1_0'],
  cruds() {
    return CRUD({ title: 'VtServerController', url: 'api/vtServer/query', idField: 'id', sort: 'id,desc', crudMethod: { ...crudVtServer }})
  },
  data() {
    return {
      query: {},
      permission: {
        add: ['admin', 'vtServer:add'],
        edit: ['admin', 'vtServer:edit'],
        del: ['admin', 'vtServer:del']
      },
      rules: {
        id: [
          { required: true, message: 'ID不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        portBindings: [
          { required: true, message: '绑定的端口，外网->内网不能为空', trigger: 'blur' }
        ],
        timeZoneEnabled: [
          { required: true, message: 'timezone状态不能为空', trigger: 'blur' }
        ],
        domain: [
          { required: true, message: '域名不能为空', trigger: 'blur' }
        ],
        httpsEnabled: [
          { required: true, message: 'https状态不能为空', trigger: 'blur' }
        ],
        imageName: [
          { required: true, message: '镜像名称不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      },
      searchFields: [
        { label: '名称', prop: 'name', props: { clearable: true, size: 'small', style: 'width:90px' } },
        { label: '绑定的端口', prop: 'portBindings', tooltip: '外网 → 内网', props: { clearable: true, size: 'small', style: 'width:90px' } },
        { label: 'timezone状态', prop: 'timeZoneEnabled', type: 'select', options: [], props: { clearable: true, size: 'small', style: 'width:90px' } },
        { label: '域名', prop: 'domain' , props: { clearable: true, size: 'small', style: 'width:90px' }},
        { label: 'https状态', prop: 'httpsEnabled', type: 'select', options: [], props: { clearable: true, size: 'small', style: 'width:90px' } },
        { label: '镜像名称', prop: 'imageName', props: { clearable: true, size: 'small', style: 'width:90px' } },
        { label: '状态', prop: 'enabled', type: 'select', options: [], props: { clearable: true, size: 'small', style: 'width:90px' } }
      ],
      tableColumns: [
        { prop: 'id', label: 'ID' },
        { prop: 'name', label: '名称' },
        { prop: 'portBindings', label: '绑定的端口',    headerTooltip: '外网 → 内网' },
        { prop: 'timeZoneEnabled', label: 'timezone状态', type: 'switch' },
        { prop: 'domain', label: '域名' },
        { prop: 'httpsEnabled', label: 'https状态', type: 'switch' },
        { prop: 'imageName', label: '镜像名称' },
        { prop: 'enabled', label: '状态', type: 'switch' },
        { prop: 'createBy', label: '创建者' },
        { prop: 'updateBy', label: '更新者' },
        { prop: 'createTime', label: '创建日期' },
        { prop: 'updateTime', label: '更新时间' },
      ],
      formFields: [
        { label: '名称1', prop: 'name' },
        { label: '绑定的端口', prop: 'portBindings', type: 'el-input', props: { rows: 3, type: 'textarea', style: 'width:370px' } },
        { label: 'timezone状态', prop: 'timeZoneEnabled', type: 'switch' },
        { label: '域名', prop: 'domain' },
        { label: 'https状态', prop: 'httpsEnabled', type: 'switch' },
        { label: '镜像名称', prop: 'imageName' },
        { label: '状态', prop: 'enabled', type: 'switch' }
      ],
    }
  },
  created() {
    // 组件初始化后，dict 已经加载
    this.searchFields.find(f => f.prop === 'timeZoneEnabled').options = this.dict['switch_status_1_0']
    this.searchFields.find(f => f.prop === 'httpsEnabled').options = this.dict['switch_status_1_0']
    this.searchFields.find(f => f.prop === 'enabled').options = this.dict['switch_status_1_0']
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeToAdd]() {
      // if (this.form.isTop === '1') {
      //   this.form.pid = null
      // }
      return true
    },
  }
}
</script>

<style scoped>

</style>
