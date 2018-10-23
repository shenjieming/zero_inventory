<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="模块名称" prop="moduleName">
      <el-input v-model="dataForm.moduleName" placeholder="模块名称"></el-input>
    </el-form-item>
      <el-form-item label="模块编码" prop="moduleCode">
        <el-input v-model="dataForm.moduleCode" placeholder="模块编码"></el-input>
      </el-form-item>
    <el-form-item label="模块描述" prop="description">
      <el-input v-model="dataForm.description" placeholder="模块描述"></el-input>
    </el-form-item>
    <el-form-item label="当前版本" prop="currentVersion">
      <el-input v-model="dataForm.currentVersion" placeholder="当前版本"></el-input>
    </el-form-item>
    <el-form-item label="升级信息" prop="upgradeInfo">
      <el-input v-model="dataForm.upgradeInfo" placeholder="升级信息"></el-input>
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
          moduleCode: 0,
          moduleName: '',
          description: '',
          currentVersion: '',
          upgradeInfo: '',
          status: '',
          createBy: '',
          createDate: '',
          updateBy: '',
          updateDate: '',
          remarks: '',
          clientId: '',
          clientSecret: ''
        },
        isAdd: true,
        dataRule: {
          moduleName: [
            { required: true, message: '模块名称不能为空', trigger: 'blur' }
          ],
          moduleCode: [
            { required: true, message: '模块编码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.$nextTick(() => {
          this.dataForm = {}
          this.$refs['dataForm'].resetFields()
          if (id) {
            this.isAdd = false
            this.$http({
              url: this.$http.adornUrl(`/sys/module/info/${id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.dataForm = data
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/module/${this.isAdd ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'moduleCode': this.dataForm.moduleCode || undefined,
                'moduleName': this.dataForm.moduleName,
                'description': this.dataForm.description,
                'currentVersion': this.dataForm.currentVersion,
                'upgradeInfo': this.dataForm.upgradeInfo,
                'status': this.dataForm.status,
                'createBy': this.dataForm.createBy,
                'createDate': this.dataForm.createDate,
                'updateBy': this.dataForm.updateBy,
                'updateDate': this.dataForm.updateDate,
                'remarks': this.dataForm.remarks,
                'clientId': this.dataForm.clientId,
                'clientSecret': this.dataForm.clientSecret
              })
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
      },
      handleClose () {
        this.dataForm = {}
      }
    }
  }
</script>
