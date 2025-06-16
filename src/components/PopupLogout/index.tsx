import { useAuth } from "@/context/Auth";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";

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
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>Đăng xuất tài khoản</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Bạn có chắc chắn muốn đăng xuất không?
				</DialogContentText>
			</DialogContent>
			<DialogActions className="flex justify-end items-center gap-2">
				<Button variant="outlined" className="" onClick={handleClose}>
					<span className="normal-case">Đóng</span>
				</Button>
				<Button
					variant="contained"
					onClick={handleLogout}
					autoFocus
					className="bg-red-500 hover:bg-red-600">
					<span className="normal-case">Thoát</span>
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PopupLogOut;
