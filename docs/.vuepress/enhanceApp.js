import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import ListTable from '../../src/components/ListTable'
import Pagination from '../../src/components/Pagination'
import SearchBar from '../../src/components/SearchBar'

// import '../../dist/css/js-base-components.css'
// import JSBC from '../../dist/jsbc.js'

export default async ({ Vue }) => {
  if (typeof process === 'undefined') {
    // Vue.use(JSBC)
    Vue.use(ElementUI)
    Vue.use(ListTable)
    Vue.use(Pagination)
    Vue.use(SearchBar)
  }
}
