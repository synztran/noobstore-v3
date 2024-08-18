import UserClient from '@/client/UserClient';
import useQueryData from '@/hook/useQueries';
import { CircularProgress } from '@material-ui/core';
import { getFirst, isValid } from 'client/index';
import { HTTP_STATUS, RETRY_NUMBER_GET_USER } from 'constants/Enums/https';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AuthService from 'services/AuthSevice';
import UserService from 'services/UserService';
import { ACCESS_TOKEN, ACCESS_TOKEN_LONGLIVE, GENERAL_DOMAIN } from 'systemconfig/index';
import NotifyUtils from 'utils/NotifyUtils';
import { getSessionTokenClient } from 'utils/SessionUtils';

const AuthContext = createContext({});

export const AuthProvider = ({
  children,
  token,
  redirectUrl,
  initUser,
  source = '',
}) => {
  const { cartQuery } = useQueryData();
  const [user, setUser] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { pathname } = router;
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const prevRefreshKey = useRef(refreshKey);
  const refresh = () => {
    setRefreshKey(Date.now());
  };

  // TODO:
  const setCookies = useCallback((info, rememberMe = false) => {
    const { bearerToken = null } = info;
    Cookies.set(ACCESS_TOKEN, bearerToken, {
      domain: GENERAL_DOMAIN,
      sameSite: 'Lax',
    });
  }, []);

  const removeCookies = () => {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(ACCESS_TOKEN, { domain: GENERAL_DOMAIN });
    Cookies.remove(ACCESS_TOKEN_LONGLIVE);
    Cookies.remove(ACCESS_TOKEN_LONGLIVE, { domain: GENERAL_DOMAIN });
  };

  const getUserInfo = useCallback(async () => {
    try {
      const ss = getSessionTokenClient();
      if (!ss || ss.length === 0) return null;

      const res = await UserService.getAccount({}, RETRY_NUMBER_GET_USER);

      if (isValid(res)) {
        const customerInfoData = getFirst(res);
        const [accountInfoRes] = await UserService.getAccountInfo({})
        customerInfoData.account = getFirst(accountInfoRes)?.account || null;
        customerInfoData.session = getFirst(accountInfoRes)?.session || null;
        setCustomerInfo(customerInfoData);
        return res;
      }
      if (res.status === HTTP_STATUS.Unauthorized) {
        removeCookies();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    return null;
  }, []);

  const reloadDataCustomer = async () => {
    try {
      const res = await UserService.getAccount();
      if (isValid(res)) {
        const customerInfoData = getFirst(res);
        const [bankInfoRes, accountInfoRes] = await Promise.all([CustomerClient.getBankAccountInfo({}), UserService.getAccountInfo({})]);
        customerInfoData.bank = getFirst(bankInfoRes);
        customerInfoData.account = getFirst(accountInfoRes)?.account || null;
        customerInfoData.session = getFirst(accountInfoRes)?.session || null;
        setCustomerInfo(customerInfoData);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const setInfoUser = (userInfo) => {
    setUser(userInfo);
    setIsAuthenticated(!!userInfo);
    setIsLoading(false);
  };

  const logout = (callback, options = {}) => {
    // AuthClient.logout();

    // const { clearAll = false } = options || {};
    setInfoUser(null);
    setCookies({}, true);
    removeCookies();

    window.location.href = '/';
    if (typeof callback === 'function') {
      return callback();
    }

    // redirect to mienbac.thuocsi.vn
    // setTimeout(() => {
    //   window.location.reload(true);
    // }, 1000);

    return false;
  };

  const loadUserFromCookies = useCallback(
    async (callback) => {
      const respUser = await UserClient.getCurrentUser();
      if (respUser?.status === 'OK') {
        const userInfo = getFirst(respUser, null);
        const cookiesValue = Cookies.get(ACCESS_TOKEN, { domain: GENERAL_DOMAIN });
        if (cookiesValue && cookiesValue.length > 0) {
          setCookies({ bearerToken: cookiesValue }, true);
        }

        if (userInfo) {
          userInfo.cookiesValue = cookiesValue;
          cartQuery.refetch();
        } 
        setInfoUser(userInfo);
        setIsLoading(false);
        if (callback && typeof callback === 'function') callback(userInfo);
      }
    },
    [getUserInfo, setIsLoading],
  );

  const login = (info, rememberMe) => {
    setCookies(info, rememberMe);
    loadUserFromCookies();
  };

  const handleLogin = ({
    email,
    password,
    rememberMe = true,
    success,
    type = 'CUSTOMER',
    callback,
    withOtp,
    error,
  }) => {
    const param = { email, password, type, remember: rememberMe, refUrl: router?.pathname || '/', redirectUrl: redirectUrl || '/' };
    const paramOtp = {
      email,
      type,
      remember: rememberMe,
      refUrl: router?.pathname || '/',
      redirectUrl: redirectUrl || '/',
    };
    // action
    AuthService.login(withOtp ? paramOtp : param)
      .then(async (result) => {
        if (callback) callback(result);
        if (result.status !== HTTP_STATUS.Ok) {
          if (error) error();
          NotifyUtils.error(result?.message || 'Đã có lỗi xảy ra');
          return;
        }
        const userInfo = getFirst(result);
        login(userInfo, rememberMe);
        cartQuery.refetch();

        if (success) {
          success();
        }
      })
      .catch(() => {
        NotifyUtils.error('Đã có lỗi xảy ra');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResetPassword = useCallback(async (data) => {
    // const result = await AuthService.resetPassword(data);
    // if (isValid(result)) {
    //   NotifyUtils.info(result.message);
    // } else {
    //   NotifyUtils.error(result?.message || 'Đã có lỗi xảy ra');
    // }
  }, []);

  // off check token
  useEffect(() => {
    // nếu không có user thì mới check token
    // if (initUser === null) {
    //   if (token) {
    //     setCookies({ bearerToken: token });
    //   }
    //   loadUserFromCookies(async (userInfo) => {
    //     if (token) {
    //       if (redirectUrl) {
    //         router.push(redirectUrl);
    //       } else {
    //         router.push(router.pathname);
    //       }
    //     }
    //   });
    // } else {
    //   loadUserFromCookies(async (userInfo) => {
    //     if (token) {
    //       if (redirectUrl) {
    //         router.push(redirectUrl);
    //       } else {
    //         router.push(router.pathname);
    //       }
    //     }
    //   });
    // }
    loadUserFromCookies(async (userInfo) => {
      if (token) {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push(router.pathname);
        }
      }
    });
  }, [pathname, loadUserFromCookies, token, redirectUrl, source]);

  return (
    <AuthContext.Provider
      value={{
        user,
        customerInfo,
        isAuthenticated,
        login,
        handleLogin,
        logout,
        isLoading,
        handleResetPassword,
        reloadDataCustomer,
        refresh,
        refreshKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

export const LoadingRoute = ({ children }) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => setLoading(true);
    const handleComplete = (url) => setLoading(false);

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
        router.events.off('routeChangeStart', handleStart)
        router.events.off('routeChangeComplete', handleComplete)
        router.events.off('routeChangeError', handleComplete)
    }
  })

  if (isLoading) {
    return <div className='flex w-full h-screen top-1/2 left-1/2 relative items-center'><CircularProgress size={64} color="success" /></div>;
  }

  return children;
};
