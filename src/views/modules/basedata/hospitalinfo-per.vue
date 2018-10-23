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
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记号" prop="perNo">
            <el-input v-model="dataForm.perNo" placeholder="请输入登记号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法人" prop="legalName">
            <el-input v-model="dataForm.legalName" placeholder="请输入法人信息"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="legalName">
            <el-input v-model="dataForm.principalName" placeholder="请输入负责人信息"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始日期" prop="beginDate">
            <el-date-picker
              v-model="dataForm.beginDate"
              type="datetime"
              format="yyyy-MM-dd hh:mm"
              value-format="yyyy-MM-dd hh:mm"
              placeholder="选择日期时间">
            </el-date-picker>
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
        <el-col :span="12">
          <el-form-item label="发证机关" prop="regOrg">
            <el-input v-model="dataForm.regOrg" placeholder="请输入发证机关"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发证日期" prop="regDate">
            <el-date-picker
              v-model="dataForm.regDate"
              type="datetime"
              format="yyyy-MM-dd hh:mm"
              value-format="yyyy-MM-dd hh:mm"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="地址" prop="licType">
            <el-input v-model="dataForm.perAddr" placeholder="请输入地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="诊疗项目" prop="businessScope">
            <el-input v-model="dataForm.businessScope" placeholder="请输入诊疗项目" type="textarea"></el-input>
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
      </el-row>
    </el-form>
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
            <a style="color: #00a0e9;cursor: pointer" @click="checkLic(scope.row)">{{ scope.row.perNo }}</a>
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
    perNo: '',
    perAddr: '',
    legalName: '',
    principalName: '',
    regCapital: '',
    regOrg: '',
    remarks: ''
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
          url: this.$http.adornUrl(`/basedata/hospitalper/info/${row.perCode}`),
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
          url: this.$http.adornUrl(`/basedata/hospitalper/restory/${this.parentForm.hplCode}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.historyList = data
        })
      },
      // 换证
      changeCertificate () {
        if (this.dataForm.perCode) {
          const data = {
            parentId: this.dataForm.perCode
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
        this.$nextTick(() => {
          // this.dataForm = {}
          this.parentForm = row
          this.$refs['dataForm'].resetFields()
          if (row.hplCode) {
            this.$http({
              url: this.$http.adornUrl(`/basedata/hospitalper/list/${row.hplCode}`),
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
            this.dataForm.hplCode = this.parentForm.hplCode
            this.$http({
              url: this.$http.adornUrl(`/basedata/hospitalper/${this.isAdd ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(() => {
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
