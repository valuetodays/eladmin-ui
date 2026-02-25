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
        <el-button type="primary" size="mini"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="testMenu1(row.id)"> 测试菜单一 </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </base-crud-page>
</template>

<script>
  import BaseCrudPage from '@/components/BaseCrudPage.vue'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import crudHttpsDomain from '@/api/mybiz/https-domain'

  const defaultForm = { id: null, title: null, domain: null, remark: null }
  export default {
    name: 'HttpsDomain',
    components: { BaseCrudPage },
    mixins: [presenter()],
    cruds() {
      return CRUD({
        title: 'https域名管理',
        url: 'api/httpsDomain/query',
        idField: 'id',
        sort: 'id,desc',
        crudMethod: { ...crudHttpsDomain },
      })
    },
    data() {
      return {
        permission: {
          add: ['admin', 'httpsDomain:add'],
          edit: ['admin', 'httpsDomain:edit'],
          del: ['admin', 'httpsDomain:del'],
        },
        rules: {
          title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
          domain: [{ required: true, message: '域名不能为空', trigger: 'blur' }],
        },
        defaultForm: {
          id: null, title: null, domain: null, remark: null  
        },
        searchFields: [
          { label: '标题', prop: 'title', props: { clearable: true, size: 'small', style: 'width:185px' } },
          { label: '域名', prop: 'domain', props: { clearable: true, size: 'small', style: 'width:185px' } },
          { label: '备注', prop: 'remark', props: { clearable: true, size: 'small', style: 'width:185px' } },
        ],
        tableColumns: [
          { prop: 'id', label: 'ID' },
          { prop: 'title', label: '标题' },
          { prop: 'domain', label: '域名' },
          { prop: 'remark', label: '备注' },
        ],
        formFields: [
          { label: '名称', prop: 'id', },
          { label: '标题', prop: 'title', },
          { label: '域名', prop: 'domain', },
          {
            label: '备注',
            prop: 'remark',
            type: 'el-input',
            props: { rows: 3, type: 'textarea', style: 'width:370px' },
          },
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
      testMenu1(id) {
        this.$message.success('testMenu1: ' + id)
      },
    },
  }
</script>

<style scoped></style>
