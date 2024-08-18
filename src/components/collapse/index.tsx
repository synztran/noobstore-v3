import { classNames } from '@/utils/AppConfig';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import styles from './styles.module.css';

const CollapseText = ({
	title,
	content,
	bgc = "#fff",
}: {
	title: string;
	content: string | JSX.Element;
	bgc?: string;
	textColor?: string;
}) => {
	return (
		<section className="grid place-items-center mt-4">
			<label className="w-full group">
				<input
					className="peer absolute scale-0"
					type="checkbox"
				/>
				<span
					className={classNames(styles.shadow || '', "block max-h-12 max-w-full rounded-lg px-4 py-0 text-gray-400 transition-all delay-150 duration-300 ease-in-out overflow-hidden peer-checked:max-h-max")}
					style={{ backgroundColor: `${bgc}` }}>
					<h3 className="flex h-12 cursor-pointer items-center font-bold w-full justify-between">
						{title}
						<span className="transition-all duration-200 group-has-[:checked]:rotate-90 "><KeyboardArrowRightIcon/></span>
					</h3>
					<div className="mb-2 text-gray-700 text-sm" dangerouslySetInnerHTML={{__html: content}} />
				</span>
			</label>
		</section>
	);
};

export default CollapseText;
