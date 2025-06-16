import ChatComponent from "@/components/MessageChat";
import { Base } from "@/templates/Base";

const ChatPage = () => {
	return (
		<Base>
			<div className="mx-w-full relative z-1 h-full">
				<ChatComponent />
			</div>
		</Base>
	);
};

export default ChatPage;
