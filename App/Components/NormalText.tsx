import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Colors, Fonts } from '../Themes';

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: Fonts.type.regular,
    color: Colors.text,
    lineHeight: 19,
    textAlign: 'left',
  },
});

interface INormalTextProps {
  text: string;
  fontFamily?: string;
  color?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: any;
  flex?: number;
  flexWrap?: any;
  marginBottom?: number;
  marginTop?: number;
  marginLeft?: number;
  decoration?: boolean;
}

export function NormalText({
  text,
  fontFamily,
  color,
  lineHeight,
  letterSpacing,
  textAlign,
  flex,
  flexWrap,
  marginTop,
  marginBottom,
  marginLeft,
  decoration,
}: INormalTextProps) {
  return (
    <Text
      style={[
        styles.text,
        {
          fontFamily,
          color,
          lineHeight,
          letterSpacing,
          textAlign,
          flex: flex ? flex : undefined,
          flexWrap: flexWrap ? flexWrap : undefined,
          marginTop,
          marginBottom,
          marginLeft,
          textDecorationLine: decoration ? 'underline' : 'none',
        },
      ]}
    >
      {text}
    </Text>
  );
}

NormalText.defaultProps = {
  fontFamily: Fonts.type.regular,
  color: Colors.text,
  lineHeight: 19,
  letterSpacing: undefined,
  textAlign: 'left',
  marginBottom: 0,
  marginTop: 0,
  marginLeft: 0,
  decoration: false,
};
