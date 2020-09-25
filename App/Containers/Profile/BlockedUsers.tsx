import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { LargeText } from '../../Components/LargeText';
import Urls from '../../Constants/Urls';
import Api from '../../Services/Api';
import { Colors } from '../../Themes';

interface IFollowers {
  id: string;
  displayName: string;
  isGuestAuthor: boolean;
  avatar: string;
}
let users = [];
function BlockedUsers(props: any) {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [toUpdate, setToUpdate] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);
  function unBlockUser(userId: string) {
    AsyncStorage.getItem('blockedUsers').then((response) => {
      AsyncStorage.setItem(
        'blockedUsers',
        JSON.stringify(
          JSON.parse(response).filter((blockedIds: string) => {
            return blockedIds !== userId;
          }),
        ),
      ).then((response) => {
        let arr = blockedUsers.filter((item) => item.id !== userId);
        setBlockedUsers(arr);

        setToUpdate(1);
        setToUpdate(1);
        setToUpdate(1);
      });
    });
  }

  function fetchUsers() {
    var promises = [];
    AsyncStorage.getItem('blockedUsers').then((result) => {
      JSON.parse(result).map((id: string) => {
        promises.push(
          Api({
            method: 'GET',
            url: `${Urls.profile.user}${id}`,
          }),
        );
      });

      Promise.all(promises).then((response) => {
        //When all promises are donde, this code is executed;
        setBlockedUsers(response.map((result) => result.data));
      });
    });
  }

  function renderSeparator() {
    return (
      <View
        style={{
          borderColor: '#EDEDED',
          borderWidth: 1,
        }}
      />
    );
  }

  function renderItem(item: IFollowers) {
    return (
      <View
        style={{
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View testID={'Avatar-View'}>
            {item.avatar ? (
              <Avatar
                rounded
                source={{
                  uri: item.avatar,
                }}
                size={'medium'}
              />
            ) : item.displayName ? (
              <Avatar
                overlayContainerStyle={{ backgroundColor: Colors.background }}
                size={'medium'}
                rounded
                title={item.displayName.charAt(0)}
              />
            ) : null}
          </View>
          {item.general ? (
            item.general.displayName ? (
              <LargeText
                color={Colors.black}
                marginLeft={5}
                textAlign={'center'}
                text={item.general.displayName}
              />
            ) : null
          ) : null}
        </View>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: Colors.background,
            paddingVertical: 10,
            paddingHorizontal: 20,

            borderRadius: 7,
            backgroundColor: Colors.background,
          }}
          onPress={() => unBlockUser(item.id)}
        >
          <Text style={{ color: Colors.white }}>{`Unblock`}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 0 }}>
      <View>
        {blockedUsers && blockedUsers.length > 0 ? (
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
            data={blockedUsers}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={renderSeparator}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              paddingVertical: 20,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: Colors.lightGray,
              }}
            >
              You don't have any blocked users
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default BlockedUsers;
