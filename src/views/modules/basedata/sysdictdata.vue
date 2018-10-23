<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.dictLabel" placeholder="字典标签" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList(pageIndex = 1)">查询</el-button>
        <el-button v-if="isAuth('basedata:sysdictdata:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="dictCode"
        header-align="center"
        align="center"
        label="字典编码">
      </el-table-column>

      <el-table-column
        prop="dictLabel"
        header-align="center"
        align="center"
        label="字典标签">
      </el-table-column>
      <el-table-column
        prop="dictValue"
        header-align="center"
        align="center"
        label="字典键值">
      </el-table-column>
       <el-table-column
         prop="treeSort"
         header-align="center"
         align="center"
         label="排序号">
       </el-table-column>
      <el-table-column
        prop="isSys"
        header-align="center"
        align="center"
        label="系统内置">
      </el-table-column>
      <el-table-column
        prop="updateDate"
        header-align="center"
        align="center"
        label="更新时间">
      </el-table-column>
      <el-table-column
        prop="remarks"
        header-align="center"
        align="center"
        label="备注信息">
      </el-table-column>

       <el-table-column
              prop="status"
              header-align="center"
              align="center"
              label="状态">
            </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.dictCode)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.dictCode)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"   :dictType="$route.params.dictType"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './sysdictdata-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          dictLabel: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取字典信息列表
      getDataList () {
        this.dataListLoading = true
          // /basedata/sysdicttype/info/{id}
        //
        this.$http({
          url: this.$http.adornUrl('/basedata/sysdictdata/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'dictLabel': this.dataForm.dictLabel,
            'dictType': this.$route.params.dictType
          })
        }).then(({data}) => {
          this.dataList = data.list
          this.totalPage = data.totalCount
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.dictCode
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/basedata/sysdictdata/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then((data) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          })
        })
      }
    }
  }
</script>
