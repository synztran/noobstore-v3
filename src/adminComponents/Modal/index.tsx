import { Box, Modal } from "@mui/material";
import React from "react";

interface ModalWrapperProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
	open,
	onClose,
	children,
}) => {
	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					bgcolor: "background.paper",
					boxShadow: 24,
					p: 4,
					borderRadius: 2,
					minWidth: 300,
				}}>
				{children}
			</Box>
		</Modal>
	);
};

export default ModalWrapper;
