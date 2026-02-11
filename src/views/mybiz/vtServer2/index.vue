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
    <template #table-operation="{ row }">
      <el-dropdown size="mini" type="primary">
        <el-button type="primary" size="mini">
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="saveAllDailyStat(row.id)">
            测试菜单一
          </el-dropdown-item>
          <el-dropdown-item @click.native="updateMissingFields(row.id)">
            测试菜单二
          </el-dropdown-item>
          <el-dropdown-item @click.native="computeAllCciById(row.id)">
            测试菜单三
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </base-crud-page>
</template>

<script>
import BaseCrudPage from '@/components/BaseCrudPage.vue'
import crudVtServer from '@/api/vtServer'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'VtServer',
  components: { BaseCrudPage },
  mixins: [presenter(), ],
  dicts: ['switch_status_1_0'],
  cruds() {
    return CRUD({ title: 'VtServerController', url: 'api/vtServer/query', idField: 'id', sort: 'id,desc', crudMethod: { ...crudVtServer }})
  },
  data() {
    return {
      defaultForm: { id: null, name: null, portBindings: null, timeZoneEnabled: 1, domain: null, httpsEnabled: null, imageName: null, enabled: null, createBy: null, updateBy: null, createTime: null, updateTime: null },
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
