<template>
  <ThemeProvider :color="{ middle: { 'bg-base': '#fff' }, primary: { DEFAULT: '#1896ff' } }">
    <div class="login-box rounded-sm">
      <a-form
        :model="form"
        :wrapperCol="{ span: 24 }"
        @finish="login"
        class="login-form w-[400px] p-lg xl:w-[440px] xl:p-xl h-fit text-text"
      >
        <div class="third-platform">
          <div class="third-title mb-md text-lg">第三方登录：</div>
          <div class="third-list flex text-[28px]">
            <WechatOutlined class="icon wechat flex-1 cursor-pointer text-gray-400 hover:text-green-600" />
            <TwitterOutlined class="icon twitter flex-1 cursor-pointer text-gray-400 hover:text-blue-400" />
            <QqOutlined class="icon qq flex-1 cursor-pointer text-gray-400 hover:text-red-600" />
          </div>
        </div>
        <a-divider>Or</a-divider>
        <a-form-item :required="true" name="username">
          <a-input
            v-model:value="form.username"
            autocomplete="new-username"
            placeholder="请输入管理员学号"
            class="login-input h-[40px]"
          />
        </a-form-item>
        <a-form-item :required="true" name="password">
          <a-input-password
            v-model:value="form.password"
            autocomplete="new-password"
            placeholder="请输入密码"
            class="login-input h-[40px]"
            type="password"
          />
        </a-form-item>
        <a-button htmlType="submit" class="h-[40px] w-full" type="primary" :loading="loading"> 登录 </a-button>
        <a-divider></a-divider>
        <div class="terms">
          登录即代表您同意我们的
          <span class="font-bold">用户条款 </span>、<span class="font-bold"> 数据使用协议 </span>、以及
          <span class="font-bold">Cookie使用协议</span>。
        </div>
      </a-form>
    </div>
  </ThemeProvider>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useAccountStore } from '@/store';
  import { ThemeProvider } from 'stepin';

  // utils
  import { decryptPwd, encryptLinker } from '@/utils/encrypter'

  // api
  import { Login } from '@/api/login' 

  import { useRouter } from 'vue-router';
  const router = useRouter();


  export interface LoginFormProps {
    username: string;
    password: string;
  }
  const loading = ref(false);

  const form = reactive<LoginFormProps>({
    username: undefined,
    password: undefined,
  });

  const emit = defineEmits<{
    (e: 'success', fields: LoginFormProps): void;
    (e: 'failure', reason: string, fields: LoginFormProps): void;
  }>();

  const accountStore = useAccountStore();
  function login(params: LoginFormProps) {
    loading.value = true;

    const body = {
      studentId: form.username,
      password: encryptLinker(form.password),
    }

    // const body = {
    //   oldLinker: encryptLinker(""),
    //   newLinker: encryptLinker("123456"),
    //   confirmLinker: encryptLinker("123456")
    // }

    accountStore
      .login(body)
      .then((res) => {
        emit('success', params);
      })
      .catch((e) => {
        emit('failure', e.message, params);
      })
      .finally(() => {
        loading.value = false;
        router.push('/workplace')
      });


  }
</script>
