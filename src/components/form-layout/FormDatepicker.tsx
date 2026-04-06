import { SingleDatePicker, type SingleDatePickerProps } from "../ui/datepicker";
import { useFormLayout } from "./FormLayout";
import dayjs from "dayjs";

type FormSingleDatePickerProps = { fieldId?: string; ignoreError?: boolean } & SingleDatePickerProps;

export const FormSingleDatePicker = ({ fieldId, ignoreError,...rest }: FormSingleDatePickerProps) => {
  const {
    form: {
      form: [val],
      error: [err],
      updateField,
    },
  } = useFormLayout();

  const date = fieldId && dayjs.isDayjs(fieldId) && ((val as any)[fieldId] as dayjs.Dayjs).toDate();

  return (
    <SingleDatePicker
      date={date || undefined}
      error={fieldId && err[fieldId]}
      onDateChange={!ignoreError && fieldId ? (d) => updateField(fieldId as any, dayjs(d)) : undefined}
      {...rest}
    />
  );
};
