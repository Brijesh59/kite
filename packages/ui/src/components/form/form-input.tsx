import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import type { FieldPath, FieldValues } from "react-hook-form"

import { cn } from "../../lib/utils"
import { Button } from "../button"
import { Input } from "../input"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form-field"

type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<React.ComponentProps<typeof Input>, "name"> & {
  name: TName
  label: React.ReactNode
  description?: React.ReactNode
  fieldClassName?: string
  inputClassName?: string
  showPasswordToggle?: boolean
}

function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  fieldClassName,
  inputClassName,
  showPasswordToggle = false,
  type,
  ...inputProps
}: FormInputProps<TFieldValues, TName>) {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const inputType = showPasswordToggle
    ? isPasswordVisible
      ? "text"
      : "password"
    : type

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={fieldClassName}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className={cn(showPasswordToggle && "relative")}>
              <Input
                {...inputProps}
                {...field}
                type={inputType}
                className={cn(showPasswordToggle && "pr-10", inputClassName)}
              />
              {showPasswordToggle && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                >
                  {isPasswordVisible ? (
                    <EyeOff data-icon="inline-start" />
                  ) : (
                    <Eye data-icon="inline-start" />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { FormInput, type FormInputProps }
