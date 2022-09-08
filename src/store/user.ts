import { defineStore } from 'pinia';
import type { LoginParams } from '~/models/user';
import { login as loginApi } from '~/api/user';

export const useUserStore = defineStore('sdu-map-user', () => {
  const username = ref('');
  const token = ref('');

  async function login({ username, password, captcha }: LoginParams) {
    username = username.trim();
    password = password.trim();
    captcha = captcha.trim();
    const res = await loginApi({ username, password, captcha });
    token.value = res.data.token as string;
  }
  return { username, token, login };
});
