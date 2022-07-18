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