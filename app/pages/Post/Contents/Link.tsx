import React from 'react';
import { useNavigation } from '@react-navigation/core';
import Anchor from 'components/Link';
import Text from 'components/Text';

import { parseBoardUrl } from 'utils/parseBoard';

export default function Link({ label, to }: any) {
  const navigation = useNavigation();
  const isSameOrigin = to.indexOf('ruliweb.com') > -1;

  if (!isSameOrigin) return <Anchor label={label} to={to} />;

  const onPress = () => {
    console.log(to);
    if (to.indexOf('/board/')) {
      const { url } = parseBoardUrl(to);
      navigation.navigate('post', { url });
    } else {
      // navigation.navigate('board', {});
    }
  };
  return (
    <Text
      color="primary"
      shade={600}
      numberOfLines={1}
      onPress={onPress}
      accessible
      accessibilityRole="link"
    >
      {to}
    </Text>
  );
}
