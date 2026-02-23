import { EnumSideMenu } from '@/constants/Enums'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AccountState {
  selectedMenu: string
}

interface AccountActions {
  setSelectedMenu: (menu: string) => void
  navigateToMenu: (menu: string) => void
}

type AccountStore = AccountState & { actions: AccountActions }

const initialState: AccountState = {
  selectedMenu: EnumSideMenu.DETAIL,
}

const useAccountStore = create<AccountStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        actions: {
          setSelectedMenu: (menu: string) => {
            set({ selectedMenu: menu })
          },
          navigateToMenu: (menu: string) => {
            set({ selectedMenu: menu })
            // Update URL hash without triggering navigation
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', `/account#${menu}`)
            }
          },
        },
      }),
      {
        name: 'account-storage',
        partialize: (state) => ({ selectedMenu: state.selectedMenu }),
      }
    ),
    { name: 'AccountStore' }
  )
)

// Selectors
export const useSelectedMenu = () => useAccountStore((state) => state.selectedMenu)
export const useAccountActions = () => useAccountStore((state) => state.actions)

export default useAccountStore
