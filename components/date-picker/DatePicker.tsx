'use client'

import React, { useEffect, useState } from 'react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { DateValue } from '@internationalized/date'
import cx from 'clsx'
import { AnimatePresence } from 'framer-motion'
import { AriaDatePickerProps, I18nProvider, useDatePicker } from 'react-aria'
import { useDatePickerState } from 'react-stately'

import { FieldButton } from './Button'
import { Calendar } from './Calendar'
import { DateField } from './DateField'
import { Dialog } from './Dialog'
import { Popover } from './Popover'

export function DatePicker(
  props: AriaDatePickerProps<DateValue> & {
    error?: boolean
    required?: boolean
    locale?: string
  }
) {
  const state = useDatePickerState(props)
  const ref = React.useRef(null)
  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker(props, state, ref)

  const allError = state.validationState === 'invalid' || props.error

  //this is hack for framer motion
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    setIsOpen(state.isOpen)
  }, [state.isOpen])

  return (
    <I18nProvider locale={props.locale}>
      <div className="relative flex w-full flex-col text-left">
        {props.label ? (
          <div
            {...labelProps}
            className="mb-2 block font-medium leading-none text-gray-700"
          >
            {props.label}
            {props.required ? (
              <span className="ml-1 text-danger-500">*</span>
            ) : null}
          </div>
        ) : null}
        <div
          {...groupProps}
          ref={ref}
          className={cx(
            'flex items-center justify-center rounded border pr-1',
            'h-10',
            'focus-within:ring-2  focus-within:ring-opacity-25',
            {
              'cursor-not-allowed bg-gray-100 opacity-75': props.isDisabled,
            },
            {
              'border-gray-300': !allError,
              'border-danger-500': allError,
            },
            {
              'focus-within:border-danger-500 focus-within:ring-danger-500':
                allError,
              'focus-within:border-primary-500 focus-within:ring-primary-500':
                !allError,
            }
          )}
        >
          <div className="flex-1 px-2">
            <DateField {...fieldProps} />
          </div>
          <FieldButton isDisabled={props.isDisabled} {...buttonProps}>
            <CalendarIcon className="h-4 w-4 text-gray-800"></CalendarIcon>
          </FieldButton>
        </div>
        <AnimatePresence>
          {isOpen && (
            <Popover state={state} triggerRef={ref} placement="bottom start">
              <Dialog {...dialogProps}>
                <Calendar {...calendarProps} />
              </Dialog>
            </Popover>
          )}
        </AnimatePresence>
      </div>
    </I18nProvider>
  )
}
