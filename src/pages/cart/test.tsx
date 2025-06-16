import { useEffect, useState } from "react";

const example = () => {
	const [state] = useState({
		isActive: true,
	});

	state.isActive = false;
	function temp() {}

	useEffect(() => {
		(async () => {
			const resp = await fetch("https://api.example.com/data");
			const data = await resp.json();
		})();

		function temp() {}

		window.addEventListener("action", temp);

		return () => {
			window.removeEventListener("action", temp);
		};
	}, [state.isActive]);

	return <div />;
};
