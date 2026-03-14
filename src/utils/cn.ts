import { twJoin, ClassNameValue, twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassNameValue[]) => twMerge(twJoin(inputs))
