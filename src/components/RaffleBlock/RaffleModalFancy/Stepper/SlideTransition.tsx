import { motion, Variants } from "motion/react";
import { ReactNode, useLayoutEffect, useRef } from "react";

interface SlideTransitionProps {
	children: ReactNode;
	direction: number;
	onHeightReady: (height: number) => void;
}

const stepVariants: Variants = {
	enter: (dir: number) => ({ x: dir >= 0 ? "-100%" : "100%", opacity: 0 }),
	center: { x: "0%", opacity: 1 },
	exit: (dir: number) => ({ x: dir >= 0 ? "50%" : "-50%", opacity: 0 }),
};

export default function SlideTransition({
	children,
	direction,
	onHeightReady,
}: SlideTransitionProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		if (containerRef.current) {
			onHeightReady(containerRef.current.offsetHeight);
		}
	}, [children, onHeightReady]);

	return (
		<motion.div
			ref={containerRef}
			custom={direction}
			variants={stepVariants}
			initial="enter"
			animate="center"
			exit="exit"
			transition={{ duration: 0.4 }}
			style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
			{children}
		</motion.div>
	);
}
