<!--企业列表-->
<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.companyName" placeholder="企业名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList(pageIndex = 1)">查询</el-button>
        <el-button v-if="isAuth('sys:syscompany:save')" type="primary" @click="addHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <table-tree-column
        prop="companyName"
        header-align="center"
        treeKey="companyCode"
        parentKey="parentCode"
        width="150"
        label="仓库名称">
      </table-tree-column>
      <el-table-column
        prop="companyCode"
        header-align="center"
        align="center"
        label="企业编码">
      </el-table-column>
      <el-table-column
        prop="fullName"
        header-align="center"
        align="center"
        label="企业全称">
      </el-table-column>
      <el-table-column
        prop="treeSort"
        header-align="center"
        align="center"
        label="排序号">
      </el-table-column>
      <el-table-column
        prop="areaCode"
        header-align="center"
        align="center"
        label="区域编码">
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
        prop="statusName"
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
          <el-button v-if="isAuth('sys:syscompany:save')" type="text" @click="addHandle(scope.row)">新增</el-button>
          <el-button type="text" size="small" @click="updateHandle(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.companyCode)">删除</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
  import AddOrUpdate from './syscompany-add-or-update'
  import TableTreeColumn from '@/components/table-tree-column'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          companyName: ''
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
      TableTreeColumn,
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/syscompany/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'companyName': this.dataForm.companyName
          })
        }).then(({data}) => {
          console.log(data)
          this.dataList = treeDataTranslate(data.list, 'companyCode', 'parentCode')
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
      addHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row, 'add')
        })
      },
      updateHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.companyCode
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/syscompany/delete'),
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
