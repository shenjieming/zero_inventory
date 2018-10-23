<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="字典名称" prop="dictName">
      <el-input v-model="dataForm.dictName" placeholder="字典名称"></el-input>
    </el-form-item>
    <el-form-item label="字典类型" prop="dictType">
      <el-input v-model="dataForm.dictType" placeholder="字典类型"></el-input>
    </el-form-item>
    <el-form-item label="是否系统" prop="isSys">
      <el-switch
        v-model="dataForm.isSys"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-value="1"
        inactive-value="0">
      </el-switch>
      <!--<el-input v-model="dataForm.isSys" placeholder="是否系统字典"></el-input>-->
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
          id: 0,
          dictName: '',
          dictType: '',
          isSys: '1',
          remarks: ''
        },
        dataRule: {
          dictName: [
            { required: true, message: '字典名称不能为空', trigger: 'blur' }
          ],
          dictType: [
            { required: true, message: '字典类型不能为空', trigger: 'blur' }
          ],
          isSys: [
            { required: true, message: '是否系统字典不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/basedata/sysdicttype/info/${this.dataForm.id}`),
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
              url: this.$http.adornUrl(`/basedata/sysdicttype/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'dictName': this.dataForm.dictName,
                'dictType': this.dataForm.dictType,
                'isSys': this.dataForm.isSys,
                'remarks': this.dataForm.remarks
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
      }
    }
  }
</script>
