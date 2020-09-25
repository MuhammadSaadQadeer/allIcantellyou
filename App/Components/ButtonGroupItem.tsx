import React from 'react';
import { Text } from 'react-native';
function BtnGroupItem(props: any) {
  return (
    <Text
      style={{
        fontSize: 11,
        marginLeft: 2,
        color: props.color,
      }}
    >
      {props.title}
    </Text>
  );
}

export default BtnGroupItem;
