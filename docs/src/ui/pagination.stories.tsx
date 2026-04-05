import { useEffect, useMemo, useState } from "react"

import { type StoryObj, type Meta } from "@storybook/react-vite"
import {
  Button,
  Pagination,
  TextInput,
  usePaginatedItems,
  type PaginationProps,
} from "boring-blocks"
import * as boringBlocks from "boring-blocks"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Buttons/Pagination",
  component: Pagination,
  argTypes: {
    items: argType.number(),
    page: argType.number(),
    pageSize: argType.number(),
    pageSizeOptions: argType.disabled(),
    onPageChange: argType.callback(),
    onPageSizeChange: argType.callback(),
  },
  args: {
    items: 200,
    page: 5,
    pageSize: 15,
  },
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

const ControlledStory = ({
  page: initialPage,
  pageSize: initialPageSize,
  ...props
}: PaginationProps) => {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync when args are changes via controls
    setPage(initialPage)
    setPageSize(initialPageSize)
  }, [initialPage, initialPageSize])

  return (
    <Pagination
      {...props}
      page={page}
      pageSize={pageSize}
      onPageChange={page => {
        setPage(page)
        props.onPageChange?.(page)
      }}
      onPageSizeChange={pageSize => {
        setPageSize(pageSize)
        props.onPageSizeChange?.(pageSize)
      }}
    />
  )
}

export const Default: Story = { render: ControlledStory }
export const SelectablePageSizes: Story = {
  args: { pageSizeOptions: [10, 15, 25, 40] },
  render: ControlledStory,
}

const allExports = Object.keys(boringBlocks)
const ExportsPagination = ({
  page: initialPage,
  pageSize: initialPageSize,
  ...props
}: PaginationProps) => {
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync when args are changes via controls
    setPage(initialPage)
    setPageSize(initialPageSize)
  }, [initialPage, initialPageSize])

  const filteredItems = useMemo(
    () =>
      allExports.filter(name => {
        const terms = filter
          .replaceAll(/([A-Z])/g, " $1")
          .split(/\s+/)
          .filter(Boolean)

        return (
          terms.length === 0 ||
          terms.some(term => name.toLowerCase().includes(term.toLowerCase()))
        )
      }),
    [filter]
  )
  const visibleItems = usePaginatedItems(filteredItems, page, pageSize)

  return (
    <>
      <TextInput
        type="search"
        placeholder="Search in exports"
        value={filter}
        onChange={setFilter}
      />

      <ul className="my-4 pl-8">
        {visibleItems.map(name => (
          <li key={name} className="list-disc">
            <Button size="sm" onClick={() => setFilter(name)}>
              {name}
            </Button>
          </li>
        ))}
      </ul>

      <Pagination
        {...props}
        items={filteredItems.length}
        page={page}
        pageSize={pageSize}
        onPageChange={page => {
          setPage(page)
          props.onPageChange?.(page)
        }}
        onPageSizeChange={pageSize => {
          setPageSize(pageSize)
          props.onPageSizeChange?.(pageSize)
        }}
      />
    </>
  )
}
export const PaginatedExample: Story = {
  args: { page: 0, pageSize: 5, pageSizeOptions: [5, 10, 15] },
  render: ExportsPagination,
}
