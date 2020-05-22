import React from 'react';
import { useDispatch } from 'react-redux';
import { View, Linking, StyleSheet } from 'react-native';
import Text from 'components/Text';

import { setCurrent } from 'stores/post';

interface Props {
  label?: string;
  to: string;
}

export default function Link({ label, to }: Props) {
  const dispatch = useDispatch();
  const onPress = () => {
    if (to.indexOf('ruliweb.com') > -1) {
      dispatch(setCurrent({ url: to }));
    } else {
      Linking.openURL(to).catch(() => {});
    }
  };

  if (!to) return null;

  const LinkText = (
    <Text
      color="primary"
      shade={600}
      style={[styles.link, !label ? styles.container : undefined].filter(Boolean)}
      onPress={onPress}
      numberOfLines={1}
    >
      {to}
    </Text>
  );

  if (label) {
    return (
      <View style={styles.container}>
        <Text color="gray" shade={800}>{label}</Text>
        {LinkText}
      </View>
    );
  }
  return LinkText;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  link: {
    flex: 1,
  },
});
