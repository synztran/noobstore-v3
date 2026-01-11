import { ARTISAN_IMAGE } from "@/constants/Images";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Button } from "@/components/ReUIComponent/Button";
import { styled } from "@mui/material/styles";
import { CircleCheck, CircleX } from "lucide-react";
import Image from "next/image";

import * as React from "react";

interface MiniUploadImageProps {
  onUpload: (file: File) => void;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface IFile {
  name: string;
  status: EnumUploadStatus;
  size: number;
  url: string;
}

enum EnumUploadStatus {
  UPLOADING = "uploading",
  DONE = "done",
  ERROR = "error",
}

const UploadStatusProperty: Record<EnumUploadStatus, any> = {
  [EnumUploadStatus.UPLOADING]: {
    color: "text-gray-500",
    text: "Đang tải lên...",
    // icon: <CircleCheck className="text-gray-500" size={24} />,
  },
  [EnumUploadStatus.DONE]: {
    color: "text-green-500",
    text: "Hoàn thành",
    icon: <CircleCheck className="text-green-500" size={18} />,
  },
  [EnumUploadStatus.ERROR]: {
    color: "text-red-500",
    text: "Không thể tải lên",
    icon: <CircleX className="text-red-500" size={18} />,
  },
};

const tempImages = [
  {
    name: "image.jpg",
    status: EnumUploadStatus.UPLOADING,
    size: 1000,
    url: ARTISAN_IMAGE,
  },
  {
    name: "file2.jpg",
    status: EnumUploadStatus.DONE,
    size: 456,
    url: ARTISAN_IMAGE,
  },
  {
    name: "file3.jpg",
    status: EnumUploadStatus.ERROR,
    size: 123,
    url: ARTISAN_IMAGE,
  },
];

const MiniUploadImage: React.FC<MiniUploadImageProps> = ({ onUpload }) => {
  const [images, setImages] = React.useState<IFile[]>(tempImages);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onUpload(event.target.files[0]);
    }
  };

  return (
    <div className="relative mt-2">
      <Button variant="secondary" className="px-2 py-1 bg-[#e5e5e7] text-black">
        <AttachFileIcon className="text-black mx-0 px-0 mr-2" />
        <span className="text-xs text-black font-bold font-nunito">
          {images?.length > 0 ? "Lựa chọn thêm ảnh" : "Tải ảnh lên"}
        </span>
        <VisuallyHiddenInput type="file" />
      </Button>
      {images ? (
        <div className="flex gap-4 mt-2">
          {images.map((image, index) => (
            <div key={index} className="flex flex-col">
              <Image
                src={image.url}
                width={120}
                height={120}
                alt={image.name}
                className="rounded-lg cursor-pointer hover:scale-105 transform transition-transform duration-300"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
              <span className="font-bold text-sm mt-2">{image.name}</span>
              <span
                className={`${
                  UploadStatusProperty[image.status]?.color
                } flex items-center gap-1 text-xs`}
              >
                {UploadStatusProperty[image.status]?.icon}
                {UploadStatusProperty[image.status]?.text}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div>No file uploaded</div>
      )}
    </div>
  );
};

export default MiniUploadImage;
