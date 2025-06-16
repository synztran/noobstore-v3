import NotFoundPage from "@/404";
import { Box } from "@material-ui/core";

function Error({ statusCode }: { statusCode: number }) {
	return (
		<Box
			className="relative"
			style={{ width: "100vw", height: "100vh", background: "#28254C" }}>
			<NotFoundPage />
		</Box>
	);
}

Error.getInitialProps = ({ res, err }: { res: any; err: any }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode };
};

export default Error;
