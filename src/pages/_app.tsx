import ContextProviderCompose from '@/context/ContextProviderComposer';
import theme from '@/theme';
import createEmotionCache from '@/utils/createEmotionCache';
import { AuthProvider, LoadingRoute } from 'context/Auth';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from "next/router";
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
// import { ThemeProvider as StyledTheme } from 'styled-components';
import '../styles/global.css';
import { DEFAULT_NOOBSTORE_DESCRIPTION, DEFAULT_NOOBSTORE_LONG_TITLE, DEFAULT_NOOBSTORE_TITLE } from './../../src/constants/data';

// import MuiThemeProvider from '@/theme/ThemeProvider'; // Path to your ThemeProvider
import { MuiThemeProvider } from '@material-ui/core';
// import { StylesProvider, jssPreset } from '@mui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider } from '@material-ui/core/styles';
import "react-toastify/dist/ReactToastify.css"; //add this line
import { ThemeProvider as StyledTheme } from 'styled-components';
import { Query, QueryClient, QueryClientProvider } from '@tanstack/react-query'


const cache = createEmotionCache();
const queryClient = new QueryClient()

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { user = {} } = pageProps || {};
  const router = useRouter();
  const { query } = router;
  const { token, redirectUrl, source } = query || {};

  // fetch info user
  // useEffect(() => {
  //   (async () => {
  //     // TODO: current error, need handle
  //     const respUser = await UserClient.getCurrentUser();
  //     if (respUser?.status === 'OK') {
  //       const token = getFirst(respUser)?.access_token;
  //       // TODO: check is already have token yet, if not, set token to cookie
  //       if (Cookies.get('token') === '') {
  //         Cookies.set('token', token);
  //       }
  //     }
  //   })()
  // }, [])

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }

    // nếu khách vào thuocsi.com.vn -> cần redirect lại domain chính
    // if (window && window?.location?.href?.indexOf('thuocsi.com.vn') >= 0) {
    //   router.push(`${DOMAIN_WEB_HOST}`);
    // }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Cache-Control" content="no-cache" />
        <meta httpEquiv="Expires" content="-1" />
        <meta name="keywords" content="noobstore" />
        <title>{DEFAULT_NOOBSTORE_TITLE}</title>
        <meta name="title" content={DEFAULT_NOOBSTORE_TITLE} />
        <meta
          name="description"
          content={DEFAULT_NOOBSTORE_DESCRIPTION}
        />
        <meta property="og:site_name" content={DEFAULT_NOOBSTORE_TITLE} />
        <meta property="og:title" content={DEFAULT_NOOBSTORE_TITLE} />
        <meta property="og:image:alt" content={DEFAULT_NOOBSTORE_LONG_TITLE} />
        <meta
          property="og:description"
          content={DEFAULT_NOOBSTORE_DESCRIPTION}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
      </Head>
      {/* generateClassName={generateClassName} */}
      <StylesProvider injectFirst>
        <StyledTheme theme={theme}>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
              <ContextProviderCompose
                contextProviders={[
                  <AuthProvider
                    token={token}
                    redirectUrl={redirectUrl}
                    initUser={user}
                    source={source as string} 
                    children={undefined}          
                  />,
                ]}
              >
                <LoadingRoute>
                  <Component {...pageProps} />
                  <ToastContainer limit={2} pauseOnHover={false} hideProgressBar autoClose={2000} closeOnClick />
                </LoadingRoute>
              </ContextProviderCompose>
            </QueryClientProvider>
          </MuiThemeProvider>
        </StyledTheme>
      </StylesProvider>
    </>
  )
};

export default MyApp;
