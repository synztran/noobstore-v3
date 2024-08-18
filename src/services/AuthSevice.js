import AuthClient from 'client/AuthClient';
import { isValid } from 'client/index';

export const loginLocal = async (body) => {
  await AuthClient.loginLocal(body);
  return {};
};

export const login = async ({ email, password, type = 'CUSTOMER', refUrl, redirectUrl}) => {
  const data = {
    email,
    password,
  }
  const authRes = await AuthClient.postLogin(data);
  if (!isValid(authRes)) {
    return authRes;
  }
  return authRes;
};

export const signUp = async (data) => {
  const signUpRes = await AuthClient.signUp(data);
  return signUpRes;
};

export const registerGuest = async (data) => {
  const registerGuestRes = await AuthClient.registerGuest(data);
  return registerGuestRes;
};

export const loginv1 = async ({ tokenv1 }) => {
  const registerUserV1 = await AuthClient.registerV1({ t: tokenv1 });
  return registerUserV1;
};

export const passwordRecovery = async (data) => {
  const passwordRecoveryRes = await AuthClient.passwordRecovery(data);
  return passwordRecoveryRes;
};

export const passwordUpdate = async (data) => {
  const passwordUpdateRes = await AuthClient.passwordUpdate(data);
  return passwordUpdateRes;
};

export const newPWUpdate = async (data) => {
  const newPWUpdateRes = await AuthClient.newPassword(data);
  return newPWUpdateRes;
};

export default {
  login,
  loginv1,
  signUp,
  registerGuest,
  loginLocal,
  passwordRecovery,
  passwordUpdate,
  newPWUpdate,
};
