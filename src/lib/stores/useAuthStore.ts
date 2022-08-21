import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { authMode } from '../../common/constants';
import { AuthModeType } from '../../common/types';

interface UserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
  lastLoginAt: string | undefined;
}

interface AuthStore {
  currentUserInfo: UserInfo | null;
  mode: AuthModeType;
  userLogin: (currentUser: UserInfo) => void;
  updateMode: (currentMode: AuthModeType) => void;
  userLogout: () => void;
}

// const initState: UserInfo = {};
/**
 * - zustand middleware
 *    - devtools : 크롬 Redux DevTools에 적용
 *    - persist : 로컬 스토리지에 저장
 *    - immer : react 배열/객체 업데이트시 불변성 관리
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        currentUserInfo: null,
        mode: authMode.GUEST_MODE,
        userLogin: currentUser => set(({ currentUserInfo }) => ({ currentUserInfo: { ...currentUser } })),
        updateMode: currentMode => set(({ mode }) => ({ mode: currentMode })),
        userLogout: () => set(({ currentUserInfo, mode }) => ({ currentUserInfo: null, mode: authMode.GUEST_MODE }))
      }),
      { name: 'currentUser' }
    )
  )
);
