import {
  type ChangeEvent,
  type DragEvent,
  useId,
  type PropsWithChildren,
} from "react"

import { cn } from "../../index-utils"
import { type ClassNameProp } from "../../types/base-props"

type DragOrChangeEvent =
  | DragEvent<HTMLLabelElement>
  | ChangeEvent<HTMLInputElement>

export namespace FileInputPrimitive {
  export type InputFile = { isValidType: boolean } & File

  type HandleFileChange<TFiles extends InputFile[]> = (
    files: TFiles,
    event: DragOrChangeEvent
  ) => void

  export type Props = ClassNameProp & {
    accept?: string
    multiple?: boolean
    onChange?: HandleFileChange<[InputFile, ...InputFile[]]>
    onDragStart?: HandleFileChange<InputFile[]>
    onDragEnd?: HandleFileChange<InputFile[]>
  }
}

const getFiles = (event: DragOrChangeEvent) => {
  let files: File[] = []
  if ("dataTransfer" in event) {
    files = [...event.dataTransfer.files]
    if (files.length > 0) return files

    files = [...event.dataTransfer.items].flatMap(
      item => item.getAsFile() ?? []
    )
    if (files.length > 0) return files

    files = [...event.dataTransfer.items].flatMap(item =>
      !item.type ? [] : new File([], "", { type: item.type })
    )
    if (files.length > 0) return files
  }

  if ("files" in event.currentTarget) {
    files = [...(event.currentTarget.files ?? [])]
    if (files.length > 0) return files
  }

  return []
}

const isValidFileType = (file?: File, accept?: string) => {
  if (!accept || !file) return true

  const types = accept
    .split(",")
    .map(type => type.trim().toLowerCase())
    .filter(Boolean)

  const fileName = file.name.toLowerCase()
  const mimeType = (file.type || "").toLowerCase()

  return types.some(type => {
    const isExtension = type.startsWith(".")
    if (isExtension) {
      return fileName.endsWith(type)
    }

    const wildcard = /[/][*]$/
    if (wildcard.test(type)) {
      const base = type.replace(wildcard, "/")
      return mimeType.startsWith(base)
    }

    return mimeType === type
  })
}

const extendFiles = (
  files: File[],
  accept: string | undefined,
  multiple: boolean | undefined
) =>
  (multiple ? files : files.slice(0, 1)).map(file => {
    const isValidType = isValidFileType(file, accept)
    return Object.assign(file, { isValidType })
  }) as [FileInputPrimitive.InputFile, ...FileInputPrimitive.InputFile[]]

export const FileInputPrimitive = ({
  accept,
  multiple = false,
  onChange,
  onDragStart,
  onDragEnd,
  className,
  children,
  ...props
}: PropsWithChildren<FileInputPrimitive.Props>) => {
  const id = useId()

  const getExtendedFiles = (event: DragOrChangeEvent) =>
    extendFiles(getFiles(event), accept, multiple)

  const handleDragStart = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    onDragStart?.(getExtendedFiles(event), event)
  }

  const handleDragEnd = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    onDragEnd?.(getExtendedFiles(event), event)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    const files = getExtendedFiles(event)
    onDragEnd?.(files, event)
    if (files.length === 0 || files.some(file => !file.isValidType)) return
    onChange?.(files, event)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = getExtendedFiles(event)
    if (files.length === 0) return
    onChange?.(files, event)
  }

  return (
    <label
      {...props}
      htmlFor={id}
      className={cn("**:pointer-events-none", className)}
      onDragEnter={handleDragStart}
      onDragOver={event => event.preventDefault()}
      onDragLeave={handleDragEnd}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        id={id}
        className="sr-only"
        onChange={handleChange}
      />
      {children}
    </label>
  )
}
