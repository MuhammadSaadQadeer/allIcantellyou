import React, { useContext, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Async from '../../Components/Async';
import Connectivity from '../../Components/Connectivity';
import BackButton from '../../Components/General/BackButton';
import { LargeText } from '../../Components/LargeText';
import NoRecords from '../../Components/NoRecords';
import { SmallText } from '../../Components/SmallText';
import WithoutLoginComponent from '../../Components/WithoutLoginComponent';
import Urls from '../../Constants/Urls';
import { AppContext } from '../../Contexts/AppContext';
import { displayInDays, getInitialsForDisplayName } from '../../Lib/Utils';
import Api from '../../Services/Api';
import { Colors } from '../../Themes';
import { articleStyles } from '../MainApp/Home/styles';

interface INotification {
  id: string;
  userId: string;
  type: string;
  createdAt: string;
  payload: {
    whoReacted: {
      id: string;
      avatar: string;
      displayName: string;
    };
    entityType: string;
    entityId: string;
  };
}

function MyNotifications(props: any) {
  const appCtx = useContext(AppContext);
  const [notifications, setNotifications] = useState<INotification>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getNotifications();
  }, []);

  function getNotifications() {
    setLoading(true);
    Api({
      method: 'GET',
      url: Urls.notifications.notifications,
    })
      .then((response) => {
        setNotifications(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  function seenNotification(id: string) {
    setLoading(true);
    Api({
      method: 'POST',
      url: Urls.notifications.seen,
      data: { ids: [id] },
    })
      .then((response) => {
        getNotifications();
        setLoading(false);
      })

      .catch((error) => {
        setLoading(false);
      });
  }

  function renderNotification(item: INotification) {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          borderLeftWidth: 5,
          borderLeftColor: Colors.background,
          backgroundColor: Colors.white,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View
            style={[
              articleStyles.avatarTitleSection,
              {
                paddingHorizontal: 10,
                paddingVertical: 10,
              },
            ]}
          >
            <View>
              {item.payload.whoReacted.avatar ? (
                <Avatar
                  rounded
                  source={{
                    uri: item.payload.whoReacted.avatar,
                  }}
                  size={'small'}
                />
              ) : item.payload.whoReacted.displayName ? (
                <Avatar
                  rounded
                  title={getInitialsForDisplayName(
                    item.payload.whoReacted.displayName,
                  )}
                  size={'medium'}
                />
              ) : null}
            </View>

            <View style={{ paddingHorizontal: 15 }}>
              <SmallText
                fontSize={12}
                text={item.payload.whoReacted.displayName}
                color={Colors.black}
              />
              <SmallText fontSize={10} text={displayInDays(item.createdAt)} />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              seenNotification(item.id);
            }}
          >
            <EntypoIcons name={'cross'} size={25} color={'#888888'} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            paddingHorizontal: 15,
            paddingBottom: 10,
          }}
        >
          <SmallText
            text={`${item.type}d your ${item.payload.entityType}`}
            color={Colors.black}
          />
        </View>
      </View>
    );
  }

  return (
    <Connectivity>
      {appCtx.isAuthenticated ? (
        <Async displayChildren={loading}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.newBg,
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          >
            <BackButton navigation={props.navigation} routeName={'HomeNav'} />
            <LargeText
              fontSize={19}
              color={Colors.black}
              text={'Notifications'}
              marginBottom={20}
              marginTop={20}
            />

            {notifications && notifications.length > 0 ? (
              <FlatList
                contentInset={{
                  bottom: 100,
                }}
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={{
                        alignSelf: 'stretch',
                        height: 20,
                        width: '100%',
                        backgroundColor: Colors.newBg,
                      }}
                    ></View>
                  );
                }}
                data={notifications}
                renderItem={({ item }) => renderNotification(item)}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <NoRecords title={`You don't have any notifications`} />
            )}
          </View>
        </Async>
      ) : (
        <WithoutLoginComponent
          navigation={props.navigation}
          title={'Login or create account to view Notifications'}
          btnTitle={'Proceed to Login'}
        />
      )}
    </Connectivity>
  );
}
export default MyNotifications;
