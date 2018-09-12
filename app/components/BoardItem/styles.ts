
import { StyleSheet } from 'react-native';
import { listItem, labelText } from '../../styles/color';

export default StyleSheet.create({
  container: {
    flex: 1,
    height: 75,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: listItem,
    alignItems: 'baseline',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
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
    marginLeft: 3,
    fontSize: 13,
    color: labelText,
  },
  placeholder: {
    backgroundColor: '#dedede',
    height: 16,
  },
});