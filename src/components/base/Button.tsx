import React from "react";
import clsx from "clsx";
import styles from "@/css/module/button.module.css";
import {ButtonProps} from "@/types/ui/button";

// 햄버거 버튼 바
const HamburgerLines = ({ on }: { on: boolean }) => {
	return (
		<>
			<span
			  className={clsx(
			      "absolute w-5 bg-current transition-all duration-300 h-[2px]",
			      on ? "rotate-45 top-1/2" : "top-1/2 -translate-y-2"
			  )}
			  style={{ transformOrigin: "center" }}
			/>
			<span
				className={clsx(
					"absolute w-5 bg-current transition-all duration-300 h-[2px]",
					on ? "opacity-0" : "opacity-100",
					"top-1/2 -translate-y-1/2"
				)}
			/>
			<span
				className={clsx(
					"absolute w-5 bg-current transition-all duration-300 h-[2px]",
					on ? "-rotate-45 top-1/2" : "top-1/2 translate-y-2"
				)}
				style={{ transformOrigin: "center" }}
			/>
		</>
	);
};

const Button = ({
	widthPx = 42,
	heightPx = 42,
	fontSizePx = 10,
	theme = "normal",
	round = false,
	variant = "default",
	on = false,
	reverse = false,
	className,
	style,
	...rest
}: ButtonProps) => {
	const baseClass = clsx(
		styles["btn-base"],
		styles[`theme-${theme}`],
		round && styles["round"],
		on && styles["on"],
		reverse && styles["reverse"],
		"relative flex items-center justify-center",
		className
	);

	const baseStyle = {
		width: widthPx,
		height: heightPx,
		fontSize: fontSizePx,
		...style,
	};

	// 햄버거 버튼
	if (variant === "hamburger") {
		return (
			<button {...rest} className={baseClass} style={baseStyle} aria-pressed={on}>
				<HamburgerLines on={on} />
			</button>
		);
	}

	// 기본 버튼
	return <button {...rest} className={baseClass} style={baseStyle} aria-pressed={on} />;
};

Button.displayName = "Button";

export default Button;