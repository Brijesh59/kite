import * as React from "react"
import type { FieldPath, FieldValues } from "react-hook-form"

import { cn } from "../../lib/utils"
import { Label } from "../label"
import { RadioGroup, RadioGroupItem } from "../radio-group"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form-field"
import type { FormSelectOption } from "./form-select"

type FormRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
  label: React.ReactNode
  options: FormSelectOption[]
  description?: React.ReactNode
  disabled?: boolean
  fieldClassName?: string
  radioGroupClassName?: string
  optionClassName?: string
}

function FormRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  options,
  description,
  disabled,
  fieldClassName,
  radioGroupClassName,
  optionClassName,
}: FormRadioGroupProps<TFieldValues, TName>) {
  const id = React.useId()

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={fieldClassName}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={disabled}
              className={cn("flex flex-wrap gap-3", radioGroupClassName)}
            >
              {options.map((option) => {
                const optionId = `${id}-${option.value}`
                const isChecked = field.value === option.value

                return (
                  <div
                    key={option.value}
                    data-slot="form-radio-option"
                    data-checked={isChecked}
                    data-disabled={disabled || option.disabled}
                    className={optionClassName}
                  >
                    <RadioGroupItem
                      id={optionId}
                      value={option.value}
                      disabled={option.disabled}
                    />
                    <Label
                      htmlFor={optionId}
                      className="flex-1 cursor-pointer text-sm font-medium"
                    >
                      {option.label}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { FormRadioGroup, type FormRadioGroupProps }
