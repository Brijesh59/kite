import * as React from "react"
import {
  FormProvider,
  type FieldPath,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form"

import { cn } from "../../lib/utils"
import { FormCheckbox, type FormCheckboxProps } from "./form-checkbox"
import { FormDatePicker, type FormDatePickerProps } from "./form-date-picker"
import { FormInput, type FormInputProps } from "./form-input"
import {
  FormMultiSelect,
  type FormMultiSelectProps,
} from "./form-multi-select"
import {
  FormRadioGroup,
  type FormRadioGroupProps,
} from "./form-radio-group"
import { FormSelect, type FormSelectProps } from "./form-select"
import { FormTextarea, type FormTextareaProps } from "./form-textarea"

type RichFormProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  React.ComponentProps<"form">,
  "children" | "onSubmit"
> & {
  form: UseFormReturn<TFieldValues>
  onSubmit: SubmitHandler<TFieldValues>
  children?:
    | React.ReactNode
    | ((components: FormRenderProps<TFieldValues>) => React.ReactNode)
}

type FormProps<TFieldValues extends FieldValues = FieldValues> =
  | RichFormProps<TFieldValues>
  | React.ComponentProps<typeof FormProvider>

type FormInputComponent<TFieldValues extends FieldValues> = <
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FormInputProps<TFieldValues, TName>
) => React.ReactElement | null

type FormTextareaComponent<TFieldValues extends FieldValues> = <
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FormTextareaProps<TFieldValues, TName>
) => React.ReactElement | null

type FormSelectComponent<TFieldValues extends FieldValues> = <
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FormSelectProps<TFieldValues, TName>
) => React.ReactElement | null

type FormMultiSelectComponent<TFieldValues extends FieldValues> = <
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FormMultiSelectProps<TFieldValues, TName>
) => React.ReactElement | null

type FormRadioGroupComponent<TFieldValues extends FieldValues> = <
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FormRadioGroupProps<TFieldValues, TName>
) => React.ReactElement | null

type FormCheckboxComponent<TFieldValues extends FieldValues> = <
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FormCheckboxProps<TFieldValues, TName>
) => React.ReactElement | null

type FormDatePickerComponent<TFieldValues extends FieldValues> = <
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FormDatePickerProps<TFieldValues, TName>
) => React.ReactElement | null

type FormRenderProps<TFieldValues extends FieldValues> = {
  FormInput: FormInputComponent<TFieldValues>
  FormTextarea: FormTextareaComponent<TFieldValues>
  FormSelect: FormSelectComponent<TFieldValues>
  FormMultiSelect: FormMultiSelectComponent<TFieldValues>
  FormRadioGroup: FormRadioGroupComponent<TFieldValues>
  FormCheckbox: FormCheckboxComponent<TFieldValues>
  FormDatePicker: FormDatePickerComponent<TFieldValues>
}

function Form<TFieldValues extends FieldValues = FieldValues>(
  props: FormProps<TFieldValues>
) {
  if ("form" in props) {
    const { form, onSubmit, className, children, ...formProps } = props
    const components = {
      FormInput: FormInput as FormInputComponent<TFieldValues>,
      FormTextarea: FormTextarea as FormTextareaComponent<TFieldValues>,
      FormSelect: FormSelect as FormSelectComponent<TFieldValues>,
      FormMultiSelect:
        FormMultiSelect as FormMultiSelectComponent<TFieldValues>,
      FormRadioGroup: FormRadioGroup as FormRadioGroupComponent<TFieldValues>,
      FormCheckbox: FormCheckbox as FormCheckboxComponent<TFieldValues>,
      FormDatePicker: FormDatePicker as FormDatePickerComponent<TFieldValues>,
    }

    return (
      <FormProvider {...form}>
        <form
          className={cn("flex flex-col gap-4", className)}
          onSubmit={form.handleSubmit(onSubmit)}
          {...formProps}
        >
          {typeof children === "function" ? children(components) : children}
        </form>
      </FormProvider>
    )
  }

  return <FormProvider {...props} />
}

export { Form, type FormProps, type FormRenderProps }
