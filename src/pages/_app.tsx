import {
	DEFAULT_NOOBSTORE_DESCRIPTION,
	DEFAULT_NOOBSTORE_LONG_TITLE,
	DEFAULT_NOOBSTORE_TITLE,
} from "@/constants/data";
import ContextProviderCompose from "@/context/ContextProviderComposer";
import theme from "@/theme";
import { AuthProvider, LoadingRoute } from "context/Auth";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
// import { MuiThemeProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { StylesProvider } from "@material-ui/core/styles";
import ThemeProvider from "@/theme/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css"; //add this line
import { ThemeProvider as StyledTheme } from "styled-components";
import MusicPlayer from "@/components/MusicPlayer";
import "../styles/global.css";
import MessageChat from "@/components/MessageChat";

// const cache = createEmotionCache();
const queryClient = new QueryClient();

type AppPropsWithLayout = AppProps & {
	Component: AppProps["Component"] & { layout?: React.ComponentType };
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
	const { user = {} } = pageProps || {};
	const router = useRouter();
	const { query } = router;
	const { token, redirectUrl, source } = query || {};
	const isAdminRoute = router.pathname.includes("/admin");
	const Layout =
		Component.layout ||
		(({ children }: { children: React.ReactElement }) => children);

	useEffect(() => {
		const jssStyles = document.querySelector("#jss-server-side");
		if (jssStyles) {
			jssStyles?.parentElement?.removeChild(jssStyles);
		}
	}, []);

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="Cache-Control" content="no-cache" />
				<meta httpEquiv="Expires" content="-1" />
				<meta name="keywords" content="noobstore" />
				<title>{DEFAULT_NOOBSTORE_TITLE}</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="title" content={DEFAULT_NOOBSTORE_TITLE} />
				<meta
					name="description"
					content={DEFAULT_NOOBSTORE_DESCRIPTION}
				/>
				<meta
					property="og:site_name"
					content={DEFAULT_NOOBSTORE_TITLE}
				/>
				<meta property="og:title" content={DEFAULT_NOOBSTORE_TITLE} />
				<meta
					property="og:image:alt"
					content={DEFAULT_NOOBSTORE_LONG_TITLE}
				/>
				<meta
					property="og:description"
					content={DEFAULT_NOOBSTORE_DESCRIPTION}
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
				/>
			</Head>
			<StylesProvider injectFirst>
				<ThemeProvider>
					<ContextProviderCompose
						contextProviders={[
							<QueryClientProvider
								key="QueryClientProvider"
								client={queryClient}
							/>,
							<AuthProvider
								key="authProvider"
								token={token as string}
								redirectUrl={redirectUrl as string}
								initUser={user}
								source={source as string}
								children={undefined}
							/>,
						]}>
						{/* <ReactQueryDevtools initialIsOpen={false} /> */}

						<LoadingRoute>
							<Component {...pageProps} />
							{/* <MessageChat isModule /> */}

							<ToastContainer
								limit={2}
								pauseOnHover={false}
								hideProgressBar
								autoClose={2000}
								closeOnClick
							/>
						</LoadingRoute>
					</ContextProviderCompose>
					{/* <MusicPlayer /> */}
				</ThemeProvider>
			</StylesProvider>
		</>
	);
};

export default MyApp;
