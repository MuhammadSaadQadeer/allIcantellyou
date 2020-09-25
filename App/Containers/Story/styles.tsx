import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../Themes';
export const storyStyles = StyleSheet.create({
  btnGroupStyle: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
    borderColor: Colors.transparent,
    borderWidth: 1,
  },

  btnGroupSelectedBtn: {
    backgroundColor: Colors.transparent,
  },
  btnGroupTextStyle: {
    color: Colors.background,
  },

  menuOptions: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  menuOption: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },
  menuOptionIcon: {
    fontFamily: Fonts.type.regular,
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    borderTopColor: Colors.transparent,
    borderRightColor: Colors.transparent,
    borderLeftColor: Colors.transparent,
    fontSize: 14,
    marginTop: 15,
    marginBottom: 15,
    lineHeight: 22,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  saveBtn: {
    borderColor: Colors.background,
    borderWidth: 1,
    borderRadius: 7,
  },
  cancelBtn: {
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 7,
  },
  btnTxt: {
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  answerBaseLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  stepperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperTextLabel: {
    color: Colors.lightGray,
    lineHeight: 25,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  questionStatement: {
    flexDirection: 'row',
    paddingVertical: 20,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  questionText: {
    fontSize: 15,
    flexWrap: 'wrap',
    color: Colors.textColor,
  },
  btnControls: {
    flexDirection: 'row',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
});
