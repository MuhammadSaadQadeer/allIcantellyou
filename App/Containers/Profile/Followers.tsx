import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import Async from '../../Components/Async';
import Connectivity from '../../Components/Connectivity';
import AvatarComponent from '../../Components/General/AvatarComponent';
import { LargeText } from '../../Components/LargeText';
import Urls from '../../Constants/Urls';
import { AppContext } from '../../Contexts/AppContext';
import Api from '../../Services/Api';
import { Colors } from '../../Themes';

const listData = [
  {
    name: 'Izabella Tabakova',
    following: false,
    avatar: '',
  },
  {
    name: 'Izabella Tabakova',
    following: false,
    avatar: '',
  },
  {
    name: 'Izabella Tabakova',
    following: false,
    avatar: '',
  },
  {
    name: 'Izabella Tabakova',
    following: true,
    avatar: '',
  },
];

interface IFollowers {
  id: string;
  displayName: string;
  isGuestAuthor: boolean;
  avatar: string;
}

function Followers(props: any) {
  const appCtx = useContext(AppContext);
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Api({
      method: 'GET',
      url: Urls.profile.followed,
    })
      .then((response) => {
        setIsLoading(false);
        setFollowers(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

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

  function followProfile(profileId) {
    Api({
      method: 'POST',
      url: 'follow',
      data: { userId: profileId },
    })
      .then((response) => {
        Api({
          method: 'GET',
          url: Urls.profile.followed,
        })
          .then((response) => {
            setFollowers(response.data);
          })
          .catch((error) => {});
      })
      .catch((error) => {});
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
            <AvatarComponent
              avatar={item.avatar}
              firstName={appCtx.profileData.general.firstName}
              lastName={appCtx.profileData.general.lastName}
            />

            {/* <Badge
              value={
                <View>
                  <Text style={{ color: Colors.white }}>1</Text>
                </View>
              }
              badgeStyle={{
                backgroundColor: '#8E77D8',
              }}
              textStyle={{
                color: Colors.white,
              }}
              containerStyle={articleStyles.badgeContainerStyle}
            /> */}
          </View>
          <LargeText
            marginLeft={5}
            textAlign={'center'}
            text={item.displayName}
          />
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
          onPress={() => {
            followProfile(item.id);
          }}
        >
          <Text style={{ color: Colors.white }}>{`Following`}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Connectivity>
      <Async displayChildren={isLoading}>
        <View
          style={{
            paddingHorizontal: 10,
          }}
        >
          {followers && followers.length > 0 ? (
            <FlatList
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
              data={followers}
              renderItem={({ item }) => renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
              // onEndReached={isFilter ? filterMoreArticle : fetchMoreArticles}
              // onEndReachedThreshold={0.5}
              // initialNumToRender={10}
              ItemSeparatorComponent={renderSeparator}
              showsVerticalScrollIndicator={false}
              // ListFooterComponent={
              //   <ActivityIndicator size={'large'} color={Colors.darkSkyBlue} />
              // }
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
                You don't have any followers
              </Text>
            </View>
          )}
        </View>
      </Async>
    </Connectivity>
  );
}

export default Followers;
