<template>
  <div class="list-table-c">
    <div class="table-btn-c">
      <div class="left-btn-c">
        <el-button
          v-if="options.addBtn"
          class="table-btn"
          type="primary"
          size="small"
          :icon="options.addBtnIcon || ''"
          @click="rowAdd()"
        >
          {{ options.addBtnText || '新增' }}
        </el-button>

        <slot name="menuLeft" />
      </div>
      <div class="right-btn-c">
        <slot name="menuRight" />

        <el-button
          v-if="options.refreshBtn"
          class="table-btn"
          size="small"
          circle
          :icon="options.refreshBtnIcon || ''"
          @click="tableRefresh()"
        />
        <el-button
          v-if="options.colShowHideBtn"
          class="table-btn"
          size="small"
          circle
          :icon="options.colShowHideBtnIcon || ''"
          @click="handleColsShowHide()"
        />
        <el-button
          v-if="options.searchBtn"
          class="table-btn"
          size="small"
          circle
          :icon="options.searchBtnIcon || ''"
        />
      </div>
    </div>

    <el-table
      ref="listTable"
      class="list-table"
      v-loading="tableLoading"
      :data="data"
      :height="height"
      :max-height="maxHeight"
      :border="options.border"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="options.selection" type="selection" width="60" />

      <el-table-column v-if="options.index" :label="options.indexLabel || '序号'" fixed="left" :width="options.indexWidth || 60">
        <template #header="scope">
            <slot name="indexHeader" v-bind="scope">
              {{ options.indexLabel || '序号' }}
            </slot>
        </template>
        <template #default="scope">
          <slot name="index" v-bind="scope">
            <span :rowID="scope.row.id">{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </slot>
        </template>
      </el-table-column>

      <template v-for="(column, index) in options.column" >
        <el-table-column 
          v-if="!column.hide"
          :key="index"
          :prop="column.prop"
          :fixed="column.fixed"
          :label="column.label"
          :class-name="`${column.prop}-row ${column.className || ''}`"
          :width="column.width || 'auto'"
          :min-width="column.minWidth"
          :sortable="!!column.sortable"
          :row-key="column.rowKey || 'id'"
          :show-overflow-tooltip="column.overHidden || false"
          :align="column.align || options.align"
          :header-align="column.headerAlign || options.headerAlign"
        >
          <template #header>
            <slot v-if="column.headerslot" :name="column.prop+'Header'" :index="index" v-bind="{ column }">
              {{ column.label }}
            </slot>
            <div v-else>{{ column.label }}</div>
          </template>
          
          <template #default="scope">
            <slot v-if="column.slot" :name="column.prop" :index="index" v-bind="scope" />
            <div v-else class="column-item" v-html="columnBuilder(scope.row, column)" />
          </template>
        </el-table-column>
      </template>
      
      <el-table-column
        v-if="options.menu"
        label="操作" 
        min-width="130" 
        align="center"
      >
        <template slot-scope="scope">
          <el-button v-if="options.viewBtn" type="text" size="small" :icon="options.viewBtnIcon || ''" @click="rowView(scope.row, scope.$index)">
            {{ options.viewBtnText || '查看' }}
          </el-button>
          <el-button v-if="options.editBtn" type="text" size="small" :icon="options.editBtnIcon || ''" @click="rowEdit(scope.row, scope.$index)">
            {{ options.editBtnText || '修改' }}
          </el-button>
          <el-popconfirm v-if="options.delBtn" icon="el-icon-info" icon-color="red" title="确定删除吗？" placement="top" @confirm="rowDelete(scope.row, scope.$index)">
            <el-button slot="reference" type="text" size="small" :icon="options.delBtnIcon || ''" style="margin-left: 10px;">
                {{ options.delBtnText || '删除' }}
            </el-button>
          </el-popconfirm>

          <slot name="menu" v-bind="scope" type="text" size="small"></slot>
        </template>
      </el-table-column>

      <slot />
    </el-table>

    <div v-if="!!page.total" class="page-style">
      <pagination
        :total="page.total"
        :page="page.currentPage"
        :limit="page.pageSize"
        @pagination="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-if="aevData"
      class="aevDialog"
      :title="aevTitle"
      :visible.sync="aevDialogVisible"
      width="50%"
      :close-on-press-escape="aevType === 'view'"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form ref="aevForm" :rules="aevFormRules" :model="aevData" label-width="130px">
        <template 
          v-for="col in options.column"
        >
          <el-form-item 
            v-if="!(aevType === 'edit' && col.editDisplay === false) || (aevType === 'add' && col.addDisplay === false)" 
            :key="col.prop" 
            :label="`${col.label}：`" 
            :prop="col.prop"
          >
            <span v-if="aevType === 'view'"  class="view-c">{{ aevData[col.prop] }}</span>
            <div v-else>
              <el-input
                v-model="aevData[col.prop]"
                :type="col.type || 'input'"
                :disabled="(aevType === 'edit' && col.editDisabled) || (aevType === 'add' && col.addDisabled) || false"
                :maxlength="col.maxlength || null" 
                :show-word-limit="!!col.maxlength"
                placeholder="请输入" 
                clearable 
              />
            </div>
          </el-form-item>
        </template>
      </el-form>

      <div v-if="aevType !== 'view'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="aevDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog 
      v-if="colsShowHideDialogVisible"
      title="列显隐"
      class="colsShowHideDialog"
      :visible.sync="colsShowHideDialogVisible"
    >
      <el-checkbox-group v-model="colsShowHideSelected">
        <template v-for="item in options.column">
          <el-checkbox v-if="item.showColumn !== false" :key="item.label" :label="item.label" style="margin-bottom: 15px" />
        </template>
      </el-checkbox-group>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '../../Pagination/src/main.vue'

export default {
  name: 'ListTable',
  components: { Pagination },
  props: {
    option: { // 默认的列
      type: Object,
      require: true,
      default: () => Object.assign({})
    },
    data: { // table 数据
      type: Array,
      require: true,
      default: () => []
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    permission: { // 权限控制
      type: [Object, Function],
      default: () => Object.assign({})
    },
    beforeOpen: {
      type: Function,
      default: null
    },
    page: {
      type: Object,
      default: () => Object.assign({
        total: 0, // 总数
        currentPage: 1, // 当前页
        pageSize: 10 // 页大小
      })
    },
    height: { // 表格最大高度
      type: [Number, String],
      default: null
    },
    maxHeight: {
      type: [Number, String],
      default: null
    }
  },
  data: function() {
    return {
      options: {
        index: true, // 是否显示 序号
        indexLabel: '序号',
        indexWidth: null, // 序号长度
        selection: false, // 行多选
        align: 'center', // 对齐方式
        headerAlign: 'center', // 表头对齐方式
        border: true, // 是否显示 table 边框
        menu: true, // 是否显示操作栏
        viewBtn: false,
        viewBtnText: '',
        viewBtnIcon: 'el-icon-view',
        refreshBtn: true,
        refreshBtnIcon: 'el-icon-refresh',
        colShowHideBtn: true,
        colShowHideBtnIcon: 'el-icon-s-operation',
        searchBtn: false,
        searchBtnIcon: 'el-icon-search',
        addBtn: true,
        addBtnText: '',
        addBtnIcon: 'el-icon-plus',
        editBtn: true,
        editBtnText: '',
        editBtnIcon: 'el-icon-edit',
        delBtn: true,
        delBtnText: '',
        delBtnIcon: 'el-icon-delete',
        column: []
      },

      // 弹窗数据
      aevDialogVisible: false,
      aevType: null,
      aevTitle: null,
      aevData: null,
      aevFormRules: {},

      // 列显隐
      colsShowHideSelected: [],
      colsShowHideDialogVisible: false,
    }
  },
  watch: {
    option: {
      deep: true,
      immediate: true,
      handler() {
        Object.assign(this.options, this.option);

        (this.options.column || []).forEach(col => { // 注入表单验证
          if (col.rules) this.aevFormRules[col.prop] = col.rules
        })
      }
    },
    permission: { // 权限控制
      deep: true,
      immediate: true,
      handler() {
        if (typeof this.permission !== 'function') { // 对象是全局控制
          Object.assign(this.options, this.permission || {});
        }
        // 函数 要给每种btn包一层func判断，暂时不弄，可以通过menu插槽来自定义判断
      }
    },
    colsShowHideSelected(newArrayVal) {
      const noSelected = this.options.column.filter(item => !newArrayVal.includes(item.label)).map(item => item.label);
      this.options.column.forEach(item => {
        item.hide = noSelected.includes(item.label)
        this.$nextTick(() => {
          this.$refs.listTable.doLayout()
        })
      })
    }
  },
  created() {
    (this.option.column || []).forEach(col => {
      if (!col.hide) this.colsShowHideSelected.push(col.label) // 列 显隐
    })
    
    this.$emit('on-load', this.page)
  },
  methods: {
    columnBuilder(row, column) { // 调用配置渲染或者默认渲染
      if (column.columnBuilder && typeof column.columnBuilder === 'function') {
        return column.columnBuilder(row, column)
      }
      return '<span>' + this.filterNull(row[column.prop]) + '</span>'
    },
    filterNull(val) { // 空值过滤
      return val === null || val === undefined ? '-' : val
    },
    tableRefresh() {
      this.$emit('refresh-change', this.page)
    },
    handleColsShowHide() {
      this.colsShowHideDialogVisible = true
    },
    handleCurrentChange(pageVal) {
      this.$emit('current-change', pageVal.page)
      this.$emit('sizeChange', pageVal.limit)

      Object.assign(this.page, {
        currentPage: pageVal.page,
        pageSize: pageVal.limit
      })
      
      this.$emit('on-load', this.page)
    },
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    },
    // 格式化 row 编辑数据
    formatAevData(row) {
      const obj = {};
      (this.options.column || []).forEach(col => {
          obj[col.prop] = row[col.prop] || col.value || null
      })
      return obj
    },
    rowView(row, index) {
      const done = (formData = null) => {
        this.$nextTick(() => {
          this.aevType = 'view'
          this.aevTitle = '查看'
          this.aevDataIndex = 0
          this.aevData = formData ? this.formatAevData(formData) : this.formatAevData(row)
          this.$refs['aevForm'] && this.$refs['aevForm'].clearValidate()
          this.aevDialogVisible = true
        })
      }

      typeof this.beforeOpen === 'function' ? this.beforeOpen(done, 'view', row, index) : done()
    },
    rowAdd() {
      const done = () => {
        this.$nextTick(() => {
          this.aevType = 'add'
          this.aevTitle = '新增'
          this.aevDataIndex = null
          this.aevData = this.formatAevData({})
          this.$refs['aevForm'] && this.$refs['aevForm'].clearValidate()
          this.aevDialogVisible = true
        })
      }

      typeof this.beforeOpen === 'function' ? this.beforeOpen(done, 'add') : done()
    },
    rowEdit(row, index) {
      const done = (formData = null) => {
        this.$nextTick(() => {
          this.aevType = 'edit'
          this.aevTitle = '编辑'
          this.aevDataIndex = index
          this.aevData = formData ? this.formatAevData(formData) : this.formatAevData(row)
          this.$refs['aevForm'] && this.$refs['aevForm'].clearValidate()
          this.aevDialogVisible = true
        })
      }

      typeof this.beforeOpen === 'function' ? this.beforeOpen(done, 'edit', row, index) : done()
    },
    // 删除行
    rowDelete(row, index) {
      this.$emit('row-del', row, index, () => {
        this.$nextTick(() => (this.data || []).splice(index, 1))
      })
    },
    // row 编辑弹窗-保存
    handleSubmit() {
      this.$refs['aevForm'].validate((valid) => {
        if (valid) {
          const done = () => {
            this.$nextTick(() => {
              if (this.aevDataIndex === null) {
                (this.data || []).unshift(this.aevData)
              } else {
                Object.assign(this.data[this.aevDataIndex], this.aevData)
              }
              this.aevDialogVisible = false
            })
          }

          const loading = () => { /** btn 改成disabled状态 */}

          this.$emit('row-update', this.aevData, this.aevDataIndex, done, loading)
          this.$emit('row-save', this.aevData, this.aevDataIndex, done, loading)
          if (this.aevDataIndex === null) { // 额外多余一个触发新增事件
            this.$emit('row-add', this.aevData, done, loading)
          }
        }
      })
    },
    rowClick(row, column, event) {
      this.$emit('row-click', row, column, event)
    },
    clearSelection() {
      this.$refs.listTable.clearSelection()
    }
  }
}
</script>

<style>
.table-btn-c {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.page-style {
  text-align: right;
  font-size: 14px;
  letter-spacing: -0.43px;
}
</style>