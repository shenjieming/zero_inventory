<template>
  <el-select v-model="dictionaryData" placeholder="请选择数据" @change="changeList"  style="width: 100%">
    <el-option
      v-for="item in options"
      :key="item.dictCode"
      :label="item.dictLabel"
      :value="item.dictCode">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name: 'dictionary-select',
    data () {
      return {
        // 列表
        options: [],
        // 字段框选中code
        dictionaryData: ''
      }
    },
    props: {
      // 字典类型值
      dictType: {
        type: String,
        default: ''
      },
      // 表单传参赋值数据
      postForm: {
        type: String,
        default: ''
      },
      // 当前下拉框宽度
      restStyle: {
        type: String,
        default: 'width: \'185px\''
      }
    },
    methods: {
      // 当数据发生改变时，更改父组件传值
      changeList (code) {
        this.$emit('update:postForm', code)
      }
    },
    mounted () {
      this.$http({
        url: this.$http.adornUrl('/basedata/sysdictdata/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': 1,
          'limit': 30,
          'dictType': this.dictType
        }, false)
      }).then(({data}) => {
        this.options = data.list
        console.log(data)
      })
    }
  }
</script>

<style scoped>

</style>
