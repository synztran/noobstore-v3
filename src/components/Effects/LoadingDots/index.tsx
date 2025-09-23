import React from "react";

const LoadingDots: React.FC = () => {
	return (
		<div className="flex items-end gap-2 h-full">
			{[0, 1, 2].map((i) => (
				<span
					key={i}
					style={{
						animation: `loading-dot-bounce 1.5s infinite`,
						animationDelay: `${i * 0.2}s`,
						display: "inline-flex",
						scale: "2",
					}}>
					.
				</span>
			))}
			<style>
				{`
          @keyframes loading-dot-bounce {
            0%, 80%, 100% {
              transform: translateY(0);
              opacity: 1;
            }
            40% {
              transform: translateY(-4px);
              opacity: 0.7;
            }
          }
        `}
			</style>
		</div>
	);
};

export default LoadingDots;
