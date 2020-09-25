import React from 'react';
import { Text, View } from 'react-native';
import { Colors } from '../Themes';

interface INoRecords {
  title: string;
}
function NoRecords(props: INoRecords) {
  return (
    <View>
      <Text
        style={{
          fontSize: 30,
          alignSelf: 'center',
          marginTop: 50,
          color: Colors.lightGray,
        }}
      >
        {props.title}
      </Text>
    </View>
  );
}

export default NoRecords;
