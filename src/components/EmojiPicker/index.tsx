import { forwardRef, useImperativeHandle, useState } from "react";

interface IProps {
	handleClick: (emojiData: { emoji: string }) => void;
	ref: React.RefObject<any>;
}

const EmojiPicker = forwardRef((props: IProps, ref) => {
	const [open, setOpen] = useState(false);
	console.log("open", open);

	useImperativeHandle(
		ref,
		() => ({
			open: () => {
				setOpen(true);
			},
			close: () => {
				setOpen(false);
			},
			status: () => {
				return open;
			},
		}),
		[ref]
	);

	return open ? (
		<div className="absolute bottom-40 left-40 z-10">
			<EmojiPicker {...props} />
		</div>
	) : null;
});

export default EmojiPicker;
