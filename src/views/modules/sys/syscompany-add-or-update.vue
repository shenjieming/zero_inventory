<!--企业新增修改dialog-->
<template>
  <el-dialog
    :title="!dataForm.companyCode ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="90px">
      <el-form-item label="父级名称" v-if="dataForm.parentName">
        <span> {{dataForm.parentName}}</span>
      </el-form-item>
    <el-form-item label="企业名称" prop="companyName">
      <el-input v-model="dataForm.companyName" placeholder="企业名称"></el-input>
    </el-form-item>
    <el-form-item label="企业代码" prop="viewCode">
      <el-input v-model="dataForm.viewCode" placeholder="企业代码" v-if="!isEdit"></el-input>
      <span v-else>{{dataForm.viewCode}} </span>
    </el-form-item>
    <el-form-item label="企业全称" prop="fullName">
      <el-input v-model="dataForm.fullName" placeholder="企业全称"></el-input>
    </el-form-item>
    <el-form-item label="排序号" prop="treeSort">
          <el-input v-model="dataForm.treeSort" placeholder="本级排序号（升序）"></el-input>
    </el-form-item>
    <el-form-item label="区域编码" prop="areaCode">
      <el-input v-model="dataForm.areaCode" placeholder="区域编码"></el-input>
    </el-form-item>
    <el-form-item label="备注信息" prop="remarks">
      <el-input v-model="dataForm.remarks" placeholder="备注信息"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          companyCode: '',
          parentCode: '',
          parentName: '',
          parentCodes: '',
          treeSort: '',
          treeSorts: '',
          treeLeaf: '',
          treeLevel: '',
          treeNames: '',
          viewCode: '',
          companyName: '',
          fullName: '',
          areaCode: '',
          status: '',
          createBy: '',
          createDate: '',
          updateBy: '',
          updateDate: '',
          remarks: '',
          corpCode: '',
          corpName: ''
        },
        // 是否为编辑标识符
        isEdit: false,
        dataRule: {
          companyName: [
            { required: true, message: '企业名称不能为空', trigger: 'blur' }
          ],
          fullName: [
            { required: true, message: '企业全称不能为空', trigger: 'blur' }
          ],
          viewCode: [
            { required: true, message: '企业代码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (row, isAdd) {
        this.visible = true
        this.$nextTick(() => {
          this.dataForm = {}
          this.$refs['dataForm'].resetFields()
          if (row) {
            if (isAdd === 'add') {
              this.dataForm = {
                parentCode: row.companyCode,
                parentName: row.companyName
              }
            } else {
              this.isEdit = true
              this.$http({
                url: this.$http.adornUrl(`/sys/syscompany/info/${row.companyCode}`),
                method: 'get',
                params: this.$http.adornParams({companyCode: row.companyCode})
              }).then(({data}) => {
                this.dataForm = data
              })
            }
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const httpParams = {
              'companyCode': this.dataForm.companyCode || undefined,
              'parentCode': this.dataForm.parentCode,
              'treeSort': this.dataForm.treeSort,
              'treeSorts': this.dataForm.treeSorts,
              'treeLeaf': this.dataForm.treeLeaf,
              'treeLevel': this.dataForm.treeLevel,
              'treeNames': this.dataForm.treeNames,
              'viewCode': this.dataForm.viewCode,
              'companyName': this.dataForm.companyName,
              'fullName': this.dataForm.fullName,
              'areaCode': this.dataForm.areaCode,
              'status': this.dataForm.status,
              'createBy': this.dataForm.createBy,
              'createDate': this.dataForm.createDate,
              'updateBy': this.dataForm.updateBy,
              'updateDate': this.dataForm.updateDate,
              'remarks': this.dataForm.remarks,
              'corpCode': this.dataForm.corpCode,
              'corpName': this.dataForm.corpName
            }
            if (httpParams.treeLevel === 0) {
              this.parentCode = 0
            }
            this.$http({
              url: this.$http.adornUrl(`/sys/syscompany/${!this.dataForm.companyCode ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData(httpParams)
            }).then((data) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            })
          }
        })
      }
    }
  }
</script>
