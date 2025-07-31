import { STAR_MEDAL_ICON } from "@/constants/Images";
import { classNames } from "@/utils/AppConfig";
import { Box } from "@material-ui/core";
import { Star } from "lucide-react";

interface Props {
	star: number;
	reviewer?: number;
	disabled?: boolean;
	readonly?: boolean;
	isVertical?: boolean;
}

const RatingComponent = ({
	star = 0,
	reviewer = 0,
	disabled = false,
	readonly = false,
	isVertical = false,
}: Props) => {
	if (isVertical) {
		return (
			<div className="flex flex-col items-center">
				<div className="flex items-center gap-1">
					<img src={STAR_MEDAL_ICON} alt="star" className="w-6 h-6" />
					<span className="text-lg font-bold">{star}</span>
				</div>
				<span className="text-base">Đánh giá</span>
			</div>
		);
	}

	return (
		<Box className="flex align-middle gap-2">
			<div className="flex items-center">
				{[...Array(5)].map((_, i) => {
					const full = i + 1 <= Math.floor(star);
					const half = !full && i < star && star % 1 >= 0.5;
					return (
						<span key={i} className="relative w-4 h-4 inline-block">
							<Star
								className={classNames(
									"w-4 h-4",
									full
										? "fill-yellow-400"
										: half
										? "fill-yellow-400"
										: "fill-gray-300"
								)}
								style={
									half
										? {
												clipPath:
													"polygon(0 0, 50% 0, 50% 100%, 0 100%)",
										  }
										: undefined
								}
							/>
							{half && (
								<Star
									className="w-4 h-4 fill-gray-300 absolute top-0 left-0"
									style={{
										clipPath:
											"polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
									}}
								/>
							)}
						</span>
					);
				})}
			</div>
			<div
				style={{ lineHeight: "18px", paddingTop: 2 }}
				className="text-sm">
				{reviewer} đánh giá
			</div>
		</Box>
	);
};

export default RatingComponent;
