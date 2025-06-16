import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const ReactQuill = dynamic(() => import("react-quill"), {
	ssr: false, // Disable server-side rendering for this component
});

interface IProps {
	label?: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	onBlur?: () => void;
	errorMessage?: string;
	note?: string;
	maxContent?: number;
	id?: string;
}

const TextEditor: React.FC<IProps> = (props) => {
	const {
		value,
		onChange,
		placeholder = "",
		label = "",
		className,
		onBlur,
		note = "",
		maxContent = 0,
		id = "",
	} = props;

	const [charCount, setCharCount] = useState(value.length);

	return (
		<div className={`${className}`}>
			<div className="flex justify-between items-center">
				{label ? (
					<label className="text-gray-500">{label}</label>
				) : null}

				{maxContent > 0 ? (
					<p className="text-gray-500 ml-auto">
						{charCount}/{maxContent}
					</p>
				) : null}
			</div>
			<ReactQuill
				id={id}
				value={value}
				onChange={(value, _, __, editor) => {
					onChange(value);
					setCharCount(editor.getLength() - 1);
				}}
				placeholder={placeholder}
				theme="snow" // Use the "snow" theme for a clean toolbar
				modules={{
					toolbar: [
						[{ header: [false, 1, 2, 3, 4, 5, 6] }],
						[{ font: [] }],
						[{ color: [] }],
						[{ background: [] }],
						["bold", "italic", "underline"],
						["link", "image"],
						[{ list: "ordered" }, { list: "bullet" }],
					],
				}}
				onBlur={onBlur ? onBlur : () => {}}
			/>
			<div className="flex justify-between items-center mt-2">
				{note ? <p className="italic text-gray-500">*{note}</p> : null}
			</div>
			{props.errorMessage && (
				<p className="text-red-500 text-sm mt-[3px] ml-[14px]">
					{props.errorMessage}
				</p>
			)}
		</div>
	);
};

export default TextEditor;
