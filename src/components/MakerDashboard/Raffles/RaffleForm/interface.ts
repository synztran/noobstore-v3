import { FormikErrors, FormikTouched } from "formik";
import { IRaffleFormValues } from ".";

export interface ISectionProps {
	values: IRaffleFormValues;
	errors: FormikErrors<IRaffleFormValues>;
	touched: FormikTouched<IRaffleFormValues>;
	handleChange: (e: React.ChangeEvent<any>) => void;
	handleBlur: (e: React.FocusEvent<any>) => void;
	setFieldValue: (field: string, value: any) => void;
}
