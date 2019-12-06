import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getPost } from 'app/stores/post';
import { getBookmark, setBookmark, removeBookmark } from 'app/stores/bookmark';

import BottomSheet from 'app/components/BottomSheet';
import ListItem from 'app/components/ListItem';

import HeaderRight from './HeaderRight';

export default function PostRight({ route, navigation }: any) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const data = useSelector(route.params.bookmark ? getBookmark(route.params.url) : getPost(route.params.url));
  const onClose = () => setShow(false);
  const onPress = () => setShow(true);
  const toggleBookmark = () => {
    if (route.params.bookmark) {
      dispatch(removeBookmark(route.params.url));
      navigation.goBack();
    } else {
      dispatch(setBookmark(data));
    }
    setShow(false);
  };

  return (
    <>
      <HeaderRight name="more-vert" onPress={onPress} />
      <BottomSheet show={show} onClose={onClose}>
        <ListItem name="bookmark" onPress={toggleBookmark}>
          {route.params.bookmark ? '북마크에서 제거하기' : '북마크에 넣기'}
        </ListItem>
      </BottomSheet>
    </>
  );
}
