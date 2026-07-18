import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { FieldPath, FieldValues } from "react-hook-form"

import { cn } from "../../lib/utils"
import { Button } from "../button"
import { Calendar } from "../calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form-field"

type FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
  label: React.ReactNode
  placeholder?: string
  description?: React.ReactNode
  disabled?: boolean
  dateFormat?: string
  fieldClassName?: string
  triggerClassName?: string
  popoverClassName?: string
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    "mode" | "onSelect" | "selected"
  >
}

function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  placeholder = "Pick a date",
  description,
  disabled,
  dateFormat = "PPP",
  fieldClassName,
  triggerClassName,
  popoverClassName,
  calendarProps,
}: FormDatePickerProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      render={({ field }) => {
        const fieldValue = field.value as unknown
        const selectedDate =
          fieldValue instanceof Date ? fieldValue : undefined

        return (
          <FormItem className={fieldClassName}>
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                      triggerClassName
                    )}
                  >
                    <CalendarIcon data-icon="inline-start" />
                    {selectedDate ? format(selectedDate, dateFormat) : placeholder}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className={cn("w-auto p-0", popoverClassName)}>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={field.onChange}
                  autoFocus
                  {...calendarProps}
                />
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export { FormDatePicker, type FormDatePickerProps }
