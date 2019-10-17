import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    height: 72,
    padding: 16,
    flexDirection: 'column',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  subInfo: {
    height: 20,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 12,
    flexShrink: 1,
  },
  metaText: {
    textAlign: 'right',
    marginLeft: 16,
  },
  subjectText: {
    flex: 1,
    fontSize: 16,
    flexShrink: 1,
  },
});
