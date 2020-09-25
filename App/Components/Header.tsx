import React from 'react';

import { View } from 'react-native';
import { LargeText } from './LargeText';

function Header(props: any) {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
      }}
    >
      {props.children}
      <LargeText text={props.title} marginLeft={10} fontSize={18} />
    </View>
  );
}
export default Header;
