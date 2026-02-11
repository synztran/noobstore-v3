import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Label as LabelPrimitive } from "radix-ui";
import * as React from "react";

const labelVariants = cva(
	"text-sm leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
	{
		variants: {
			variant: {
				primary: "font-medium",
				secondary: "font-normal",
			},
		},
		defaultVariants: {
			variant: "primary",
		},
	},
);

type TLabeProps = React.ComponentProps<typeof LabelPrimitive.Root> &
	VariantProps<typeof labelVariants> & {
		required?: boolean;
	};

function Label({ className, variant, required, ...props }: TLabeProps) {
	return (
		<>
			<LabelPrimitive.Root
				data-slot="label"
				className={cn(labelVariants({ variant }), className)}
				{...props}
			/>
			{required && <span className="text-red-500 ml-0.5">*</span>}
		</>
	);
}

export { Label };
