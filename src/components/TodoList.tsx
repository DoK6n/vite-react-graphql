import React, { PropsWithChildren, useEffect, useState } from 'react';

export default function TodoList({ children }: PropsWithChildren) {
  // const client = useApolloClient();
  // const data = client.readQuery({
  //   query: GET_USER_ALL_TODOS,
  // });
  // const onClearCache = () => {
  //   client.cache.evict({ id: '' }); // cache id에 해당하는 데이터 제거
  // };

  // const [updateDndTodo] = useMutation(UPDATE_DND_TODO);
  // await updateDndTodo({
  //   data: {},
  //   context: {
  //     headers: {
  //       uid: currentUserInfo?.uid,
  //     },
  //   },
  // });
  // };

  return <div className='cardWrapper'>{children}</div>;
}
