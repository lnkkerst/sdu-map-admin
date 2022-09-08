import type { LoginParams } from './../models/user';
import http from '~/utils/http';

export const getCaptcha = () => {
  return http.get('/captcha');
};

export const login = async (userData: LoginParams) => {
  return http.post('/session', { data: userData });
};

export const logout = () => {
  return http.delete('/session');
};
