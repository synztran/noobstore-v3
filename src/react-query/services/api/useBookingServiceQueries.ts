import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryPresets } from "../../configs";
import { appQueryKeys } from "../../root";
import { IResponseBackendServiceBooking } from "@/interface/Client/Service";

type IQueryOptions = {
	enabled?: boolean | (() => boolean);
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]> &
	Partial<UseQueryOptions<IResponseBackendServiceBooking, Error>>;

export default function useBookingServiceQueries(
	bookingId: string,
	queryOptions?: IQueryOptions
) {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.service.getBookingService(bookingId),
		...queryPresets.longLived,
		...queryOptions,
		enabled,
	};

	const bookingServiceQuery = useQuery(queryConfig);
	return bookingServiceQuery;
}
