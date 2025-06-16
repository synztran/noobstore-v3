import NextImage from "next/image";
import { AppConfig } from "../utils/AppConfig";
import { LOGO_STORE } from "@/constants/Images";

type ILogoProps = {
	xl?: boolean;
	isIcon?: boolean;
};

const Logo = ({ xl, isIcon = false }: ILogoProps) => {
	const size = xl ? "44" : "32";
	const fontStyle = xl ? "font-semibold text-3xl" : "font-semibold text-xl";

	return (
		<span
			className={`inline-flex items-center text-gray-900 ${fontStyle} gap-2`}>
			<NextImage
				src={LOGO_STORE}
				width={120}
				height={60}
				alt="logo store"
				className="hover:rotate-6 transition-all duration-300 shadow-xl object-contain"
				style={{
					maxWidth: "100%",
					height: "auto",
				}}
			/>
			{isIcon && <span>{AppConfig.site_name}</span>}
		</span>
	);
};

export { Logo };
