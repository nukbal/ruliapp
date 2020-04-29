import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Text from 'components/Text';
import formatDate from 'utils/formatDate';
import useCachedFile from 'hooks/useCachedFile';
import { FILE_PREFIX } from 'config/constants';

export default function Profile({ date, views, user }: Pick<PostDetailRecord,'user'|'date'|'views'>) {
  const [uri] = useCachedFile(user.image);
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <View style={styles.panel}>
        <Text>{`조회수: ${views}`}</Text>
        <Text>{`작성일시: ${date ? formatDate(date) : '-'}`}</Text>
      </View>
      <View style={[styles.panel, styles.user]}>
        <View>
          <Text>{user.name}</Text>
          <Text>{`${user.level || '-'}레벨 / ${user.experience || 0}%`}</Text>
          <Text>{`${user.age || 0}일`}</Text>
        </View>
        {!!uri && <Image source={{ uri: FILE_PREFIX + uri }} style={styles.avatar} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    marginBottom: 8,
    borderBottomWidth: 0.5,
  },
  panel: {
    flex: 1,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 8,
  },
  avatar: {
    marginLeft: 8,
    width: 52,
    height: 52,
    borderRadius: 8,
  },
});
