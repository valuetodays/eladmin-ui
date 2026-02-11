<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle" style="display: flex; flex-wrap: wrap; gap: 8px;">
        <!-- 搜索 -->
        <div style="display: inline-flex; align-items: center;" v-for="f in searchFields" >
          <el-tooltip v-if="f.tooltip" :content="f.tooltip" placement="top">
            <label class="el-form-item-label" style="cursor: help;">{{ f.label }}
              <i class="el-icon-question" style="margin-left: 4px; cursor: pointer;"></i>
            </label>
          </el-tooltip>
          <template v-else>
            <label class="el-form-item-label">{{ f.label }}</label>
          </template>

          <component
            :is="f.type === 'select' ? 'el-select' : 'el-input'"
            v-model="query[f.prop]"
            v-bind="f.props"
            class="filter-item"
            @keyup.enter.native="f.type !== 'select' && crud.toQuery"
            @change="f.type === 'select' && crud.toQuery"
          >
            <el-option
              v-if="f.options"
              v-for="o in f.options"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </component>
        </div>

        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item prop="portBindings">
            <template #label>
              <span style="display: inline-flex; align-items: center;">
                绑定的端口
                <el-tooltip content="外网 → 内网" placement="top">
                  <i class="el-icon-question" style="margin-left: 4px; cursor: pointer;"></i>
                </el-tooltip>
              </span>
            </template>
            <el-input v-model="form.portBindings" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="timezone状态" prop="timeZoneEnabled">
            <el-tooltip :content="'Switch value: ' + form.timeZoneEnabled" placement="top">
              <el-switch
                active-color="#13ce66"
                active-text="启用"
                :active-value="true"
                inactive-color="#ff4949"
                inactive-text="停用"
                :inactive-value="false"
                v-model="form.timeZoneEnabled">
              </el-switch>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="域名" prop="domain">
            <el-input v-model="form.domain" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="https状态" prop="httpsEnabled">
            <el-tooltip :content="'Switch value: ' + form.httpsEnabled" placement="top">
              <el-switch
                active-color="#13ce66"
                active-text="启用"
                :active-value="true"
                inactive-color="#ff4949"
                inactive-text="停用"
                :inactive-value="false"
                v-model="form.httpsEnabled">
              </el-switch>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="镜像名称" prop="imageName">
            <el-input v-model="form.imageName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态" prop="enabled">
            <el-tooltip :content="'Switch value: ' + form.enabled" placement="top">
              <el-switch
                active-color="#13ce66"
                active-text="启用"
                :active-value="true"
                inactive-color="#ff4949"
                inactive-text="停用"
                :inactive-value="false"
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
import crudVtServer from '@/api/vtServer'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, portBindings: null, timeZoneEnabled: 1, domain: null, httpsEnabled: null, imageName: null, enabled: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'VtServer',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['switch_status_1_0'],
  cruds() {
    return CRUD({ title: 'VtServerController', url: 'api/vtServer/query', idField: 'id', sort: 'id,desc', crudMethod: { ...crudVtServer }})
  },
  data() {
    return {
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
      queryTypeOptions: [
        { key: 'name', display_name: '名称' },
        { key: 'portBindings', display_name: '绑定的端口，外网->内网' },
        { key: 'timeZoneEnabled', display_name: 'timezone状态' },
        { key: 'domain', display_name: '域名' },
        { key: 'httpsEnabled', display_name: 'https状态' },
        { key: 'imageName', display_name: '镜像名称' },
        { key: 'enabled', display_name: '状态' }
      ],
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
