import React from 'react';
import { View, Linking, StyleSheet } from 'react-native';
import Text from 'components/Text';

interface Props {
  label?: string;
  to: string;
}

export default function Link({ label, to }: Props) {
  const onPress = () => {
    Linking.openURL(to).catch(() => {});
  };

  const LinkText = (
    <Text
      color="primary"
      shade={600}
      style={[styles.link, !label ? styles.container : undefined]}
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
