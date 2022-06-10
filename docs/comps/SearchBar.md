# SearchBar 工具框

通过简单配置，搭建输入框。

## 基本用法 - 输入框

文本框

::: demo
```html
<template>
  <div class="input">
    <SearchBar 
      type="input"
      inputType="text"
      :value="value"
      placeholder="请输入文字"
      clearable
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: ''
      }
    }
  }
</script>
<style>
  .input-area {
    width: 200px
  }
</style>
```
:::

文本域

::: demo
```html
<template>
  <div class="input-area">
    <SearchBar 
      type="input"
      inputType="textarea"
      :value="value"
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: ''
      }
    }
  }
</script>
<style>
  .input {
    width: 200px
  }
  .input-area {
    width: 400px
  }
</style>
```
:::

## 基本用法 - 按钮

按钮

::: demo
```html
<template>
  <div class="button">
    <div class="button-list">
      <SearchBar 
        type="button"
        btnText="主要按钮"
      />
    </div>
    <div class="button-list">
      <SearchBar 
        type="button"
        buttonType="primary"
        btnText="主要按钮"
      />
    </div>
    <div class="button-list">
      <SearchBar 
        type="button"
        buttonType="primary"
        btnText="主要按钮"
        disabled
      />
    </div>
    <div class="button-list">
      <SearchBar 
        type="button"
        buttonType="primary"
        btnText="主要按钮"
        round
      />
    </div>
    <div class="button-list">
      <SearchBar 
        type="button"
        buttonType="primary"
        btnText="主要按钮"
        round
        size="small"
      />
    </div>
  </div>
</template>
<style>
  .button {
    display: flex;
  }
  .button-list {
    margin-left: 20px;
  }
</style>
```
:::

## 基本用法 - 单选框

单选框

::: demo
```html
<template>
  <div class="radio">
    <SearchBar 
      type="radio"
      :radioValue="radioValue"
      :label="label"
      :radioText="radioText"
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        radioValue: 1,
        label: [1,2],
        radioText: ['备选项','备选项']
      }
    }
  }
</script>
<style>
  .button {
    display: flex;
  }
  .button-list {
    margin-left: 20px;
  }
</style>
```
:::

## 基本用法 - 多选框

多选框

::: demo
```html
<template>
  <div class="checkbox">
    <SearchBar 
      type="checkbox"
      :checkedValue="checkedValue"
      :checkedText="checkedText"
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        checkedValue: [false],
        checkedText: ['备选项']
      }
    }
  }
</script>
<style>
  .button {
    display: flex;
  }
  .button-list {
    margin-left: 20px;
  }
</style>
```
:::

## input Attributes

<div class="special_table">

|     参数   |    说明   |    类型    |   可选值   |   默认值   | 
|:----------|:----------|:----------|:----------|:----------|
| value           | 绑定值                | string    | —    | —    |
| type            | 类型                  | string    | input / button    | input    |
| inputType       | 输入框类型             | string    | text，textarea    | text    |
| placeholder     | 输入框占位文本         | string    | —    | —    |
| clearable       | 是否可清空             | boolean    | —    | false    |
| disabled       | 是否禁用             | boolean    | —    | false    |
| showPassword    | 是否显示切换密码图标    | boolean    | —    | false    |
| autosize        | 自适应内容高度，只对<br />type="textarea" 有效，可传入对象，<br />如，{ minRows: 2, maxRows: 6 }    | boolean / object    | —    | false    |
| showWordLimit   | 是否显示输入字数统计，只在 type = <br />"text" 或 type = "textarea" 时有效    | boolean    | —    | false    |
| size    | 输入框尺寸，只在 type!="textarea"<br />时有效    | string    | medium / small / mini    | —    |
| rows    | 输入框行数，只对 type="textarea"<br />有效    | number    | —    | 2    |
| maxlength    | 原生属性，最大输入长度    | number    | —    | —    |

</div>

## button Attributes

<div class="special_table">

|     参数   |    说明   |    类型    |   可选值   |   默认值   | 
|:----------|:----------|:----------|:----------|:----------|
| btnText           | 按钮内容                | string    | —    | 主要按钮    |
| type            | 类型                  | string    | input / button    | button    |
| buttonType       | 按钮类型             | string    | text，textarea    | text    |
| disabled       | 是否禁用             | boolean    | —    | false    |
| size    | 按钮尺寸    | string    | medium / small / mini    | —    |

</div>