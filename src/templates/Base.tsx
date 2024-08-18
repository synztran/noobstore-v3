// import { Meta } from "../layout/Meta";
// import { AppConfig } from "../utils/AppConfig";
import { Box, CircularProgress, Container } from "@material-ui/core";
import { useEffect } from "react";
import { Footer } from "./Footer";
import Header from "./Header";
import LandingPage from "./LandingPage";

const Base = ({ children, isLoading = false }: { children?: JSX.Element, isLoading?: boolean }) => {
	useEffect(() => {
		if (isLoading) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isLoading]);
	
	return (
		<div className="text-gray-600 antialiased bg-gray-100">
			{
				isLoading ? (
					<Box position="fixed" width="100%" height="100%" bgcolor="rgba(255,255,255, 0.8)" zIndex={1000}>
						<CircularProgress size={84} style={{position: "absolute", top: '50%', left: '50%'}} classes={{
							circle: 'text-red-500'
						}} />
					</Box>
				) : null
			}
			<Header />
			{children && Object.keys(children.props).length > 0 ? (
				<Container 
					maxWidth="xl"
					className="mx-auto bg-gray-100 relative"
					style={{ minHeight: "calc(100vh - 128px - 365px)" }}
				>
					{children}
				</Container>
			) : (
				<div className="min-h-screen container mx-auto mb-8">
					<LandingPage />
				</div>
			)}
			<Footer />
		</div>
	);
}

export { Base };
