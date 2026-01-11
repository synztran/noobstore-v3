import React, { useState } from "react";
import { TextField, Chip, Tooltip, Divider } from "@mui/material";
import { Button } from "@/components/ReUIComponent/Button";
import { CheckCircle, XCircle } from "lucide-react";
import { SUGGESTED_DISCOUNT_CODES } from "@/constants";
import useServices, { useServiceAction } from "@/zustand/useServices";
import { motion } from "framer-motion";

interface IProps {
  appliedCode?: string[];
}

const DiscountBlock: React.FC<IProps> = ({ appliedCode }) => {
  const { discounts } = useServices();
  const { updateDiscount } = useServiceAction();
  const [input, setInput] = useState(appliedCode ? appliedCode[0] : "");
  const [applied, setApplied] = useState<string[]>(
    appliedCode || discounts.map((d) => d.discountCode) || []
  );
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasSuggested =
    (Array.isArray(SUGGESTED_DISCOUNT_CODES) &&
      SUGGESTED_DISCOUNT_CODES.length > 0) ||
    appliedCode?.length === 0;

  const handleApply = () => {
    const code = input?.trim();
    if (!code) {
      setLocalError("Vui lòng nhập mã giảm giá");
      setSuccess(false);
      return;
    }
    if (hasSuggested) {
      const found = SUGGESTED_DISCOUNT_CODES.find(
        (s) => s.code.toLowerCase() === code.toLowerCase()
      );
      if (found) {
        setApplied([code.toUpperCase()]);
        setLocalError(null);
        setSuccess(true);
        updateDiscount([code.toUpperCase()]);
      } else {
        setLocalError("Mã giảm giá không hợp lệ hoặc đã hết hạn");
        setSuccess(false);
      }
    } else {
      // No suggestion list, accept any code
      setApplied([code.toUpperCase()]);
      setLocalError(null);
      setSuccess(true);
      updateDiscount([code.toUpperCase()]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setLocalError(null);
    setSuccess(false);
  };

  const handleSelectSuggested = (code: string) => {
    setInput(code);
    setLocalError(null);
    setSuccess(false);
  };

  const handleRemove = () => {
    setApplied([]);
    setInput("");
    setSuccess(false);
    setLocalError(null);
    updateDiscount([]);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-base">Mã giảm giá</label>
      <div className="flex gap-2 items-center">
        <motion.div
          className="flex-1 relative"
          animate={
            localError
              ? {
                  x: [0, -10, 10, -10, 10, 0],
                  boxShadow: [
                    "0 0 0px 0px rgba(255,0,0,0)",
                    "0 0 8px 2px rgba(255,0,0,0.4)",
                    "0 0 8px 2px rgba(255,0,0,0.7)",
                    "0 0 8px 2px rgba(255,0,0,0.4)",
                    "0 0 0px 0px rgba(255,0,0,0)",
                  ],
                }
              : { x: 0, boxShadow: "0 0 0px 0px rgba(255,0,0,0)" }
          }
          transition={{ duration: 0.5, type: "spring" }}
        >
          <TextField
            size="small"
            variant="outlined"
            placeholder="Nhập mã giảm giá"
            value={input}
            onChange={handleInputChange}
            disabled={applied.length > 0}
            className={`w-full h-[40px] ${localError ? "border-red-500" : ""}`}
            InputProps={{
              className: `!min-h-[40px] ${localError ? "!border-red-500" : ""}`,
              style: localError
                ? {
                    borderColor: "#ef4444",
                    background: "#fff1f2",
                  }
                : {},
            }}
            error={!!localError}
          />
          {appliedCode ? (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 font-semibold">
              Đã áp dụng
            </span>
          ) : null}
        </motion.div>
        {!appliedCode ? (
          <Button
            variant={applied.length > 0 ? "outline" : "default"}
            onClick={applied.length > 0 ? handleRemove : handleApply}
            disabled={applied.length > 0 ? false : !input?.trim()}
            className="h-full rounded-md bg-red-400 hover:bg-red-500 text-white disabled:bg-gray-400"
          >
            {applied.length > 0 ? (
              <XCircle size={18} className="stroke-white mr-2" />
            ) : (
              <CheckCircle size={18} className="stroke-white mr-2" />
            )}
            {applied.length > 0 ? "Xóa" : "Áp dụng"}
          </Button>
        ) : null}
      </div>
      {localError ? (
        <div className="text-red-600 text-xs">{localError}</div>
      ) : null}
      {success && applied.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-green-700 text-sm flex items-center gap-1">
            <CheckCircle size={16} className="stroke-green-700" /> Đã áp dụng mã{" "}
            <b>{applied.join(", ")}</b>
          </div>
        </div>
      )}
      {!applied.length && hasSuggested && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_DISCOUNT_CODES.map((s) => (
            <Tooltip title={s.description} key={s.code}>
              <Chip
                key={s.code}
                label={
                  <span className="text-sm">
                    <strong className="text-sm">{s.code}</strong>
                    {/* {s.description
											? ` - ${s.description}`
											: ""} */}
                  </span>
                }
                variant="outlined"
                color="primary"
                onClick={() => handleSelectSuggested(s.code)}
                className="cursor-pointer !border-gray-600"
              />
            </Tooltip>
          ))}
        </div>
      )}
      <Divider />
    </div>
  );
};

export default DiscountBlock;
