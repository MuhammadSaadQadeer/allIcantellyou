import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { Fonts, Colors } from '../../Themes';

interface IBlockButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  width?: string;
  disabled?: boolean;
}

function BlockButton({
  title,
  onPress,
  color,
  width,
  disabled,
}: IBlockButtonProps) {
  return (
    <TouchableOpacity
      style={{
        width: width ? width : '80%',
        borderRadius: 5,
        backgroundColor: color ? color : Colors.background,
        alignSelf: 'center',
        height: 36,
      }}
      disabled={disabled ? true : false}
      onPress={onPress}
    >
      <Text
        style={{
          fontFamily: Fonts.type.regular,
          fontSize: 14,
          paddingVertical: 8,
          color: Colors.white,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default BlockButton;
