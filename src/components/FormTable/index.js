import FormTable from './src/main.vue';
import "core-js/modules/es.function.name"

FormTable.install = function(Vue) {
  Vue.component(FormTable.name, FormTable);
};

export default FormTable;
