import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/core/styles';
import Theme from 'components/layout/Theme';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components';
import { AppConfig } from '../utils/AppConfig';

// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    let pageProps = null;

    const styledComponentsSheet = new StyledComponentSheets();
    const materialSheets = new MaterialUiServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) => {
            pageProps = props;
            return styledComponentsSheet.collectStyles(materialSheets.collect(<App {...props} />));
          },
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        pageProps,
        styles: (
          <>
            {initialProps.styles}
            {materialSheets.getStyleElement()}
            {styledComponentsSheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      styledComponentsSheet.seal();
    }
  }

  render() {
    const { pageProps }:any = this.props;

    return (
      <Html lang={AppConfig.locale}>
        <Head>
          <link rel="shortcut icon" href="/static/favicon.ico" />
          {/* PWA primary color */}
          <meta name="theme-color" content={Theme.palette.primary.main} />
        </Head>
        <body className="notranslate">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
