import React, { createContext, useContext, useEffect, useState } from "react"

interface SidebarContextType {
  isOpen: boolean
  setOpen: (open: boolean) => Promise<void>
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarContextProvider")
  }
  return context
}

export function SidebarContextProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Only fetch the initial state once
    if (!isInitialized) {
      window.sidebar.getState().then((state) => {
        setIsOpen(state)
        setIsInitialized(true)
      })
    }
  }, [isInitialized])

  const setOpen = async (open: boolean) => {
    setIsOpen(open)
    await window.sidebar.setState(open)
  }

  // Don't render children until we have the initial state
  if (!isInitialized) {
    return null
  }

  return (
    <SidebarContext.Provider value={{ isOpen, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
} 