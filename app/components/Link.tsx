import React from 'react';
import { View, Linking, StyleSheet } from 'react-native';
import Text from 'app/components/Text';

interface Props {
  label?: string;
  to: string;
}

export default function Link({ label, to }: Props) {
  const onPress = () => {
    Linking.openURL(to).catch(() => {});
  };
  return (
    <View style={styles.container}>
      {label && <Text color="gray" shade={800}>{label}</Text>}
      <Text
        color="primary"
        shade={600}
        style={[styles.link]}
        onPress={onPress}
        numberOfLines={1}
      >
        {to}
      </Text>
    </View>
  );
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
