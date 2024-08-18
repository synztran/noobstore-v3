// import { ImageFallbackBanner } from "@/utils/ImageFallback";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import styles from "./styles.module.css";

const sliderSetting = {
	dots: true,
	infinite: true,
	arrow: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1,
	nextArrow: <SampleNextArrow />,
	prevArrow: <SamplePrevArrow />,

	// className: "center",
	// slidesToShow: 3,
	// centerMode: true,
	// centerPadding: "60px",
};

const tempData = [
	{ imageUrl: "/uploads/kbdfansd45v2.jpeg" },
	// { imageUrl: "/uploads/singaunikorn.jpeg" },
	// { imageUrl: "/uploads/canonkeysbalance.png" },
];

interface Props {
	data?: unknown;
}

const SliderBanner = ({ data }: Props) => {
	return (
		<div className="container relative mb-8 max-w-full">
			<Slider className={styles.sliderBanner} {...sliderSetting}>
				{tempData?.map((child) => (
					<div className="w-full relative h-50vh">
						{/* <ImageFallbackBanner
							src={child.imageUrl}
							layout="fill"
							objectFit="cover"
							// height={20}
							alt="image banner"
						/> */}
						<Image
							src={child.imageUrl}
							layout="fill"
							objectFit="cover"
							// height={20}
							alt="image banner"
						/>
					</div>
				))}
			</Slider>
		</div>
	);
};

export default SliderBanner;

function SamplePrevArrow(props: any) {
	const { className, styles, onClick } = props;

	return (
		<div className={className} style={styles} onClick={onClick}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-6 h-6">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M15.75 19.5L8.25 12l7.5-7.5"
				/>
			</svg>
		</div>
	);
}

function SampleNextArrow(props: any) {
	const { className, style, onClick } = props;
	return (
		<div className={className} style={{ ...style }} onClick={onClick}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-6 h-6">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M8.25 4.5l7.5 7.5-7.5 7.5"
				/>
			</svg>
		</div>
	);
}
