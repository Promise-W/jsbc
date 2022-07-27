# ListTable 表格

通过简单配置，搭建基本的表格页面。

## 基本用法
::: demo 最简单用法
```html
<template>
  <ListTable 
    :option="option" 
    :data="tableData"
    :table-loading="loading"
    @refresh-change="getList"
    @on-load="getList"
  />
</template>

<script>
  export default {
  data() {
    return {
      loading: false, // 加载动画
      option: {
        column: [
          {
            label: '名字', // 属性name
            prop: 'name', // 属性key
          },
          {
            label: '公司',
            prop: 'company'
          },
          {
            label: '备注',
            prop: 'remark',
            type: 'textarea'
          },
          {
            label: '隐藏列', // 隐藏列
            prop: 'hideProp',
            hide: true
          }
        ]
      },
      tableData: []
    }
  },
  methods: {
    getList() {
      this.loading = true
      
      setTimeout(() => { // ajax || axios
        this.tableData = [
          { name: 'mock1', company: '华为', 'remark': '我是华为公司人员', 'hideProp': '我是隐藏列' },
          { name: 'mock2', company: '海思', 'remark': '我是海思公司人员' }
        ]

        this.loading = false
      }, 600)
    }
  }
}
</script>
```
:::


## 基本用法 - 配置项
配置 option 丰富表格

::: demo 通过配置，显示各种按钮、展示默认操作列、使用插槽等
```html
<template>
  <ListTable 
    :option="option" 
    :data="tableData"
    :before-open="beforeOpen"
    :table-loading="loading"
    @row-del="rowDel"
    @row-update="rowUpdate"
    @row-click="rowClick"
    @selection-change="selectionChange"
    @refresh-change="getList"
    @on-load="getList"
  >
    <template slot="menuLeft">
      <el-button type="success" size="small">自定义按钮</el-button>
    </template>

    <template #menu="scope">
     <el-button icon="el-icon-check" type="text" size="small" @click="logScope(scope)">自定义操作按钮</el-button>
    </template>
  </ListTable>
</template>

<script>
  export default {
  data() {
    return {
      loading: false, // 加载动画
      option: {
        index: true, // 是否显示 序号
        indexLabel: '序号',
        selection: true, // 是否显示 checkbox(回调函数为selectionChange)
        refreshBtn: true, // 刷新按钮
        addBtn: true, // 新增按钮
        viewBtn: true, // 查看按钮
        editBtn: true, // 编辑按钮
        delBtn: true, // 删除按钮
        column: [
          {
            label: '名字',
            prop: 'name', // 属性key
            fixed: true, // 是否固定
            maxlength: 50, // 输入值最大字数
            sortable: true, // 是否排序
            editDisplay: false, // 编辑时 是否显示
            editDisabled: true, // 编辑时 是否可编辑
            value: 'mock-data', // 默认值
            rules: [{ // 表单验证规则
              required: true,
              message: "请输入姓名",
              trigger: "blur"
            }]
          },
          {
            label: '公司',
            prop: 'company',
            addDisplay: true, // 新增时 是否显示
            addDisabled: true, // 新增时 是否可编辑
            editDisabled: true,
            value: '国资委',
            columnBuilder(row, column) { // 可以不重写，默认取值 row[column.prop]
              return `<span style="font-weight: 700">${row[column.prop]}(我在配置中渲染)</span>`
            }
          },
          {
            label: '备注', // 使用列的具名插槽
            prop: 'remark',
            type: 'textarea'
          },
          {
            label: '隐藏列', // 使用列的具名插槽
            prop: 'hideProp',
            hide: true
          }
        ]
      },
      tableData: []
    }
  },
  methods: {
    getList() {
      this.loading = true
      
      setTimeout(() => { // ajax || axios
        this.tableData = [
          { name: 'mock1', company: '华为', 'remark': '我是华为公司人员', 'hideProp': '我是隐藏列' },
          { name: 'mock2', company: '海思', 'remark': '我是海思公司人员' }
        ]

        this.loading = false
      }, 600)
    },
    selectionChange(list){
      this.$message.success('选中的数据'+ JSON.stringify(list));
    },
    beforeOpen(done, type) { // add view edit
      console.log('beforeOpen type', type)
      if (['edit', 'view'].includes(type)) {
        // axios || ajax
      }
      done()
    },
    rowDel(row, index, done) { // delete
      console.log('delete', row, index)
      // axios || ajax
      done()
    },
    rowUpdate(row, index, done) { // edit add
      console.log('rowUpdate', row, index)
      // axios || ajax
      done()
    },
    rowClick(row, column, event) {
      this.$notify({
        showClose: true,
        message: '单击'+JSON.stringify(row),
        type: 'success',
      });
    },
    logScope(scope) {
      console.log('scope', scope)
    }
  }
}
</script>
```
:::

## 默认插槽
可补充column(默认插槽在列表最后)

::: demo 各列全部采用默认渲染
```html
<template>
  <ListTable 
    :option="option" 
    :data="tableData"
    :table-loading="loading"
    @refresh-change="getList"
  >
    <el-table-column label="操作(我在listTable默认插槽)" min-width="130" align="center">
      <template #default="{ row }">
        <el-button type="text" size="small" @click="handleEdit(row)">修改</el-button>
        <el-popconfirm icon="el-icon-info" icon-color="red" title="确定删除吗？" placement="top" @confirm="handleDel(row)">
          <el-button slot="reference" type="text" size="small" style="margin-left: 10px;">删除</el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </ListTable>
</template>

<script>
  export default {
  data() {
    return {
      loading: false,
      option: {
        menu: false,
        column: [
          {
            label: '名字',
            prop: 'name'
          },
          {
            label: '公司',
            prop: 'company'
          },
          {
            label: '备注', // 使用列的具名插槽
            prop: 'remark'
          }
        ]
      },
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true

      setTimeout(() => { // ajax || axios
        this.tableData = [
          { name: 'mock1', company: '华为', 'remark': '我是华为公司人员' },
          { name: 'mock2', company: '海思', 'remark': '我是海思公司人员' }
        ]

        this.loading = false
      }, 300)
    },
    handleEdit(row, scope) {
      console.log('edit', row, scope)
    },
    handleDel(row) {
      console.log('delete', row)
    }
  }
}
</script>
```
:::

## 具名插槽
通过具名插槽来自定义渲染column

::: demo 各列全部采用默认渲染
```html
<template>
  <ListTable 
    :option="option" 
    :data="tableData"
    :table-loading="loading"
    @refresh-change="getList"
  >
      <template #company="{ row }">
        {{ '具名插槽(company) - ' + row.company }}
      </template>

      <template #remark="{ row }">
        {{ '具名插槽(remark) - ' + row.remark }}
      </template>
    </ListTable>
</template>

<script>
  export default {
  data() {
    return {
      loading: false,
      option: {
        column: [
          {
            label: '名字',
            prop: 'name'
          },
          {
            label: '公司(我在listTable列的具名插槽)', // 使用列的具名插槽
            prop: 'company',
            slot: true
          },
          {
            label: '备注(我在listTable列的具名插槽)', // 使用列的具名插槽
            prop: 'remark',
            slot: true
          }
        ]
      },
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true

      setTimeout(() => { // ajax || axios
        this.tableData = [
          { name: 'mock1', company: '华为', 'remark': '我是华为公司人员' },
          { name: 'mock2', company: '海思', 'remark': '我是海思公司人员' }
        ]

        this.loading = false
      }, 300)
    }
  }
}
</script>
```
:::

## 表格分页
表格和分页结合

::: demo 表格和分页结合
```html
<template>
  <ListTable 
    :option="option" 
    :data="tableData"
    :table-loading="loading"
    :page="page"
    @refresh-change="getList"
    @on-load="getList"
  />
</template>

<script>
  export default {
  data() {
    return {
      loading: false,
      option: {
        column: [
          {
            label: '名字',
            prop: 'name'
          },
          {
            label: '公司',
            prop: 'company'
          },
          {
            label: '备注',
            prop: 'remark'
          }
        ]
      },
      tableData: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    getList(page) {
      console.log('page', page)
      this.loading = true
      setTimeout(() => { // ajax || axios
        this.tableData = [
          { name: 'mock1', company: '华为', 'remark': '我是华为公司人员' },
          { name: 'mock2', company: '海思', 'remark': '我是海思公司人员' }
        ]
        this.page.total = 100
        this.loading = false
      }, 300)
    }
  }
}
</script>
```
:::


## Table Attributes
<div class="special_table">

|     属性名   |    说明   |    类型    |   可选值   |   默认值   | 
|:----------|:----------|:----------|:----------|:----------|
| **\*** option    | 表格各列配置项    | object    | -    | {loading: false, column: []}    |
| **\*** data    | 显示的数据    | array    | —    | —    |
| loading    | 加载动画    | boolean    | true,false    | false   |
| permission | btn权限控制    | object    |  { xxBtn: true|false }   |    |
| page    | 是否显示分页    | object    |     | {total: 0, currentPage:1, pageSize: 10}   |
| before-open | 新增、查看、编辑弹窗前的钩子函数 | function    |  function   |  function   |
| scrollPartHeightOffset    | 表格偏移量    | number    | number    | 0    |

</div>

## Table Attributes option
<div class="special_table">

|     属性名   |    说明   |    类型    |   可选值   |   默认值   | 
|:----------|:----------|:----------|:----------|:----------|
| **\*** column   | 列配置项    | array    | []  | []   |
| index    | 是否显示 序号    | boolean    | true,false  | false   |
| indexLabel    | 序号名字    | string    | —    | 序号     |
| selection    | 是否显示 checkbox    | boolean    | true,false    | false   |
| refreshBtn   | 刷新按钮    | boolean    | true,false  | true   |
| refreshBtnIcon | 刷新按钮图标 | string  | -  | el-icon-refresh   |
| colShowHideBtn   | 列显示隐藏按钮    | boolean    | true,false  | true   |
| colShowHideBtnIcon | 列显示隐藏按钮图标 | string  | -  | el-icon-s-operation   |
| addBtn   | 新增按钮    | boolean    | true,false  | false   |
| addBtnText   | 新增按钮名字  | string  | -  | 新增   |
| addBtnIcon   | 新增按钮图标 | string  | -  | el-icon-plus   |
| menu    | 是否显示 操作列    | boolean    | true,false  | true   |
| viewBtn   | 查看按钮    | boolean    | true,false  | false   |
| addBtnText   | 查看按钮名字  | string  | -  | 查看   |
| addBtnIcon   | 查看按钮图标 | string  | -  | el-icon-view   |
| editBtn   | 编辑按钮    | boolean    | true,false  | true   |
| addBtnText   | 编辑按钮名字  | string  | -  | 编辑   |
| addBtnIcon   | 编辑按钮图标 | string  | -  | el-icon-edit   |
| delBtn   | 删除按钮    | boolean    | true,false  | true   |
| addBtnText   | 删除按钮名字  | string  | -  | 删除   |
| addBtnIcon   | 删除按钮图标 | string  | -  | el-icon-delete   |

</div>

## Table Events
暂无

## Table Methods
<div class="special_table">

|     方法名   |    说明   |  参数 |
|:----------|:----------|------|
| refresh-change  | 刷新列表 | -  |
| paginationFn   | 分页回调 | { page, limit } = obj |
| selection-change | 勾选selected行 | selection |
| row-del | row删除前的钩子函数 | (row,index,done) |
| row-update | row更新前的钩子函数 | (row,index,done) |
| row-save | 同上 row-update | (row,index,done) |
| row-add | row新增前的钩子函数 | (row,done) |

</div>

## Table Slot
<div class="special_table">

|     name   |    说明   | 
|:----------|:----------|
| menuLeft    | 表格头上左侧自定义btn |
| menuRight   | 表格头上右侧自定义btn |
| menu   | 表格自定义操作列 |

</div>

## Table-column Attributes
<div class="special_table">

|     属性名   |    说明   | 类型 |  可选值 | 默认值 |
|:----------|:----------| ----- | ------ | ----|
| name      | 列名 |  string | _| _ |
| prop   | 属性key |  string | _| _ |
| type   | 属性编辑形式 |  string | input,textarea | input |
| fixed    | 是否固定 |  boolean | true,false | false |
| hide    | 是否隐藏列 |  boolean | true,false | false |
| maxlength   | 输入值最大字数 |  number | _ | null |
| sortable    | 是否排序 |  boolean | true,false | false |
| addDisplay    | 新增时 是否显示 |  boolean | true,false | false |
| addDisabled    | 新增时 是否可编辑 |  boolean | true,false | false |
| editDisplay    | 编辑时 是否显示 |  boolean | true,false | false |
| editDisabled    | 编辑时 是否可编辑 |  boolean | true,false | false |
| value   | 默认值 |  string | _ |  |
| rules      | 表单验证规则 |  array | _ |  |

</div>

## Table-column Scoped Slot
<div class="special_table">

|     name    |    说明   | 
|:------------|:----------|
| #[**prop**] | 自定义列的内容，参数为 { row, column, $index } |
| default     | 表格列默认的唯一插槽，位于最后一列 |

</div>
