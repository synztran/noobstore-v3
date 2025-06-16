import { SyncSlickArrowNext, SyncSlickArrowPrev } from "@/settings/slick";
import { Grid } from "@material-ui/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

interface Props {
	imageList: {
		src: string;
		alt: string;
		id: number;
	}[];
}

const SliderSyncing = ({ imageList }: Props) => {
	const [navMain, setNavMain] = useState<Slider | undefined>();
	const [navSub, setNavSub] = useState<Slider | undefined>();

	useEffect(() => {
		setNavMain(slider1);
		setNavSub(slider2);
	}, []);

	let slider1: any = null;
	let slider2: any = null;

	const settingMainSlide = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		// arrows: false,
		nextArrow: <SyncSlickArrowNext />,
		prevArrow: <SyncSlickArrowPrev />,
	};

	const goToSlide = (index: number) => {
		if (navMain) {
			navMain.slickGoTo(index - 1);
		}
	};

	return (
        <div>
            {/* @ts-ignore */}
            <Slider
				asNavFor={navSub}
				//@ts-ignore
				ref={(slider) => (slider1 = slider)}
				{...settingMainSlide}>
				{imageList?.map((child) => (
					<div
						className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg max-h-max"
						key={child.id}>
						<Image
                            src={child?.src}
                            alt={child?.alt}
                            width={1200}
                            height={400}
                            className="w-full object-cover object-center"
                            style={{
                                maxWidth: "100%",
                                height: "auto"
                            }} />
					</div>
				))}
			</Slider>
            <Grid container spacing={2} style={{ marginTop: "1rem" }}>
				{imageList?.map((child) => (
					<Grid
						item
						md={3}
						className="aspect-h-4 aspect-w-4 overflow-hidden rounded-lg my-auto cursor-pointer justify-center flex align-middle">
						<Image
                            onClick={() => goToSlide(child.id)}
                            src={child?.src}
                            alt={child?.alt}
                            className="object-cover select-none"
                            width={120}
                            height={120}
                            style={{
                                maxWidth: "100%",
                                height: "auto"
                            }} />
					</Grid>
				))}
			</Grid>
        </div>
    );
};

export default SliderSyncing;
