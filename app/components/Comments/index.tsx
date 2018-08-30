import React, { Component } from 'react';
import { View, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import LazyImage from '../LazyImage';
import { primary } from '../../styles/color';
import styles from './styles';
import Placeholder from './placeholder';

import realm from '../../store/realm';

async function loadItem(key: string) {
  return new Promise((res, rej) => {
    try {
      const data: PostRecord | undefined = realm.objectForPrimaryKey('Comment', key);
      let response;
      if (data) {
        response = {
          subject: data.subject,
          user: data.user,
          commentSize: data.commentSize,
          likes: data.likes,
          views: data.views,
        };
      }
      res(response);
    } catch (e) {
      rej(e);
    }
  });
}

interface Props {
  id: string;
}

export default class Comment extends Component<Props, { loading: boolean }> {
  state = { loading: true };

  async componentDidMount() {
    const record = await loadItem(this.props.id);
    if (record) {
      // @ts-ignore
      this.record = record;
      this.setState({ loading: false });
    }
  }

  // @ts-ignore
  record: CommentRecord = {};

  render() {
    if (this.state.loading) {
      return <Placeholder />;
    }
    const { userName, content, time, likes, dislike, image, best, child } = this.record;
    const containerStyle: any = [styles.container];
    if (child) {
      containerStyle.push({ paddingLeft: 16 });
    }
    return (
      <View style={containerStyle}>
        <View style={styles.UserContainer}>
          <View style={styles.horizontal}>
            <Text style={styles.UserText}>
              {userName}
            </Text>
            {best && (<Text style={styles.bestText}>BEST</Text>)}
          </View>
          {time && (<Text style={styles.timeText}>{time}</Text>)}
        </View>
        <View style={styles.CommentContainer}>
          {image && (<LazyImage source={{ uri: image }} />)}
          {content && (<Text style={styles.CommentText}>{content}</Text>)}
        </View>
        <View style={styles.infoContainer}>
          {likes && (<FontAwesome name="thumbs-o-up" size={20} color={primary} />)}
          {likes && (<Text style={[styles.UserText, { marginLeft: 6 }]}>{likes}</Text>)}
          {dislike && (<FontAwesome name="thumbs-o-down" size={20} color={primary} />)}
          {dislike && (<Text style={[styles.UserText, { marginLeft: 6 }]}>{dislike}</Text>)}
        </View>
      </View>
    );
  }
}
