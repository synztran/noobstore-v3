import { classNames } from "@/utils/AppConfig";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styles from "./styles.module.css";

const CollapseText = ({
	title,
	content,
	bgc = "#fff",
	id,
}: {
	title: string;
	content: string | JSX.Element;
	bgc?: string;
	textColor?: string;
	id?: string;
}) => {
	return (
		<section className="grid place-items-center mt-4">
			<label htmlFor={id} className="w-full peer">
				<input
					id={id}
					className="peer/checkbox absolute scale-0 group"
					type="checkbox"
					name="collapse"
				/>
				<div className="transition-transform duration-200 peer-[:has(/checkbox:checked)]:rotate-90">
					<KeyboardArrowRightIcon />
				</div>
				<div
					className={classNames(
						styles.shadow || "",
						"block max-h-12 max-w-full rounded-lg px-4 py-0 text-gray-600 transition-all delay-150 duration-300 ease-in-out overflow-hidden peer-checked/collapse:max-h-max"
					)}
					style={{ backgroundColor: `${bgc}` }}>
					<h3 className="flex h-12 cursor-pointer items-center font-bold w-full justify-between">
						{title}
						<div className="transition-transform duration-200 peer-checked/collapse:rotate-90">
							<KeyboardArrowRightIcon />
						</div>
					</h3>
					<div
						className="mb-2 text-gray-700 text-sm"
						dangerouslySetInnerHTML={{ __html: content as string }}
					/>
				</div>
			</label>
		</section>
	);
};

export default CollapseText;
