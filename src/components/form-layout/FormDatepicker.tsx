
import { SingleDatePicker, type SingleDatePickerProps } from "../form/datepicker";
import { useFormLayout } from "./FormLayout";
import dayjs from "dayjs";

type FormSingleDatePickerProps = { fieldId?: string } & SingleDatePickerProps;

export const FormSingleDatePicker = ({ fieldId, ...rest }: FormSingleDatePickerProps) => {
  const {
    form: {
      form: [val],
      error: [err],
      validateField,
    },
  } = useFormLayout();

  const date = fieldId && dayjs.isDayjs(fieldId) && ((val as any)[fieldId] as dayjs.Dayjs).toDate();

  return (
    <SingleDatePicker
      date={date || undefined}
      error={fieldId && err[fieldId]}
      onDateChange={fieldId ? ((d) => validateField({ [fieldId]: dayjs(d) })) : undefined}
      {...rest}
    />
  );
};
