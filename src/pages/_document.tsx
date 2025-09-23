import { ServerStyleSheets as MaterialUiServerStyleSheets } from "@material-ui/core/styles";
import Document, { Head, Html, Main, NextScript } from "next/document";
import { ServerStyleSheet as StyledComponentSheets } from "styled-components";
import { AppConfig } from "../utils/AppConfig";

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
						return styledComponentsSheet.collectStyles(
							materialSheets.collect(<App {...props} />)
						);
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
		const { pageProps }: any = this.props;

		return (
			<Html lang={AppConfig.locale}>
				<Head>
					<link rel="shortcut icon" href="/static/favicon.ico" />
					{/* <script
						src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPCHA_SITE_TO_RECAPCHA_KEY}`}
						async
						defer
					/> */}
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
