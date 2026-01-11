import { useAuth } from "@/context/Auth";
import {
  Dialog,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ReUIComponent/Dialog";
import { Button } from "@/components/ReUIComponent/Button";

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
        <DialogBackdrop />
        <DialogViewport>
          <DialogContent showClose={false}>
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
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Thoát
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
};

export default PopupLogOut;
