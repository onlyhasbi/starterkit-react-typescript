import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { motion, AnimatePresence } from 'framer-motion'
import { useControllableState } from '@/hooks'
import cx from 'clsx'
const PopoverCtx = createContext()
function usePopover() {
  const context = useContext(PopoverCtx)
  if (context === undefined) {
    throw new Error('usePopover must be used within a PopoverCtx.Provider')
  }
  return context
}

export function PopoverTrigger({ children }) {
  return <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
}

export function PopoverRoot({
  children,
  open,
  onOpenChange,
  defaultOpen = false,
}) {
  const [_open, _setOpen] = useControllableState({
    value: open,
    onChange: onOpenChange,
    defaultValue: defaultOpen,
  })

  return (
    <PopoverCtx.Provider value={{ open: _open, setOpen: _setOpen }}>
      <PopoverPrimitive.Root
        open={_open}
        defaultOpen={_open}
        onOpenChange={(value) => _setOpen(value)}
      >
        {children}
      </PopoverPrimitive.Root>
    </PopoverCtx.Provider>
  )
}

export function PopoverArrow() {
  return (
    <PopoverPrimitive.Arrow asChild>
      <div className="relative h-[4px] w-[13px]">
        <div
          className={cx(
            'absolute h-2 w-2 rotate-45',
            'left-0 right-0 ml-auto mr-auto',
            'top-[-3.5px] bg-white shadow-md',
            'border-r border-b border-black border-opacity-[0.15]',
          )}
        ></div>
      </div>
    </PopoverPrimitive.Arrow>
  )
}

export function PopoverContent({
  children,
  side = 'bottom',
  align = 'center',
}) {
  const { open } = usePopover()

  //workaround for radix bug
  const [, forceRender] = useState(0)
  const containerRef = useRef(0)
  useEffect(() => {
    containerRef.current = document.body
    forceRender((prev) => prev + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence>
      {open ? (
        <PopoverPrimitive.Portal forceMount container={containerRef.current}>
          <PopoverPrimitive.Content
            side={side}
            align={align}
            asChild
            forceMount
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.15, ease: 'easeOut' },
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
                transition: { duration: 0.1, ease: 'easeIn' },
              }}
              className="rounded bg-white p-3 shadow ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {children}
            </motion.div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  )
}
