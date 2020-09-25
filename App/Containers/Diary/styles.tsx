import { StyleSheet } from 'react-native';

export const diaryStyles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },

  textInputStyles: {
    height: 150,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  postContorls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginTop: 40,
  },
  btnStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    marginLeft: 7,
    fontSize: 12,
  },
  moodStyles: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
