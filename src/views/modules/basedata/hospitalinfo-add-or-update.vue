<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row >
        <el-col :span="12">
          <el-form-item label="医院名称" prop="hplName">
            <el-input v-model="dataForm.hplName" placeholder="医院名称"></el-input>
          </el-form-item>
          <el-form-item label="医院等级" prop="levelCode">
            <dictionary-select dictType="bd_hospital_level" :postForm.sync="dataForm.levelCode"></dictionary-select>
          </el-form-item>
        <el-form-item label="医院类型" prop="hplType">
          <dictionary-select dictType="bd_hospital_type" :postForm.sync="dataForm.hplType"></dictionary-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contactPerson">
            <el-input v-model="dataForm.contactPerson" placeholder="医院联系人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="contactTel">
            <el-input v-model="dataForm.contactTel" placeholder="医院联系电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="税号" prop="taxNo">
        <el-input v-model="dataForm.taxNo" placeholder="税号"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="开户行" prop="hplBank">
        <el-input v-model="dataForm.hplBank" placeholder="开户行"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="银行账户" prop="bankNo">
        <el-input v-model="dataForm.bankNo" placeholder="银行账户"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="地址" prop="areaCode">
        <el-input v-model="dataForm.areaCode" placeholder="区域编码"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="详细地址" prop="hplAddr">
        <el-input v-model="dataForm.hplAddr" placeholder="详细地址"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="24">
        <el-form-item label="备注信息" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="备注信息" type="textarea"></el-input>
        </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import dictionarySelect from '@/components/common/dictionary-select'
  import { isMobile } from '@/utils/validate'
  var validateMobile = (rule, value, callback) => {
    if (!isMobile(value)) {
      callback(new Error('手机号格式错误'))
    } else {
      callback()
    }
  }
  export default {
    name: 'hospitalinfo-add-or-update',
    data () {
      return {
        visible: false,
        dataForm: {
          hplCode: '',
          hplName: '',
          levelCode: '',
          hplType: '',
          taxNo: '',
          hplBank: '',
          bankNo: '',
          contactPerson: '',
          contactTel: '',
          areaCode: '',
          hplAddr: '',
          remarks: ''
        },
        dataRule: {
          hplName: [
            { required: true, message: '医院名称不能为空', trigger: 'blur' }
          ],
          contactPerson: [
            { required: true, message: '医院联系人不能为空', trigger: 'blur' }
          ],
          contactTel: [
            { validator: validateMobile, trigger: 'blur' }
          ],
          areaCode: [
            { required: true, message: '区域编码不能为空', trigger: 'blur' }
          ],
          hplAddr: [
            { required: true, message: '详细地址不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      dictionarySelect
    },
    methods: {
      init (id) {
        this.visible = true
        this.$nextTick(() => {
          this.dataForm = {}
          this.$refs['dataForm'].resetFields()
          if (id) {
            this.$http({
              url: this.$http.adornUrl(`/basedata/hospitalinfo/info/${id}`),
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
              url: this.$http.adornUrl(`/basedata/hospitalinfo/${!this.dataForm.hplCode ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'hplCode': this.dataForm.hplCode || undefined,
                'hplName': this.dataForm.hplName,
                'levelCode': this.dataForm.levelCode,
                'spelName': this.dataForm.spelName,
                'hplType': this.dataForm.hplType,
                'orgType': this.dataForm.orgType,
                'taxNo': this.dataForm.taxNo,
                'hplBank': this.dataForm.hplBank,
                'bankNo': this.dataForm.bankNo,
                'contactPerson': this.dataForm.contactPerson,
                'contactTel': this.dataForm.contactTel,
                'areaCode': this.dataForm.areaCode,
                'hplAddr': this.dataForm.hplAddr,
                'status': this.dataForm.status,
                'createUserId': this.dataForm.createUserId,
                'createBy': this.dataForm.createBy,
                'createDate': this.dataForm.createDate,
                'updateUserId': this.dataForm.updateUserId,
                'updateBy': this.dataForm.updateBy,
                'updateDate': this.dataForm.updateDate,
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
