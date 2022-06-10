# Pagination 分页

通过简单配置，搭建基本的分页功能。

## 基本用法
配置 total, currentPage, pageSize 等属性即可

::: demo
```html
<template>
  <Pagination
    :total="total"
    :page="currentPage"
    :limit="pageSize"
    :pageSizes="pageSizes"
    :layout="layout"
    :background="background"
    :hidden="hidden"
    @handleSizeChange="handleSizeChange"
    @handleCurrentChange="handleCurrentChange"
  />
</template>
<script>
  export default {
    data() {
      return {
        total: 100,
        currentPage: 1,
        pageSize: 20,
        pageSizes: [10, 20, 30, 40, 50],
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        hidden: false
      }
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    }
  }
</script>
```
:::

## Attributes

<div class="special_table">

|     参数   |    说明   |    类型    |   可选值   |   默认值   | 
|:----------|:----------|:----------|:----------|:----------|
| total    | 数据总数    | number    | number    | 0    |
| currentPage    | 当前页    | number    | number    | 1    |
| pageSize    | 页码大小    | number    | number    | 20    |
| pageSizes    | 每页显示的数据数    | array    | —    | [10, 20, 30, 40, 50]    |
| layout    | 分页布局    | string    | —    | 'total, sizes, prev, pager, next, jumper'    |
| background    | 是否显示页码背景    | boolean    | —    | true    |
| hidden    | 是否显示分页    | boolean    | —    | true    |

</div>

## Events

<div class="special_table">

|     参数   |    说明   |    回调参数    |
|:----------|:----------|:----------|
| handleSizeChange    | pageSize 改变时会触发    | 每页条数    |
| handleCurrentChange    | currentPage 改变时会触发    | 当前页    |

</div>


<style>
  
</style>