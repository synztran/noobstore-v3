import { useState, useEffect, useRef, RefObject } from "react";
import { LuckyWheel, WheelRenderer } from "./constructor";
import { IReward } from "./interface";
import { classNames } from "@/utils/AppConfig";

interface IProps {
	rewards: IReward[];
	turns: number;
}

export default function DynamicLuckyWheel(props: IProps) {
	const { rewards, turns } = props;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [wheel, setWheel] = useState<LuckyWheel | null>(null);
	const [rendered, setRenderer] = useState<WheelRenderer | null>(null);
	const [result, setResult] = useState<IReward | null>(null);
	const [rotate, setRotate] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);

	useEffect(() => {
		if (canvasRef.current && rewards.length > 0) {
			const newWheel = new LuckyWheel(rewards, turns);
			const newRenderer = new WheelRenderer(canvasRef.current, rewards);
			setWheel(newWheel);
			setRenderer(newRenderer);

			const update = () => {
				newRenderer.renderWheel();
				requestAnimationFrame(update);
			};
			update();
		}
	}, [rewards]);

	const handleSpin = async () => {
		if (wheel && !result) {
			try {
				const prize = await wheel.spin();
				setResult(prize?.reward || null);
				setRotate(prize?.rotation || 0);
				setDuration(prize?.duration || 0);
			} catch (error) {
				console.error(error);
			}
		}
	};

	const handleReset = () => {
		if (wheel) {
			wheel.reset();
		}
	};

	return (
		<div id="spinnerWrapper" className="">
			<div
				className={`relative bg-no-repeat bg-cover py-[24px] px-[48px] h-[580px] justify-between rounded-[12px] bg-[url('/assets/images/lucky-wheel/background.png')] grid grid-cols-12`}>
				<div className="grid col-span-3 items-center flex-col h-full p-[0 0 32px] flex-2 relative">
					<div className="bg-contain bg-no-repeat w-full h-[162px] bg-center" />
				</div>
				<div className="grid col-span-5">
					<div className="relative w-[400px] rounded-[12px] my-0 mx-auto flex flex-col items-center">
						<div className="text-center relative flex justify-center w-full h-full">
							<div className="w-[60px] h-[60px] bg-contain bg-no-repeat bg-center absolute bg-[url('/assets/images/lucky-wheel/wheel-center.svg')] z-1 drop-shadow-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
							<div className="w-full h-full bg-contain bg-no-repeat bg-center absolute bg-[url('/assets/images/lucky-wheel/wheel-background.svg')] z-0 scale-[0.96]" />
							<div className="w-[40px] h-[25%] bg-contain bg-no-repeat bg-center absolute bg-[url('/assets/images/lucky-wheel/selector.svg')] z-4" />
							<canvas
								ref={canvasRef}
								className=""
								width="800"
								height="800"
								style={{
									WebkitTransform: `rotate(${rotate - 90}deg)`,
									WebkitTransition: `-webkit-transform ${duration}s ease-out`,
									zIndex: 0,
									width: "100%",
								}}
							/>
						</div>
						<ButtonSpin
							handleSpin={handleSpin}
							handleReset={handleReset}
							isSpinning={wheel?.getIsSpinning() || false}
							turns={turns}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

interface IButtonSpin {
	handleSpin: () => void;
	handleReset: () => void;
	isSpinning: boolean;
	turns: number;
	ref?: RefObject<HTMLDivElement>;
	btnHeadRef?: RefObject<HTMLDivElement>;
	btnBottomRef?: RefObject<HTMLDivElement>;
}

function ButtonSpin({
	handleSpin,
	handleReset,
	isSpinning,
	turns,
	ref,
	btnHeadRef,
	btnBottomRef,
}: IButtonSpin) {
	return (
		<div
			ref={ref}
			className={classNames(
				"w-[200px] h-[135px] relative cursor-pointer flex justify-center my-0 mx-auto z-10",
				isSpinning ? "pointer-events-none" : "",
			)}
			onClick={isSpinning ? handleReset : handleSpin}>
			<div
				ref={btnHeadRef}
				className="w-[200px] h-[70px] absolute bg-no-repeat bg-center bg-[url('/wheel/top_button_spin.svg')] top-0 z-1 transition-all duration-500">
				<span className="justify-center items-center flex w-full text-white text-2xl uppercase user-select-none text-shadow-[1px_3px_#00000066]">
					{turns === 0 ? "Hết lượt" : "Quay"}
				</span>
			</div>
			<div
				ref={btnBottomRef}
				className="w-[200px] h-[65px] absolute bg-no-repeat bg-center bg-[url('/wheel/bottom_button_spin.svg')] bottom-3.5 z-2">
				<span className="justify-center items-flex-end flex w-full text-white text-sm uppercase user-select-none text-shadow-[1px_3px_#00000066] absolute bottom-0">
					{!turns ? "Còn 0 lượt" : `Còn ${turns || 0} lượt`}
				</span>
			</div>
		</div>
	);
}
