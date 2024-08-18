import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Actions {
  toggleDialogLogin: (payload: boolean) => void;
}

interface InitialDialogLoginState {
  isOpenDialogLogin: boolean
}

type DialogLoginState =  InitialDialogLoginState & { actions: Actions}

const InitialState = {
  isOpenDialogLogin: false
}

const useDialogLogin = create<DialogLoginState>()(
  devtools((set, get) => ({
    ...InitialState,
    actions: {
      toggleDialogLogin: (payload: boolean) => {
        set(() => ({
          isOpenDialogLogin: payload
        }))
      }
    }
  }))
)

export const useDialogLoginAction = () => useDialogLogin((state) => state.actions);

export default useDialogLogin;