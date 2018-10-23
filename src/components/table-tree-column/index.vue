<!--该组件用左书插件使用-->
<template>
  <el-table-column :prop="prop" v-bind="$attrs"  >
    <template slot-scope="scope">
      <span @click.prevent="toggleHandle(scope.$index, scope.row)" :style="childStyles(scope.row)">
        <i :class="iconClasses(scope.row)" :style="iconStyles(scope.row)"></i>
        {{ scope.row[prop] }}
      </span>
    </template>
  </el-table-column>
</template>

<script>
  import isArray from 'lodash/isArray'
  export default {
    name: 'table-tree-column',
    props: {
      prop: {
        type: String
      },
      treeKey: {
        type: String,
        default: 'id'
      },
      parentKey: {
        type: String,
        default: 'parentId'
      },
      levelKey: {
        type: String,
        default: '_level'
      },
      childKey: {
        type: String,
        default: 'children'
      }
    },
    methods: {
      childStyles (row) {
        return { 'padding-left': (row[this.levelKey] > 1 ? row[this.levelKey] * 7 : 0) + 'px' }
      },
      iconClasses (row) {
        return [ !row._expanded ? 'el-icon-caret-right' : 'el-icon-caret-bottom' ]
      },
      iconStyles (row) {
        return { 'visibility': this.hasChild(row) ? 'visible' : 'hidden' }
      },
      hasChild (row) {
        return (isArray(row[this.childKey]) && row[this.childKey].length >= 1) || false
      },
      // 切换处理
      toggleHandle (index, row) {
        // 如果有子列表
        if (this.hasChild(row)) {
          let data = this.$parent.store.states.data.slice(0)
          data[index]._expanded = !data[index]._expanded
          if (data[index]._expanded) {
            data = data.splice(0, index + 1).concat(row[this.childKey]).concat(data)
          } else {
            const arr = [row[this.treeKey]]
            data = this.removeChildNode(data, arr)
          }
          this.$parent.store.commit('setData', data)
          this.$nextTick(() => {
            this.$parent.doLayout()
          })
        }
      },
      // 移除子节点
      removeChildNode (data, parentId) {
        if (parentId.length) {
          let ids = []
          parentId.forEach(item => {
            for (let i = data.length - 1; i > 0; i--) {
              if (item === data[i][this.parentKey]) {
                ids.push(data[i][this.treeKey])
                data.splice(i, 1)
              }
            }
          })
          return this.removeChildNode(data, ids)
        } else {
          return data
        }
      }
    }
  }
</script>
