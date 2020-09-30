<template>
  <div class="app-container">
    <el-form ref="form" class="roadposition_form" :model="form" :rules="formRules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" :disabled="isUpdate" placeholder="支持中文，英文，数字，以及三种类型组合" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所属派出所" prop="policeStationId">
            <el-select v-model="form.policeStationId" placeholder="请选择" filterable>
              <el-option
                v-for="item in policeStationNameOptions"
                :key="item.policeStationId"
                :label="item.policeStationName"
                :value="item.policeStationId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="手机号" prop="telephone">
            <el-input v-model="form.telephone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item v-if="userId" label="密码">
            <el-input v-model="form.password" placeholder="请输入密码" maxlength="20" />
          </el-form-item>
          <el-form-item v-else label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="">
            <el-button type="primary" :loading="saveLoading" @click="doSubmit">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import axios from '@/utils/request'

export default {
  data() {
    const validateInput = (rule, value, callback) => {
      /* eslint-disable eqeqeq */
      const reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
      if (!value) {
        callback(new Error('请输入必填项'))
      } else if (!reg.test(value)) {
        callback(new Error('输入不合规范'))
      } else {
        callback()
      }
    }
    const validatePoliceStation = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入必填项'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入必填项'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      /* eslint-disable eqeqeq */
      const reg = /^1\d{10}$/
      if (!value) {
        callback()
        // callback(new Error('请输入必填项'))
      } else if (!reg.test(value)) {
        callback(new Error('手机号输入不合规范'))
      } else {
        callback()
      }
    }
    return {
      saveLoading: false,
      isUpdate: false, // 是否是修改模式
      userId: '', // 修改用户的id
      formRules: {
        username: [
          { required: true, trigger: 'change', validator: validateInput }
        ],
        telephone: [
          { trigger: 'change', validator: validatePhone }
        ],
        policeStationId: [
          { required: true, trigger: 'change', validator: validatePoliceStation }
        ],
        password: [
          { required: true, trigger: 'change', validator: validatePassword }
        ]
      },
      policeStationNameOptions: [],
      form: {
        username: '',
        policeStationId: '',
        telephone: '',
        password: ''
      }
    }
  },
  mounted: function() {
    const { username, userId } = this.$route.query
    // 获取派出所列表
    axios.post('/api/policestations/search', {
      pageNo: 1,
      pageSize: 100
    }).then((res) => {
      this.policeStationNameOptions = res.data.data
    }).catch(() => {
      this.$message({
        message: '获取派出所数据异常',
        type: 'error'
      })
    })
    if (username) {
      this.isUpdate = true
      this.userId = userId
      axios.get(`/api/users/${userId}`).then((res) => {
        const { username, telephone, policeStationId } = res.data
        Object.assign(this.form, {
          username,
          telephone,
          policeStationId
        })
      }).catch((a) => {
        this.$message({
          message: '获取数据异常',
          type: 'error'
        })
      })
    }
  },
  methods: {
    doSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveLoading = true
          if (this.isUpdate) {
            axios.put('/api/users', {
              userId: this.userId,
              ...this.form
            }).then((res) => {
              this.saveLoading = false
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  location.reload()
                }
              })
            }).catch((a) => {
              this.saveLoading = false
              this.$message({
                message: '操作失败',
                type: 'error'
              })
            })
          } else {
            axios.post('/api/user', {
              ...this.form,
              type: 2
            }).then((res) => {
              this.saveLoading = false
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  location.reload()
                }
              })
            }).catch((a) => {
              this.saveLoading = false
              this.$message({
                message: '操作失败',
                type: 'error'
              })
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.btns_box {
  margin-bottom: 20px;
}
.table_pagination {
  margin-top: 20px;
}
.savebtn {
  margin-top: 20px;
}
.el-select {
  display: block;
}
</style>
