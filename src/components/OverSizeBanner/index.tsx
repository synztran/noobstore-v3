import { SERVICE_BACKGROUND } from "@/constants/Images";
import { classNames } from "@/utils/AppConfig";
import Image from "next/image";

interface IProps {
	banner?: string;
	classes?: string;
}

const OverSizeBanner = (props: IProps) => {
	const { banner, classes } = props;
	return (
        <div
			className={classNames(
				"w-full h-[350px] bg-gray-300 rounded-lg relative overflow-hidden",
				classes as string
			)}>
            <Image
                src={banner ?? SERVICE_BACKGROUND}
                alt="banner over size"
                fill
                sizes="100vw"
                style={{
                    objectFit: "cover"
                }} />
        </div>
    );
};

export default OverSizeBanner;
