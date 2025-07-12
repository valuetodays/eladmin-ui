<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">名称</label>
        <el-input v-model="query.name" clearable placeholder="名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">timezone状态</label>
        <el-tooltip :content="'Switch value: ' + query.timeZoneEnabled" placement="top">
          <el-switch
                  active-color="#13ce66"
                  active-text="启用"
                  active-value="1"
                  inactive-color="#ff4949"
                  inactive-text="停用"
                  inactive-value="0"
                  v-model="query.timeZoneEnabled">
          </el-switch>
        </el-tooltip>        
        <label class="el-form-item-label">域名</label>
        <el-input v-model="query.domain" clearable placeholder="域名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">https状态</label>
        <!-- <el-input v-model="query.httpsEnabled" clearable placeholder="https状态" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" /> -->
        <!-- <el-radio v-model="query.httpsEnabled" >{{ item.label }}</el-radio> -->
        <el-radio-group v-model="query.httpsEnabled" size="medium">
          <el-radio-button v-for="item in dict.enabled_status" :key="item.id" :label="item.value">{{ item.label }}</el-radio-button>
        </el-radio-group>

        <label class="el-form-item-label">镜像地址</label>
        <el-input v-model="query.imageName" clearable placeholder="镜像地址" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">状态</label>
        <el-input v-model="query.enabled" clearable placeholder="状态" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="绑定的端口，外网->内网" prop="portBindings">
            <el-input v-model="form.portBindings" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="timezone状态" prop="timeZoneEnabled">
            <el-radio v-model="form.timeZoneEnabled" v-for="item in dict.enabled_status" :key="item.id" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
          <el-form-item label="域名" prop="domain">
            <el-input v-model="form.domain" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="https状态" prop="httpsEnabled">
            <el-radio v-model="form.httpsEnabled" v-for="item in dict.enabled_status" :key="item.id" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
          <el-form-item label="镜像地址" prop="imageName">
            <el-input v-model="form.imageName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态" prop="enabled">
            <el-radio v-model="form.enabled" v-for="item in dict.enabled_status" :key="item.id" :label="item.value">{{ item.label }}</el-radio>
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
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="portBindings" label="绑定的端口，外网->内网" />
        <el-table-column prop="timeZoneEnabled" label="timezone状态">
          <template slot-scope="scope">
            {{ dict.label.enabled_status[scope.row.timeZoneEnabled] }}
          </template>
        </el-table-column>
        <el-table-column prop="domain" label="域名" />
        <el-table-column prop="httpsEnabled" label="https状态">
          <template slot-scope="scope">
            {{ dict.label.enabled_status[scope.row.httpsEnabled] }}
          </template>
        </el-table-column>
        <el-table-column prop="imageName" label="镜像地址" />
        <el-table-column prop="enabled" label="状态">
          <template slot-scope="scope">
            {{ dict.label.enabled_status[scope.row.enabled] }}
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" />
        <el-table-column prop="updateBy" label="更新者" />
        <el-table-column prop="createTime" label="创建日期" />
        <el-table-column prop="updateTime" label="更新时间" />
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

const defaultForm = { id: null, name: null, portBindings: null, timeZoneEnabled: null, domain: null, httpsEnabled: null, imageName: null, enabled: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'VtServer',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['enabled_status'],
  cruds() {
    return CRUD({ title: 'VtServerController', url: 'api/vtServer', idField: 'id', sort: 'id,desc', crudMethod: { ...crudVtServer }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'vtServer:add'],
        edit: ['admin', 'vtServer:edit'],
        del: ['admin', 'vtServer:del']
      },
      rules: {
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
          { required: true, message: '镜像地址不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
      },
      queryTypeOptions: [
        { key: 'name', display_name: '名称' },
        { key: 'timeZoneEnabled', display_name: 'timezone状态' },
        { key: 'domain', display_name: '域名' },
        { key: 'httpsEnabled', display_name: 'https状态' },
        { key: 'imageName', display_name: '镜像地址' },
        { key: 'enabled', display_name: '状态' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
