import { useAuth } from "@/context/Auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import React from "react";

const withMakerAuth = <P extends object>(
	WrappedComponent: React.ComponentType<P>,
) => {
	const RequiresMakerAuth: React.FC<P> = (props) => {
		const auth = useAuth();
		const { user } = auth || {};
		const router = useRouter();

		console.log("withMakerAuth - user:", user);

		useEffect(() => {
			if (!user || !user.makerId) {
				router.replace("/"); // Redirect to home page if no makerId
			}
		}, [user, router]);

		// Render the wrapped component only if the user has a makerId
		if (!user || !user.makerId) {
			return null;
		}

		return <WrappedComponent {...props} />;
	};

	return RequiresMakerAuth;
};

export default withMakerAuth;
