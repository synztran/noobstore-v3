import React, { useState } from "react";
import { Modal, Tabs, Tab, Divider } from "@mui/material";
import { Button } from "@/components/ReUIComponent/Button";
import { X } from "lucide-react";
import Image from "next/image";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import DateUtils from "@/utils/DateUtils";
import { formatCurrency } from "@/utils/FormatNumber";
import {
  I3D_NUMBER_ONE,
  I3D_NUMBER_TWO,
  I3D_NUMBER_THREE,
} from "@/constants/Images";
import { EnumRaffleStatus } from "@/interface/Client/Raffle";
import { EnumRafflePaymentStatus } from "@/interface/interface";

interface RegisterRaffleModalProps {
  open: boolean;
  onClose: () => void;
  selected: TResponseRaffleEntry | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`raffle-tabpanel-${index}`}
      aria-labelledby={`raffle-tab-${index}`}
      className="w-full overflow-y-auto mt-4"
    >
      {value === index ? children : null}
    </div>
  );
};

const TABS = [
  {
    id: 0,
    label: "Đăng ký",
    ariaControls: "raffle-tabpanel-0",
  },
  {
    id: 1,
    label: "Thông tin",
    ariaControls: "raffle-tabpanel-1",
  },
  {
    id: 2,
    label: "Giao hàng",
    ariaControls: "raffle-tabpanel-2",
  },
];

const RegisterRaffleModal: React.FC<RegisterRaffleModalProps> = ({
  open,
  onClose,
  selected,
}) => {
  const [tabValue, setTabValue] = useState(0);

  if (!open || !selected) return null;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full px-6 pt-6 pb-20 animate-fade-in flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[80vh]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header Section with Image and Basic Info */}
        {/* Product Image */}
        <div className="w-32 h-32 relative flex-shrink-0 border border-gray-200 rounded-lg p-2 bg-gray-50">
          <Image
            src={selected?.raffleInfo.thumbnail.path || ""}
            alt={selected?.raffleInfo.thumbnail.alt || "Raffle"}
            fill
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        {/* Entry ID and Status */}
        <div className="flex-1 space-y-4">
          <div className="text-2xl font-bold">Raffle #{selected.raffleId}</div>

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-semibold text-sm">Sản phẩm</p>
              <p className="font-semibold text-gray-900">
                {selected.raffleInfo.title}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold text-sm">Team/Maker</p>
              <p className="font-semibold text-gray-900">
                {selected.makerInfo?.brandName || "Không xác định"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold text-sm">
                Thời gian mở raffle
              </p>
              <p className="font-semibold text-gray-900">
                {DateUtils.formatVietNamDate(selected.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold text-sm">
                Thời gian dự kiến giao hàng
              </p>
              <p className="font-semibold text-gray-900 truncate">
                {DateUtils.formatVietNamDate(
                  selected.raffleInfo.deliveryEstimate || ""
                ) || "Đang cập nhật"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="w-full flex flex-col min-h-0">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Raffle entry tabs"
            className="border-b border-gray-200"
            TabIndicatorProps={{
              style: { backgroundColor: "#16a34a" },
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.id}
                label={tab.label}
                id={`raffle-tab-${tab.id}`}
                aria-controls={tab.ariaControls}
                className={`!text-[13px] !capitalize ${
                  tabValue === tab.id
                    ? "!text-green-600 !font-bold"
                    : "!text-gray-600 !font-semibold"
                }`}
              />
            ))}
          </Tabs>

          {/* Tab Panel 1: Order History */}
          <TabPanel value={tabValue} index={0}>
            <div className="space-y-4">
              {/* Entry Timeline */}
              <div className="grid grid-cols-2 gap-4">
                {selected.productSelections.map((product) => (
                  <div
                    key={`${product.productId}-${product.name}`}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex gap-4"
                  >
                    <div className="w-20 h-20 relative flex-shrink-0 border border-gray-200 rounded overflow-hidden bg-white">
                      <Image
                        src={product.thumbnail?.path || ""}
                        alt={
                          product.thumbnail?.alt || product.name || "Sản phẩm"
                        }
                        fill
                        objectFit="cover"
                        className="rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900 line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>

          {/* Tab Panel 2: Product Details */}
          <TabPanel value={tabValue} index={1}>
            <div className="space-y-4">
              {/* Contact Information */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Thông tin liên hệ
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Họ tên</p>
                    <p className="font-semibold text-gray-900">
                      {selected.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Điện thoại</p>
                    <p className="font-semibold text-gray-900">
                      {selected.phone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">
                      {selected.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Địa chỉ giao hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">Địa chỉ</p>
                  <p className="font-semibold text-gray-900">
                    {selected.shipping.address}
                  </p>
                  <p className="text-gray-600 mt-2">Thành phố</p>
                  <p className="font-semibold text-gray-900">
                    {selected.shipping.city}
                  </p>
                  {selected.shipping.companyName && (
                    <>
                      <p className="text-gray-600 mt-2">Công ty</p>
                      <p className="font-semibold text-gray-900">
                        {selected.shipping.companyName}
                      </p>
                    </>
                  )}
                  <p className="text-gray-600 mt-2">Đơn vị vận chuyển</p>
                  <p className="font-semibold text-gray-900">
                    {selected.shipping.shippingMethod.name}
                  </p>
                  <p className="text-gray-600 mt-2">Phí vận chuyển</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(
                      selected.shipping.shippingMethod.price || 0
                    )}
                  </p>
                </div>
              </div>

              {/* Selected Products */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Sản phẩm đã chọn
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {selected.productSelections.map((product) => (
                    <div
                      key={`${product.productId}-${product.name}`}
                      className="bg-white border border-gray-200 rounded-lg p-3 flex gap-3"
                    >
                      <div className="w-16 h-16 relative flex-shrink-0 border border-gray-200 rounded overflow-hidden bg-white">
                        <Image
                          src={product.thumbnail?.path || ""}
                          alt={
                            product.thumbnail?.alt || product.name || "Sản phẩm"
                          }
                          fill
                          objectFit="cover"
                          className="rounded"
                        />
                        {product.priority && (
                          <div className="absolute right-0.5 top-0.5 bg-white rounded-full shadow-sm">
                            {product.priority === 1 ? (
                              <Image
                                src={I3D_NUMBER_ONE}
                                alt="1"
                                width={20}
                                height={20}
                              />
                            ) : product.priority === 2 ? (
                              <Image
                                src={I3D_NUMBER_TWO}
                                alt="2"
                                width={20}
                                height={20}
                              />
                            ) : product.priority === 3 ? (
                              <Image
                                src={I3D_NUMBER_THREE}
                                alt="3"
                                width={20}
                                height={20}
                              />
                            ) : null}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900 line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selected.note && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Ghi chú</h3>
                  <p className="text-sm text-gray-700">{selected.note}</p>
                </div>
              )}

              {/* Secret Key */}
              {selected.secretKey && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Mã bí mật
                  </h3>
                  <p className="text-sm font-mono text-gray-900 bg-white border border-gray-300 rounded p-2">
                    {selected.secretKey}
                  </p>
                </div>
              )}
            </div>
          </TabPanel>
        </div>
        <div className="fixed bottom-0 left-0 w-full flex items-center justify-end border-t border-gray-200 bg-white p-4">
          <Button
            size="default"
            variant="outline"
            className=""
            onClick={onClose}
          >
            <span className="text-sm text-black font-bold">Đóng</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterRaffleModal;
