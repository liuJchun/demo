<template>
  <div class="login-container">
    <a-form :model="formState"
            name="basic"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
            class="form-container">
      <a-form-item label="用户名"
                   name="name"
                   :rules="[{ required: true, message: '用户名不能为空!' }]">
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item label="密码"
                   name="pwd"
                   :rules="[{ required: true, message: '密码不能为空！' }]">
        <a-input-password v-model:value="formState.pwd" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary"
                  html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
export default {
  setup() {
    const formState = reactive({
      name: '',
      pwd: '',
    })

    return {
      formState,
    }
  },

  methods: {
    async onFinish(values) {
      await this.$store.dispatch('userStore/login', values)
      message.success('登录成功')
      // this.$router.push('/dashboard')
    },
  },
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.form-container {
  width: 500px;
  height: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>