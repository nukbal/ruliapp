
import { StyleSheet } from 'react-native';
import { primary, labelText, listItem, primaryOpacity } from '../../styles/color';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 1,
    justifyContent: 'center',
    backgroundColor: listItem,
  },
  childContainer: {
    flex: 1,
    padding: 16,
    paddingLeft: 25,
    marginBottom: 3,
    justifyContent: 'center',
    backgroundColor: listItem,
  },
  bestContainer: {
    backgroundColor: primaryOpacity,
  },
  UserContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  UserText: {
    color: 'black',
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    paddingRight: 6,
  },
  timeText: {
    fontSize: 13,
    color: labelText,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
  },
  CommentContainer: {
    flex: 1,
    paddingTop: 8,
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
  CommentText: {
    color: 'black',
    lineHeight: 21,
    justifyContent: 'flex-start',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bestText: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 13,
    backgroundColor: primary,
    color: 'white',
  },
  placeholder: {
    backgroundColor: '#dedede',
    height: 16,
  },
});