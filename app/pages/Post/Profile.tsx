import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Image from 'react-native-fast-image';
import { getPostUser } from 'app/stores/post';
import Text from 'app/components/Text';

export default function Profile({ url }: { url: string }) {
  const user = useSelector(getPostUser(url));
  return (
    <View style={styles.container}>
      <View>
        <Text>{user.name}</Text>
        <Text>{`${user.level || '-'}레벨`}</Text>
      </View>
      {user.image && <Image source={{ uri: user.image }} style={styles.avatar} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  avatar: {
    marginLeft: 8,
    width: 30,
    height: 30,
  },
});
