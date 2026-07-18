import * as React from "react"
import type { FieldPath, FieldValues } from "react-hook-form"

import { Textarea } from "../textarea"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form-field"

type FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<React.ComponentProps<typeof Textarea>, "name"> & {
  name: TName
  label: React.ReactNode
  description?: React.ReactNode
  fieldClassName?: string
  textareaClassName?: string
}

function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  fieldClassName,
  textareaClassName,
  ...textareaProps
}: FormTextareaProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={fieldClassName}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              {...textareaProps}
              {...field}
              className={textareaClassName}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { FormTextarea, type FormTextareaProps }
