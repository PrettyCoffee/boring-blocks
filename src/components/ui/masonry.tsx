import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react"

import { css } from "goober"

import { useThrottle } from "../../hooks/use-throttle"
import { type ClassNameProp } from "../../types/base-props"
import { cn } from "../../utils/cn"

const COLUMN_WIDTH = "--masonry-column-width" as string
const MASONRY_TRANSITION = "--masonry-transition-duration" as string

const getNumberOfColumns = (
  gridWidth: number,
  minColumnWidth: number,
  gap: number
) => {
  const numberOfColumns = Math.floor(gridWidth / minColumnWidth)
  const minUsedWidth =
    numberOfColumns * minColumnWidth + (numberOfColumns - 1) * gap
  return minUsedWidth <= gridWidth ? numberOfColumns : numberOfColumns - 1
}

const getColumnWidth = (
  grid: HTMLElement,
  minColumnWidth: number,
  gap: number
) => {
  const gridWidth = grid.clientWidth
  const numberOfColumns = getNumberOfColumns(gridWidth, minColumnWidth, gap)
  return (gridWidth - (numberOfColumns - 1) * gap) / numberOfColumns
}

interface BoxPosition {
  top: number
  left: number
  height: number
  width: number
  element: HTMLElement
}

const getSmallestColumn = (columns: BoxPosition[][]) => {
  const currentHeights = columns.map((column: BoxPosition[]) => {
    const current = column.at(-1)
    return !current ? 0 : current.top + current.height
  })

  const minHeight = Math.min(...currentHeights)
  const smallestIndex = currentHeights.indexOf(minHeight)
  return { index: smallestIndex, height: minHeight }
}

const getLargestColumn = (columns: BoxPosition[][]) => {
  const currentHeights = columns.map((column: BoxPosition[]) => {
    const current = column.at(-1)
    return !current ? 0 : current.top + current.height
  })

  const maxHeight = Math.max(...currentHeights)
  const largestIndex = currentHeights.indexOf(maxHeight)
  return { index: largestIndex, height: maxHeight }
}

const getChildrenColumns = (
  grid: HTMLElement,
  columnWidth: number,
  gap: number
) => {
  const gridWidth = grid.scrollWidth
  const numberOfColumns = Math.floor(gridWidth / columnWidth)

  const columns = Array.from(
    { length: numberOfColumns },
    (): BoxPosition[] => []
  )

  const children = [...grid.children].filter(
    child => child instanceof HTMLElement
  )

  return children.reduce((columns, element) => {
    const smallest = getSmallestColumn(columns)
    const lastEntry = columns[smallest.index]?.at(-1)

    const top = !lastEntry ? 0 : lastEntry.top + lastEntry.height + gap
    const left = columnWidth * smallest.index + gap * smallest.index

    const box: BoxPosition = {
      element,
      top,
      left,
      height: element.offsetHeight,
      width: columnWidth,
    }

    columns[smallest.index]?.push(box)
    return columns
  }, columns)
}

interface MasonryGridProps {
  minColumnWidth: number
  gap?: number
  transitionDuration?: number
}

const gridClass = css`
  position: relative;
  width: 100%;
`
const MasonryGrid = ({
  children,
  minColumnWidth,
  gap = 0,
  transitionDuration = 200,
}: PropsWithChildren<MasonryGridProps>) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const throttle = useThrottle(1000 / 60)

  const [didMount, setDidMount] = useState(false)

  const updateGrid = useCallback(
    (grid: HTMLElement) =>
      throttle(() => {
        const columnWidth = getColumnWidth(grid, minColumnWidth, gap)
        grid.style.setProperty(COLUMN_WIDTH, `${columnWidth}px`)

        const columns = getChildrenColumns(grid, columnWidth, gap)
        columns.flat().forEach(({ element, left, top }) => {
          element.style.setProperty("translate", `${left}px ${top}px`)
        })

        const largest = getLargestColumn(columns)
        grid.style.setProperty("height", `${largest.height}px`)
      }),
    [gap, minColumnWidth, throttle]
  )

  useEffect(() => {
    if (!gridRef.current) return
    updateGrid(gridRef.current)
    // Only enable transitions after first render is flushed
    window.queueMicrotask(() => setDidMount(true))
  }, [updateGrid])

  useEffect(() => {
    if (!gridRef.current) return

    const observer = new ResizeObserver(() => {
      if (!gridRef.current) return
      updateGrid(gridRef.current)
    })
    observer.observe(gridRef.current)
    return () => {
      observer.disconnect()
    }
  }, [updateGrid])

  return (
    <div
      ref={gridRef}
      className={gridClass}
      style={{
        [MASONRY_TRANSITION]: !didMount ? "0ms" : `${transitionDuration}ms`,
      }}
    >
      {children}
    </div>
  )
}

const itemClass = css`
  position: absolute;
  top: 0;
  left: 0;
  height: max-content;
  width: var(${COLUMN_WIDTH});

  @media (prefers-reduced-motion: no-preference) {
    transition-duration: var(${MASONRY_TRANSITION});
    transition-timing-function: ease-out;
    transition-property: translate;
  }
`
const MasonryItem = ({
  className,
  children,
}: PropsWithChildren<ClassNameProp>) => (
  <div className={cn(itemClass, className)}>{children}</div>
)

export const Masonry = {
  Grid: MasonryGrid,
  Item: MasonryItem,
}
