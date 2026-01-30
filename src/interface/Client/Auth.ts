export interface IPostRegisterData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface IPostLogin {
	email: string;
	password: string;
}

export interface IPostVerifyMail {
	token: string;
	type: "customer" | "maker";
}
