import { RecaptchaWrapperRef } from "@/components/RecaptchaWrapper";
import NotifyUtils from "@/utils/NotifyUtils";
import { Divider } from "@mui/material";
import { Button } from "@/components/ReUIComponent/Button";
import { ArrowUpDown, ChevronDown, Truck } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  MAPPING_DELIVERY_METHOD,
  MAPPING_ICON_SUMMARY_SERVICE,
} from "@/constants";
import { EnumShippingMethodCode } from "@/interface/interface";
import useServiceFeeQuery from "@/react-query/services/api/useServiceFeeQueries";
import { formatCurrency } from "@/utils/FormatNumber";
import useServices, {
  EnumServiceFeeType,
  useServiceAction,
} from "@/zustand/useServices";
// import LoadingDots from "../Effects/LoadingDots";
import SummaryServiceCollapse from "./collapse";
import SummaryServiceDeliveryBlock from "./DeliveryBlock";
import DiscountBlock from "./DiscountBlock";
import SummaryServiceBlock from "./ServiceBlock";
import { CircularProgress } from "@mui/material";
import { EnumResponseStatus } from "@/interface/Client/interface";
import SuccessModal from "./ModalDirection";

const text = {
  title: "",
  location: "Bình Thạnh, Hồ Chí Minh, Việt Nam",
};
const fundLink = "https://tnvc.vn";

const SummaryService: React.FC = () => {
  const {
    selectedOpt,
    selectedPlan,
    discounts,
    totalDiscount,
    shippingInfo,
    contactInfo,
    keyboardItems,
    switchItems,
    stabilizerItems,
    fees,
  } = useServices();
  const {
    calculateTotalPrice,
    calculateSubTotalPrice,
    submitServiceBooking,
    updateFees,
  } = useServiceAction();
  const { data: serviceFees } = useServiceFeeQuery();
  const recaptchaRef = useRef<RecaptchaWrapperRef>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    platFormFee,
    serviceOutOfTimeFee: { pickup, delivery },
  } = fees;

  const [isCollapse, setIsCollapse] = React.useState({
    note: true,
    delivery: true,
    services: true,
  });

  const [isOpenModalSuccess, setOpenModalSuccess] = useState(false);

  const handleCollapse = (target: "note" | "delivery" | "services") => {
    setIsCollapse((prev) => ({ ...prev, [target]: !prev[target] }));
  };

  // Handle service booking submission with reCAPTCHA
  async function handleSubmitBooking() {
    try {
      setIsSubmitting(true);
      // Submit service booking
      const response = await submitServiceBooking();

      if (response?.status === EnumResponseStatus.OK) {
        NotifyUtils.success("Đặt lịch thành công!");
        // You might want to redirect or reset form here
      } else {
        NotifyUtils.error(response?.message || "Có lỗi xảy ra khi đặt lịch");
      }
    } catch (error) {
      console.error("Service booking error:", error);
      NotifyUtils.error("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (serviceFees) {
      updateFees(
        "platFormFee",
        serviceFees[EnumServiceFeeType.PLATFORM]?.price || 0
      );
    }
  }, [serviceFees]);

  console.log("keyboardItems", keyboardItems);

  return (
    <div
      className="border border-gray-400 bg-white relative -top-[5rem] p-4 rounded-lg flex flex-col gap-4"
      id="summary-service-step"
    >
      <div className="flex flex-col">
        <strong className="text-lg">
          {selectedOpt?.name ?? "Vui lòng chọn gói dịch vụ"}
        </strong>
        <span className="text-sm text-gray-600">{text.location}</span>
      </div>
      <div className="flex flex-col gap-2">
        {shippingInfo?.method?.code !==
        EnumShippingMethodCode.SELF_DELIVERY_SELF_PICKUP ? (
          <DetailContent
            icon={<Truck size={24} />}
            headContent={
              shippingInfo?.deliveryMethod.name !== "" ? (
                shippingInfo?.deliveryMethod.name
              ) : (
                <CircularProgress size={20} />
              )
            }
            subTitle={shippingInfo?.deliveryMethod.code}
            endContent={
              shippingInfo?.deliveryMethod.code !== "" ? (
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {shippingInfo?.deliveryMethod.price > 0
                      ? formatCurrency(shippingInfo?.deliveryMethod.price)
                      : "Miễn phí"}
                  </span>
                </div>
              ) : null
            }
            headClasses="font-bold"
            headContentClasses="text-base"
          />
        ) : null}
        <DetailContent
          icon={<ArrowUpDown size={24} />}
          headContent={
            MAPPING_DELIVERY_METHOD[shippingInfo?.method.code] ?? (
              <CircularProgress size={20} />
            )
          }
          endContent={
            shippingInfo?.method.code !== "" ? (
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {shippingInfo?.method.price > 0
                    ? formatCurrency(shippingInfo?.method.price)
                    : "Miễn phí"}
                </span>
              </div>
            ) : null
          }
          headClasses="font-bold"
          headContentClasses="text-base"
        />
        <SummaryServiceDeliveryBlock />
        {shippingInfo?.addOns.map((addOn) => (
          <DetailContent
            icon={MAPPING_ICON_SUMMARY_SERVICE[addOn.value]?.icon ?? null}
            key={addOn.value}
            headContent={addOn.name}
            endContent={
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {addOn.price > 0 ? formatCurrency(addOn.price) : "Miễn phí"}
                </span>
              </div>
            }
            headClasses="font-bold"
            headContentClasses="text-base"
          />
        ))}
        <SummaryServiceBlock />
      </div>
      <Divider />
      <div className="flex flex-col">
        {keyboardItems.length ||
        switchItems.length ||
        stabilizerItems.length > 0 ? (
          <div>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleCollapse("note")}
            >
              <label className="cursor-pointer select-none">Ghi chú:</label>
              {keyboardItems.length ||
              switchItems.length ||
              stabilizerItems.length > 0 ? (
                <div className="hover:bg-gray-200 rounded-full transition-all duration-150">
                  <ChevronDown
                    size={16}
                    className={`cursor-pointer hover:bg-gray-200 rounded-full transition-all duration-150 transform ${
                      isCollapse.note ? "-scale-y-100" : ""
                    }`}
                  />
                </div>
              ) : null}
            </div>
            <SummaryServiceCollapse isCollapse={isCollapse.note}>
              {keyboardItems.length > 0 ? (
                <textarea
                  className="w-full h-20 p-2 resize-none rounded-md select-none"
                  readOnly
                  value={keyboardItems
                    .map((keyboard) => keyboard.note)
                    .join("\n")}
                />
              ) : null}
              {switchItems.length > 0 ? (
                <textarea
                  className="w-full h-20 p-2 resize-none rounded-md"
                  readOnly
                  value={switchItems.map((sw) => sw.note).join("\n")}
                />
              ) : null}
              {stabilizerItems.length > 0 ? (
                <textarea
                  className="w-full h-20 p-2 resize-none rounded-md"
                  readOnly
                  value={stabilizerItems
                    .map((stabilizer) => stabilizer.note)
                    .join("\n")}
                />
              ) : null}
            </SummaryServiceCollapse>
          </div>
        ) : null}
        <div className="flex flex-col gap-1">
          <DiscountBlock />
          <DetailContent
            headContent="Gói dịch vụ nâng cao:"
            headContentClasses="text-gray-600"
            headClasses="!text-sm text-gray-500"
            endContent={formatCurrency(selectedPlan?.price || 0)}
            itemEndClasses="text-base"
            endClasses="items-center"
            parentClasses="items-center"
            isShow={selectedPlan ? selectedPlan?.price > 0 : false}
          />
          <DetailContent
            headContent="Phí nền tảng:"
            headContentClasses="text-gray-600"
            headClasses="!text-sm text-gray-500"
            endContent={formatCurrency(platFormFee)}
            itemEndClasses="text-base"
            endClasses="items-center"
            parentClasses="items-center"
            isExpand
            subTitle={`100% đóng góp vào quỹ dưới danh nghĩa Khách hàng NoobStore - <a class='text-blue-600 text-xs hover:text-blue-700 hover:underline transition-all duration-300' href='${fundLink}' target='_blank'>xem thêm</a>`}
          />
          {pickup > 0 || delivery > 0 ? (
            <DetailContent
              headContent="Phí hỗ trợ ngoại giờ:"
              headContentClasses="text-gray-600"
              headClasses="!text-sm text-gray-500"
              endContent={formatCurrency(pickup + delivery)}
            />
          ) : null}
          <DetailContent
            headContent="Tạm tính:"
            endContent={formatCurrency(calculateSubTotalPrice())}
            parentClasses="items-center"
          />
          <DetailContent
            headContent="Giảm giá:"
            headContentClasses="text-gray-600"
            endContent={
              totalDiscount > 0
                ? `-${formatCurrency(totalDiscount)}`
                : `${formatCurrency(0)}`
            }
            itemEndClasses="text-red-600"
            headClasses=""
            parentClasses="items-center"
          />
          <Divider />
          <DetailContent
            headContent="Tổng tiền:"
            endContent={formatCurrency(calculateTotalPrice())}
            itemEndClasses="text-xl font-bold"
            headClasses="text-xl font-bold"
            parentClasses="items-center"
            headContentClasses="text-lg"
          />
        </div>
        <Button
          className="bg-red-400 rounded-md text-white w-full my-2 hover:bg-red-500 font-bold normal-case"
          onClick={handleSubmitBooking}
          disabled={isSubmitting}
        >
          <span className="text-white text-xl">
            {isSubmitting ? "Đang xử lý..." : "Đặt lịch"}
          </span>
        </Button>
        <small className="px-2 text-center break-keep">
          Khi bạn nhấn vào nút{" "}
          <strong className="text-red-400">Đặt lịch</strong>, bạn đồng ý với
          các&nbsp;
          <a href="#">điều khoản</a> và <a href="#">quy định</a> của NoobStore
        </small>
      </div>
      <SuccessModal
        open={isOpenModalSuccess}
        title="Đặt lịch thành công!"
        subtitle="Bạn đã đặt lịch dịch vụ thành công. Hệ thống sẽ chuyển hướng bạn trong giây lát."
        countdownTime={3} // seconds
        // redirectUrl="/dashboard"
      />
    </div>
  );
};

export default SummaryService;

export const DetailContent = ({
  type,
  icon,
  headContent = "",
  subTitle = "",
  endContent = "",
  headClasses = "",
  endClasses = "",
  itemEndClasses = "",
  parentClasses = "",
  headContentClasses = "",
  isExpand = false,
  isShow = true,
}: {
  type?: "dicount" | "total" | "fee";
  icon?: React.ReactNode;
  headContent?: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  endContent?: string | React.ReactNode;
  headClasses?: string;
  endClasses?: string;
  itemEndClasses?: string;
  parentClasses?: string;
  headContentClasses?: string;
  isExpand?: boolean;
  isShow?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  if (!isShow) return null;
  if (!isExpand) {
    return (
      <div className={`flex gap-2 ${parentClasses}`}>
        <div className="flex gap-2">
          {icon ? <div className="select-none">{icon}</div> : null}
          {icon ? <Divider orientation="vertical" flexItem /> : null}
          <div className="flex flex-col gap-0.5">
            <div className={`${headClasses}`}>
              <div className="flex items-start gap-1">
                <div className={`${headContentClasses} text-base`}>
                  {headContent}
                </div>
              </div>
            </div>
            {subTitle ? (
              <div
                className={`text-xs text-gray-600 leading-[1.25] ${
                  type === "dicount"
                    ? "border border-gray-600 rounded-md px-2 py-1 text-center leading-[1]"
                    : ""
                }`}
                dangerouslySetInnerHTML={{
                  __html: subTitle as string,
                }}
              />
            ) : null}
          </div>
        </div>
        {endContent ? (
          <div className={`ml-auto flex ${endClasses}`}>
            {typeof endContent === "string" ? (
              <span
                className={`${itemEndClasses} ${
                  type === "dicount" ? "text-red-600" : ""
                }`}
              >
                {endContent}
              </span>
            ) : null}
            {typeof endContent === "number" ? (
              <span
                className={`${itemEndClasses} ${
                  type === "dicount" ? "text-red-600" : ""
                }`}
              >
                {formatCurrency(endContent)}
              </span>
            ) : null}
            {typeof endContent === "object" ? (
              <span className={`${itemEndClasses}`}>{endContent}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
  return (
    <div className={`flex gap-2 ${parentClasses}`}>
      <div className="flex gap-2">
        {icon ? <div className="select-none">{icon}</div> : null}
        {icon ? <Divider orientation="vertical" flexItem /> : null}
        <div className="flex flex-col gap-0.5">
          <div className={`text-base ${headClasses}`}>
            <div className="flex items-start gap-1">
              <div className={`${headContentClasses}`}>{headContent}</div>
              {subTitle ? (
                <button
                  type="button"
                  className="text-xs text-gray-600 hover:text-gray-800 rounded px-1 py-0.5 leading-none"
                  onClick={() => setIsCollapsed((prev) => !prev)}
                  aria-label={isCollapsed ? "Expand" : "Collapse"}
                >
                  <div className="hover:bg-gray-200 rounded-full transition-all duration-150">
                    <ChevronDown
                      size={18}
                      className={`cursor-pointer hover:bg-gray-200 rounded-full transition-all duration-150 p-0.5 transform ${
                        isCollapsed ? "" : "-scale-y-100"
                      }`}
                    />
                  </div>
                </button>
              ) : null}
            </div>
          </div>
          {subTitle && !isCollapsed ? (
            <div
              className={`text-xs text-gray-600 leading-[1.25] ${
                type === "dicount"
                  ? "border border-gray-600 rounded-md px-2 py-1 text-center leading-[1]"
                  : ""
              }`}
              dangerouslySetInnerHTML={{
                __html: subTitle as string,
              }}
            />
          ) : null}
        </div>
      </div>
      {endContent ? (
        <div className={`ml-auto flex ${endClasses}`}>
          {typeof endContent === "string" ? (
            <span
              className={`${itemEndClasses} ${
                type === "dicount" ? "text-red-600" : ""
              }`}
            >
              {endContent}
            </span>
          ) : null}
          {typeof endContent === "number" ? (
            <span
              className={`${itemEndClasses} ${
                type === "dicount" ? "text-red-600" : ""
              }`}
            >
              {formatCurrency(endContent)}
            </span>
          ) : null}
          {typeof endContent === "object" ? (
            <span className={`${itemEndClasses}`}>{endContent}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
