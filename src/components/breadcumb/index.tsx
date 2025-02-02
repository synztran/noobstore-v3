import { useRouter } from "next/router";

interface Props {
	mainRoot: string;
	subRoot?: string;
	sub2Root?: string;
}

const Breadcumb = ({ mainRoot, subRoot, sub2Root }: Props) => {
	console.log("mainRoot", mainRoot, subRoot);
	const router = useRouter();

	return (
		<div className="container flex justify-start items-center h-12 max-w-full border-b border-gray-400">
			<nav className="text-sm sm:text-base py-4 md:py-4 lg:py-4 rounded-md">
				<ol className="list-none p-0 inline-flex space-x-2">
					<li
						className="flex items-center"
						onClick={() => router.push("/")}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="1em"
							viewBox="0 0 576 512"
							className="cursor-pointer hover:fill-blue-500 transition-colors duration-300"
							fill="#4b5563">
							<path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
						</svg>{" "}
						<span className="mx-2">/</span>
					</li>
					{mainRoot ? (
						<li className="flex items-center">
							<a
								href="#"
								className="text-gray-600 hover:text-blue-500 transition-colors duration-300">
								{mainRoot}
							</a>
							{subRoot ? <span className="mx-2">/</span> : null}
						</li>
					) : null}
					{subRoot ? (
						<li className="flex items-center">
							<span className="text-gray-800">{subRoot}</span>
							{sub2Root ? <span className="mx-2">/</span> : null}
						</li>
					) : null}
					{sub2Root ? (
						<li className="flex items-center">
							<span className="text-gray-800">{sub2Root}</span>
						</li>
					) : null}
				</ol>
			</nav>
		</div>
	);
};

export default Breadcumb;
