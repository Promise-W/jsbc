import ListTable from './src/main.vue'

ListTable.install = function(Vue) {
  Vue.component(ListTable.name, ListTable)
}

export default ListTable
