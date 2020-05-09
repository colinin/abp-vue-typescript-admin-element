<template>
  <el-form
    ref="changePassword"
    :model="changePassword"
    label-width="100px"
  >
    <el-form-item
      label="请输入原密码"
      prop="oldPassword"
    >
      <el-input
        v-model="changePassword.oldPassword"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item
      label="请输入新密码"
      prop="newPassword"
    >
      <el-input
        v-model="changePassword.newPassword"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item
      label="请确认新密码"
      prop="confirmPassword"
    >
      <el-input
        v-model="changePassword.confirmPassword"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        class="cancel"
        style="width:100px"
        @click="onCancel"
      >
        取 消
      </el-button>
      <el-button
        class="confirm"
        type="primary"
        style="width:100px"
        @click="onSubmit('changePassword')"
      >
        确 定
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { UserChangePasswordDto, UserApiService } from '@/api/users'

class ChangePassword {
  oldPassword!: string
  newPassword!: string
  confirmPassword!: string
}

@Component({
  name: 'ChangePassword'
})
export default class extends Vue {
  @Prop({ default: '' }) private userId!: string
  private changePassword: ChangePassword
  private userApiService: UserApiService

  constructor() {
    super()
    this.changePassword = new ChangePassword()
    this.userApiService = new UserApiService()
  }

  private onSubmit() {
    const form = this.$refs.changePassword as any
    form.validate((valid: boolean) => {
      if (valid) {
        const changePasswordInput = new UserChangePasswordDto()
        changePasswordInput.currentPassword = this.changePassword.oldPassword
        changePasswordInput.newPassword = this.changePassword.newPassword
        this.userApiService.changePassword(changePasswordInput).then(() => {
          this.$message.success('密码已变更!')
          this.onCancel()
        })
      }
    })
  }

  private onCancel() {
    this.$emit('onClose')
  }
}
</script>
