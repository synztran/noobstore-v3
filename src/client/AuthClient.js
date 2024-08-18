import { ACCOUNT_API, AUTH_API } from 'constants/APIUri';
import { POST } from '../../src/client/index';

export const postRegister = async (data) => {
    const { email, password, firstName, lastName } = data;
    const url = AUTH_API.REGISTER;
    return POST({url, body: data, isAuth: false});
}

export const postLogin = async (data) => {
    const url = AUTH_API.LOGIN;
    const body = {
        email: data.email,
        password: data.password,
    }
    return POST({url, body , isAuth: false});
}


export const getAccountInfo = async ({ ctx }) => GET({ ctx, url: ACCOUNT_API.CURRENT_ACCOUNT  });

export default {
    postRegister,
    postLogin,
    getAccountInfo,
}