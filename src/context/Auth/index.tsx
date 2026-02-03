import UserClient from "@/client/UserClient";
import { IAuthUser } from "@/interface/Context/auth";
import { appQueryKeys } from "@/react-query/root";
import { CircularProgress } from "@mui/material";
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
	reloadDataCustomer: () => void;
	refresh: () => void;
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
	source = "",
}: {
	children: ReactNode;
	token: string;
	redirectUrl: string;
	source: string;
}): React.ReactElement => {
	const [user, setUser] = useState<IAuthUser | null>(null);
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

		// Clear cached user data
		localStorage.removeItem("cached_user");
		localStorage.removeItem("cached_user_timestamp");

		window.location.href = "/";
		setIsLoading(false);
	};

	const loadUserFromCookies = useCallback(
		async (callback?: (data: any) => void, retryCount = 0) => {
			// If user is already loaded and authenticated, don't make another API call
			if (user && isAuthenticated && !isLoading) {
				if (callback && typeof callback === "function") callback(user);
				return;
			}

			// Check if we have cached user data in localStorage
			const cachedUser = localStorage.getItem("cached_user");
			const cacheTimestamp = localStorage.getItem(
				"cached_user_timestamp",
			);
			const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

			if (cachedUser && cacheTimestamp) {
				const isExpired =
					Date.now() - parseInt(cacheTimestamp) > CACHE_DURATION;
				if (!isExpired) {
					try {
						const userInfo = JSON.parse(cachedUser);
						setInfoUser(userInfo);
						setIsLoading(false);
						if (callback && typeof callback === "function")
							callback(userInfo);
						return;
					} catch (error) {
						// If parsing fails, continue with API call
						localStorage.removeItem("cached_user");
						localStorage.removeItem("cached_user_timestamp");
					}
				}
			}

			try {
				// Add timeout to prevent hanging
				const timeoutPromise = new Promise((_, reject) => {
					setTimeout(() => reject(new Error("API timeout")), 10000); // 10 second timeout
				});

				const apiPromise = UserClient.getCurrentUser();
				const respUser = (await Promise.race([
					apiPromise,
					timeoutPromise,
				])) as any;

				if (respUser?.status === "OK") {
					const userInfo = respUser?.data;
					const cookiesValue = Cookies.get(ACCESS_TOKEN);
					if (cookiesValue && cookiesValue.length > 0) {
						setCookies({ bearerToken: cookiesValue }, true);
					}

					if (userInfo) {
						// Cache user data in localStorage
						localStorage.setItem(
							"cached_user",
							JSON.stringify(userInfo),
						);
						localStorage.setItem(
							"cached_user_timestamp",
							Date.now().toString(),
						);

						queryClient.invalidateQueries(
							appQueryKeys.cart.cartData,
						);
					}
					setInfoUser(userInfo);
					setIsLoading(false);
					if (callback && typeof callback === "function")
						callback(userInfo);
				} else {
					// API returned error status
					console.warn("Failed to get user data:", respUser?.status);
					handleApiFailure();
				}
			} catch (error) {
				console.error("Error loading user from cookies:", error);

				// Retry logic for network errors (but not for timeouts on first try)
				if (
					retryCount < 2 &&
					(error as any).message !== "API timeout"
				) {
					setTimeout(
						() => {
							loadUserFromCookies(callback, retryCount + 1);
						},
						1000 * (retryCount + 1),
					); // Exponential backoff
					return;
				}

				handleApiFailure();
			}

			function handleApiFailure() {
				// Check if we have valid cookies but API failed
				const cookiesValue = Cookies.get(ACCESS_TOKEN);

				if (cookiesValue && cookiesValue.length > 0) {
					// We have a token but API failed - use cached data if available
					if (cachedUser) {
						try {
							const userInfo = JSON.parse(cachedUser);
							setInfoUser(userInfo);
							setIsLoading(false);
							if (callback && typeof callback === "function")
								callback(userInfo);
							return;
						} catch (parseError) {
							console.error(
								"Failed to parse cached user data:",
								parseError,
							);
						}
					}

					// If no cached data, set as unauthenticated but don't remove cookies yet
					// (maybe it's just a temporary network issue)
					setInfoUser(null);
					setIsAuthenticated(false);
					setIsLoading(false);
				} else {
					// No token, definitely not authenticated
					setInfoUser(null);
					setIsAuthenticated(false);
					setIsLoading(false);
					removeCookies();
				}

				if (callback && typeof callback === "function") callback(null);
			}
		},
		[
			getUserInfo,
			setIsLoading,
			user,
			isAuthenticated,
			isLoading,
			queryClient,
			setCookies,
			removeCookies,
		], // Added dependencies
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

	// Initial load effect - only runs once on mount
	useEffect(() => {
		loadUserFromCookies();
	}, []); // Empty dependency array - runs only once

	// Handle token/redirect changes separately
	useEffect(() => {
		if (token && user) {
			if (redirectUrl) {
				router.push(redirectUrl);
			}
		}
	}, [token, redirectUrl, user]); // Only when these specific values change

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
