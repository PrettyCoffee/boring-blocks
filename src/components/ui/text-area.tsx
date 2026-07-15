import { InputBorder } from "./fragments/input-border"
import { cn } from "../../index-utils"
import {
  TextAreaPrimitive,
  type TextAreaPrimitiveProps,
} from "../primitive/text-area-primitive"

export type TextAreaProps = Pick<
  TextAreaPrimitiveProps,
  | "ref"
  | "autoGrow"
  | "value"
  | "onChange"
  | "onKeyDown"
  | "onKeyUp"
  | "onFocus"
  | "onBlur"
  | "placeholder"
  | "disabled"
  | "className"
  | "style"
>

export const TextArea = ({ className, ...props }: TextAreaPrimitiveProps) => (
  <InputBorder className={cn("h-max w-full", className)}>
    <TextAreaPrimitive
      {...props}
      className="w-full bg-transparent px-3 py-2 text-sm text-text outline-none placeholder:text-text-gentle"
    />
  </InputBorder>
)
