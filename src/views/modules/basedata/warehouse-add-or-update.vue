<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="95px">
    <el-form-item label="父级仓库" prop="parentId" v-if="dataForm.parentName">
      <span>{{dataForm.parentName}}</span>
    </el-form-item>
    <el-form-item label="仓库名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="仓库名称"></el-input>
    </el-form-item>
    <el-form-item label="负责人姓名" prop="resName">
      <el-input v-model="dataForm.resName" placeholder="负责人姓名"></el-input>
    </el-form-item>
    <el-form-item label="联系电话" prop="tel">
      <el-input v-model="dataForm.tel" placeholder="联系电话"></el-input>
    </el-form-item>
    <el-form-item label="备注信息" prop="remarks">
      <el-input v-model="dataForm.remarks" placeholder="备注信息"></el-input>
    </el-form-item>
    <el-form-item label="区域编码" prop="areaCode">
      <el-input v-model="dataForm.areaCode" placeholder="区域编码"></el-input>
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
    // props: {
    //   // 上级仓库名称
    //   parentWareHouse: {
    //     type: Object,
    //     default: {}
    //   }
    // },
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          parentId: '',
          name: '',
          spelName: '',
          resName: '',
          tel: '',
          remarks: '',
          areaCode: '',
          compId: '',
          status: '',
          createUserId: '',
          createBy: '',
          createDate: '',
          updateUserId: '',
          updateBy: '',
          updateDate: '',
          orgType: ''
        },
        dataRule: {
          name: [
            { required: true, message: '仓库名称不能为空', trigger: 'blur' }
          ],
          spelName: [
            { required: true, message: '仓库拼音不能为空', trigger: 'blur' }
          ],
          resName: [
            { required: true, message: '负责人姓名不能为空', trigger: 'blur' }
          ],
          tel: [
            { required: true, message: '联系电话不能为空', trigger: 'blur' }
          ],
          remarks: [
            { required: true, message: '备注信息不能为空', trigger: 'blur' }
          ],
          areaCode: [
            { required: true, message: '区域编码不能为空', trigger: 'blur' }
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
                parentId: row.id,
                parentName: row.name
              }
            } else {
              this.dataForm = JSON.parse(JSON.stringify(row))
            }
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/basedata/warehouse/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'parentId': this.dataForm.parentId,
                'name': this.dataForm.name,
                'spelName': this.dataForm.spelName,
                'resName': this.dataForm.resName,
                'tel': this.dataForm.tel,
                'remarks': this.dataForm.remarks,
                'areaCode': this.dataForm.areaCode,
                'compId': this.dataForm.compId,
                'status': this.dataForm.status,
                'createUserId': this.dataForm.createUserId,
                'createBy': this.dataForm.createBy,
                'createDate': this.dataForm.createDate,
                'updateUserId': this.dataForm.updateUserId,
                'updateBy': this.dataForm.updateBy,
                'updateDate': this.dataForm.updateDate,
                'orgType': this.dataForm.orgType
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
