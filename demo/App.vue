<template>
  <div class="demo-app">
    <SearchBar
      :option="searchOption"
      :search.sync="search"
      :filter-list="filterList" 
      @search-change="searchChange" 
      @search-reset="searchReset" 
      @filter-change="filterChange" 
    >
      <template #searchMenu="{ filters, size }">
        <el-button type="warning" :size="size" icon="el-icon-download" @click="handleDownload(filters)">下载-自定义标签</el-button>
      </template>
      <template #search="{ filters, size }">
        <label :class="`label label-${size}`" style="width: 80px">标题</label>
        <div class="filter-c" style="margin-left: 80px;">
          <el-input class="filter" placeholder="插槽自定义输入框" :size="size" v-model="filters.title" />
        </div>
      </template>
      <!-- 通过配置项的具名插槽(prop+Search)重写过滤器 注：v-model必须绑定在search上面！-->
      <template #companyIdSearch="{ search, filters, filter, size }">
        <el-slider :size="size" v-model="search.companyId" @change="val => filterChange(filters, filter, val)"></el-slider>
      </template>
    </SearchBar>
    
    <ListTable 
      :option="option" 
      :data="tableData" 
      :table-loading="loading"
      @refresh-change="getList"
      @on-load="getList" 
    />
  </div>
</template>

<script>
  export default {
  data() {
    return {
      loading: false, // 加载动画
      search: { // 如果 filterList 里面的默认值，则用filterList的默认值
        name: 'llalla',
        title: 'bbbb'
      },
      searchOption: {
        size: 'small', // 默认medium
        searchMenuSpan: 10, // 搜索按钮的长度
        searchLabelWidth: 80, // 标题的宽度，默认为110，可以配置到option下作用于全部,也可以单独配置每一项
        searchSpan: 6, // filter宽度
        searchFilterNull: true, // 过滤空数据
        searchBtnText:'查询',
        searchBtnIcon:'el-icon-search',
        emptyBtnText:'重置',
        emptyBtnIcon:'el-icon-close'
      },
      filterList: [
        {
          label: '名字', // 属性name
          prop: 'name', // 属性key
          search: true, // 是否开启搜索
          searchType: 'input', // 搜索框类型 input date daterange datetime datetimerange
          searchValue: 'seabedfish', // 搜索默认值, 可以覆盖表单默认值
          searchLabelWidth: 60, // 搜索字段标题宽度
          searchSpan: 4, // 搜索字段宽度
          placeholder: '请输入名字', // 搜索字段空提示
        },
        {
          label: '公司',
          prop: 'companyId',
          search:true,
          searchValue: 88,
          searchType: 'select',
          searchSpan: 4,
          placeholder: '请选择公司',
          options: [{ label: 'wjx', value: 12 }, { label: 'ws', value: 88 }] // select options可选值
        },
      ],
      option: {
        column: [
          {
            label: '名字', // 属性name
            prop: 'name', // 属性key
          },
          {
            label: '公司',
            prop: 'companyId'
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
      }, 1000)
    },
    searchChange(filters) {
      console.log('searchChange filters', JSON.stringify(filters))
      this.getList()
    },
    searchReset(filters) {
      console.log('searchReset filters', JSON.stringify(filters))
      this.getList()
    },
    filterChange(filters, filter, val) {
      console.log('filterChange filters', JSON.stringify(filters), filter, val)
      this.getList()
    },
    handleDownload(filters) {
      console.log('custom-btn filters', JSON.stringify(filters))
    }
  }
}
</script>