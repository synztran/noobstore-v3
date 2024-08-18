import LogoStore from "@/public/assets/icons/logo.png";
import NextImage from "next/image";
import { AppConfig } from "../utils/AppConfig";

type ILogoProps = {
	xl?: boolean;
};

const Logo = (props: ILogoProps) => {
	const size = props.xl ? "44" : "32";
	const fontStyle = props.xl
		? "font-semibold text-3xl"
		: "font-semibold text-xl";

	return (
		<span
			className={`inline-flex items-center text-gray-900 ${fontStyle} gap-2`}>
			<NextImage
				src={LogoStore}
				width={120}
				height={60}
				objectFit="contain"
				alt="logo store"
				className="hover:rotate-12 transition-all duration-300 shadow-xl"
			/>
			{AppConfig.site_name}
		</span>
	);
};

export { Logo };
