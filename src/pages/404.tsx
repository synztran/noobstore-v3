import { Button, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Base } from "templates/Base";

const Custom404 = () => {
	const router = useRouter();

	useEffect(() => {
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	return (
		<Base>
			<div className="flex flex-col items-center justify-center h-screen">
				<Typography
					variant="h1"
					className="text-6xl font-bold text-gray-800 mb-4">
					404
				</Typography>
				<Typography
					variant="h4"
					className="text-2xl text-gray-600 mb-8">
					Page Not Found
				</Typography>
				<Typography
					variant="body1"
					className="text-gray-500 mb-8 text-center max-w-md">
					The page you are looking for might have been removed, had
					its name changed, or is temporarily unavailable.
				</Typography>
				<Button
					variant="contained"
					color="primary"
					onClick={() => router.push("/")}
					className="bg-red-500 hover:bg-red-600">
					Go Back Home
				</Button>
			</div>
		</Base>
	);
};

export default Custom404;
