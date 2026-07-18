import * as React from "react"
import type { FieldPath, FieldValues } from "react-hook-form"

import { cn } from "../../lib/utils"
import { Checkbox } from "../checkbox"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form-field"

type FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<React.ComponentProps<typeof Checkbox>, "checked" | "name"> & {
  name: TName
  label: React.ReactNode
  description?: React.ReactNode
  fieldClassName?: string
  checkboxClassName?: string
}

function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  fieldClassName,
  checkboxClassName,
  ...checkboxProps
}: FormCheckboxProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn("gap-3", fieldClassName)}>
          <div className="flex items-start gap-3">
            <FormControl>
              <Checkbox
                {...checkboxProps}
                checked={Boolean(field.value)}
                onCheckedChange={field.onChange}
                className={checkboxClassName}
              />
            </FormControl>
            <div className="grid gap-1.5 leading-none">
              <FormLabel>{label}</FormLabel>
              {description && <FormDescription>{description}</FormDescription>}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { FormCheckbox, type FormCheckboxProps }
