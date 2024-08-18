import { create } from "zustand";
import { devtools } from "zustand/middleware";

enum EnumSideTab {
  ACCOUNT = 'ACCOUNT',
  NOTIFICATION = 'NOTIFICATION',
  ADDRESSES = 'ADDRESSES',
  ORDERS = 'ORDERS',
  LOGOUT = 'LOGOUT'
}

interface Actions {
  updateSideTab: (payload: EnumSideTab) => void
}

interface InitialUserState {
  sideTab: EnumSideTab

}

type UserState =  InitialUserState & { actions: Actions}

const InitialState = {
  sideTab: EnumSideTab.ACCOUNT
}

const useUser = create<UserState>()(
  devtools((set, get) => ({
    ...InitialState,
    actions: {
      updateSideTab: (payload: EnumSideTab) => {
        const { sideTab } = get()
        if (sideTab === payload || sideTab === EnumSideTab.LOGOUT) return
        set({ sideTab: payload })
      }
    }
  }))
)

export const useUserAction = () => useUser((state) => state.actions);

export default useUser;