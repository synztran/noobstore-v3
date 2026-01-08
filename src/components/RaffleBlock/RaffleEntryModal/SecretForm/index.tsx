import { IStepProps } from "@/interface/Raffle";
import { useRaffleSubmitSecretMutation } from "@/react-query/raffles/api/useRaffleSubmitSecretMutation";
import NotifyUtils from "@/utils/NotifyUtils";
import useRaffle, { useRaffleAction } from "@/zustand/useRaffle";
import { Button, CircularProgress } from "@mui/material";
import { memo, useRef, useState } from "react";

const StepSecretKey: React.FC<IStepProps> = memo(({ raffleData }) => {
  const { raffleSubmitForm } = useRaffle();
  const { updateRaffleSubmitForm, setRaffleLoading } = useRaffleAction();
  const postSumitSecretKey = useRaffleSubmitSecretMutation();
  const { mutateAsync, isPending: isLoading } = postSumitSecretKey;
  const [message, setMessage] = useState<string>("");

  // Giới hạn gọi: tối đa 3 lần trong 30s
  const callWindowMs = 30_000;
  const maxCallsInWindow = 3;
  const callTimestamps = useRef<number[]>([]);

  const handleSubmitSecretKey = async (secretKey: string) => {
    const now = Date.now();
    // Loại bỏ các lần gọi quá 30s trước
    callTimestamps.current = callTimestamps.current.filter(
      (ts) => now - ts < callWindowMs
    );

    if (callTimestamps.current.length >= maxCallsInWindow) {
      NotifyUtils.error("Bạn thao tác quá nhanh. Vui lòng thử lại sau.");
      return;
    }
    callTimestamps.current.push(now);

    try {
      setRaffleLoading(true);
      const res = await mutateAsync({
        payload: { secretKey, raffleId: raffleData?.raffleId },
      });

      if (res.status === "OK") {
        updateRaffleSubmitForm({ secretKey });
      } else {
        setMessage("Khóa bí mật không hợp lệ. Vui lòng thử lại.");
      }
    } catch (error) {
      NotifyUtils.error("Đã xảy ra lỗi khi xác minh. Vui lòng thử lại.");
    } finally {
      setRaffleLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="text-center mb-6 flex flex-col gap-2 items-center">
        <div className="text-xl font-bold">Nhập khóa bí mật</div>
        <div className="text-gray-600">
          Đảm bảo bạn đã có khóa bảo mật, nếu chưa hãy tham gia vào cộng động
          của maker.
        </div>
      </div>
      {/* Form nhập và xác minh khóa bí mật */}
      {raffleSubmitForm?.secretKey ? (
        <div className="p-4 rounded-lg bg-green-100 border border-green-400 text-green-800 text-center">
          Khóa bí mật đã được xác minh{" "}
          <strong className="text-green-800">thành công!</strong> Mời bạn tiếp
          tục
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-gray-200 border">
          <form
            className="relative space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const formData = new FormData(form);
              const secretKey = String(formData.get("secretKey") || "").trim();

              if (!secretKey) {
                NotifyUtils.error("Vui lòng nhập khóa bí mật.");
                return;
              }

              handleSubmitSecretKey(secretKey);
            }}
          >
            <div className="relative space-y-2">
              <label
                htmlFor="secretKey"
                className="block font-medium text-gray-700"
              >
                Khóa bí mật
              </label>
              <input
                id="secretKey"
                name="secretKey"
                type="text"
                className="w-full !bg-white rounded-md border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập khóa bí mật do maker cung cấp..."
                required
                disabled={isLoading}
              />

              <div
                className={`text-sm ${
                  message ? "text-red-400" : "text-gray-600"
                } absolute -bottom-6`}
              >
                {message || ""}
              </div>
            </div>

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              className="w-full bg-red-400 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition-colors my-auto text-lg flex items-center justify-center disabled:"
            >
              {isLoading ? (
                <CircularProgress
                  size={26}
                  classes={{
                    circle: "!stroke-white",
                  }}
                />
              ) : (
                "Xác minh khóa bí mật"
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
});

export default StepSecretKey;
