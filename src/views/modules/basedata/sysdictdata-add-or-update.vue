<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">

   <el-form-item label="上级字典" prop="parentCode">
         <el-input v-model="dictType" placeholder="父级编号" disabled></el-input>
       </el-form-item>
    <el-form-item label="字典标签" prop="dictLabel">
      <el-input v-model="dataForm.dictLabel" placeholder="字典标签"></el-input>
    </el-form-item>
    <el-form-item label="字典键值" prop="dictValue">
      <el-input v-model="dataForm.dictValue" placeholder="字典键值"></el-input>
    </el-form-item>
    <el-form-item label="排序号" prop="treeSort">
      <el-input v-model="dataForm.treeSort" placeholder="本级排序号（升序）"></el-input>
    </el-form-item>
    <el-form-item label="系统内置" prop="isSys">
      <el-switch
        v-model="dataForm.isSys"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-value="1"
        inactive-value="0">
      </el-switch>
    </el-form-item>
    <el-form-item label="字典描述" prop="description">
      <el-input v-model="dataForm.description" placeholder="字典描述"></el-input>
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
    props: {
      dictType: {
        type: String,
        default: {}
      }
    },
    data () {
      return {
        visible: false,
        dataForm: {
          dictCode: '',
          parentCode: '',
          treeSort: '',
          dictLabel: '',
          dictValue: '',
          isSys: '1',
          description: '',
          remarks: ''
        },
        dataRule: {
          treeSort: [
            { required: true, message: '本级排序号（升序）不能为空', trigger: 'blur' }
          ],
          dictLabel: [
            { required: true, message: '字典标签不能为空', trigger: 'blur' }
          ],
          dictValue: [
            { required: true, message: '字典键值不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.dictCode = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.dictCode) {
            this.$http({
              url: this.$http.adornUrl(`/basedata/sysdictdata/info/${this.dataForm.dictCode}`),
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
              url: this.$http.adornUrl(`/basedata/sysdictdata/${!this.dataForm.dictCode ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'parentCode': this.dictType,
                'dictCode': this.dataForm.dictCode || undefined,
                'treeSort': this.dataForm.treeSort,
                'dictLabel': this.dataForm.dictLabel,
                'dictValue': this.dataForm.dictValue,
                'isSys': this.dataForm.isSys,
                'description': this.dataForm.description,
                'cssStyle': this.dataForm.cssStyle,
                'cssClass': this.dataForm.cssClass,
                'status': this.dataForm.status,
                'remarks': this.dataForm.remarks,
                'dictType': this.dictType
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
