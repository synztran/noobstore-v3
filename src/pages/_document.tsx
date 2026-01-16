import { ServerStyleSheets as MaterialUiServerStyleSheets } from "@mui/styles";
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
					{/* Google Fonts - Nunito, Montserrat, Poppins, Merriweather Sans */}
					<link
						href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Poppins:wght@800&display=swap"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Merriweather+Sans:ital,wght@0,300;0,500;0,700;1,300;1,500;1,700&family=Nunito:ital,wght@0,300;0,500;0,700;0,1000;1,300;1,500;1,700;1,1000&display=swap"
						rel="stylesheet"
					/>
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
