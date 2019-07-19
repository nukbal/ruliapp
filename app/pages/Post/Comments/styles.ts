
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 1,
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  UserContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  UserText: {
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    paddingRight: 6,
  },
  infoContainer: {
    flex: 1,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconText: {
    paddingHorizontal: 6,
  }
});
