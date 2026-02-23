import { useCalcBodyHeight } from '@/hook/useConfig'
import { classNames } from '@/utils/AppConfig'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Footer } from './Footer'
import Header from './Header'

const Base = ({ children, isLoading = false, styles, isNonStrutured = true }: { children?: React.ReactNode | null; isLoading?: boolean; styles?: React.CSSProperties; isNonStrutured?: boolean }) => {
  const router = useRouter()
  const { appiedFixedLayout } = useCalcBodyHeight({
    pathName: router.pathname,
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    if (isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="text-gray-600 antialiased bg-gray-50 w-full h-screen">
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <CircularProgress
            size={84}
            classes={{
              circle: 'text-red-500',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div
        className={classNames(`max-w-7xl text-gray-600 antialiased container mx-auto`)}
        id="webpage"
        style={{
          minHeight: 'calc(100vh - 120px - 248px)',
        }}
      >
        {children}
      </div>
      <Footer />
    </>
  )
}

export { Base }
