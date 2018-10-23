<template>
  <el-dialog
    :title="dialogTitle"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row >
        <el-col :span="12">
          <el-form-item label="医院名称">
            <el-input v-model="parentForm.hplName" placeholder="请输入医院名称" disabled></el-input>
          </el-form-item>
          <el-form-item label="营业执照编号" prop="licNo">
            <el-input v-model="dataForm.licNo" placeholder="请输入营业执照编号"></el-input>
          </el-form-item>
        <el-form-item label="类型" prop="licType">
          <dictionary-select dictType="bd_company_type" :postForm.sync="dataForm.licType"></dictionary-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="住所" prop="licAddr">
            <el-input v-model="dataForm.licAddr" placeholder="请输入住所详细地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法人" prop="legalName">
            <el-input v-model="dataForm.legalName" placeholder="请输入法人信息"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册资本" prop="regCapital">
            <el-input v-model="dataForm.regCapital" placeholder="请填写注册资本"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="开始时间" prop="beginDate">
            <el-date-picker
              clear-icon
              v-model="dataForm.beginDate"
              type="datetime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
            </el-date-picker >
            <!--<span v-if="dataForm.flag != 1"></span>-->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker
              :disabled="dataForm.flag == 1"
              v-model="dataForm.endDate"
              type="datetime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
            </el-date-picker>
            <el-switch
              v-model="dataForm.flag"
              active-text="永久"
              active-value="1"
              inactive-value="0"
              @change="flagChange"
            >
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="登记机关" prop="regOrg">
            <el-input v-model="dataForm.regOrg" placeholder="请输入登记机关"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记日期" prop="regDate">
            <el-date-picker
              v-model="dataForm.regDate"
              type="datetime"
              format="yyyy-MM-dd hh:mm"
              value-format="yyyy-MM-dd hh:mm"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成立日期" prop="establishmentDate">
            <el-date-picker
              v-model="dataForm.establishmentDate"
              type="datetime"
              format="yyyy-MM-dd hh:mm"
              value-format="yyyy-MM-dd hh:mm"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="经营范围" prop="businessScope">
            <el-input v-model="dataForm.businessScope" placeholder="请输入经营范围" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息" prop="remarks">
            <el-input v-model="dataForm.remarks" placeholder="请输入备注信息" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图片上传" prop="pic">
            <el-input v-model="dataForm.pic" placeholder="请上传图片"></el-input>
          </el-form-item>
        </el-col>
        <div v-if="isShowHistory">
          <el-table
            border
            :data="historyList"
            max-height="200"
            style="width: 100%">
            <el-table-column
              label="证号"
              width="180">
              <template slot-scope="scope">
                <a style="color: #00a0e9;cursor: pointer" @click="checkLic(scope.row)">{{ scope.row.licNo }}</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="beginDate"
              label="有效期开始日期"
              width="180">
            </el-table-column>
            <el-table-column
              label="有效期截止日期"
              width="180">
              <template slot-scope="scope">
                {{ scope.row.endDate ? scope.row.endDate : '永久' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="fl" @click="showHistory">查看历史证件</el-button>
      <el-button @click="changeCertificate" type="info" v-if="flag">换证</el-button>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import dictionarySelect from '@/components/common/dictionary-select'
  const defaultForm = {
    flag: 0,
    beginDate: '',
    businessScope: '',
    endDate: '',
    licNo: '',
    licAddr: '',
    licType: '',
    regCapital: '',
    regDate: '',
    regOrg: '',
    remarks: '',
    hplCode: ''
  }
  export default {
    name: 'hospitalinfo-add-or-update',
    data () {
      return {
        visible: false,
        dataForm: {},
        parentForm: {},
        isAdd: false,
        dataRule: {
        },
        // 弹窗标题
        dialogTitle: '',
        isShowHistory: false,
        // 历史证件列表
        historyList: [],
        flag: false
      }
    },
    components: {
      dictionarySelect
    },
    methods: {
      // 切换历史证件
      checkLic (row) {
        this.isShowHistory = false
        this.getLicDetail(row)
      },
      // 获取证件详情
      getLicDetail (row) {
        this.isAdd = false
        this.$http({
          url: this.$http.adornUrl(`/basedata/license/info/${row.licCode}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm = data
        })
      },
      // 查看历史证件列表
      showHistory () {
        this.isShowHistory = !this.isShowHistory
        this.$http({
          url: this.$http.adornUrl(`/basedata/license/restory/${this.parentForm.hplCode}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.historyList = data
        })
      },
      // 换证
      changeCertificate () {
        if (this.dataForm.licCode) {
          const data = {
            parentId: this.dataForm.licCode
          }
          this.dataForm = Object.assign(data, defaultForm)
        }
        this.dialogTitle = '换证'
        this.isAdd = true
      },
      // 永久日期切换项
      flagChange (data) {
        if (data === '0' || data === '1') {
          const flag = 0
          data = flag ? this.dataForm.endDate : this.dataForm.endDate = ''
        } else {
          this.dataForm.flag = 0
        }
      },
      init (row) {
        this.visible = true
        this.isShowHistory = false
        this.$nextTick(() => {
          this.parentForm = row
          this.$refs['dataForm'].resetFields()
          if (row.hplCode) {
            this.$http({
              url: this.$http.adornUrl(`/basedata/license/list/${row.hplCode}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data) {
                this.isAdd = false
                this.dialogTitle = '医院法人证书编辑'
                this.dataForm = data
                this.flag = true
              } else {
                this.dataForm = Object.assign(defaultForm)
                this.dialogTitle = '医院法人证书新增'
                this.isAdd = true
                this.flag = false
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.orgCode = this.parentForm.hplCode
            this.$http({
              url: this.$http.adornUrl(`/basedata/license/${this.isAdd ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then((data) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                }
              })
            })
          }
        })
      }
    }
  }
</script>
