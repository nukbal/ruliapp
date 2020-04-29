import React from 'react';
import {
  View,
  Text,
  Linking,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from 'components/Button';

function noop() {}

export default function ContentFooter({
  url, likes, dislikes, commentSize,
}: Pick<PostDetailRecord,'url'|'likes'|'dislikes'|'commentSize'>) {
  const { colors } = useTheme();

  const open = () => {
    const path = `https://m.ruliweb.com/${url}`;
    Linking.openURL(path).catch((err) => console.error('An error occurred', err));
  };

  const color = colors.text;
  const textStyle = [styles.infoText, { color }];

  return (
    <View style={[styles.infoPanel, { borderColor: colors.border }]}>
      {likes !== undefined && (
        <View style={styles.infoItem}>
          <Button name="thumbs-up" onPress={noop} pointerEnabled={false} size={400} />
          <Text style={textStyle}>{dislikes}</Text>
        </View>
      )}
      {dislikes !== undefined && (
        <View style={styles.infoItem}>
          <Button name="thumbs-down" onPress={noop} pointerEnabled={false} size={400} />
          <Text style={textStyle}>{dislikes}</Text>
        </View>
      )}
      {commentSize !== undefined && (
        <View style={styles.infoItem}>
          <Button name="message-square" onPress={noop} pointerEnabled={false} size={400} />
          <Text style={textStyle}>{commentSize}</Text>
        </View>
      )}
      <View style={styles.infoItem}>
        <Button name="share" onPress={open} size={400} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  infoItem: {
    flex: 1,
    padding: 8,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: 'white',
  },
});
