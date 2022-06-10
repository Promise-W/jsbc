<template>
  <!-- 表格组件-->
  <!-- 该组件支持以下功能 -->
  <!-- 1.支持简单表格的渲染 -->
  <!-- 2.支持额外操作按钮 -->
  <!-- 3.支持多选操作 -->
  <!-- 4.支持点击功能操作 -->
  <!-- 5.支持表格内编辑，校验，错误提示操作 -->
  <!-- 6.支持设置显示/隐藏序号 -->
  <!-- 7.支持设置宽度 -->
  <!-- 8.支持自定义表格状态 -->
  <!-- 9.支持自定义列 -->
  <!-- 10.支持设置element-ui表格属性和方法配置，element-ui表格文档：https://element.eleme.cn/2.14/#/zh-CN/component/table -->
  <!-- 11.支持多级表头，最多3层 -->
  <!-- 12.支持对某个表头字段进行排序 -->
  <div class="table">
    <el-form v-if="tableObj.isEditTable" ref="FormTable" :model="tableData">
      <el-table
        v-loading="loading"
        v-bind="$attrs"
        style="width: 100%"
        :data="tableData.data"
        class="table-edit"
        v-on="$listeners"
      >
        <el-table-column
          v-if="tableObj.isHasIndex"
          label="序号"
          width="60"
        >
          <template slot-scope="scope">
            <span>{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableObj.tableHead"
          :key="item.value"
          :label="item.label"
          :min-width="item.minWidth || 160"
          :width="item.width || 'auto'"
        >
          <template v-if="item.children">
            <el-table-column
              v-for="(itemChildren, index1) in item.children"
              :key="index + '-' + index1"
              :label="itemChildren.label"
              :min-width="item.minWidth || 160"
              :width="itemChildren.width || 'auto'"
            >
              <template v-slot:header>
                <slot v-if="itemChildren.customHeader" :slot-scope="itemChildren" :name="itemChildren.value" />
                <div v-else>{{ itemChildren.label }}</div>
              </template>
              <template v-if="itemChildren.children && itemChildren.children.length">
                <el-table-column
                  v-for="(itemgrandChildren, index2) in itemChildren.children"
                  :key="index + '-' + index1 + '-' + index2"
                  :label="itemgrandChildren.label"
                  :min-width="item.minWidth || 160"
                  :width="itemgrandChildren.width || 'auto'"
                >
                  <template slot-scope="scope">
                    <el-form-item :key="scope.$index + itemgrandChildren.value + index" label="" :prop="`data[${scope.$index}].${itemgrandChildren.value}`" :rules="rules[itemgrandChildren.value] instanceof Array ? rules[itemgrandChildren.value] : (rules[itemgrandChildren.value] ? rules[itemgrandChildren.value](scope.row): [])">
                      <el-input
                        v-if="itemgrandChildren.editType === 'input'"
                        :key="scope.$index + '-' + index"
                        v-model="scope.row[itemgrandChildren.value]"
                        :placeholder="itemgrandChildren.placeholder || '请输入' + itemgrandChildren.label"
                        :maxlength="itemgrandChildren.maxlength || -1"
                        :show-word-limit="itemgrandChildren.showWordLimit || false"
                        @input="val => {$emit('changeTableValue', scope.$index, itemgrandChildren.value, val)}"
                      />
                      <el-input
                        v-else-if="itemgrandChildren.editType === 'textarea'"
                        :key="index+'-'"
                        v-model="scope.row[itemgrandChildren.value]"
                        :maxlength="itemgrandChildren.maxlength || 200"
                        type="textarea"
                        autosize
                        :show-word-limit="itemgrandChildren.showWordLimit || false"
                        :placeholder="itemgrandChildren.placeholder || '请输入' + itemgrandChildren.label"
                        @input="val => {$emit('changeTableValue', scope.$index, itemgrandChildren.value, val)}"
                      />
                      <el-select
                        v-else-if="itemgrandChildren.editType === 'select'"
                        :key="index+'-'"
                        v-model="scope.row[itemgrandChildren.value]"
                        :placeholder="itemgrandChildren.placeholder || '请选择' + itemgrandChildren.label"
                        @change="val => {$emit('changeTableValue', scope.$index, itemgrandChildren.value, val)}"
                      >
                        <el-option
                          v-for="(itemSelectChildren, optionIndex) in itemgrandChildren.options"
                          :key="itemSelectChildren.value"
                          :value="itemSelectChildren.value"
                          :label="itemSelectChildren.label"
                          :disabled="itemSelectChildren.disabled || false"
                          @click.native="e => {$emit('changeOptionClick', scope.$index, item.value, e, optionIndex)}"
                        />
                      </el-select>
                      <el-select
                        v-else-if="itemgrandChildren.editType === 'multiSelectSearch'"
                        :key="index+'-'"
                        v-model="scope.row[itemgrandChildren.value]"
                        multiple
                        filterable
                        :allow-create="item.allowCreate"
                        default-first-option
                        :placeholder="itemgrandChildren.placeholder"
                        @change="val => {$emit('changeTableValue', scope.$index, itemgrandChildren.value, val, itemgrandChildren)}"
                      >
                        <el-option
                          v-for="itemSelectChildren in itemgrandChildren.options"
                          :key="itemSelectChildren.value"
                          :value="itemSelectChildren.value"
                          :label="itemSelectChildren.label"
                          :disabled="itemSelectChildren.disabled || false"
                        />
                      </el-select>
                      <el-select
                        v-else-if="itemgrandChildren.editType === 'selectSearch'"
                        :key="index+'-'"
                        v-model="scope.row[itemgrandChildren.value]"
                        filterable
                        :allow-create="item.allowCreate"
                        default-first-option
                        :placeholder="itemgrandChildren.placeholder"
                        @change="val => {$emit('changeTableValue', scope.$index, itemgrandChildren.value, val, itemgrandChildren)}"
                      >
                        <el-option
                          v-for="itemSelectChildren in itemgrandChildren.options"
                          :key="itemSelectChildren.value"
                          :value="itemSelectChildren.value"
                          :label="itemSelectChildren.label"
                          :disabled="itemSelectChildren.disabled || false"
                        />
                      </el-select>
                      <el-select
                        v-else-if="itemgrandChildren.editType === 'remoteSelectSearch'"
                        v-loadmore="loadMore"
                        v-model="scope.row[itemgrandChildren.value]"
                        v-remo
                        clearable
                        filterable
                        :allow-create="item.allowCreate"
                        :placeholder="itemgrandChildren.placeholder"
                        remote
                        :remote-method="remoteMethod"
                        @visible-change="getEnterpriseName"
                        @change="val => { $emit('changeTableValue', scope.$index, itemgrandChildren.value, val, Object.assign({}, itemgrandChildren, {options: remoteItems})) }"
                      >
                        <el-option
                          v-for="itemSelectChildren in remoteItems"
                          :key="itemSelectChildren.entId"
                          :value="itemSelectChildren.entId"
                          :label="itemSelectChildren.entName"
                          :disabled="itemSelectChildren.disabled || false"
                        />
                      </el-select>
                      <el-date-picker
                        v-else-if="itemgrandChildren.editType === 'dateRange'"
                        v-model="scope.row[itemgrandChildren.value]"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :value-format="itemgrandChildren.valueFormat || 'yyyy-MM-dd'"
                        :format="itemgrandChildren.format||'yyyy-MM-dd'"
                        @input="val => {$emit('changeTableValue', scope.$index, itemgrandChildren.value, val)}"
                      />
                      <el-date-picker
                        v-else-if="itemgrandChildren.editType === 'date'"
                        v-model="scope.row[itemgrandChildren.value]"
                        :type="itemgrandChildren.dateType || 'date'"
                        :value-format="itemgrandChildren.valueFormat || 'yyyy-MM-dd'"
                        :format="itemgrandChildren.format||'yyyy-MM-dd'"
                        placeholder="选择日期"
                        @input="val => {$emit('changeTableValue', scope.$index, itemgrandChildren.value, val)}"
                      />
                      <el-date-picker
                        v-else-if="itemgrandChildren.editType === 'datetime'"
                        v-model="scope.row[itemgrandChildren.value]"
                        type="datetime"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        format="yyyy-MM-dd hh:mm:ss"
                        placeholder="选择日期"
                        @input="val => {$emit('changeTableValue', scope.$index, itemgrandChildren.value, val)}"
                      />
                      <slot v-else-if="itemgrandChildren.editType === 'custom'" :name="itemgrandChildren.customName" :custom-html-obj="scope" />
                      <span v-else>{{ scope.row[itemgrandChildren.value] }}</span>
                    </el-form-item>
                  </template>
                  <template v-slot:header>
                    <slot v-if="itemgrandChildren.customHeader" :slot-scope="itemgrandChildren" :name="itemgrandChildren.value" />
                    <div v-else>{{ itemgrandChildren.label }}</div>
                  </template>
                </el-table-column>
              </template>
              <template v-if="!(itemChildren.children && itemChildren.children.length)" slot-scope="scope">
                <el-form-item :key="scope.$index + itemChildren.value + index" label="" :prop="`data[${scope.$index}].${itemChildren.value}`" :rules="rules[itemChildren.value] instanceof Array ? rules[itemChildren.value] : (rules[itemChildren.value] ? rules[itemChildren.value](scope.row): [])">
                  <el-input
                    v-if="itemChildren.editType === 'input'"
                    :key="scope.$index + '-' + index"
                    v-model="scope.row[itemChildren.value]"
                    :placeholder="itemChildren.placeholder || '请输入' + itemChildren.label"
                    :maxlength="itemChildren.maxlength || -1"
                    :show-word-limit="itemChildren.showWordLimit || false"
                    @input="val => {$emit('changeTableValue', scope.$index, itemChildren.value, val)}"
                  />
                  <el-input
                    v-else-if="itemChildren.editType === 'textarea'"
                    :key="index+'-'"
                    v-model="scope.row[itemChildren.value]"
                    :maxlength="itemChildren.maxlength || 200"
                    type="textarea"
                    autosize
                    :placeholder="itemChildren.placeholder || '请输入' + itemChildren.label"
                    :show-word-limit="itemChildren.showWordLimit || false"
                    @input="val => {$emit('changeTableValue', scope.$index, itemChildren.value, val)}"
                  />
                  <el-select
                    v-else-if="itemChildren.editType === 'select'"
                    :key="index+'-'"
                    v-model="scope.row[itemChildren.value]"
                    :placeholder="itemChildren.placeholder || '请选择' + itemChildren.label"
                    @change="val => {$emit('changeTableValue', scope.$index, itemChildren.value, val)}"
                  >
                    <el-option
                      v-for="(itemSelectChildren, optionIndex) in itemChildren.options"
                      :key="itemSelectChildren.value"
                      :value="itemSelectChildren.value"
                      :label="itemSelectChildren.label"
                      :disabled="itemSelectChildren.disabled || false"
                      @click.native="e => {$emit('changeOptionClick', scope.$index, item.value, e, optionIndex)}"
                    />
                  </el-select>
                  <el-select
                    v-else-if="itemChildren.editType === 'multiSelectSearch'"
                    :key="index+'-'"
                    v-model="scope.row[itemChildren.value]"
                    multiple
                    filterable
                    :allow-create="item.allowCreate"
                    default-first-option
                    :placeholder="itemChildren.placeholder"
                    @change="val => {$emit('changeTableValue', scope.$index, itemChildren.value, val, itemChildren)}"
                  >
                    <el-option
                      v-for="itemSelectChildren in itemChildren.options"
                      :key="itemSelectChildren.value"
                      :value="itemSelectChildren.value"
                      :label="itemSelectChildren.label"
                      :disabled="itemSelectChildren.disabled || false"
                    />
                  </el-select>
                  <el-select
                    v-else-if="itemChildren.editType === 'selectSearch'"
                    :key="index+'-'"
                    v-model="scope.row[itemChildren.value]"
                    filterable
                    :allow-create="item.allowCreate"
                    default-first-option
                    :placeholder="itemChildren.placeholder"
                    @change="val => {$emit('changeTableValue', scope.$index, itemChildren.value, val, itemChildren)}"
                  >
                    <el-option
                      v-for="itemSelectChildren in itemChildren.options"
                      :key="itemSelectChildren.value"
                      :value="itemSelectChildren.value"
                      :label="itemSelectChildren.label"
                      :disabled="itemSelectChildren.disabled || false"
                    />
                  </el-select>
                  <el-select
                    v-else-if="itemChildren.editType === 'remoteSelectSearch'"
                    v-model="scope.row[itemChildren.value]"
                    v-loadmore="loadMore"
                    clearable
                    filterable
                    :allow-create="item.allowCreate"
                    :placeholder="itemChildren.placeholder"
                    remote
                    :remote-method="remoteMethod"
                    @visible-change="getEnterpriseName"
                    @change="val => { $emit('changeTableValue', scope.$index, itemChildren.value, val, Object.assign({}, itemChildren, {options: remoteItems})) }"
                  >
                    <el-option
                      v-for="itemSelectChildren in remoteItems"
                      :key="itemSelectChildren.entId"
                      :value="itemSelectChildren.entId"
                      :label="itemSelectChildren.entName"
                      :disabled="itemSelectChildren.disabled || false"
                    />
                  </el-select>
                  <el-date-picker
                    v-else-if="itemChildren.editType === 'dateRange'"
                    v-model="scope.row[itemChildren.value]"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :value-format="itemChildren.valueFormat || 'yyyy-MM-dd'"
                    :format="itemChildren.format||'yyyy-MM-dd'"
                    @input="val => {$emit('changeTableValue', scope.$index, itemChildren.value, val)}"
                  />
                  <el-date-picker
                    v-else-if="itemChildren.editType === 'date'"
                    v-model="scope.row[itemChildren.value]"
                    :type="itemChildren.dateType || 'date'"
                    :value-format="itemChildren.valueFormat || 'yyyy-MM-dd'"
                    :format="itemChildren.format||'yyyy-MM-dd'"
                    placeholder="选择日期"
                    @input="val => {$emit('changeTableValue', scope.$index, itemChildren.value, val)}"
                  />
                  <el-date-picker
                    v-else-if="itemChildren.editType === 'datetime'"
                    v-model="scope.row[itemChildren.value]"
                    type="datetime"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    format="yyyy-MM-dd hh:mm:ss"
                    placeholder="选择日期"
                    @input="val => {$emit('changeTableValue', scope.$index, itemChildren.value, val)}"
                  />
                  <slot v-else-if="itemChildren.editType === 'custom'" :name="itemChildren.customName" :custom-html-obj="scope" />
                  <span v-else>{{ scope.row[itemChildren.value] }}</span>
                </el-form-item>
              </template>
            </el-table-column>
          </template>
          <template v-slot:header>
            <slot v-if="item.customHeader" :slot-scope="item" :name="item.value" />
            <div v-else>{{ item.label }}</div>
          </template>
          <template v-if="!item.children" slot-scope="scope">
            <el-form-item :key="scope.$index + item.value + index" label="" :prop="`data[${scope.$index}].${item.value}`" :rules="rules[item.value] instanceof Array ? rules[item.value] : (rules[item.value] ? rules[item.value](scope.row): [])">

              <el-input
                v-if="item.editType === 'input'"
                :key="scope.$index + '-' + index"
                v-model="scope.row[item.value]"
                :show-word-limit="item.showWordLimit || false"
                :placeholder="item.placeholder || '请输入' + item.label"
                :maxlength="item.maxlength || -1"
                @input="val => {$emit('changeTableValue', scope.$index, item.value, val)}"
              />
              <el-input
                v-else-if="item.editType === 'textarea'"
                :key="index+'-'"
                v-model="scope.row[item.value]"
                :maxlength="item.maxlength || 200"
                type="textarea"
                autosize
                :show-word-limit="item.showWordLimit || false"
                :placeholder="item.placeholder || '请输入' + item.label"
                @input="val => {$emit('changeTableValue', scope.$index, item.value, val)}"
              />
              <el-select
                v-else-if="item.editType === 'select'"
                :key="index+'-'"
                v-model="scope.row[item.value]"
                :placeholder="item.placeholder || '请选择' + item.label"
                @change="val => {$emit('changeTableValue', scope.$index, item.value, val)}"
              >
                <el-option
                  v-for="(itemChildren, optionIndex) in item.options"
                  :key="itemChildren.value"
                  :value="itemChildren.value"
                  :label="itemChildren.label"
                  :disabled="itemChildren.disabled || false"
                  @click.native="e => {$emit('changeOptionClick', scope.$index, item.value, e, optionIndex)}"
                />
              </el-select>
              <el-select
                v-else-if="item.editType === 'multiSelectSearch'"
                :key="index+'-'"
                v-model="scope.row[item.value]"
                multiple
                filterable
                :allow-create="item.allowCreate"
                default-first-option
                :placeholder="item.placeholder"
                @change="val => {$emit('changeTableValue', scope.$index, item.value, val, item)}"
              >
                <el-option
                  v-for="itemChildren in item.options"
                  :key="itemChildren.value"
                  :value="itemChildren.value"
                  :label="itemChildren.label"
                  :disabled="itemChildren.disabled || false"
                />
              </el-select>
              <el-select
                v-else-if="item.editType === 'selectSearch'"
                :key="index+'-'"
                v-model="scope.row[item.value]"
                filterable
                :allow-create="item.allowCreate"
                default-first-option
                :placeholder="item.placeholder"
                @change="val => {$emit('changeTableValue', scope.$index, item.value, val, item)}"
              >
                <el-option
                  v-for="itemChildren in item.options"
                  :key="itemChildren.value"
                  :value="itemChildren.value"
                  :label="itemChildren.label"
                  :disabled="itemChildren.disabled || false"
                />
              </el-select>
              <el-select
                v-else-if="item.editType === 'remoteSelectSearch'"
                v-loadmore="loadMore"
                v-model="scope.row[item.value]"
                clearable
                filterable
                :allow-create="item.allowCreate"
                :placeholder="item.placeholder"
                remote
                :remote-method="remoteMethod"
                @visible-change="getEnterpriseName"
                @change="val => { $emit('changeTableValue', scope.$index, item.value, val, Object.assign({}, item, {options: remoteItems})) }"
              >
                <el-option
                  v-for="itemChildren in remoteItems"
                  :key="itemChildren.entId"
                  :value="itemChildren.entId"
                  :label="itemChildren.entName"
                  :disabled="itemChildren.disabled || false"
                />
              </el-select>
              <el-date-picker
                v-else-if="item.editType === 'dateRange'"
                v-model="scope.row[item.value]"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :value-format="item.valueFormat || 'yyyy-MM-dd'"
                :format="item.format||'yyyy-MM-dd'"
                @input="val => {$emit('changeTableValue', scope.$index, item.value, val)}"
              />
              <el-date-picker
                v-else-if="item.editType === 'date'"
                v-model="scope.row[item.value]"
                :type="item.dateType || 'date'"
                :value-format="item.valueFormat || 'yyyy-MM-dd'"
                :format="item.format||'yyyy-MM-dd'"
                placeholder="选择日期"
                @input="val => {$emit('changeTableValue', scope.$index, item.value, val)}"
              />
              <el-date-picker
                v-else-if="item.editType === 'datetime'"
                v-model="scope.row[item.value]"
                type="datetime"
                value-format="yyyy-MM-dd hh:mm:ss"
                format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择日期"
                @input="val => {$emit('changeTableValue', scope.$index, item.value, val)}"
              />
              <slot v-else-if="item.editType === 'custom'" :name="item.customName" :custom-html-obj="scope" />
              <span v-else>{{ scope.row[item.value] }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableObj.hasHandle"
          fixed="right"
          label="操作"
          :width="tableObj.handleWidth || 'auto'"
        >
          <template slot-scope="scope">
            <div class="operate-c">
              <slot name="before-table-button" :before-table-button="scope" />
              <el-button v-if="tableObj.hasEditButton" type="text" size="small" @click="$emit('editData', scope.row)">编辑</el-button>
              <el-button v-if="tableObj.hasDeleteButton" type="text" size="small" @click="$emit('deleteData',scope.row)">删除</el-button>
              <slot name="after-table-button" :after-table-button="scope" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-table
      v-else
      v-loading="loading"
      :data="tableData.data"
      v-bind="$attrs"
      style="width: 100%"
      v-on="$listeners"
      @selection-change="(val) => {$emit('handleSelectionChange', val)}"
    >
      <el-table-column
        v-if="tableObj.isSelection"
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="tableObj.isHasIndex"
        label="序号"
        width="50"
      >
        <template slot-scope="scope">
          <span>{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in tableObj.tableHead"
        :key="index"
        :label="item.label"
        :min-width="item.minWidth || 160"
        :width="item.width || 'auto'"
        :sortable="!!item.sortable"
      >
        <template v-if="!item.children" slot-scope="scope">
          <span v-if="isClickFunc(item, scope.row)" class="color-blue" @click="$emit('cellClick', scope.$index, scope.row)">{{ scope.row[item.value] }}</span>
          <span v-else-if="item.isState" :class="stateClass(scope.row)">{{ scope.row[item.value] }}</span>
          <slot v-else-if="item.editType === 'custom'" :name="item.customName" :custom-html-obj="scope" />
          <span v-else v-html="scope.row[item.value]" />
          <!-- <span v-if="showErrorTxt(scope, item, index)" class="red error-txt">{{ errorTxt[index][scope.$index] }}</span> -->
        </template>
        <template v-if="item.children">
          <el-table-column
            v-for="(itemChildren, index1) in item.children"
            :key="index + '-' + index1"
            :label="itemChildren.label"
            :min-width="item.minWidth || 160"
            :width="item.width || 'auto'"
            :sortable="!!itemChildren.sortable"
          >
            <template v-if="itemChildren.children">
              <el-table-column
                v-for="(itemgrandChildren, index2) in itemChildren.children"
                :key="index + '-' + index1 + '-' + index2"
                :label="itemgrandChildren.label"
                :min-width="item.minWidth || 160"
                :width="itemgrandChildren.width || 'auto'"
                :sortable="!!itemgrandChildren.sortable"
              >
                <template slot-scope="scope">
                  <span v-if="isClickFunc(itemgrandChildren, scope.row)" class="color-blue" @click="$emit('cellClick', scope.$index, scope.row)">{{ scope.row[item.value] }}</span>
                  <span v-else-if="itemgrandChildren.isState" :class="stateClass(scope.row)">{{ scope.row[itemgrandChildren.value] }}</span>
                  <span v-else v-html="scope.row[itemgrandChildren.value]" />
                </template>
              </el-table-column>
            </template>
            <template v-if="!itemChildren.children" slot-scope="scope">
              <span v-if="isClickFunc(itemChildren, scope.row)" class="color-blue" @click="$emit('cellClick', scope.$index, scope.row)">{{ scope.row[itemChildren.value] }}</span>
              <span v-else-if="itemChildren.isState" :class="stateClass(scope.row)">{{ scope.row[itemChildren.value] }}</span>
              <span v-else v-html="scope.row[itemChildren.value]" />
            </template>
          </el-table-column>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableObj.hasHandle"
        fixed="right"
        label="操作"
        :width="tableObj.handleWidth || 'auto'"
      >
        <template slot-scope="scope">
          <slot name="before-table-button" :before-table-button="scope" />
          <el-button v-if="tableObj.hasEditButton" type="text" size="small" @click="$emit('editData', scope.row)">编辑</el-button>
          <el-button v-if="tableObj.hasDeleteButton" type="text" size="small" @click="$emit('deleteData',scope.row)">删除</el-button>
          <slot name="after-table-button" :after-table-button="scope" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

export default {
  name: 'FormTable',
  props: {
    tableObj: {
      require: true,
      type: Object,
      default: () => ({
        tableHead: [], // 表头
        isSelection: true, // 是否可以多选进行批量操作
        isHasIndex: true, // 是否有序号
        hasEditButton: true, // 是否存在编辑按钮
        hasDeleteButton: true, // 是否存在删除按钮
        isEditTable: false, // 是否是编辑表格
        hasHandle: true, // 是否操作
        handleWidth: 'auto', // 表格列宽度
        isState: false // 状态判断
      })
    },
    // rowErrorArr: {
    //   require: false,
    //   type: Array,
    //   default: () => []
    // }, // 行错误列表
    // colErrorArr: {
    //   require: false,
    //   type: Array,
    //   default: () => []
    // }, // 列错误列表
    // errorTxt: {
    //   require: false,
    //   type: Array,
    //   default: () => [[]]
    // }, // 错误提示列表
    currentPage: {
      require: false,
      type: Number,
      default: 1
    }, // 当前页
    pageSize: {
      require: false,
      type: Number,
      default: 10
    }, // 每页数量
    data: {
      require: true,
      type: Array,
      default: () => []
    }, // 表格数据
    rules: {
      require: true,
      type: Object,
      default: () => ({})
    }, // 校验列表（参考element-ui form表单校验）
    // tableHead: {
    //   require: true,
    //   type: Array,
    //   default: () => [
    //     {
    //       label: '', // 表头标签
    //       width: '', // 表头宽度
    //       value: '', // 表头值
    //       editType: '', // 编辑表格类型，目前支持input-输入框，textarea-多行输入框，select-下拉框，selectSearch-下拉搜索，date-日期,dateRange-日期范围, datetime-日期时间, custom-自定义格式
    //       customName: '', // 当列为自定义编辑类型时所对应的插槽名称
    //       customHeader: false, // 是否自定义表头
    //       valueFormat: '', // 日期/时间值所对应的format格式, 默认为yyyy-MM-dd
    //       dateType: '', // year-年,month-月,date-日
    //       format: '', // 日期/时间显示格式,默认为yyyy-MM-dd
    //       options: [], // 下拉框数据
    //       placeholder: '', // 输入提示框
    //       saveId: '', // 当为远程搜索，对应的数据为null时，原value会被存储起来，新value会被label覆盖
    //       valueDefaultKey: '', // 当editType为selectSearch、remoteSelectSearch、multiSelectSearch时, 对应的数据为null时，默认值所对应的参数(不是指默认值，而是默认参数所对应的值)
    //       remoteItems: this.initRemoteItems || [], // api远程返回的数据
    //     }
    //   ]
    // } // 表头
    // isSelection: {
    //   require: false,
    //   type: Boolean,
    //   default: true
    // }, // 是否可以多选进行批量操作
    initRemoteItems: {
      type: Array,
      default: () => []
    }, // 搜索选择列表
    loading: {
      require: true,
      type: Boolean,
      default: true
    } // 是否正在加载中
    // isHasIndex: {
    //   require: false,
    //   type: Boolean,
    //   default: true
    // }, // 是否有序号
    // currentPage: {
    //   require: true,
    //   type: Number,
    //   default: 1
    // }, // 当前页
    // pageSize: {
    //   require: true,
    //   type: Number,
    //   default: 10
    // }, // 每页数量
    // hasEditButton: {
    //   require: false,
    //   type: Boolean,
    //   default: true
    // }, // 是否可以编辑
    // hasDeleteButton: {
    //   require: false,
    //   type: Boolean,
    //   default: true
    // }, // 是否显示删除按钮
    // isEditTable: {
    //   require: false,
    //   type: Boolean,
    //   default: false
    // }, // 是否在表格内进行编辑
    // hasHandle: {
    //   require: false,
    //   type: Boolean,
    //   default: true
    // }, // 是否允许操作
    // handleWidth: {
    //   require: false,
    //   type: Number || String,
    //   default: 'auto'
    // }, // 操作宽度
    // isState: {
    //   require: false,
    //   type: Boolean,
    //   default: false
    // } // 状态
  },
  data() {
    return {
      tableData: {},
    }
  },
  watch: {
    data: {
      handler: function(newVal) {
        const tableHead = this.tableObj.tableHead
        this.$set(this.tableData, 'data', newVal.map((item) => {
          const obj = JSON.parse(JSON.stringify(item))
          for (const key in obj) {
            const tableHeadObj = tableHead.find(item1 => item1.value === key)
            if (tableHeadObj) {
              const { editType, valueDefaultKey } = tableHeadObj
              if (obj[key] === obj[valueDefaultKey]) {
                continue
              }
              if ((['selectSearch'].indexOf(editType) > -1 && [-1, null, ''].indexOf(obj[key]) > -1)) {
                obj[key] = obj[valueDefaultKey]
              } else if (editType === 'multiSelectSearch' && obj[key] !== null) {
                let keyValArr

                if (typeof (obj[key]) === 'string') {
                  keyValArr = obj[key].split(',')
                } else {
                  keyValArr = obj[key]
                }
                keyValArr = keyValArr.map((itemChildren, index1) => {
                  return itemChildren === '' ? obj[valueDefaultKey].split(',')[index1] : itemChildren
                })
                if (typeof (obj[key]) === 'string') {
                  obj[key] = keyValArr.toString()
                } else {
                  obj[key] = keyValArr
                }
              } else if (editType === 'multiSelectSearch' && obj[key] === null) {
                obj[key] = [obj[valueDefaultKey]]
              } else if (editType === 'remoteSelectSearch' && [-1, null, ''].indexOf(obj[key]) > -1) {
                obj[item.saveId] = obj[key]
                obj[key] = obj[valueDefaultKey]
              }
            }
          }
          return obj
        }))
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    isClickFunc(item, row) {
      let isShow = false
      this.$emit('isShowClickFunc', row, (val) => {
        isShow = val
      })
      return item.isClick && isShow
    },
    stateClass(row) {
      let styleStr = ''
      this.$emit('getClassStr', row, (val) => {
        styleStr = JSON.parse(val)
      })
      return styleStr
    },
    resetFormFields() {
      this.$refs.FormTable && this.$refs.FormTable.clearValidate()
    },
    getFormRef() {
      return this.$refs.FormTable
    },
    loadMore() {
      this.$emit('loadMore')
    },
    // 远程初始化搜索
    getEnterpriseName() {
      this.searchVal = ''
      this.$emit('visible-change', '')
    },

    // 远程搜索
    remoteMethod(inputValue) {
      this.$emit('remote-method', inputValue, 1)
    }
  }
}
</script>
<style lang="scss">
$red: #ED5353;
.table{
  .color-blue{
    color: #108EE9;
    cursor: pointer;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
  .red{
    color: $red;
  }
  .el-table td, .el-table th{
    padding: 16px 0;
  }
  .is-error input, .is-error input::-webkit-input-placeholder {
    border-color: $red;
    color: $red;
  }
  .error-txt{
    position: absolute;
    bottom: -4px;
    left: 10px;
    font-size: 12px;
  }
  textarea{
    min-height: 40px!important;
  }
  .el-textarea .el-input__count{
    background-color: transparent;
    bottom: -12px;
  }
}
</style>
