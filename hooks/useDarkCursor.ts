import { useEffect } from 'react'

export function useDarkCursor() {
  useEffect(() => {
    document.body.classList.add('dark-cursor')
    return () => {
      document.body.classList.remove('dark-cursor')
    }
  }, [])
}