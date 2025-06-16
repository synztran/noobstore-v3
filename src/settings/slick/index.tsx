import { SyncArrowLeft } from "@/icons/syncArrowLeft";
import { SyncArrowRight } from "@/icons/syncArrowRight";
import { classNames } from "@/utils/AppConfig";

export const SyncSlickArrowNext = (props: any) => {
	const { className, style, onClick } = props;
	return (
		<div
			className={classNames(
				className,
				"!absolute !bottom-2 !right-2 z-60 !w-[48px] !h-[48px] !transform-none",
				"before:hidden"
			)}
			style={{ ...style, top: "unset" }}
			onClick={onClick}>
			<SyncArrowRight />
		</div>
	);
};

export const SyncSlickArrowPrev = (props: any) => {
	const { className, style, onClick } = props;
	return (
		<div
			className={classNames(
				className,
				"absolute !bottom-2 !left-2 z-60 !w-[48px] !h-[48px] !transform-none",
				"before:hidden"
			)}
			style={{ ...style, top: "unset" }}
			onClick={onClick}>
			<SyncArrowLeft />
		</div>
	);
};
