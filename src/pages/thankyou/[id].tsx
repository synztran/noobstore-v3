import ThanksComp from "@/components/ThanksComp";
import { GIF_THANKS } from "@/constants/Images";
import { HOME_URL } from "@/constants/path";
import { useAuth } from "@/context/Auth";
import useOrderQuery from "@/react-query/order/api/useOrderQueries";
import { Base } from "@/templates/Base";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const ThankYouPage = () => {
	const router = useRouter();
	const { id: orderId } = router.query;
	const auth = useAuth();
	const { isPending } = useOrderQuery(orderId as string);

	useEffect(() => {
		if (!auth) {
			router.push(HOME_URL);
		}

		if (auth) {
		}
	}, [auth]);

	if (!orderId) return null;

	return (
		<Base isLoading={isPending}>
			<div className="mx-w-full relative z-1 h-full">
				<ThanksComp orderId={orderId as string} />
			</div>
		</Base>
	);
};

export default ThankYouPage;
