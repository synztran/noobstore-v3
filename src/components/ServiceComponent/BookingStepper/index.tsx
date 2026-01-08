import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { CircularProgress } from "@mui/material";
import {
  EnumBackendServiceStepStatus,
  IResponseBackendService,
  IResponseBackendServiceBooking,
} from "@/interface/Client/Service";
import { mappingBookingServiceStatus } from "@/constants";
// TODO: Replace MUI system styles with Tailwind CSS

interface IProps {
  service: IResponseBackendServiceBooking;
  classNames?: string;
}
// export type StepStatus = "PENDING" | "IN_PROCESS" | "BLOCK" | "COMPLETED";

// export type BookingStep = {
// 	id: string;
// 	status: StepStatus;
// 	title: string;
// 	description?: string;
// 	timestamp?: string; // ISO string
// 	imageUrl?: string;
// };

// type BookingStepperProps = {
// 	steps?: BookingStep[];
// 	isActionHistory?: boolean; // when true show full history, otherwise show current + past
// 	className?: string;
// };

const STATUS_COLOR: Record<EnumBackendServiceStepStatus, string> = {
  PENDING: "bg-gray-200 text-gray-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-green-100 text-green-800",
};

// const DRAFT_STEPS: BookingStep[] = [
// 	{
// 		id: "created",
// 		status: "COMPLETED",
// 		title: "Đã tạo đơn",
// 		description: "Đơn hàng được tạo và chờ xác nhận từ cửa hàng",
// 		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
// 	},
// 	{
// 		id: "in_progress",
// 		status: "IN_PROCESS",
// 		title: "Đang thực hiện",
// 		description: "Kỹ thuật viên đang xử lý yêu cầu",
// 		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
// 	},
// 	{
// 		id: "qc",
// 		status: "PENDING",
// 		title: "Kiểm tra chất lượng",
// 		description: "Chờ kiểm tra trước khi đóng gói",
// 		timestamp: undefined,
// 	},
// 	{
// 		id: "delivered",
// 		status: "PENDING",
// 		title: "Hoàn thành & Giao hàng",
// 		description: "Sẽ cập nhật khi chuyển sang giao hàng",
// 	},
// ];

function formatDateTime(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString("vi-VN", { dateStyle: "medium" });
    const time = d.toLocaleTimeString("vi-VN", { timeStyle: "short" });
    return `${date} - ${time}`;
  } catch (e) {
    return iso;
  }
}

const BookingStepper = ({ service, classNames = "" }: IProps) => {
  if (!service || !service.timeline || service.timeline.length === 0) {
    return null;
  }
  return (
    <div className={`w-full ${classNames}`}>
      <ol className="relative space-y-2">
        {service?.timeline.map((step, idx) => {
          const isCompleted =
            step.status === EnumBackendServiceStepStatus.COMPLETED;
          // For reachability we base on full steps array index
          const fullIdx = service?.timeline.findIndex((s) => s.id === step.id);
          const isCurrent = step.isCurrent;

          return (
            <li
              key={step.id}
              className={`relative flex w-full`}
              style={{
                opacity:
                  step.status === EnumBackendServiceStepStatus.PENDING
                    ? 0.4
                    : 1,
              }}
            >
              {/* vertical connector below each item (thin) */}
              <div className="flex flex-col w-2/12 items-center gap-2">
                <div
                  className={`min-h-[40px] flex items-center justify-center w-10 h-10 rounded-full ring-8 ring-white text-lg font-bold ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="stroke-white stroke-[5px]" />
                  ) : null}

                  {isCurrent ? (
                    <CircularProgress
                      size={18}
                      classes={{
                        circle: "!stroke-white !stroke-[5px]",
                      }}
                    />
                  ) : null}
                  {!isCompleted && !isCurrent ? fullIdx + 1 : null}
                </div>
                {step.id !== service.timeline.length ? (
                  <div
                    className={`w-1 min-h-[60px] h-full rounded-md ${
                      isCompleted ? "bg-green-400" : "bg-gray-200"
                    }`}
                  />
                ) : null}
              </div>

              <div className="w-10/12">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start min-h-[40px] gap-2">
                    <div className="flex flex-col">
                      <h4 className="font-semibold text-sm">{step.title}</h4>
                      {step.timestamp ? (
                        <div
                          className="text-xs font-semibold text-gray-600 leading-4
                        "
                        >
                          {formatDateTime(step.timestamp)}
                        </div>
                      ) : null}
                    </div>
                    <div
                      className={`px-2 py-0.5 h-fit rounded-md text-sm font-semibold ${
                        STATUS_COLOR[step.status]
                      }`}
                    >
                      {mappingBookingServiceStatus[step.status]}
                    </div>
                  </div>

                  {step.description ? (
                    <p className="text-sm font-semibold text-gray-600 leading-[1.2]">
                      {step.description}
                    </p>
                  ) : null}
                </div>

                {/* {step.imageUrl ? (
									<div className="mt-2 w-40 h-24 relative rounded overflow-hidden border">
										<Image
											src={step.imageUrl}
											alt={step.title}
											fill
											className="object-cover"
										/>
									</div>
								) : null} */}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default BookingStepper;
