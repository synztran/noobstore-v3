import React from "react";
import { motion, Variants } from "motion/react";

interface StepConnectorProps {
  isComplete: boolean;
}

const lineVariants: Variants = {
  incomplete: { width: 0, backgroundColor: "transparent" },
  complete: { width: "100%", backgroundColor: "var(--primary-color)" },
};

export default function StepConnector({ isComplete }: StepConnectorProps) {
  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-neutral-600">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}
