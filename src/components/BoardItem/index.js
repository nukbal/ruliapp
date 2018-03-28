import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { listItem, labelText, border, primaryOpacity } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 2,
  },
  itemContainer: {
    flex: 1,
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: listItem,
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    flexWrap:'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    color: 'black',
  },
  itemText: {
    marginLeft: 8,
    color: labelText,
  }
});

export default class BoardItem extends PureComponent {
  state = {
    visible: true,
  }

  componentDidMount() {
    this.layout = { width: 0, height: 0 };
  }

  setVisible = (visible) => {
    if (this.state.visible !== visible) {
      this.setState({ visible });
    }
  }

  onLayout = ({ nativeEvent }) => {
    this.layout.width = nativeEvent.layout.width;
    this.layout.height = nativeEvent.layout.height;
  }

  onPress = () => {
    const { onPress, id, title, prefix, boardId } = this.props;
    if (!onPress) return;

    onPress(id, title, prefix, boardId);
  }

  layout = { width: 0, height: 0 };

  render() {
    const { title, comments, author, like, views, times, likes } = this.props;

    if (this.state.visibility === false) {
      const { width, height } = this.layout;
      return ( <View style={{ width, height }} /> )
    }

    return (
      <TouchableOpacity onLayout={this.onLayout} style={styles.container} onPress={this.onPress} >
        <View style={styles.itemContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <View style={styles.info}>
            <View style={styles.item}>
              <Ionicons name="ios-chatboxes-outline" size={20} color={labelText} />
              <Text style={styles.itemText}>{comments || 0}</Text>
            </View>
            <View style={styles.item}>
              <Ionicons name="ios-heart-outline" size={20} color={labelText} />
              <Text style={styles.itemText}>{likes || 0}</Text>
            </View>
            <View style={styles.item}>
              <Ionicons name="ios-person-outline" size={20} color={labelText} />
              <Text style={styles.itemText}>{views || 0}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
