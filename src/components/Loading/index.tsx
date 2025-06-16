import { CircularProgress } from "@material-ui/core";

const LoadingComponent = () => {
	return (
		<div className="h-[80vh - 130px - 320px] relative w-full">
			<CircularProgress className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		</div>
	);
};

export default LoadingComponent;
