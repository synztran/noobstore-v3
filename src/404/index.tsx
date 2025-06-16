import { useEffect } from "react";
import styles from "./styles.module.css";

export default function NotFoundPage() {
	const buttonText = "Quay lại";
	const content = "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa";
	useEffect(() => {
		let mouseY = 0,
			mouseX = 0;
		let pageX = document.body.getBoundingClientRect().width;
		let pageY = document.body.getBoundingClientRect().height;
		const updateDimensions = () => {
			pageX = document.body.getBoundingClientRect().width;
			pageY = document.body.getBoundingClientRect().height;
		};

		const initEyesPosition = () => {
			const targetEye = document.getElementById("ghostEyes");
			if (targetEye) {
				const xAxis = -50; // Center horizontally
				const yAxis = 0; // Center vertically
				targetEye.style.transform = `translate(${xAxis}%, -${yAxis}%)`;
			}
		};

		initEyesPosition();

		const haddleMouseMove = (e: MouseEvent) => {
			mouseY = e.pageY;
			let yAxis = ((pageY / 2 - mouseY) / pageY) * 100;
			mouseX = e.pageX / -pageX;
			let xAxis = -mouseX * 100 - 100;

			const targetEye = document.getElementById("ghostEyes");
			if (targetEye) {
				targetEye.style.transform = `translate(${xAxis}%,-${yAxis}%)`;
			}
		};

		window.addEventListener("resize", updateDimensions);
		document.addEventListener("mousemove", haddleMouseMove);

		return () => {
			window.removeEventListener("resize", updateDimensions);
			document.removeEventListener("mousemove", haddleMouseMove);
		};
	}, []);

	return (
		<div
			className="w-350 h-full max-h-600 min-h-450 rounded-xl absolute top-1/2 left-1/2 -translate-x-half -translate-y-half"
			style={{ background: "#332F63" }}>
			<div className="pt-5 px-8 pb-8 absolute left-1/2 top-1/3 -translate-x-half -translate-y-1/3">
				<div className={styles.symbol}></div>
				<div className={styles.symbol}></div>
				<div className={styles.symbol}></div>
				<div className={styles.symbol}></div>
				<div className={styles.symbol}></div>
				<div className={styles.symbol}></div>

				<div className="bg-white w-100 h-100 rounded-t-100 relative mx-0 my-auto animate-upndown404_3s">
					<div
						className="absolute left-1/2 -translate-x-half -translate-y-48"
						style={{ height: 12, width: 70, top: "30%" }}
						id="ghostEyes">
						<div
							className="w-3 h-3 rounded-md mx-3 my-0 absolute left-0"
							style={{ background: "#332F63" }}
						/>
						<div
							className="w-3 h-3 rounded-md mx-3 my-0 absolute right-0"
							style={{ background: "#332F63" }}
						/>
					</div>
					<div className="flex absolute top-full left-0 right-0">
						<div
							className="grow relative rounded-full bg-white"
							style={{ height: 20, top: -10 }}></div>
						<div
							className="grow relative  rounded-full bg-white -top-7 mx-0 -my-0 "
							style={{
								backgroundColor: "#332F63",
								height: 20,
								top: -12,
							}}></div>
						<div
							className="grow relative  rounded-full bg-white"
							style={{ height: 20, top: -10 }}></div>
						<div
							className="grow relative  rounded-full bg-white -top-7 mx-0 -my-0 "
							style={{
								backgroundColor: "#332F63",
								height: 20,
								top: -12,
							}}></div>
						<div
							className="grow relative  rounded-full bg-white"
							style={{ height: 20, top: -10 }}></div>
					</div>
				</div>
				<div
					className="shadow rounded-half mx-0 my-auto animate-smallnbig404_3s "
					style={{ height: 20 }}
				/>
			</div>

			<div className="absolute bottom-20 left-1/2 -translate-x-half">
				<div className="text-white text-center w-250 text-lg mx-0 my-auto">
					<div
						className="text-2xl text-white font-bold"
						style={{ letterSpacing: "0.5px" }}>
						Whoops!
					</div>
					<div
						className="mt-5 text-lg"
						style={{ letterSpacing: ".5px", color: "#8C8AA7" }}>
						{content}
					</div>
				</div>

				<a href="/" className={styles.box_button}>
					{buttonText}
				</a>
			</div>
		</div>
	);
}
