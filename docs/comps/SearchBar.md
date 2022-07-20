# SearchBar 工具框

通过简单配置，搭建搜索框。

## 基本用法

::: demo
```html
<template>
  <div class="">
    <SearchBar
      :filter-list="filterList" 
      @search-change="searchChange" 
      @search-reset="searchReset" 
      @filter-change="filterChange" 
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        filterList: [
          {
            label: '名字', // 属性name
            prop: 'name', // 属性key
            placeholder: '请输入名字' // 搜索字段空提示
          },
          {
            label: '公司',
            prop: 'companyId',
            placeholder: '请选择公司',
            searchType: 'select', // 搜索框类型 input select date daterange datetime datetimerange
            options: [ // select options可选值
              { label: '华为', value: 12 }, 
              { label: '小米', value: 88 }
            ]
          },
          {
            label: '入职日期',
            prop: 'date',
            placeholder: '请选择入职日期',
            searchType: 'date'
          }
        ],
      }
    },
    methods: {
      searchChange(filters) {
        this.$message.info(JSON.stringify(filters))
      },
      searchReset(filters) {
        this.$message.info(JSON.stringify(filters))
      },
      filterChange(filters, filter, val) {
        this.$message.success(JSON.stringify(filters))
      }
    }
  }
</script>
```
:::

## 基本用法-参数配置

::: demo
```html
<template>
  <div class="">
    <SearchBar
      :option="searchOption"
      :filter-list="filterList" 
      @search-change="searchChange" 
      @search-reset="searchReset" 
      @filter-change="filterChange" 
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        searchOption: {
          size: 'small', // 默认medium
          searchLabelWidth: 80, // 标题宽度默认为110，作用于全部filter，也可filterList单独配置
          searchSpan: 6, // // 搜索字段宽度默认为6
          searchMenuSpan: 4, // 按钮容器的宽度默认为6
          searchBtnText:'查询', // 搜索按钮文案
          searchBtnIcon:'el-icon-search', // 搜索按钮图标
          emptyBtnText:'重置', // 重置按钮文案
          emptyBtnIcon:'el-icon-close', // 重置按钮文案
          searchFilterNull: false, // 过滤空数据
        },
        filterList: [
          {
            label: '名字',
            prop: 'name',
            placeholder: '请输入名字',
            searchValue: 'seabedFish', // 搜索默认值
            searchLabelWidth: 50, // 单独配置 搜索字段标题宽度
            searchSpan: 8 // 单独配置 搜索字段宽度
          },
          {
            label: '公司',
            prop: 'companyId',
            placeholder: '请选择公司',
            searchType: 'select',
            searchValue: 88,
            options: [
              { label: '华为', value: 12 }, 
              { label: '小米', value: 88 }
            ],
            searchLabelWidth: 55, // 单独配置 搜索字段标题宽度
          },
          {
            label: '入职日期',
            prop: 'date',
            searchType: 'date',
            placeholder: '请选择入职日期'
          }
        ],
      }
    },
    methods: {
      searchChange(filters) {
        this.$message.info(JSON.stringify(filters))
      },
      searchReset(filters) {
        this.$message.info(JSON.stringify(filters))
      },
      filterChange(filters, filter, val) {
        this.$message.success(JSON.stringify(filters))
      }
    }
  }
</script>
```
:::

## 搜索变量 search

注：search 和 filters 是不同对象

::: demo
```html
<!-- search 和 filters 是不同对象；在searchFilterNull=true时，值也会不一样，filters会返回除去空值以后的值 -->
<template>
  <div class="">
    <SearchBar
      :search.sync="search"
      :filter-list="filterList" 
      @search-change="searchChange" 
      @search-reset="searchReset" 
      @filter-change="filterChange" 
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        search: { // 如果 filterList 里面的默认值，则用filterList的默认值
          id: 99,
          name: 'promise wang',
          companyId: 12
        },
        filterList: [
          {
            label: '名字',
            prop: 'name',
            placeholder: '请输入名字'
          },
          {
            label: '公司',
            prop: 'companyId',
            placeholder: '请选择公司',
            searchType: 'select',
            options: [
              { label: '华为', value: 12 }, 
              { label: '小米', value: 88 }
            ]
          },
          {
            label: '入职日期',
            prop: 'date',
            searchType: 'date',
            placeholder: '请选择入职日期'
          }
        ],
      }
    },
    methods: {
      searchChange(filters) {
        this.$message.info(`filters: ${JSON.stringify(filters)} search: ${JSON.stringify(this.search)}`)
      },
      searchReset(filters) {
        this.$message.info(`filters: ${JSON.stringify(filters)} search: ${JSON.stringify(this.search)}`)
      },
      filterChange(filters, filter, val) {
        this.$message.success(`filters: ${JSON.stringify(filters)} search: ${JSON.stringify(this.search)}`)
      }
    }
  }
</script>
```
:::

## 条件插槽

::: demo
```html
<template>
  <div class="">
    <SearchBar
      :filter-list="filterList" 
      @search-change="searchChange" 
      @search-reset="searchReset" 
      @filter-change="filterChange" 
    >
      <!-- 搜索插槽 如果是混搭，结构类名 label  filter-c filter 最好保持一致 -->
      <template #search="{ filters, size }">
        <label :class="`label label-${size}`" style="width: 80px">标题</label>
        <div class="filter-c" style="margin-left: 80px;">
          <el-input class="filter" placeholder="插槽自定义输入框" :size="size" v-model="filters.title" style="width: 150px" />
        </div>
      </template>

      <!-- 通过配置项的具名插槽(prop+Search)重写过滤器 注：v-model必须绑定在search上面！ -->
      <template #ageSearch="{ search, filters, filter, size }">
        <el-slider :size="size" v-model="search.age" @change="val => filterChange(filters, filter, val)"></el-slider>
      </template>
    </SearchBar>
  </div>
</template>
<script>
  export default {
    data() {
      return {
       filterList: [
          {
            label: '名字',
            prop: 'name',
            placeholder: '请输入名字'
          },
          {
            label: '年龄',
            prop: 'age'
          },
          {
            label: '入职日期',
            prop: 'date',
            searchType: 'date',
            placeholder: '请选择入职日期'
          }
        ],
      }
    },
    methods: {
      searchChange(filters) {
        this.$message.info(JSON.stringify(filters))
      },
      searchReset(filters) {
        this.$message.info(JSON.stringify(filters))
      },
      filterChange(filters, filter, val) {
        this.$message.success(JSON.stringify(filters))
      }
    }
  }
</script>
```
:::

## 按钮插槽

::: demo
```html
<template>
  <div class="">
    <SearchBar
      :option="searchOption"
      :filter-list="filterList" 
      @search-change="searchChange" 
      @search-reset="searchReset" 
      @filter-change="filterChange" 
    >
      <!-- 按钮插槽 -->
      <template #searchMenu="{ filters, size }">
        <el-button type="warning" :size="size" icon="el-icon-download" @click="handleDownload(filters)">下载-自定义标签</el-button>
      </template>
    </SearchBar>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        searchOption: {
          searchLabelWidth: 80,
          searchSpan: 5,
          searchMenuSpan: 8, // 按钮容器的宽度默认为6
        },
        filterList: [
          {
            label: '名字',
            prop: 'name',
            placeholder: '请输入名字'
          },
          {
            label: '年龄',
            prop: 'age'
          },
          {
            label: '入职日期',
            prop: 'date',
            searchType: 'date',
            placeholder: '请选择入职日期'
          }
        ],
      }
    },
    methods: {
      searchChange(filters) {
        this.$message.info(JSON.stringify(filters))
      },
      searchReset(filters) {
        this.$message.info(JSON.stringify(filters))
      },
      filterChange(filters, filter, val) {
        this.$message.success(JSON.stringify(filters))
      },
      handleDownload(search) {
        this.$message.success(JSON.stringify(search))
      }
    }
  }
</script>
```
:::

## SearchBar Attributes

<div class="special_table">


|     属性名   |    说明   |    类型    |   可选值   |   默认值   | 
|:----------|:----------|:----------|:----------|:----------|
| **\*** filter-list    | filters配置项(建议必填，不用插槽最好])   | array    | _    | 参考filter-list详解    |
| option    | 搜索框各项参数配置    |  object    | _    | 参考option详解   |
| search    | 贯彻搜索框的同步对象    | object    | _    | {}   |

</div>

## SearchBar Attributes filter-list

<div class="special_table">

|     参数   |    说明   |    类型    |   可选值   |   默认值   | 
|:----------|:----------|:----------|:----------|:----------|
| **\*** label           | 条件名称                | string    | _    | _    |
| **\*** prop            | 条件key                 | string    | _    | _    |
| placeholder       | 条件默认提示             | string    | _    | _   |
| searchType       | 条件类型             | input, select, date, daterange, datetime, datetimerange    |_    | input    |
| searchValue       | 条件默认值             | _    | _    | _    |
| searchLabelWidth    | 标题的宽度    | number    |  _   | 110    |
| searchSpan       | 搜索框的宽度        | number    | _    | 6    |

</div>

## SearchBar Attributes option

<div class="special_table">

|     参数   |    说明   |    类型    |   可选值   |   默认值   | 
|:----------|:----------|:----------|:----------|:----------|
| size    | 搜索框尺寸    | string    | medium / small / mini    | medium    |
| searchMenuSpan   | 搜索按钮的总长度          | number    |  —    | 6    |
| searchLabelWidth | 标题的宽度(作用于全部)   | number    |  _   | 110    |
| searchSpan       | 搜索框的宽度(作用于全部) | number    |  _    | 6    |
| searchFilterNull | 过滤空数据             | boolean   | true, false   | true    |
| searchBtnText    | 搜索btn文案            | string    | —    | 搜索    |
| searchBtnIcon    | 搜索btn图标            | string    | —    | el-icon-search    |
| emptyBtnText     | 重置btn文案            | string    | —    | 重置        |
| emptyBtnIcon     | 重置btn图标            | string    | —    | el-icon-delete    |

</div>

## SearchBar Slot
具体代码参考上文条件插槽和按钮插槽

<div class="special_table">

|     name   |    说明   | 
|:----------|:----------|
| search    | 自定义搜索卡槽 |
| xxSearch   | 自定义列搜索(列的prop加Search作为卡槽的名称) |
| searchMenu   | 自定义按钮卡槽 |

</div>