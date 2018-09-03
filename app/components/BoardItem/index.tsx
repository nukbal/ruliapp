import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { primaryLight } from '../../styles/color';
import styles from './styles';
import Placeholder from './placeholder';

import realm from '../../store/realm';

async function loadItem(key: string) {
  return new Promise((res, rej) => {
    try {
      const data: PostRecord | undefined = realm.objectForPrimaryKey('Post', key);
      let response;
      if (data) response = data;
      res(response);
    } catch (e) {
      rej(e);
    }
  });
}


interface IBoardItem {
  id: string;
  onPress: (payload: any) => void;
}

interface State {
  touching: boolean;
  loading: boolean;
}

export default class BoardItem extends Component<IBoardItem, State> {
  constructor(props: IBoardItem) {
    super(props);
    const keys = props.id.split('_');

    // @ts-ignore
    this.record = { key: props.id, id: keys[2], prefix: keys[0], boardId: keys[1], subject: '' };
  }

  state = { touching: false, loading: true };
  record: PostRecord;

  async componentDidMount() {
    if (!this.record.subject) {
      this.setState({ loading: true });
      const record = await loadItem(this.props.id);
      if (record) {
        // @ts-ignore
        this.record = { ...this.record, ...record };
        this.setState({ loading: false });
      }
    }
  }

  shouldComponentUpdate(_: any, state: State) {
    return state.touching !== this.state.touching ||
      state.loading !== this.state.loading;
  }

  beforePress = () => {
    this.setState({ touching: true });
  }

  afterPress = () => {
    this.setState({ touching: false });
  }

  onPress = () => {
    const { onPress } = this.props;
    if (!onPress) return;
    const { subject, id, prefix, boardId } = this.record;
    if (!id || !boardId) return;

    onPress({ subject, id, prefix, boardId });
  }

  render() {
    if (this.state.loading) return <Placeholder />;
    
    const viewStyle = [styles.container];
    const itemText = [styles.itemText];
    const titleText = [styles.titleText];
    if (this.state.touching) {
      // @ts-ignore
      viewStyle.push({ backgroundColor: primaryLight });
      // @ts-ignore
      itemText.push({ color: 'white' });
      // @ts-ignore
      titleText.push({ color: 'white' });
    }
    const { subject, user, commentSize, likes, views } = this.record;
    return (
      <TouchableWithoutFeedback
        onPressIn={this.beforePress}
        onPress={this.onPress}
        onPressOut={this.afterPress}
      >
        <View style={viewStyle}>
          <View style={styles.info}>
            <Text style={titleText} numberOfLines={1}>{subject}</Text>
          </View>
          <View style={styles.info}>
            <Text style={itemText} numberOfLines={1}>{user.name} |</Text>
            <Text style={itemText}>덧글 {commentSize} |</Text>
            <Text style={itemText}>추천 {likes} |</Text>
            <Text style={itemText}>조회 {views}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
