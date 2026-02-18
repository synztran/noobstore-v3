import UploadImage from "@/components/InputComponents/UploadImage";
import { ISectionProps } from "./interface";

const ImagesSection: React.FC<ISectionProps> = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	setFieldValue,
}) => (
	<div className="space-y-6">
		<div className="text-xl font-semibold mb-4">Hình ảnh</div>

		<div className="space-y-4">
			<div>
				<UploadImage
					label="Ảnh đại diện"
					subLabel="Ảnh này sẽ hiển thị trên card preview của raffle"
					allowMultiple={false}
					max={1}
					isRequired={false}
					acceptedFileTypes={[".jpg", ".jpeg", ".png", ".webp"]}
					thumbnailUploaded={
						values.thumbnail ? [values.thumbnail.path] : []
					}
					handleSyncData={(files) => {
						if (files && files.length > 0) {
							setFieldValue("thumbnail", {
								path: files?.[0]?.publicUrl,
								alt: "Thumbnail",
							});
						}
					}}
				/>
			</div>

			<div className="border-t pt-6">
				<UploadImage
					label="Thư viện ảnh"
					subLabel="Các ảnh này sẽ hiển thị trong chi tiết raffle"
					allowMultiple={true}
					max={10}
					isRequired={false}
					acceptedFileTypes={[".jpg", ".jpeg", ".png", ".webp"]}
					thumbnailUploaded={values.images.map((img) => img.path)}
					handleSyncData={(files) => {
						if (files && files.length > 0) {
							const newImages = files.map((file) => ({
								path: file.publicUrl,
								alt: "Gallery image",
							}));
							setFieldValue("images", [
								...values.images,
								...newImages,
							]);
						}
					}}
				/>
			</div>
		</div>
	</div>
);

export default ImagesSection;
