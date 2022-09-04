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
  signInWithRedirect,
} from 'firebase/auth';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { firebase } from '../firebase';
import { CREATE_USER } from '../lib/graphql/mutation';
import dayjs from 'dayjs';
import { GET_USER } from '../lib/graphql/query';
import { useAuthStore } from '../lib/stores/useAuthStore';
import { authMode } from '../common/constants';

firebase();

interface GoogleLoginProps {
  setLogin: Dispatch<SetStateAction<User | null>>;
}

export default function GoogleLogin({ setLogin }: GoogleLoginProps) {
  const { currentUserInfo, userLogin, updateMode, mode, userLogout } = useAuthStore();
  const [addUser] = useMutation(CREATE_USER);
  const [retrieveUserById] = useLazyQuery(GET_USER);

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // The signed-in user info.
    const user = result.user;
    // This gives you a Facebook Access Token.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential!.accessToken;

    try {
      const { loading, error, data } = await retrieveUserById({
        context: {
          headers: {
            uid: user.uid,
          },
        },
      });

      if (loading) return;
      if (!data || !data.retrieveUserById) {
        console.log('Register code here');
        const createDt = dayjs(user.metadata.creationTime).format('YYYY-MM-DD HH:mm:ss');
        await addUser({
          variables: {
            data: {
              email: user.email,
              name: user.displayName,
              snsTypeName: user.providerData[0].providerId,
              createDt: createDt,
            },
          },
          context: {
            headers: {
              uid: user.uid,
            },
          },
        });
      }
      console.log('Login code here ');
      console.log('(then)data:', data);
      // add user info
      await userLogin({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        providerId: user.providerData[0].providerId,
        lastLoginAt: dayjs(user.metadata.lastSignInTime).format('YYYY-MM-DD HH:mm:ss'),
      });

      // login
      updateMode(authMode.LOGIN_MODE);
    } catch (error) {
      console.error(error);
    }
  };
  //   signInWithPopup(auth, provider) // 구글 로그인 팝업창
  //     .then(result => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //       const token = credential!.accessToken;
  //       // 로컬 스토리지에 유저 데이터 저장
  //       // auth.setPersistence(browserLocalPersistence);

  //       // The signed-in user info.
  //       const user = result.user;

  //       retrieveUserById({
  //         context: {
  //           headers: {
  //             uid: user.uid,
  //           },
  //         },
  //       })
  //         .then(({ loading, data }) => {
  //           // graphql query가 비동기이므로 then 사용
  //           if (!loading) {
  //             if (data && data.retrieveUserById) {
  //               console.log('Login code here ');
  //               console.log('(then)data:', data);
  //               // add user info
  //               userLogin({
  //                 uid: user.uid,
  //                 displayName: user.displayName,
  //                 email: user.email,
  //                 photoURL: user.photoURL,
  //                 providerId: user.providerData[0].providerId,
  //                 lastLoginAt: dayjs(user.metadata.lastSignInTime).format('YYYY-MM-DD HH:mm:ss'),
  //               });
  //             } else {
  //               console.log('Register code here');
  //               const createDt = dayjs(user.metadata.creationTime).format('YYYY-MM-DD HH:mm:ss');
  //               addUser({
  //                 variables: {
  //                   data: {
  //                     email: user.email,
  //                     name: user.displayName,
  //                     snsTypeName: user.providerData[0].providerId,
  //                     createDt: createDt,
  //                   },
  //                 },
  //                 context: {
  //                   headers: {
  //                     uid: user.uid,
  //                   },
  //                 },
  //               }).then(() => {
  //                 // add user info
  //                 userLogin({
  //                   uid: user.uid,
  //                   displayName: user.displayName,
  //                   email: user.email,
  //                   photoURL: user.photoURL,
  //                   providerId: user.providerData[0].providerId,
  //                   lastLoginAt: dayjs(user.metadata.lastSignInTime).format('YYYY-MM-DD HH:mm:ss'),
  //                 });
  //               });
  //             }
  //           }
  //           // login
  //           updateMode(authMode.LOGIN_MODE);
  //         })
  //         .catch(error => {
  //           console.error({ code: error.code, message: error.message });
  //         });

  //       // setLogin(user);
  //     })
  //     .catch(error => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       console.error({ code: errorCode, message: errorMessage });
  //       const credential = GoogleAuthProvider.credentialFromError(error);
  //       // ...
  //     });
  // };

  const signOutWithGoogle = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      userLogout();
    } catch (error) {
      console.error(error);
    }
  };

  const onAuthStateChange = async () => {
    const auth = getAuth();
    await onAuthStateChanged(auth, user => {
      // User is signed out
      if (!user) return;
      try {
        const updateUserProfile = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
        };
        setLogin(user);
        userLogin({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          providerId: user.providerId,
          lastLoginAt: user.metadata.lastSignInTime,
        });
        console.log('Profile Update', updateUserProfile);
      } catch (error) {
        console.error(error);
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
