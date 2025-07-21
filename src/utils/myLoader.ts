// // Type definitions for loader params
// export interface LoaderParams {
// 	src: string;
// 	width: number;
// 	quality?: number;
// }

// // import { DOMAIN_IMAGE_CACHE_LOADER } from "systemconfig";
// // import { changeDomainProxyToCDN } from "./CacheImageUtils";

// const myLoader = ({ src, width, quality }: LoaderParams): string =>
// 	`${src}${src.indexOf("?") >= 0 ? "&" : "?"}w=${width}&q=${quality ?? 100}`;

// export const myLoaderCache = ({ src, width, quality }: LoaderParams): string =>
// 	`${DOMAIN_IMAGE_CACHE_LOADER}/_next/legacy/image?url=${encodeURIComponent(
// 		src
// 	)}&w=${width}&q=${quality ?? 75}`;

// export const myLoaderCacheProxy = ({
// 	src,
// 	width,
// 	quality = 100,
// }: LoaderParams): string =>
// 	src?.startsWith(DOMAIN_IMAGE_CACHE_LOADER)
// 		? src
// 		: `${DOMAIN_IMAGE_CACHE_LOADER}/img/${src
// 				.replace(/^https?:\/\//, "")}${
// 				src.indexOf("?") >= 0 ? "&" : "?"
// 		  }${
// 				width && src?.indexOf(".svg") === -1 ? `w=${width}` : ""
// 		  }${quality ? `&q=${quality}` : ""}`;

// export const myLoaderCacheInstant = myLoaderCache;

// export const myLoaderCacheCDN = ({
// 	src,
// 	width,
// 	quality,
// }: LoaderParams): string =>
// 	`${changeDomainProxyToCDN(src)}${
// 		src.indexOf("?") >= 0 ? "&" : "?"
// 	}w=${width}&q=${quality ?? 100}`;

// export default myLoader;
