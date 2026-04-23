import { useMemo, type Dispatch } from "react"

import { Button } from "./button"
import { Select } from "./select"
import { hstack } from "../../styles/stack"
import { type ClassNameProp } from "../../types/base-props"
import { clamp } from "../../utils/clamp"
import { cn } from "../../utils/cn"
import { ErrorBoundary } from "../utility/error-boundary"

interface PageSizeSelectProps {
  pageSizes: number[]
  value: number
  onPageSizeChange?: Dispatch<number>
}
const PageSizeSelect = ({
  pageSizes,
  value,
  onPageSizeChange,
}: PageSizeSelectProps) => (
  <Select.Root
    value={String(value)}
    // TODO: Translate caption
    placeholder="Size"
    onChange={value => onPageSizeChange?.(Number(value))}
  >
    {pageSizes.map(size => (
      <Select.Option key={size} value={String(size)} />
    ))}
  </Select.Root>
)

interface PaginationButtonsProps {
  page: number
  numberOfPages: number
  onPageChange?: Dispatch<number>
}
const PaginationButtons = ({
  numberOfPages,
  page,
  onPageChange,
}: PaginationButtonsProps) => {
  const buttons =
    numberOfPages < 5
      ? Array.from({ length: numberOfPages }, (_, index) => index)
      : Array.from({ length: 5 }, (_, index) => {
          const min = clamp(page - 2, 0, numberOfPages - 5)
          return min + index
        })

  const ellipsis = (
    <span className="inline-grid w-8 place-content-center font-bold text-text-muted before:content-['...']" />
  )

  const firstPage = 0
  const lastPage = numberOfPages - 1

  const getButton = (pageIndex: number) => (
    <Button
      key={pageIndex}
      active={page === pageIndex}
      onClick={() => onPageChange?.(pageIndex)}
      className="w-10 p-0"
    >
      {pageIndex + 1}
    </Button>
  )

  if (buttons.length <= 1) return <>{getButton(0)}</>

  return (
    <>
      {!buttons.includes(firstPage) && (
        <>
          {getButton(firstPage)}
          {buttons.at(0) !== firstPage + 1 && ellipsis}
        </>
      )}
      {buttons.map(getButton)}
      {!buttons.includes(lastPage) && (
        <>
          {buttons.at(-1) !== lastPage - 1 && ellipsis}
          {getButton(lastPage)}
        </>
      )}
    </>
  )
}

const getNumberOfPages = (items: number, size: number) => {
  let pages = Math.floor(items / size)
  if (items % size === 0) pages--
  return pages + 1
}

export interface PaginationProps extends ClassNameProp {
  page: number
  pageSize: number
  pageSizeOptions?: [number, ...number[]]
  items: number
  onPageChange?: Dispatch<number>
  onPageSizeChange?: Dispatch<number>
}

export const Pagination = ({
  page,
  pageSize,
  pageSizeOptions,
  items,
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) => {
  const numberOfPages = getNumberOfPages(items, pageSize)

  return (
    <ErrorBoundary>
      <div className={cn(hstack({ align: "center" }), className)}>
        <PaginationButtons
          numberOfPages={numberOfPages}
          page={page}
          onPageChange={onPageChange}
        />

        {pageSizeOptions && (
          <>
            <div className="flex-1" />
            <span className="mr-2">
              {/* TODO: Translate caption */}
              Page size:
            </span>
            <PageSizeSelect
              pageSizes={pageSizeOptions}
              value={pageSize}
              onPageSizeChange={pageSize => {
                onPageChange?.(0)
                onPageSizeChange?.(pageSize)
              }}
            />
          </>
        )}
      </div>
    </ErrorBoundary>
  )
}

export const usePaginatedItems = <T,>(
  items: T[],
  page: number,
  pageSize: number
) => {
  const start = page * pageSize
  const end = start + pageSize
  return useMemo(() => items.slice(start, end), [items, start, end])
}
