
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  item: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginBottom: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconStyle: {
    paddingRight: 32,
  },
  itemText: {
    fontWeight: '500',
    alignItems: 'center',
  },
  divide: {
    marginBottom: 25,
  },
});
