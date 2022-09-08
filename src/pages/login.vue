<script lang="ts" setup>
import type { Form } from '@varlet/ui';

const { t } = useI18n();
const formData = $ref({
  username: '',
  password: '',
  captcha: ''
});

const imgUrl = $ref('');

const form = $ref<Form | null>(null);

const handleLogin = async () => {
  if (form === null) {
    return;
  }
  if (!form.validate()) {
    return;
  }
  useUserStore().login(formData);
};
</script>

<template>
  <div h-full flex justify-center items-center>
    <div w-sm h-sm>
      <var-card :title="t('login.title')">
        <template #description>
          <div mx-sm my-md>
            <var-form ref="form">
              <var-input
                v-model="formData.username"
                mt-xs
                :placeholder="t('login.username')"
                :rules="[v => !!v || t('login.username_verify')]"
              />
              <var-input
                v-model="formData.password"
                type="password"
                mt-xs
                :placeholder="t('login.password')"
                :rules="[v => !!v || t('login.password_verify')]"
              />
              <var-input
                v-model="formData.captcha"
                mt-xs
                :placeholder="t('login.captcha')"
                :rules="[v => !!v || t('login.captcha_verify')]"
              >
              </var-input>
              <div mt-xs flex justify-center>
                <var-image :src="imgUrl"></var-image>
              </div>
              <div mt-xs flex justify-center>
                <var-button type="primary" @click.prevent="handleLogin">
                  {{ t('login.login') }}
                </var-button>
              </div>
            </var-form>
          </div>
        </template>
      </var-card>
    </div>
  </div>
</template>

<style></style>

<route lang="yaml">
meta:
  layout: guest
</route>
