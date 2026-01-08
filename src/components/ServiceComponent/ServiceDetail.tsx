import useBookingServiceQueries from "@/react-query/services/api/useBookingServiceQueries";
import { formatCurrency } from "@/utils/FormatNumber";
import useServices from "@/zustand/useServices";
import { Mail, Phone } from "lucide-react";
import ServiceItemSelected from "./ServiceItemSelected";
import { IResponseBackendTask } from "@/interface/Client/Service";
import DateUtils from "@/utils/DateUtils";
import { Divider } from "@mui/material";
import SummaryServicePayment from "./SummaryServicePayment";

const ServiceDetail = ({ id }: { id: string }) => {
  const { data: service, isPending } = useBookingServiceQueries(id as string);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!service) {
    return <div>Dịch vụ không tồn tại hoặc đã bị xóa.</div>;
  }

  return (
    <div className="sticky top-32 bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div className="relative space-y-4">
        {/* <div className="text-xl font-bold border border-gray-300 rounded-lg p-4 text-center">
					Thông tin
				</div> */}
        <div className="flex flex-col justify-center items-center w-full gap-1">
          <span className="text-sm text-gray-700">Tổng tiền</span>
          <span className="font-bold text-center text-2xl bg-gray-400 rounded-md shadow-md px-1 py-.5">
            {formatCurrency(service?.totalPrice || 0)}
          </span>
          <span className="text-gray-700 text-sm text-center">
            {DateUtils.formatVietNamDate(service?.createdAt || "")}
            <br />
            Mã đơn hàng: <strong>{service?.serviceBookingId}</strong>
          </span>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-semibold text-gray-700">
								Mã đơn hàng
							</label>
							<p className="text-gray-900 bg-gray-50 p-2 rounded-lg shadow-md">
								{service?.serviceBookingId}
							</p>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700">
								Khách hàng
							</label>
							<div className="bg-gray-50 p-2 rounded-lg shadow-md space-y-1">
								<p className="capitalize">
									{service?.contact.name} -{" "}
									{service?.contact.phone}
								</p>
								<p className="text-sm flex items-center gap-1">
									<Mail size={16} /> {service?.contact.email}
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-semibold text-gray-700 ">
								Tổng tiền
							</label>
							<p className="font-bold text-green-600 bg-green-50 p-2 rounded-lg text-center shadow-md">
								{formatCurrency(service?.totalPrice || 0)}
							</p>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700">
								Ngày tạo
							</label>
							<p className="bg-gray-50 p-2 rounded-lg shadow-md">
								{new Date(
									service?.createdAt || ""
								).toLocaleDateString("vi-VN")}
								<br />
								{formatTime(service?.createdAt || "")}
							</p>
						</div>
					</div>
				</div> */}
      </div>

      {/* Service Items */}
      <div className="relative">
        <div className="border-2 border-gray-200 rounded-lg">
          <div className="px-4 py-2 border-b-2 border-gray-200 font-bold text-lg ">
            Thông tin dịch vụ
          </div>
          <div className="">
            {service?.tasks?.map((item, idx) => (
              <div key={item.taskId}>
                <ServiceItemSelected task={item as IResponseBackendTask} />
                <Divider className="max-w-[93%] !mx-auto" />
              </div>
            ))}
            <SummaryServicePayment service={service} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
