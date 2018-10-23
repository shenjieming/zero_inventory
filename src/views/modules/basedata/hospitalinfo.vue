<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList(pageIndex = 1)">查询</el-button>
        <el-button v-if="isAuth('basedata:hospitalinfo:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        prop="hplName"
        header-align="center"
        align="center"
        label="医院名称">
      </el-table-column>
      <el-table-column
        prop="hplCode"
        header-align="center"
        align="center"
        label="医院编码">
      </el-table-column>
      <el-table-column
        prop="levelCodeName"
        header-align="center"
        align="center"
        label="医院等级">
      </el-table-column>
      <el-table-column
        prop="hplTypeName"
        header-align="center"
        align="center"
        label="医院类型">
      </el-table-column>
      <el-table-column
        prop="contactPerson"
        header-align="center"
        align="center"
        label="联系人">
      </el-table-column>
      <el-table-column
        prop="contactTel"
        header-align="center"
        align="center"
        label="联系电话">
      </el-table-column>
      <el-table-column label="营业执照"  align="center">
        <template slot-scope="scope">
          <i class="el-icon-edit primary-color" title="查看" @click="getLicense(scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column label="执业许可证"  align="center">
        <template slot-scope="scope">
          <i class="el-icon-edit primary-color" title="查看" @click="getHospitalPer(scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column label="法人证书"  align="center">
        <template slot-scope="scope">
          <i class="el-icon-edit primary-color" title="查看" @click="getLegal(scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="statusName"
        header-align="center"
        align="center"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.hplCode)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.hplCode)">删除</el-button>
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
    <hospital-info-license v-if="hospitalInfoLicenseVisible" ref="hospitalInfoLicense"></hospital-info-license>
    <hospital-info-legal v-if="hospitalInfoLegalVisible" ref="hospitalInfoLegal"></hospital-info-legal>
    <hospital-info-per v-if="hospitalInfoPerVisible" ref="hospitalInfoPer"></hospital-info-per>
  </div>
</template>

<script>
  import AddOrUpdate from './hospitalinfo-add-or-update'
  import HospitalInfoLicense from './hospitalinfo-license'
  import HospitalInfoPer from './hospitalinfo-per'
  import hospitalInfoLegal from './hospitalinfo-legal'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        // 营业执照是否可见
        hospitalInfoLicenseVisible: false,
        // 执业许可证是否可见
        hospitalInfoPerVisible: false,
        // 法人代表是否可见
        hospitalInfoLegalVisible: false
      }
    },
    components: {
      AddOrUpdate,
      HospitalInfoLicense,
      HospitalInfoPer,
      hospitalInfoLegal
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/basedata/hospitalinfo/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
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
          return item.hplCode
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/basedata/hospitalinfo/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 获取营业执照
      getLicense (row) {
        this.hospitalInfoLicenseVisible = true
        this.$nextTick(() => {
          this.$refs.hospitalInfoLicense.init(row)
        })
      },
      // 执业许可证
      getHospitalPer (row) {
        this.hospitalInfoPerVisible = true
        this.$nextTick(() => {
          this.$refs.hospitalInfoPer.init(row)
        })
      },
      // 法人证书
      getLegal (row) {
        this.hospitalInfoLegalVisible = true
        this.$nextTick(() => {
          this.$refs.hospitalInfoLegal.init(row)
        })
      }
    }
  }
</script>
