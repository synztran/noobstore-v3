import React from "react";
import Image from "next/image";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { Button } from "@/components/ReUIComponent";
import { Plus } from "lucide-react";

type StatusKey = "true" | "false";
const mappingMemberStatus: Record<
	StatusKey,
	{ text: string; color: string; border: string }
> = {
	true: {
		text: "Đang hoạt động",
		color: "text-green-600",
		border: "border border-green-600",
	},
	false: {
		text: "Không hoạt động",
		color: "text-red-500",
		border: "border border-red-500",
	},
};

const TeamCollaboration = () => {
	const teamMembers = [
		{
			name: "Alexandra Deff",
			workingTitle: "Working on GitHub Project Repository",
			workingStatus: mappingMemberStatus["true"],
		},
		{
			name: "Edwin Adenike",
			workingTitle: "Integrate User Authentication System",
			workingStatus: mappingMemberStatus["false"],
		},
		{
			name: "Isaac Oluwatemilorun",
			workingTitle: "Develop Search and Filter Functionality",
			workingStatus: mappingMemberStatus["true"],
		},
		{
			name: "David Oshodi",
			workingTitle: "Responsive Layout for Homepage",
			workingStatus: mappingMemberStatus["false"],
		},
		{
			name: "David Oshodi",
			workingTitle: "Responsive Layout for Homepage",
			workingStatus: mappingMemberStatus["false"],
		},
	];

	return (
		<div className="p-4 bg-white rounded-lg shadow-md space-y-4 flex-1 flex flex-col">
			<div className="flex justify-between items-center gap-4">
				<div className="text-lg font-bold">Thành viên</div>
				<Button variant="secondary" size="sm" fontSize="sm">
					<Plus size={16} />
					&nbsp; Thêm thành viên
				</Button>
			</div>
			<ul className="space-y-2 overflow-y-auto flex-1 min-h-0">
				{teamMembers.map((member, index) => (
					<li key={index} className="flex items-center gap-2 p-2">
						<div className="relative min-w-10 w-10 h-10 rounded-full overflow-hidden">
							<Image
								src={NEW_MISSING_IMAGE}
								alt="Avatar"
								fill
								style={{ objectFit: "cover" }}
							/>
						</div>
						<div className="w-full space-y-1">
							<div className="flex justify-between items-center gap-2">
								<p className="text-sm font-semibold">
									{member.name}
								</p>
								<span
									className={`px-1 py-.5 rounded-sm text-xs font-medium ${member.workingStatus.color} ${member.workingStatus.border}`}>
									{member.workingStatus.text}
								</span>
							</div>
							<p className="text-xs text-gray-500">
								Đảm nhiệm vị trí{" "}
								<strong className="text-gray-600">
									{member.workingTitle}
								</strong>
							</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TeamCollaboration;
