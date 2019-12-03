import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { getPostUser } from 'app/stores/post';
import Text from 'app/components/Text';

export default function Profile({ url }: { url: string }) {
  const user = useSelector(getPostUser(url));
  return (
    <View style={styles.container}>
      <View>
        <Text>{user.name}</Text>
        <Text>{`${user.level || '-'}레벨 / ${user.experience || 0}%`}</Text>
        <Text>{`${user.age || 0}일`}</Text>
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
    width: 52,
    height: 52,
    borderRadius: 8,
  },
});
