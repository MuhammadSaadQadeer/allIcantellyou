import { StyleSheet } from 'react-native';
import { Colors } from './Themes';

export const mainAppStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    borderTopColor: Colors.white,
    borderTopWidth: 0.2,
  },
  searchBarView: {
    alignSelf: 'stretch',
    flex: 1,
  },
  searchBarInputContainer: {
    backgroundColor: '#33C9FF',
    height: 32,
    color: Colors.white,
  },
  searchBarContainer: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.background,
    borderBottomColor: Colors.background,
    color: Colors.white,
  },
  searchBarInput: {
    fontSize: 13,
    color: Colors.white,
    height: 20,
  },
});
