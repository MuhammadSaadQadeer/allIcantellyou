const type = {
  regular: 'Nunito-Regular',
  bold: 'Nunito-Bold',
  bold_italic: 'Nunito-BoldItalic',
  light: 'Nunito-Light',
  light_italic: 'Nunito-LightItalic',
  black: 'Nunito-Black',
  black_italic: 'Nunito-BlackItalic',
  semi_bold: 'Nunito-SemiBold',
  semi_bold_italic: 'Nunito-SemiBoldItalic',
};

const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 20,
  h6: 19,
  heading: 20,
  input: 18,
  regular: 16,
  medium: 14,
  small: 12,
  tiny: 8.5,
};

const style = {
  h1: {
    fontFamily: type.bold,
    fontSize: size.h1,
  },
  h2: {
    fontWeight: 'bold',
    fontSize: size.h2,
  },
  h3: {
    fontFamily: type.regular,
    fontSize: size.h3,
  },
  h4: {
    fontFamily: type.regular,
    fontSize: size.h4,
  },
  h5: {
    fontFamily: type.regular,
    fontSize: size.h5,
  },
  h6: {
    fontFamily: type.bold,
    fontSize: size.h6,
  },
  normal: {
    fontFamily: type.regular,
    fontSize: size.regular,
  },
  description: {
    fontFamily: type.regular,
    fontSize: size.medium,
  },
};

export default {
  type,
  size,
  style,
};
