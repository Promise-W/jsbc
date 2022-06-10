import Pagination from './components/Pagination/index.js';
import ListTable from './components/ListTable/index.js';
import FormTable from './components/FormTable/index.js';
import SearchBar from './components/SearchBar/index.js';

const components = [
  Pagination,
  ListTable,
  FormTable,
  SearchBar
];

const install = function(Vue) {
  if (install.installed) return

  components.forEach(component => {
    Vue.component(component.name, component);
  })

  install.installed = true
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

// export {
//   Pagination,
//   ListTable,
//   FormTable
// }

export default {
  version: '0.0.1',
  install,
  Pagination,
  ListTable,
  FormTable,
  SearchBar
};
