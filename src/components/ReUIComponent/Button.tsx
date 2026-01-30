import { cn } from "@/lib/utils";
import { CircularProgress } from "@mui/material";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const buttonVariants = cva(
	"text-base inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default:
					"bg-background hover:bg-accent font-semibold disabed:cursor-not-allowed",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				primary:
					"bg-red-400 text-primary-foreground hover:bg-red-500 font-semibold",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
			fontSize: {
				xs: "text-xs",
				sm: "text-sm",
				md: "text-base",
				lg: "text-lg",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			fontSize,
			asChild = false,
			isLoading = false,
			children,
			disabled,
			...props
		},
		ref,
	) => {
		return (
			<button
				className={cn(
					buttonVariants({ variant, size, fontSize, className }),
				)}
				ref={ref}
				disabled={disabled || isLoading}
				{...props}>
				{isLoading && <CircularProgress size={16} className="mr-2" />}
				{children}
			</button>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
