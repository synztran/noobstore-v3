import { ACCOUNT_API } from '@/constants/APIUri';
import { GET } from '../../src/client/index';

const getCurrentUser = async (ctx) => {
    const url = ACCOUNT_API.CURRENT_ACCOUNT;
    return GET({ctx, url});
}

export default {
    getCurrentUser,
}