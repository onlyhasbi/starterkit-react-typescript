'use client'

import React, { createContext, useContext } from 'react'
import {
  ArrowDownIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/solid'
import cx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

import { Spinner } from '@/components/spinner'

export type Direction = 'asc' | 'desc' | undefined
export type VerticalAlignment = 'top' | 'center' | 'bottom'

export type SortParams = {
  column?: string
  direction: Direction
}

type ProviderParams = {
  loading: boolean
  withColumnBorders: boolean
  striped: boolean
  hightlightOnHover: boolean
  stickyHeader: boolean
  empty: boolean
  sort?: SortParams
  onChangeSort?: (params: SortParams) => void
  verticalAlignment: VerticalAlignment
}

const TableCtx = createContext<ProviderParams>({
  loading: false,
  withColumnBorders: false,
  striped: false,
  hightlightOnHover: false,
  stickyHeader: false,
  empty: false,
  sort: {
    column: '',
    direction: 'asc',
  },
  verticalAlignment: 'top',
})

export function TableEmpty({ children }: { children: React.ReactNode }) {
  const { empty, loading } = useContext(TableCtx)
  return empty ? (
    <tbody>
      <tr>
        <td colSpan={999} className="h-96 w-full">
          {loading ? null : children}
        </td>
      </tr>
    </tbody>
  ) : null
}

type ThProps = React.ComponentProps<'th'> & {
  children: React.ReactNode
  className?: string
  columnKey?: string
  sortable?: boolean
}

export function Th({
  children,
  className,
  columnKey,
  sortable,
  ...props
}: ThProps) {
  const { withColumnBorders, stickyHeader, sort, onChangeSort } =
    useContext(TableCtx)

  if (sortable === true && columnKey === undefined) {
    throw new Error('columnKey must be provided when sortable is true')
  }

  function toggleSort() {
    if (!sortable || !columnKey) {
      return
    }

    const currentDirection = sort?.direction

    let nextDirection: Direction = undefined
    if (currentDirection === 'asc') {
      nextDirection = 'desc'
    }

    if (currentDirection === 'desc') {
      nextDirection = undefined
    }

    if (!currentDirection) {
      nextDirection = 'asc'
    }
    onChangeSort?.({
      column: nextDirection ? columnKey : undefined,
      direction: nextDirection,
    })
  }

  return (
    <th
      {...props}
      className={cx(
        'px-2 py-3',
        'bg-white ',
        'text-left text-sm font-medium text-gray-700',
        'border-b border-gray-300',
        {
          '[&:not(:last-child)]:border-r': withColumnBorders,
          'sticky top-0': stickyHeader,
        },
        {
          'cursor-pointer hover:bg-gray-50': sortable,
        },
        className
      )}
      onClick={toggleSort}
    >
      <div className="flex items-center justify-between space-x-3">
        <div className="w-full">{children}</div>
        {sortable ? (
          <div>
            {sort?.column !== columnKey ? (
              <ArrowsUpDownIcon className="h-3.5 w-3.5 text-gray-400"></ArrowsUpDownIcon>
            ) : null}

            {sort?.column === columnKey && sort?.direction === 'asc' ? (
              <ArrowUpIcon className="h-3.5 w-3.5"></ArrowUpIcon>
            ) : null}

            {sort?.column === columnKey && sort?.direction === 'desc' ? (
              <ArrowDownIcon className="h-3.5 w-3.5"></ArrowDownIcon>
            ) : null}
          </div>
        ) : null}
      </div>
    </th>
  )
}

export function Td(props: React.ComponentProps<'td'>) {
  const { withColumnBorders, verticalAlignment } = useContext(TableCtx)
  return (
    <td
      {...props}
      className={cx(
        'px-2 py-3',
        'text-left text-gray-800',
        'border-t border-gray-300 group-[:first-of-type]:border-t-0 ',
        //selected style
        'group-data-[selected=true]:border-y-2 group-data-[selected=true]:border-y-primary-500',
        'group-data-[selected=true]:last:border-r-2 group-data-[selected=true]:last:border-r-primary-500',
        'group-data-[selected=true]:first:border-l-2 group-data-[selected=true]:first:border-l-primary-500',

        {
          '[&:not(:last-child)]:border-r': withColumnBorders,
          'align-top': verticalAlignment === 'top',
          'align-middle': verticalAlignment === 'center',
          'align-bottom': verticalAlignment === 'bottom',
        }
      )}
    >
      {props.children}
    </td>
  )
}

type TrProps = React.ComponentProps<'tr'> & { selected?: boolean }
export function Tr({ children, selected, ...props }: TrProps) {
  const { striped, hightlightOnHover } = useContext(TableCtx)
  return (
    <tr
      {...props}
      data-selected={selected}
      className={cx('group hover:cursor-default', {
        'hover:bg-blue-50': hightlightOnHover,
        'odd:bg-gray-100': striped,
        'bg-primary-50': selected,
      })}
    >
      {children}
    </tr>
  )
}

function Loading({ show }: { show?: boolean }) {
  return (
    <AnimatePresence>
      {show ? (
        <div className="absolute inset-0 flex justify-center">
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 0.4,
              transition: { duration: 0.2, ease: 'easeOut' },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, ease: 'easeIn' },
            }}
            className={cx(
              'absolute inset-0',
              'bg-white',
              'flex h-full w-full justify-center'
            )}
          ></motion.div>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: { duration: 0.2, ease: 'easeOut' },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, ease: 'easeIn' },
            }}
            className="z-10 my-auto h-8 w-8 text-primary-500  opacity-100"
          >
            <Spinner></Spinner>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

export function Thead(props: React.ComponentProps<'thead'>) {
  const currentCtxValue = useContext(TableCtx)
  return (
    <TableCtx.Provider
      value={{
        ...currentCtxValue,
        // th inside thead always striped = false and highlightOnHover = false
        striped: false,
        hightlightOnHover: false,
      }}
    >
      <thead {...props}>{props.children}</thead>
    </TableCtx.Provider>
  )
}

export function Tbody(props: React.ComponentProps<'tbody'>) {
  const { empty } = useContext(TableCtx)
  if (empty) {
    return null
  }
  return <tbody {...props}>{props.children}</tbody>
}

type TableProos = {
  withBorder?: boolean
  children?: React.ReactNode
  loading?: boolean
  withColumnBorders?: boolean
  striped?: boolean
  hightlightOnHover?: boolean
  stickyHeader?: boolean
  empty?: boolean
  overflowXAuto?: boolean
  layout?: 'fixed' | 'auto'
  sort?: SortParams
  onChangeSort?: (params: SortParams) => void
  verticalAlignment?: VerticalAlignment
}

export function Table({
  withBorder = false,
  children,
  loading = false,
  withColumnBorders = false,
  striped = false,
  hightlightOnHover = false,
  stickyHeader = false,
  empty = false,
  overflowXAuto = true,
  layout = 'auto',
  sort,
  onChangeSort,
  verticalAlignment = 'top',
}: TableProos) {
  if (stickyHeader && overflowXAuto) {
    throw new Error(
      'stickyHeader and overflowXAuto cannot be true at the same time'
    )
  }

  return (
    <TableCtx.Provider
      value={{
        loading,
        withColumnBorders,
        striped,
        hightlightOnHover,
        stickyHeader,
        empty,
        sort,
        onChangeSort,
        verticalAlignment,
      }}
    >
      <div className="relative w-full">
        <div
          className={cx('relative w-full', {
            'overflow-x-auto': overflowXAuto,
          })}
        >
          <table
            className={cx('relative  w-full tabular-nums', 'border-spacing-0', {
              'border border-gray-300 ': withBorder,
              'border-opacity-0': !withBorder,
              'table-fixed': layout === 'fixed',
              'table-layout': layout === 'auto',
            })}
          >
            {children}
          </table>
        </div>

        <Loading show={loading}></Loading>
      </div>
    </TableCtx.Provider>
  )
}

export function useTableSort({ column = '', direction = 'asc' }: SortParams) {
  const [sort, setSort] = React.useState<SortParams>({
    column,
    direction,
  })

  function handleChangeSort(value: SortParams) {
    setSort(value)
  }

  return { sort, handleChangeSort }
}
