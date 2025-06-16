import ChatComponent from "@/components/MessageChat";
import Admin from "@/layoutAdmin/Admin";

export default function AdminChatPage() {
	return (
		<>
			<div className="mx-w-full my-6 relative z-1">
				<ChatComponent isAdmin={true} />
			</div>
		</>
	);
}

AdminChatPage.layout = (props: {
	children: React.ReactNode;
	isHideStats?: boolean;
}) => <Admin {...props} isHideStats={true} />;
