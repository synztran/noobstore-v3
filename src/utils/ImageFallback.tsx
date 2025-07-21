/* eslint-disable no-param-reassign */
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import NextImage from "next/legacy/image";
import { useState } from "react";

type TImageFallback = {
	src: string;
	fallbackSrc: string;
	loading?: "eager" | "lazy";
	isUseLoader?: boolean;
	isUseLoaderCache?: boolean;
	isUseLoaderCacheProxy?: boolean;
	isUseLoaderCdn?: boolean;
	q?: number;
	width?: number;
};

const ImageFallback = ({
	src,
	fallbackSrc,
	loading = "eager",
	isUseLoader = true,
	isUseLoaderCache = false,
	isUseLoaderCacheProxy = false,
	isUseLoaderCdn = false,
	q,
	width,
	...rest
}: TImageFallback): React.ReactElement => {
	const [hasError, setHasError] = useState(false);
	const [currentSrc, setCurrentSrc] = useState(src);

	// Reset error state if src changes
	if (currentSrc !== src) {
		setHasError(false);
		setCurrentSrc(src);
	}

	return (
		<NextImage
			{...rest}
			src={hasError ? fallbackSrc || NEW_MISSING_IMAGE : src}
			onError={() => setHasError(true)}
			loading={loading}
			style={{
				maxWidth: "100%",
				height: "auto",
			}}
		/>
	);
};

type IImageFallbackBanner = {
	src: string;
	width: number;
	q?: number;
};

const ImageFallbackBanner = ({
	src,
	width,
	q = 100,
	...rest
}: IImageFallbackBanner) =>
	ImageFallback({
		src,
		isUseLoaderCacheProxy: true,
		width,
		...rest,
		q,
		fallbackSrc: src,
	});

type IImageFallbackStatic = {
	src: string;
	q?: number;
};

const ImageFallbackStatic = ({ src, q = 100, ...rest }: IImageFallbackStatic) =>
	ImageFallback({
		src: src,
		fallbackSrc: src,
		isUseLoaderCacheProxy: true,
		...rest,
		q,
	});

const ImageFallbackStoreImage = ({
	src = NEW_MISSING_IMAGE,
	q = 100,
	...rest
}) =>
	ImageFallback({
		src: src || NEW_MISSING_IMAGE,
		fallbackSrc: NEW_MISSING_IMAGE,
		isUseLoaderCacheProxy: true,
		q,
		...rest,
	});

const ImageFallbackProductImage = ({
	src = NEW_MISSING_IMAGE,
	q = 100,
	quality = 100,
	loading = "lazy",
	size = null,
	fallbackSrc = NEW_MISSING_IMAGE,
	...rest
}) =>
	ImageFallback({
		src:
			(src && size
				? `${src}${src?.includes("?") ? "&" : "?"}size=${size}`
				: src || NEW_MISSING_IMAGE) || NEW_MISSING_IMAGE,
		isUseLoaderCacheProxy: true,
		q,
		loading: loading as "eager" | "lazy",
		...rest,
		fallbackSrc: src ?? (fallbackSrc || NEW_MISSING_IMAGE),
	});

export default ImageFallback;
export {
	ImageFallbackBanner,
	ImageFallbackProductImage,
	ImageFallbackStatic,
	ImageFallbackStoreImage,
};
