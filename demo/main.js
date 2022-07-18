import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 源码按需 加载
// import ListTable from '../src/components/ListTable'
// import Pagination from '../src/components/Pagination'
// import SearchBar from '../src/components/SearchBar'
// Vue.use(ListTable)
// Vue.use(Pagination)
// Vue.use(SearchBar)

// 源码全部 加载
import YTC from '../src/index.js'
// 测试库 加载
// import '../../dist/css/yitu-component-base.css'
// import YTC from '../../dist/yituComponentBase.js' // 测试库 
Vue.use(YTC)

import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
