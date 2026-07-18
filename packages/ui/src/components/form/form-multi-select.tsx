import * as React from "react"
import { ChevronDown } from "lucide-react"
import type { FieldPath, FieldValues } from "react-hook-form"

import { cn } from "../../lib/utils"
import { Button } from "../button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "../dropdown-menu"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form-field"
import type { FormSelectOption } from "./form-select"

type FormMultiSelectProps<
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

function FormMultiSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  options,
  placeholder = "Select options",
  description,
  disabled,
  fieldClassName,
  triggerClassName,
  contentClassName,
}: FormMultiSelectProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      render={({ field }) => {
        const value = Array.isArray(field.value)
          ? (field.value as string[])
          : []
        const selectedOptions = options.filter((option) =>
          value.includes(option.value)
        )
        const selectedLabel =
          selectedOptions.length > 0
            ? selectedOptions.map((option) => option.label).join(", ")
            : placeholder

        return (
          <FormItem className={fieldClassName}>
            <FormLabel>{label}</FormLabel>
            <DropdownMenu>
              <FormControl>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-between font-normal",
                      selectedOptions.length === 0 && "text-muted-foreground",
                      triggerClassName
                    )}
                  >
                    <span className="truncate">{selectedLabel}</span>
                    <ChevronDown data-icon="inline-end" />
                  </Button>
                </DropdownMenuTrigger>
              </FormControl>
              <DropdownMenuContent className={cn("w-64", contentClassName)}>
                <DropdownMenuGroup>
                  {options.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      checked={value.includes(option.value)}
                      disabled={option.disabled}
                      onCheckedChange={(checked) => {
                        const nextValue = checked
                          ? [...value, option.value]
                          : value.filter((item) => item !== option.value)

                        field.onChange(nextValue)
                      }}
                      onSelect={(event) => event.preventDefault()}
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export { FormMultiSelect, type FormMultiSelectProps }
