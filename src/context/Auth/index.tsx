import AuthClient from "@/client/AuthClient";
import UserClient from "@/client/UserClient";
import { IAuthUser } from "@/interface/Context/auth";
import { appQueryKeys } from "@/react-query/root";
import { CircularProgress } from "@material-ui/core";
import { useQueryClient } from "@tanstack/react-query";
import { getFirst } from "client/index";
import UserService from "client/UserClient";
import { HTTP_STATUS } from "constants/Enums/https";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import AuthService from "services/AuthSevice";
import {
	ACCESS_TOKEN,
	ACCESS_TOKEN_LONGLIVE,
	GENERAL_DOMAIN,
} from "systemconfig/index";
import NotifyUtils from "utils/NotifyUtils";
import { getSessionTokenClient } from "utils/SessionUtils";

interface AuthContextType {
	user: IAuthUser | null;
	customerInfo: IAuthUser | null;
	isAuthenticated: boolean;
	login: (info: any, rememberMe: boolean) => void;
	handleLogin: (payload: {
		email: string;
		password: string;
		rememberMe: boolean;
		success: () => void;
		type: string;
		callback?: (data: any) => void;
		withOtp: boolean;
		error: () => void;
	}) => void;
	logout?: () => void;
	isLoading: boolean;
	// handleResetPassword: () => void;
	reloadDataCustomer: () => void;
	refresh: () => void;
	// refreshKey: string;
}

interface AuthProviderProps {
	children: ReactNode;
	token: string;
	redirectUrl: string;
	initUser?: any;
	source: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({
	children,
	token,
	redirectUrl,
	// initUser,
	source = "",
}: {
	children: ReactNode;
	token: string;
	redirectUrl: string;
	// initUser: any;
	source: string;
}): JSX.Element => {
	const [user, setUser] = useState(null);
	const [customerInfo, setCustomerInfo] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const { pathname } = router;
	const [_, setRefreshKey] = useState(Date.now());
	const refresh = () => {
		setRefreshKey(Date.now());
	};
	const queryClient = useQueryClient();

	const setCookies = useCallback((info: any, rememberMe: boolean) => {
		const { bearerToken = null } = info;
		Cookies.set(ACCESS_TOKEN, bearerToken, {
			domain: GENERAL_DOMAIN,
			sameSite: "Lax",
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

			const res = await UserService.getCurrentUser({});
			if (res.status === "OK") {
				const customerInfoData = getFirst(res) || {
					account: null,
					session: null,
				};
				const customerInfoObj: any =
					typeof customerInfoData === "object" &&
					customerInfoData !== null
						? { ...customerInfoData }
						: {};
				setCustomerInfo(customerInfoObj);
				return res;
			}
			if (res.status === HTTP_STATUS.Unauthorized) {
				removeCookies();
			}
		} catch (error) {
			NotifyUtils.error("Đã có lỗi xảy ra");
		}
		return null;
	}, []);

	const reloadDataCustomer = async () => {
		//
	};

	const setInfoUser = (userInfo: any) => {
		setUser(userInfo);
		setIsAuthenticated(!!userInfo);
		setIsLoading(false);
	};

	const logout = () => {
		setIsLoading(true);
		setInfoUser(null);
		setCookies({ info: null }, false);
		removeCookies();

		window.location.href = "/";
		setIsLoading(false);
	};

	const loadUserFromCookies = useCallback(
		async (callback?: (data: any) => void) => {
			const respUser = await UserClient.getCurrentUser();
			if (respUser?.status === "OK") {
				const userInfo = respUser?.data;
				const cookiesValue = Cookies.get(ACCESS_TOKEN);
				if (cookiesValue && cookiesValue.length > 0) {
					setCookies({ bearerToken: cookiesValue }, true);
				}

				if (userInfo) {
					queryClient.invalidateQueries(appQueryKeys.cart.cartData);
				}
				setInfoUser(userInfo);
				setIsLoading(false);
				if (callback && typeof callback === "function")
					callback(userInfo);
			}
		},
		[getUserInfo, setIsLoading]
	);

	const login = (info: any, rememberMe: boolean) => {
		setCookies(info, rememberMe);
		loadUserFromCookies();
	};

	const handleLogin = ({
		email,
		password,
		rememberMe = true,
		success,
		type = "CUSTOMER",
		callback,
		withOtp,
		error,
	}: {
		email: string;
		password: string;
		rememberMe: boolean;
		success: () => void;
		type: string;
		callback?: (data: any) => void;
		withOtp: boolean;
		error: () => void;
	}) => {
		const param = {
			email,
			password,
			type,
			remember: rememberMe,
			refUrl: router?.pathname || "/",
			redirectUrl: redirectUrl || "/",
		};
		const paramOtp = {
			email,
			type,
			remember: rememberMe,
			refUrl: router?.pathname || "/",
			redirectUrl: redirectUrl || "/",
		};
		// action
		AuthService.login(withOtp ? paramOtp : param)
			.then(async (result) => {
				if (callback) callback(result);
				if (result.status !== HTTP_STATUS.Ok) {
					if (error) error();
					NotifyUtils.error(result?.message || "Đã có lỗi xảy ra");
					return;
				}
				const userInfo = getFirst(result);
				login(userInfo, rememberMe);
				queryClient.invalidateQueries(appQueryKeys.cart.cartData);

				if (success) {
					success();
				}
			})
			.catch(() => {
				NotifyUtils.error("Đã có lỗi xảy ra");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		loadUserFromCookies(async () => {
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
				reloadDataCustomer,
				refresh,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

export const LoadingRoute = ({ children }: { children: any }) => {
	const router = useRouter();
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		const handleStart = () => setLoading(true);
		const handleComplete = () => setLoading(false);

		router.events.on("routeChangeStart", handleStart);
		router.events.on("routeChangeComplete", handleComplete);
		router.events.on("routeChangeError", handleComplete);

		return () => {
			router.events.off("routeChangeStart", handleStart);
			router.events.off("routeChangeComplete", handleComplete);
			router.events.off("routeChangeError", handleComplete);
		};
	});

	if (isLoading) {
		return (
			<div className="flex w-full h-screen top-1/2 left-1/2 relative items-center">
				<CircularProgress size={64} color="primary" />
			</div>
		);
	}

	return children;
};
