import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
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
	const [currentImageIdx, setCurrentImageIdx] = useState(1);
	const [isNavigating, setIsNavigating] = useState(false);

	useEffect(() => {
		setNavMain(slider1);
		setNavSub(slider2);
		setCurrentImageIdx(1);
	}, []);

	let slider1: any = null;
	let slider2: any = null;

	const settingMainSlide = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		// nextArrow: <SyncSlickArrowNext />,
		// prevArrow: <SyncSlickArrowPrev />,
		beforeChange: (oldIndex: number, newIndex: number) => {
			setCurrentImageIdx(newIndex + 1);
		},
	};

	const goToSlide = useCallback(
		(index: number) => {
			if (navMain && !isNavigating) {
				setIsNavigating(true);
				navMain.slickGoTo(index - 1);
				setCurrentImageIdx(index);
				setTimeout(() => setIsNavigating(false), 500); // Debounce for 500ms
			}
		},
		[navMain, isNavigating]
	);

	const goToNext = useCallback(() => {
		if (navMain && !isNavigating) {
			setIsNavigating(true);
			const nextIndex =
				currentImageIdx === imageList.length ? 1 : currentImageIdx + 1;
			navMain.slickGoTo(nextIndex - 1);
			setCurrentImageIdx(nextIndex);
			setTimeout(() => setIsNavigating(false), 500); // Debounce for 500ms
		}
	}, [navMain, isNavigating, currentImageIdx, imageList.length]);

	const goToPrev = useCallback(() => {
		if (navMain && !isNavigating) {
			setIsNavigating(true);
			const prevIndex =
				currentImageIdx === 1 ? imageList.length : currentImageIdx - 1;
			navMain.slickGoTo(prevIndex - 1);
			setCurrentImageIdx(prevIndex);
			setTimeout(() => setIsNavigating(false), 500); // Debounce for 500ms
		}
	}, [navMain, isNavigating, currentImageIdx, imageList.length]);

	return (
		<div className="flex gap-4">
			<div className="grid grid-cols-1 gap-1 w-1/5 relative place-items-center">
				<div
					className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer border border-gray-500 rounded-full p-0.5 transition-colors bg-white ${
						isNavigating
							? "opacity-50 cursor-not-allowed"
							: "hover:bg-gray-400"
					}`}
					onClick={isNavigating ? undefined : goToPrev}>
					<ChevronUp className="w-4 h-4" />
				</div>
				{imageList?.map((child) => (
					<div
						key={child.id}
						className={`overflow-hidden rounded-lg my-auto cursor-pointer justify-center flex align-middle bg-gray-200 w-[80px] h-[80px] ${
							currentImageIdx === child.id
								? "border-2 border-black"
								: ""
						} ${isNavigating ? "pointer-events-none" : ""}`}>
						<Image
							onClick={() => !isNavigating && goToSlide(child.id)}
							src={child?.src}
							alt={child?.alt}
							className="object-cover select-none rounded-lg"
							width={80}
							height={80}
							style={{
								maxWidth: "100%",
								height: "auto",
							}}
						/>
					</div>
				))}
				<div
					className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-pointer border border-gray-500 rounded-full p-0.5 transition-colors bg-white ${
						isNavigating
							? "opacity-50 cursor-not-allowed"
							: "hover:bg-gray-400"
					}`}
					onClick={isNavigating ? undefined : goToNext}>
					<ChevronDown className="w-4 h-4" />
				</div>
			</div>
			<div className="w-4/5 relative">
				<Slider
					asNavFor={navSub}
					ref={(slider) => (slider1 = slider)}
					{...settingMainSlide}>
					{imageList?.map((child) => (
						<div
							className="overflow-hidden rounded-lg max-h-max"
							key={child.id}>
							<Image
								src={child?.src}
								alt={child?.alt}
								width={800}
								height={500}
								className="w-full object-contain object-center"
							/>
						</div>
					))}
				</Slider>
				<div className="absolute max-w-max px-2 py-0.5 bg-gray-400 bottom-3 right-2">
					{currentImageIdx}
				</div>
			</div>
			{/* <Grid container spacing={2} style={{ marginTop: "1rem" }}>
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
								height: "auto",
							}}
						/>
					</Grid>
				))}
			</Grid> */}
		</div>
	);
};

export default SliderSyncing;
