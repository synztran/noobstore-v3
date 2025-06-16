import { Collapse } from "@material-ui/core";
import React from "react";

interface CollapseProps {
	children: React.ReactNode;
	isCollapse?: boolean;
}

const SummaryServiceCollapse: React.FC<CollapseProps> = ({
	isCollapse,
	children,
}) => {
	return (
		<div className="h-auto">
			<Collapse in={isCollapse}>{children}</Collapse>
		</div>
	);
};

export default SummaryServiceCollapse;
