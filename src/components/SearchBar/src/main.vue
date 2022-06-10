<template>
  <div class="inputArea-container">
    <div v-if="type == 'input'">
      <el-input
        v-model="value"
        :placeholder="placeholder"
        :clearable="clearable"
        :show-password="showPassword"
        :type="inputType"
        :autosize="autosize"
        :maxlength="maxlength"
        :show-word-limit="showWordLimit"
        :size="size"
        :rows="rows"
        :disabled="disabled"
        >
      </el-input>
    </div>
    <div v-if="type == 'button'">
      <el-button :type="buttonType" :round="round" :size="size" :disabled="disabled">{{btnText}}</el-button>
    </div>
    <div v-if="type == 'radio'">
      <div v-for="(item, index) in radioText" :key="index" class="el-radio-item">
        <el-radio v-model="radioValue" :label="label[index]">{{item}}</el-radio>
      </div>
    </div>
    <div v-if="type == 'checkbox'">
      <div v-for="(item, index) in checkedText" :key="index" class="el-radio-item">
        <el-checkbox v-model="checkedValue[index]">{{item}}</el-checkbox>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'SearchBar',
    props: {
      type: {
        type: String,
        default: 'input'
      },
      inputType: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String
      },
      value: {
        type: String,
        default: ''
      },
      clearable: {
        type: Boolean,
        default: false
      },
      showPassword: {
        type: Boolean,
        default: false
      },
      autosize: {
        type: [Boolean,Object],
        default: false
      },
      showWordLimit: {
        type: Boolean,
        default: false
      },
      maxlength: {
        type: Number
      },
      size: {
        type: String,
        default: 'medium'
      },
      rows: {
        type: Number,
        default: 2
      },
      buttonType: {
        type: String
      },
      btnText: {
        type: String,
        default: '主要按钮'
      },
      round: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      radioValue: {
        type: String,
        default: '1'
      },
      label: {
        type: Array,
        default: []
      },
      radioText: {
        type: Array,
        default: ['备选项','备选项']
      },
      checkedValue: {
        type: Array,
        default: [false]
      },
      checkedText: {
        type: Array,
        default: ['备选项']
      }
    },
    data() {
      return {

      }
    }
  }
</script>
<style>
 .el-radio-item {
   margin-right: 20px;
   display: inline-block;
 }
</style>