import { Button } from "@/components/ReUIComponent/Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPortal,
	DialogTitle,
} from "@/components/ReUIComponent/Dialog";
import { useAuth } from "@/context/Auth";

const PopupLogOut = ({
	open,
	handleClose,
}: {
	open: boolean;
	handleClose: () => void;
}) => {
	const { logout } = useAuth() as unknown as { logout: () => void };
	const handleLogout = () => {
		if (logout) logout();
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogPortal>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Đăng xuất tài khoản</DialogTitle>
						<DialogDescription>
							Bạn có chắc chắn muốn đăng xuất không?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex justify-end items-center gap-2">
						<DialogClose asChild>
							<Button variant="outline" onClick={handleClose}>
								Đóng
							</Button>
						</DialogClose>
						<Button
							variant="default"
							onClick={handleLogout}
							className="bg-red-500 hover:bg-red-600 text-white">
							Thoát
						</Button>
					</DialogFooter>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
};

export default PopupLogOut;
