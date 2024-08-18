import Image from "next/image";
import Slider from "react-slick";

interface Props {
	bannerImages: {
		url: string;
	}[];
}

const initialSetting = {
	autoplay: false,
};

const Banner = ({ bannerImages }: Props) => {
	if (bannerImages?.length === 0) {
		return <></>;
	}

	return (
		<div className="w-full relative max-h-8">
			{bannerImages.map((banner) => (
				<Slider {...initialSetting}>
					<Image
						src={banner.url}
						alt="banner"
						objectFit="contain"
						layout="fill"
					/>
					{/* <CategoryCard category={items}  /> */}
				</Slider>
			))}
		</div>
	);
};

export default Banner;
