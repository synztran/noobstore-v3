const workingTime = {
	start: {
		hour: 8,
		minute: 30,
	},
	end: {
		hour: 19,
		minute: 0,
	},
};

const formatDate = (date: Date, style = "dd/mm/yyyy") => {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	switch (style) {
		case "dd/mm/yyyy hh:mm":
			return `${day}/${month}/${year} - ${hours}:${minutes}`;
		default:
			return `${day}/${month}/${year}`;
	}
};

const isOutOfWorkingTime = (dateStr?: string | null) => {
	if (!dateStr) return false;
	const date = new Date(dateStr);
	const hour = date.getHours();
	const minute = date.getMinutes();

	const startHour = workingTime.start.hour;
	const startMinute = workingTime.start.minute;
	const endHour = workingTime.end.hour;
	const endMinute = workingTime.end.minute;

	// Convert all times to minutes since midnight for easy comparison
	const timeInMinutes = hour * 60 + minute;
	const startInMinutes = startHour * 60 + startMinute;
	const endInMinutes = endHour * 60 + endMinute;

	console.log(timeInMinutes, startInMinutes, endInMinutes);

	// Out of working time if before start or after end (end is exclusive)
	if (timeInMinutes < startInMinutes || timeInMinutes >= endInMinutes) {
		return true;
	}

	return false;
};

export default {
	formatDate,
	isOutOfWorkingTime,
};
