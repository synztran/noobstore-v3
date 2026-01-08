import { Box, Button, Modal, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface SuccessModalProps {
  open: boolean;
  title: string;
  subtitle: string;
  countdownTime: number;
  redirectUrl?: string;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(400px, 80vw)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "0.5rem",
  textAlign: "center",
};

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  title,
  subtitle,
  countdownTime,
  redirectUrl,
}) => {
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState(countdownTime);

  useEffect(() => {
    if (!open) return;

    setRemainingTime(countdownTime);

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (redirectUrl) {
            router.push(redirectUrl);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, countdownTime, redirectUrl, router]);

  const handleForceRedirect = () => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  return (
    <Modal
      open={open}
      disableEscapeKeyDown
      // disableBackdropClick
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="success-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography
          id="success-modal-description"
          style={{ marginTop: "16px" }}
        >
          {subtitle}
        </Typography>
        <Typography variant="body1" style={{ marginTop: "16px" }}>
          Redirecting in {remainingTime} seconds...
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleForceRedirect}
          style={{ marginTop: "24px" }}
        >
          Redirect Now
        </Button>
      </Box>
    </Modal>
  );
};

export default SuccessModal;
