'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from '@/hooks'
import { XMarkIcon } from '@heroicons/react/24/solid'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import cx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

const overlayMotion = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
}

const contentMotionVariants = {
  left: {
    initial: { x: '-100%', y: 0 },
    animate: { x: 0, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: {
      x: '-100%',
      y: 0,
      transition: { duration: 0.15, ease: 'easeIn' },
    },
  },
  right: {
    initial: { x: '100%', y: 0 },
    animate: { x: 0, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: {
      x: '100%',
      y: 0,
      transition: { duration: 0.15, ease: 'easeIn' },
    },
  },
}

export function DrawerHeader({ children }: { children?: React.ReactNode }) {
  return (
    <div className="px-5 py-3 ">
      <div className="text-lg font-semibold text-gray-800">{children}</div>
    </div>
  )
}

export function DrawerContent({ children }: { children?: React.ReactNode }) {
  return <div className="flex-1 overflow-auto px-5 py-2">{children}</div>
}

export function DrawerFooter({ children }: { children?: React.ReactNode }) {
  return <div className="flex justify-end space-x-3 px-5 py-3">{children}</div>
}
export function DrawerCloseButton() {
  return (
    <DialogPrimitive.Close asChild>
      <button
        className={cx(
          'absolute right-2 top-2 rounded p-0.5 text-gray-800 hover:bg-gray-200 active:bg-gray-300'
        )}
      >
        <XMarkIcon className="h-5 w-5"></XMarkIcon>
      </button>
    </DialogPrimitive.Close>
  )
}

type DrawerProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  placement?: 'left' | 'right'
  closeOnOverlayClick?: boolean
}

export function Drawer({
  open,
  onOpenChange,
  children,
  closeOnOverlayClick = true,
  placement = 'left',
  size = 'xs',
  ...props
}: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => {
    if (!closeOnOverlayClick) {
      return
    }
    onOpenChange?.(false)
  })

  //workaround for radix bug
  const [, forceRender] = useState(0)
  const containerRef = useRef<HTMLElement>()
  useEffect(() => {
    containerRef.current = document.body
    forceRender((prev) => prev + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DialogPrimitive.Root {...props} open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Portal forceMount container={containerRef.current}>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                variants={overlayMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                className="fixed inset-0 bg-black bg-opacity-50"
              ></motion.div>
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount>
              <div
                className={cx(
                  'fixed left-0 top-0 z-10 flex w-screen  justify-center overflow-y-auto'
                )}
              >
                <motion.div
                  ref={ref}
                  variants={contentMotionVariants[placement]}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={cx(
                    'fixed flex h-screen flex-col bg-white',
                    'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
                    {
                      'left-0': placement === 'left',
                      'right-0': placement === 'right',
                    },
                    {
                      'w-[20rem]': size === 'xs',
                      'w-[25rem]': size === 'sm',
                      'w-[30rem]': size === 'md',
                      'w-[35rem]': size === 'lg',
                      'w-[45rem]': size === 'xl',
                    }
                  )}
                >
                  {children}
                </motion.div>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
