import { getFirst } from "@/client";
import { postUploadImage } from "@/client/UploadClient";
import { UploadStatusProperty } from "@/constants";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { IResponse } from "@/interface/Client/interface";
import { EnumUploadStatus } from "@/interface/interface";
import NotifyUtils from "@/utils/NotifyUtils";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import React, { useState } from "react";

interface IUploadImageProps {
	allowMultiple?: boolean;
	acceptedFileTypes?: string[];
	label?: string;
	errorMessage?: string;
	files?: UploadedImage[];
	handleSyncData?: (files: { publicUrl: string; size: number }) => void;
	max?: number;
	thumbnailUploaded?: string[];
}

export interface UploadedImage {
	file?: File;
	preview: string;
	status: EnumUploadStatus;
	publicUrl?: string;
}

interface IImageData {
	bytes: number;
	created_at: string;
	public_id: string;
	url: string;
}

const UploadImage: React.FC<IUploadImageProps> = ({
	allowMultiple = false,
	acceptedFileTypes = [],
	label = "Tải lên ảnh",
	errorMessage = "",
	files = [],
	handleSyncData,
	max = 1,
	thumbnailUploaded,
}) => {
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
		() => {
			if (thumbnailUploaded) {
				return [
					{
						preview: thumbnailUploaded?.[0] || "",
						status: EnumUploadStatus.DONE,
						publicUrl: thumbnailUploaded?.[0] || "",
					},
				];
			}
			return files;
		}
	);

	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.preventDefault();
		const selectedFiles = event.target.files;
		if (!selectedFiles) return;

		// Check if adding new files would exceed the max limit
		if (uploadedImages.length + selectedFiles.length > max) {
			NotifyUtils.error(`Chỉ được phép tải lên tối đa ${max} ảnh`);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			return;
		}

		const newImages: UploadedImage[] = Array.from(selectedFiles).map(
			(file) => ({
				file,
				preview: URL.createObjectURL(file),
				status: EnumUploadStatus.UPLOADING,
			})
		);

		setUploadedImages((prev) => [...prev, ...newImages]);

		// Upload images using API
		try {
			const uploadPromises: Promise<IResponse<IImageData>>[] = Array.from(
				selectedFiles
			).map(async (file) => {
				const formData = new FormData();
				formData.append("files", file);
				const response = await postUploadImage(formData);

				if (response.status !== "OK") {
					NotifyUtils.error("Có lỗi xảy ra. Không thể tải lên ảnh");
					setUploadedImages((prev) =>
						prev.map((img) => ({
							...img,
							status: EnumUploadStatus.ERROR,
						}))
					);
				}
				return response;
			});

			const results = await Promise.all(uploadPromises);
			if (results.some((result) => result.status !== "OK")) {
				NotifyUtils.error("Có lỗi xảy ra. Không thể tải lên ảnh");
				setUploadedImages((prev) =>
					prev.map((img) => ({
						...img,
						status: EnumUploadStatus.ERROR,
					}))
				);
				return;
			}
			const firstData = results?.[0];
			if (!firstData) {
				NotifyUtils.error("Có lỗi xảy ra. Không thể tải lên ảnh");
				setUploadedImages((prev) =>
					prev.map((img) => ({
						...img,
						status: EnumUploadStatus.ERROR,
					}))
				);
				return;
			}
			const resultData = getFirst(firstData);

			setUploadedImages((prev) =>
				prev.map((img) => ({
					...img,
					status: EnumUploadStatus.DONE,
					publicUrl: (resultData as IImageData)?.url,
				}))
			);

			const listImages = {
				publicUrl: (resultData as IImageData)?.url || "",
				size: (resultData as IImageData)?.bytes || 0,
			};

			handleSyncData && handleSyncData(listImages);
			NotifyUtils.success("Tải ảnh lên thành công");
		} catch (error) {
			NotifyUtils.error("Có lỗi xảy ra. Không thể tải lên ảnh");
			setUploadedImages((prev) =>
				prev.map((img) => ({
					...img,
					status: EnumUploadStatus.ERROR,
				}))
			);
		}
	};

	const handleRemoveImage = (index: number) => {
		setUploadedImages((prev) => prev.filter((_, i) => i !== index));
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<Box component="fieldset" className="border p-4 rounded-lg">
			<Typography component="legend" className="text-base text-gray-500">
				{label}
			</Typography>
			<label
				htmlFor="file-upload"
				className="inline-block text-white bg-red-400 rounded-lg px-4 py-2 cursor-pointer text-center">
				Tải lên ảnh
			</label>
			{acceptedFileTypes?.length ? (
				<span className="ml-2 text-sm text-gray-500">
					Định dạng file ảnh{" "}
					<strong>
						{acceptedFileTypes
							.toString()
							.trim()
							.replaceAll(",", ", ")}
					</strong>
				</span>
			) : null}
			<input
				id="file-upload"
				type="file"
				accept={
					acceptedFileTypes?.join(",") || ".jpg,.jpeg,.png,.gif,.webp"
				}
				multiple={allowMultiple}
				onChange={handleImageUpload}
				style={{ display: "none" }}
				ref={fileInputRef}
			/>
			{uploadedImages?.length ? (
				<BlockImageUploaded
					uploadedImages={uploadedImages}
					handleRemoveImage={handleRemoveImage}
				/>
			) : null}
			<br />
			<span>
				{errorMessage && (
					<Typography variant="caption" color="error">
						{errorMessage}
					</Typography>
				)}
			</span>
		</Box>
	);
};

export default UploadImage;

interface IBlockImageUploaded {
	uploadedImages: UploadedImage[];
	handleRemoveImage?: (index: number) => void;
}

const BlockImageUploaded = ({
	uploadedImages,
	handleRemoveImage,
}: IBlockImageUploaded) => {
	return (
		<div style={{ marginTop: "20px" }}>
			<label>Ảnh đã tải lên:</label>
			<div className="flex gap-4">
				{uploadedImages.map((image, index) => (
					<div key={index} className="flex flex-col justify-between">
						<div className="relative max-w-max">
							{image.status === EnumUploadStatus.DONE && (
								<DeleteIcon
									className="absolute top-1 right-1 cursor-pointer z-10 text-red-400 bg-white rounded-full p-1"
									onClick={() => handleRemoveImage?.(index)}
								/>
							)}
							<div className="relative">
								<Image
									src={image.preview || NEW_MISSING_IMAGE}
									alt={`Uploaded ${index}`}
									width={120}
									height={120}
									className="rounded-lg cursor-pointer hover:scale-105 transform transition-transform duration-300"
									style={{
										maxWidth: "100%",
										height: "auto",
									}}
									quality={100}
									sizes="100vw"
								/>
								{image.status ===
									EnumUploadStatus.UPLOADING && (
									<div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
										<CircularProgress
											className="text-green-400 flex "
											size={32}
										/>
									</div>
								)}
								{image.status === EnumUploadStatus.ERROR && (
									<div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
										<span className="text-red-500 bg-[rgba(0,0,0,0.5)] text-sm font-bold">
											Có lỗi xảy ra
										</span>
									</div>
								)}
							</div>
						</div>
						<div className="mt-auto">
							<div className="max-w-[120px]">
								<span className="block font-bold text-sm mt-2 truncate w-[120px]">
									{image?.file?.name || "Thumbnail"}
								</span>
							</div>
							<span
								className={`${UploadStatusProperty[image.status]
									?.color} flex items-center gap-1 text-xs`}>
								{UploadStatusProperty[image.status]?.icon}
								{UploadStatusProperty[image.status]?.text}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
