import { EnumRaffleType } from "@/interface/Client/Raffle";
import React from "react";

interface RaffleBadgeProps {
	type: EnumRaffleType;
	className?: string;
}

// CSS-in-JS for animation and shining effect
const style = `
@keyframes shine-slide {
  0% {
    left: -60%;
  }
  100% {
    left: 120%;
  }
}
.raffle-badge-animated {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #FFD700 0%, #FFF7AE 50%, #FFC700 100%);
  color: #7c5a00;
  border-color: #FFD700;
  box-shadow: 0 2px 8px 0 rgba(255, 215, 0, 0.15);
}
.raffle-badge-animated .shine {
  content: "";
  position: absolute;
  top: 0;
  left: -60%;
  height: 100%;
  width: 60%;
  background: linear-gradient(
    120deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.6) 50%,
    rgba(255,255,255,0) 100%
  );
  pointer-events: none;
  animation: shine-slide 1.8s cubic-bezier(0.4,0,0.2,1) infinite;
  z-index: 2;
  filter: blur(1px);
}
`;

const badgeConfig: Record<
	EnumRaffleType,
	{
		label: string;
		bg: string;
		text: string;
		border: string;
		icon: React.ReactNode;
	}
> = {
	[EnumRaffleType.RAFFLE]: {
		label: "Raffle",
		bg: "bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-50",
		text: "text-yellow-900",
		border: "border-yellow-400",
		icon: (
			<svg
				className="w-5 h-5 mr-1"
				viewBox="0 0 24 24"
				fill="url(#gold-gradient)"
				stroke="url(#gold-gradient)"
				strokeWidth={1.5}
				xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient
						id="gold-gradient"
						x1="0"
						y1="0"
						x2="1"
						y2="1">
						<stop offset="0%" stopColor="#FFD700" />
						<stop offset="50%" stopColor="#FFF7AE" />
						<stop offset="100%" stopColor="#FFC700" />
					</linearGradient>
				</defs>
				<circle
					cx="12"
					cy="12"
					r="10"
					fill="url(#gold-gradient)"
					stroke="#E6B800"
					strokeWidth="2"
				/>
				<path
					d="M12 6l2.09 4.26L18 11.27l-3.18 3.09L15.18 18 12 15.77 8.82 18l.36-3.64L6 11.27l3.91-.01L12 6z"
					fill="#FFF7AE"
					stroke="#FFD700"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	[EnumRaffleType.SALE]: {
		label: "Sale",
		bg: "bg-green-100",
		text: "text-green-700",
		border: "border-green-300",
		icon: (
			<svg
				className="w-4 h-4 mr-1 text-green-500"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				viewBox="0 0 24 24">
				<path
					d="M19 5L5 19"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<circle cx="7.5" cy="16.5" r="1.5" fill="currentColor" />
				<circle cx="16.5" cy="7.5" r="1.5" fill="currentColor" />
			</svg>
		),
	},
};

const RaffleBadge: React.FC<RaffleBadgeProps> = ({ type, className = "" }) => {
	const config = badgeConfig[type];
	return (
		<>
			{type === EnumRaffleType.RAFFLE && (
				<style dangerouslySetInnerHTML={{ __html: style }} />
			)}
			<span
				className={`inline-flex items-center px-2 py-0.5 rounded-sm border text-xl font-semibold shadow-sm ${config?.bg} ${config?.text} ${config?.border} ${className} ${
					type === EnumRaffleType.RAFFLE
						? "raffle-badge-animated"
						: ""
				}`}
				style={
					type === EnumRaffleType.RAFFLE
						? undefined // All styles handled by CSS class
						: undefined
				}>
				{type === EnumRaffleType.RAFFLE && <span className="shine" />}
				{type === EnumRaffleType.RAFFLE && config?.icon}
				{config?.label}
			</span>
		</>
	);
};

export default RaffleBadge;
