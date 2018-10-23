<!--DESC:部门新增编辑dialog-->
<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="90px">
      <el-form-item label="上级部门" v-if="dataForm.parentName">
        <span> {{dataForm.parentName}}</span>
      </el-form-item>
    <el-form-item label="部门名称" prop="officeName">
      <el-input v-model="dataForm.officeName" placeholder="部门名称" @keyup.native="dataForm.fullName=dataForm.officeName"></el-input>
    </el-form-item>
     <el-form-item label="部门代码" prop="viewCode">
       <el-input v-model="dataForm.viewCode" placeholder="部门代码"></el-input>
     </el-form-item>
    <el-form-item label="部门全称" prop="fullName">
      <el-input v-model="dataForm.fullName" placeholder="部门全称"></el-input>
    </el-form-item>
    <el-form-item label="排序号" prop="treeSort">
      <el-input v-model="dataForm.treeSort" placeholder="本级排序号（升序）"></el-input>
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
          officeCode: '',
          parentCode: '',
          parentCodes: '',
          treeSort: '',
          remarks: ''
        },
        isEdit: false,
        dataRule: {
          viewCode: [
            { required: true, message: '部门代码不能为空', trigger: 'blur' }
          ],
          officeName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ],
          fullName: [
            { required: true, message: '部门全称不能为空', trigger: 'blur' }
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
                parentCode: row.officeCode,
                parentName: row.officeName
              }
            } else {
              this.isEdit = true
              this.$http({
                url: this.$http.adornUrl(`/sys/sysoffice/info/${row.officeCode}`),
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
            this.$http({
              url: this.$http.adornUrl(`/sys/sysoffice/${!this.dataForm.officeCode ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
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
