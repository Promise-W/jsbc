import SearchBar from './src/main.vue'

SearchBar.install = function(Vue) {
  Vue.component(SearchBar.name, SearchBar)
}

export default SearchBar