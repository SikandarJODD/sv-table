export type Item = {
	id: number;
	name: string;
	email: string;
	location: string;
	flag: string;
	status: "Active" | "Inactive" | "Pending";
	balance: number;
};

export type DraggableColumn = {
	id: string;
	columnId: string;
	label: string;
	isDndShadowItem?: boolean;
};
