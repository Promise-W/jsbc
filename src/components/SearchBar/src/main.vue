<template>
  <div class="search-bar">
    <el-row class="filters-row">
      <el-col class="filter-col" :span="4">
        <slot name="search" v-bind="{ search, filters: _getFilters(), size: option.size }" />
      </el-col>

      <el-col v-for="(filter, index) in filterList" :key="index" class="filter-col" :span="filter.searchSpan || option.searchSpan">
        <!-- label -->
        <label 
          v-if="filter.label && filter.label !== ''" 
          :class="`label label-${option.size}`"
          :style="`width:${filter.searchLabelWidth || option.searchLabelWidth}px`"
        >
            {{ filter.label }}
        </label>
        <!-- filter -->
        <div 
          class="filter-c" 
          :style="`margin-left:${filter.searchLabelWidth || option.searchLabelWidth}px`"
        >
          <slot :name="`${filter.prop}Search`" v-bind="{ search, filters: _getFilters(), filter, size: option.size }">
            <!-- select 过滤器 -->
            <el-select
              v-if="filter.searchType === 'select'"
              v-model="search[filter.prop]"
              :value="filter.searchValue"
              :placeholder="filter.placeholder"
              :size="option.size"
              class="filter"
              clearable
              @change="val => handleFilterChange(filter, val)"
            >
              <el-option v-for="(option, oIndex) in filter.options" :key="index + '-' + oIndex" :label="option.label" :value="option.value" />
            </el-select>
            <!-- date picker 过滤器 -->
            <el-date-picker
              v-else-if="filter.searchType === 'date'"
              v-model="search[filter.prop]"
              :value="filter.searchValue"
              :placeholder="filter.placeholder"
              :size="option.size"
              class="filter"
              clearable
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="val => handleFilterChange(filter, val)"
            />
            <!-- daterange picker 过滤器 -->
            <el-date-picker
              v-else-if="filter.searchType === 'daterange'"
              v-model="search[filter.prop]"
              :value="filter.searchValue"
              :placeholder="filter.placeholder"
              :size="option.size"
              class="filter"
              clearable
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="val => handleFilterChange(filter, val)"
            />
            <!-- datetime picker 过滤器 -->
            <el-date-picker
              v-else-if="filter.searchType === 'datetime'"
              v-model="search[filter.prop]"
              :value="filter.searchValue"
              :placeholder="filter.placeholder"
              :size="option.size"
              class="filter"
              clearable
              type="datetime"
              format="yyyy-MM-dd hh:mm:ss"
              value-format="yyyy-MM-dd hh:mm:ss"
              @change="val => handleFilterChange(filter, val)"
            />
            <!-- datetimerange picker 过滤器 -->
            <el-date-picker
              v-else-if="filter.searchType === 'datetimerange'"
              v-model="search[filter.prop]"
              :value="filter.searchValue"
              :placeholder="filter.placeholder"
              :size="option.size"
              class="filter"
              clearable
              type="datetimerange"
              format="yyyy-MM-dd hh:mm:ss"
              value-format="yyyy-MM-dd hh:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="val => handleFilterChange(filter, val)"
            />
            <!-- input 过滤器 -->
            <el-input
              v-else
              v-model="search[filter.prop]"
              :value="filter.searchValue"
              :placeholder="filter.placeholder"
              :size="option.size"
              class="filter"
              clearable
              @change="val => handleFilterChange(filter, val)"
            />
          </slot>
        </div>
      </el-col>
      <el-col :span="option.searchMenuSpan" class="btns-col">
        <el-button type="primary" :size="option.size" :icon="option.searchBtnIcon || 'el-icon-search'" @click="handleSearch">{{ option.searchBtnText || '搜索' }}</el-button>
        <el-button type="info" :size="option.size" :icon="option.emptyBtnIcon || 'el-icon-delete'" @click="handleReset">{{ option.emptyBtnText || '重置' }}</el-button>
        <slot name="searchMenu" v-bind="{ search, filters: _getFilters(), size: option.size }" />
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  name: 'SearchBar',
  props: {
    option: {
      type: Object,
      default: () => new Object()
    },
    filterList: { // 搜索条件列表
      type: Array,
      require: true,
      default: () => []
    }, 
    search: { // 搜索的对象
      type: Object,
      default: () => new Object()
    }
  },
  data() {
    this._option = {
        size: 'medium', // medium / small / mini
        searchMenuSpan: 6, // 搜索按钮的长度
        searchLabelWidth: 110, // 标题的宽度，默认为110，可以配置到option下作用于全部,也可以单独配置每一项
        searchSpan: 6, // 搜索框的宽度，默认为6，可以配置到option下作用于全部,也可以单独配置每一项
        searchFilterNull: true, // 过滤空数据
        searchBtnText: null, // 搜索btn文案
        searchBtnIcon: null, // 搜索btn图标
        emptyBtnText: null, // 重置btn文案
        emptyBtnIcon: null // 重置btn图标
      }

    return {}
  },
  created() {
    this.filterList.forEach(filter => {
      this.$set(this.search, filter.prop, filter.searchValue || this.search[filter.prop] || null) // filterList里面的初始值权重大于search
      this.$set(filter, 'searchValue', this.search[filter.prop]) // 互相回填
    })
    Object.assign(this.option, Object.assign({}, this._option, this.option))
    // console.log('filterList', this.filterList)
    // console.log('this.option', JSON.stringify(this.option))
  },
  methods: {
    // 重置
    handleReset() {
      this._resetFilters()
      this.$emit('search-reset', this._getFilters())
    },
    // 搜索
    handleSearch() {
      this.$emit('search-change', this._getFilters())
    },
    // 单个filter变化
    handleFilterChange(filter, val) {
      this.$emit('filter-change', this._getFilters(), filter, val)
    },
    // _重置 filterList 和 search
    _resetFilters() {
      Object.keys(this.search).forEach(key => {
        this.search[key] = null // TODO::这里没有做类型判断，可能是 String | Array | Number ...
      })
    },
    // _获取 search
    _getFilters() {
      const filters = JSON.parse(JSON.stringify(this.search))
      Object.keys(filters).forEach(key => {
        if (this.option.searchFilterNull && !filters[key]) {
          delete filters[key]
        }
      })
      // console.log('_getFilters filters', JSON.stringify(filters))
      return filters
    }
  }
}
</script>
<style lang="scss">
.search-bar {
  font-size: 14px;
  margin-bottom: 15px;

  .filter-col {
    position: relative;

    .label {
      text-align: right;
      vertical-align: middle;
      float: left;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box;

      &.label-small { line-height: 32px; }
      &.label-mini { line-height: 28px; }
    }

    .filter-c {
      vertical-align: middle;
      margin-bottom: 15px;

      .filter {
        width: 100%;
      }
    }
  }

  .btns-col {
    text-align: right;
  }
}
</style>