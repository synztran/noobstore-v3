import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

interface Props {
	imageList: { src: string; alt: string; id: number }[];
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
		arrows: false,
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
		<div className="flex gap-4 bg-white rounded-lg shadow-md p-4">
			<div className="flex flex-col gap-2 w-1/6 relative place-items-center items-start">
				<div
					className={`w-7 h-7 absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer border border-gray-300 rounded-full transition-colors bg-white flex items-center justify-center z-1 ${
						isNavigating
							? "opacity-50 cursor-not-allowed"
							: "hover:bg-gray-400"
					}`}
					onClick={isNavigating ? undefined : goToPrev}>
					<ChevronUp className="w-4 h-4" />
				</div>
				<div className="my-2 w-full flex flex-col gap-2">
					{imageList?.map((child) => (
						<div
							key={child.id}
							className={`overflow-hidden rounded-lg cursor-pointer justify-center flex align-middle bg-gray-200 w-full h-[85px] relative ${
								currentImageIdx === child.id
									? "border-2 border-black"
									: ""
							} ${isNavigating ? "pointer-events-none" : ""}`}>
							<Image
								onClick={() =>
									!isNavigating && goToSlide(child.id)
								}
								src={child?.src}
								alt={child?.alt}
								className="object-cover select-none rounded-lg"
								fill
							/>
						</div>
					))}
				</div>
				<div
					className={`w-7 h-7 absolute bottom-2 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-pointer border border-gray-300 rounded-full transition-colors bg-white flex items-center justify-center z-1 ${
						isNavigating
							? "opacity-50 cursor-not-allowed"
							: "hover:bg-gray-400"
					}`}
					onClick={isNavigating ? undefined : goToNext}>
					<ChevronDown className="w-4 h-4" />
				</div>
			</div>
			<div className="w-5/6 relative">
				{/* @ts-ignore: Unreachable code error */}
				<Slider
					{...settingMainSlide}
					className="h-full flex items-center"
					asNavFor={navSub}
					ref={(slider) => (slider ? (slider1 = slider) : slider1)}>
					{imageList?.map((child) => (
						<div
							className="overflow-hidden rounded-lg max-h-max border boder-gray-200"
							key={child.id}>
							<Image
								src={child?.src}
								alt={child?.alt}
								width={1200}
								height={800}
								className="w-full object-contain object-center"
							/>
						</div>
					))}
				</Slider>
				<div className="absolute max-w-max px-3 py-1 bg-gray-400 bottom-4 right-2 text-gray-800 rounded-md text-[16px] leading-tight font-bold">
					{currentImageIdx}/{imageList?.length}
				</div>
			</div>
		</div>
	);
};

export default SliderSyncing;
