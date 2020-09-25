import React from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Colors } from '../../Themes';

interface IAvatar {
  avatar: string;
  firstName: string;
  lastName: string;
  size?: string;
  displayName?: string;
}

function AvatarComponent(props: IAvatar) {
  const { firstName, lastName, avatar, displayName, size } = props;

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {avatar ? (
        <Avatar
          rounded
          source={{
            uri: avatar,
          }}
          size={'medium'}
        />
      ) : (
        <Avatar
          overlayContainerStyle={{ backgroundColor: Colors.background }}
          rounded
          size={'medium'}
          title={`Some`}
        />
        /* <LargeText
            color={Colors.white}
            text={`${firstName.charAt(0)}${lastName.charAt(0)} `}
          /> */
      )}
    </View>
  );
}

export default AvatarComponent;
