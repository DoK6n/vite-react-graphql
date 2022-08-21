import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  deleteUser,
  browserLocalPersistence,
  setPersistence,
  User,
  signInWithRedirect
} from 'firebase/auth';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { firebase } from '../firebase';
import { CREATE_USER } from '../lib/graphql/mutation';
import datjs from 'dayjs';
import { GET_USER } from '../lib/graphql/query';
import { useAuthStore } from '../lib/stores/useAuthStore';
import { authMode } from '../common/constants';

firebase();
const auth = getAuth();

interface GoogleLoginProps {
  setLogin: Dispatch<SetStateAction<User | null>>;
}

export default function GoogleLogin({ setLogin }: GoogleLoginProps) {
  const provider = new GoogleAuthProvider();

  const [uid, setUid] = useState<string | null>(null);
  const { currentUserInfo, userLogin, updateMode, mode, userLogout } = useAuthStore();
  const [addUser, { loading, error }] = useMutation(CREATE_USER);
  const [retrieveUserById, { data }] = useLazyQuery(GET_USER, {
    context: {
      headers: {
        uid: uid
      }
    }
  });

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider) // 구글 로그인 팝업창
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        // 로컬 스토리지에 유저 데이터 저장
        // auth.setPersistence(browserLocalPersistence);

        // The signed-in user info.
        const user = result.user;
        // login
        updateMode(authMode.LOGIN_MODE);
        console.log('mode: ' + mode);
        // add user info
        userLogin({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          providerId: user.providerData[0].providerId,
          lastLoginAt: datjs(user.metadata.lastSignInTime).format('YYYY-MM-DD HH:mm:ss')
        });
        console.log('current login user data: ');
        console.log(currentUserInfo);

        retrieveUserById({
          variables: {
            data: {
              id: user.uid
            }
          }
        })
          .then(({ loading, data }) => {
            // graphql query가 비동기이므로 then 사용
            if (!loading) {
              if (data && data.retrieveUserById) {
                console.log('Login code here ');
                console.log('(then)data:', data);
              } else {
                console.log('Register code here');
                console.log('(then)data:', data);
                const createDt = datjs(user.metadata.creationTime).format('YYYY-MM-DD HH:mm:ss');
                addUser({
                  variables: {
                    data: {
                      id: user.uid,
                      email: user.email,
                      name: user.displayName,
                      snsTypeName: user.providerData[0].providerId,
                      createDt: createDt
                    }
                  }
                });
              }
            }
          })
          .catch(error => {
            console.error({ code: error.code, message: error.message });
          });

        setLogin(user);
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({ code: errorCode, message: errorMessage });
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  //   signInWithPopup(auth, provider)
  //     .then(result => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //       const token = credential!.accessToken;

  //       // The signed-in user info.
  //       const user = result.user;
  //       setLogin(user);

  //       // ...
  //     })
  //     .catch(error => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       console.error({ code: errorCode, message: errorMessage });
  //       // The email of the user's account used.
  //       // const email = error.customData.email;
  //       // The AuthCredential type that was used.
  //       const credential = GoogleAuthProvider.credentialFromError(error);
  //       // ...
  //     });
  // };

  const signOutWithGoogle = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setLogin(null);
        setUid(null);
        userLogout();
      })
      .catch(error => {
        // An error happened.
        console.error({ code: error.code, message: error.message });
      });
  };

  const onAuthStateChange = () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const updateUserProfile = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified
        };
        setLogin(user);
        userLogin({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          providerId: user.providerId,
          lastLoginAt: user.metadata.lastSignInTime
        });
        console.log('Profile Update', updateUserProfile);
      } else {
        // User is signed out
        console.log(user);

        // ...
      }
    });
  };

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with google</button>
      <button onClick={onAuthStateChange}>Update User Profile</button>
      <button onClick={signOutWithGoogle}>Logout</button>
    </div>
  );
}
