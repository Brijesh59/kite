import * as React from "react"
import type { FieldPath, FieldValues } from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form-field"

type FormSelectOption = {
  label: React.ReactNode
  value: string
  disabled?: boolean
}

type FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
  label: React.ReactNode
  options: FormSelectOption[]
  placeholder?: string
  description?: React.ReactNode
  disabled?: boolean
  fieldClassName?: string
  triggerClassName?: string
  contentClassName?: string
}

function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  options,
  placeholder,
  description,
  disabled,
  fieldClassName,
  triggerClassName,
  contentClassName,
}: FormSelectProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={fieldClassName}>
          <FormLabel>{label}</FormLabel>
          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={contentClassName}>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { FormSelect, type FormSelectOption, type FormSelectProps }
