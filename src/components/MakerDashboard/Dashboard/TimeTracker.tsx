import React from "react";

const RaffleClock = () => {
	const curentDate = new Date();
	const formattedDate = curentDate.toLocaleDateString("vi-VN", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	const [currentTime, setCurrentTime] = React.useState<string>("");
	const [timezone, setTimezone] = React.useState<string>("");

	React.useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			const timeString = now.toLocaleTimeString("vi-VN");
			const timezoneString = Intl.DateTimeFormat("vi-VN", {
				timeZoneName: "short",
			})
				.formatToParts(now)
				.find((part) => part.type === "timeZoneName")?.value;

			setCurrentTime(timeString);
			setTimezone(timezoneString || "");
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, []);
	return (
		<div className="bg-white rounded-lg shadow-md p-4 space-y-2">
			<div className="text-lg text-gray-500 font-medium">
				Thời gian hiện tại
			</div>
			<div className="space-y-2">
				<div className="text-gray-400">{formattedDate}</div>
				<div className="flex items-end gap-2">
					<div className="text-3xl font-bold text-gray-900 leading-6">
						{currentTime}
					</div>
					<div className="text-sm text-blue-600 font-semibold">
						({timezone})
					</div>
				</div>
			</div>
		</div>
	);
};

export default RaffleClock;
