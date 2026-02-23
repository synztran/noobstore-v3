import { EnumSideMenu } from '@/constants/Enums'
import { useAccountActions, useSelectedMenu } from '@/zustand/useAccountStore'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

/**
 * Custom hook for managing account page navigation state
 * Syncs selectedMenu state with URL hash and provides navigation methods
 */
const useAccount = () => {
  const router = useRouter()
  const selectedMenu = useSelectedMenu()
  const { setSelectedMenu, navigateToMenu } = useAccountActions()

  // Sync state with URL hash on mount and route changes
  useEffect(() => {
    if (!router.isReady) return

    const hash = router.asPath.split('#')[1]
    if (hash && hash !== selectedMenu) {
      setSelectedMenu(hash)
    }
  }, [router.isReady, router.asPath, setSelectedMenu, selectedMenu])

  // Navigate to a specific menu and update URL
  const handleSelectMenu = useCallback(
    (menuId: string) => {
      navigateToMenu(menuId)
      router.push(`/account#${menuId}`, undefined, { shallow: true })
    },
    [navigateToMenu, router]
  )

  // Navigate to point history
  const goToPointHistory = useCallback(() => {
    handleSelectMenu(EnumSideMenu.POINT_HISTORY)
  }, [handleSelectMenu])

  // Navigate to rewards
  const goToRewards = useCallback(() => {
    handleSelectMenu(EnumSideMenu.REWARDS)
  }, [handleSelectMenu])

  // Navigate to account detail
  const goToAccountDetail = useCallback(() => {
    handleSelectMenu(EnumSideMenu.DETAIL)
  }, [handleSelectMenu])

  // Navigate to orders
  const goToOrders = useCallback(() => {
    handleSelectMenu(EnumSideMenu.ORDERS)
  }, [handleSelectMenu])

  // Navigate to addresses
  const goToAddresses = useCallback(() => {
    handleSelectMenu(EnumSideMenu.ADDRESSES)
  }, [handleSelectMenu])

  // Navigate to raffle history
  const goToRaffleHistory = useCallback(() => {
    handleSelectMenu(EnumSideMenu.RAFFLE_HISTORY)
  }, [handleSelectMenu])

  // Navigate to wishlist
  const goToWishlist = useCallback(() => {
    handleSelectMenu(EnumSideMenu.WISHLIST)
  }, [handleSelectMenu])

  // Navigate to preferences
  const goToPreferences = useCallback(() => {
    handleSelectMenu(EnumSideMenu.PREFERENCES)
  }, [handleSelectMenu])

  return {
    // State
    selectedMenu,

    // Actions
    setSelectedMenu,
    handleSelectMenu,

    // Navigation shortcuts
    goToPointHistory,
    goToRewards,
    goToAccountDetail,
    goToOrders,
    goToAddresses,
    goToRaffleHistory,
    goToWishlist,
    goToPreferences,
  }
}

export default useAccount
