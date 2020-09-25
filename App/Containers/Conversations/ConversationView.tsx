import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { NavigationEvents } from 'react-navigation';
import Async from '../../Components/Async';
import Connectivity from '../../Components/Connectivity';
import BackButton from '../../Components/General/BackButton';
import BlockButton from '../../Components/General/BlockButton';
import { LargeText } from '../../Components/LargeText';
import { SmallText } from '../../Components/SmallText';
import Urls from '../../Constants/Urls';
import { AppContext } from '../../Contexts/AppContext';
import { useApi } from '../../CustomHooks';
import { displayInDays, getInitialsForDisplayName } from '../../Lib/Utils';
import Api from '../../Services/Api';
import { Colors, Fonts } from '../../Themes';
import { storyStyles } from '../Story/styles';
import { IConversationProps } from './Conversation';

function ConversationView(props: any) {
  const appCtx = useContext(AppContext);
  const [convo, setConvo] = useState<IConversationProps>(
    props.navigation.getParam('convo'),
  );
  const [getConversations, conversations, isLoading, error, success] = useApi();

  useEffect(() => {
    setConvo(props.navigation.getParam('convo'));
    getConversations('GET', Urls.conversations.join(convo.id));
  }, []);

  function editConvoPost(item: IConversationProps) {
    props.navigation.navigate('ReplyToConvo', { convo: item, editMode: true });
  }
  function renderConversationItem(item: IConversationProps) {
    let colorInvert = false;
    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        {/* Avatar view */}
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 20,
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            disabled={true}
            onPress={() => {
              // props.navigation.navigate('AuthorProfileConv', {
              //   profileData: item.author,
              // });
            }}
            style={{
              flexDirection: 'row',
              alignSelf: 'stretch',
              flex: 1,
            }}
          >
            {/* <AvatarComponent
              avatar={item.author.avatar}
              firstName={appCtx.profileData.general.firstName}
              lastName={appCtx.profileData.general.lastName}
            /> */}

            {item.author.avatar ? (
              <Avatar
                rounded
                source={{
                  uri: item.author.avatar,
                }}
                size='medium'
              />
            ) : item.author.displayName ? (
              <Avatar
                size='medium'
                rounded
                title={getInitialsForDisplayName(item.author.displayName)}
                overlayContainerStyle={{ backgroundColor: Colors.background }}
              />
            ) : null}

            <View
              style={{
                paddingHorizontal: 15,
              }}
            >
              <SmallText
                fontSize={12}
                text={
                  item.author.displayName
                    ? item.author.displayName
                    : 'All I Can Tell You'
                }
                color={colorInvert ? Colors.white : Colors.black}
              />
              <SmallText
                color={colorInvert ? Colors.white : Colors.black}
                fontSize={10}
                text={displayInDays(item.createdAt)}
              />
            </View>
          </TouchableOpacity>

          {item.author.id === appCtx.profileData.id ? (
            <Menu>
              <MenuTrigger>
                <EntypoIcons
                  size={20}
                  color={Colors.black}
                  name={'dots-three-vertical'}
                />
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  width: 150,
                  paddingHorizontal: 10,
                }}
              >
                <MenuOption onSelect={() => editConvoPost(item)}>
                  <View style={storyStyles.menuOption}>
                    <EvilIcons name={'pencil'} size={25} />
                    <Text style={storyStyles.menuOptionIcon}>Edit</Text>
                  </View>
                </MenuOption>

                <MenuOption
                  onSelect={() =>
                    Api({
                      method: 'DELETE',
                      url: Urls.conversations.delete_message(item.id),
                    })
                      .then((response) => {
                        getConversations(
                          'GET',
                          Urls.conversations.join(convo.id),
                        );
                      })
                      .catch((error) => {})
                  }
                >
                  <View style={storyStyles.menuOption}>
                    <EvilIcons size={25} name={'trash'} color={Colors.error} />
                    <Text style={storyStyles.menuOptionIcon}>Delete</Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          ) : null}
        </View>
        <SmallText text={item.body} color={Colors.black} />
        {/* Avatar view end */}
      </View>
    );
  }

  return (
    <Connectivity>
      <Async displayChildren={isLoading}>
        {/*Overlay to post answer  */}
        <NavigationEvents
          onWillFocus={() =>
            getConversations('GET', Urls.conversations.join(convo.id))
          }
        />
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,

            borderColor: '#f2f2f2',
            borderBottomWidth: 1,
            borderTopWidth: 1,
          }}
        >
          <BackButton
            navTitle={'Conversations'}
            navigation={props.navigation}
          />
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            contentInset={{ bottom: 50 }}
            ListHeaderComponent={
              <View
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <LargeText
                  fontSize={20}
                  text={convo.title}
                  marginBottom={10}
                  marginTop={20}
                  fontFamily={Fonts.type.bold}
                />
                <SmallText text={convo.body} color={Colors.black} />
              </View>
            }
            ItemSeparatorComponent={() => {
              return <Divider />;
            }}
            ListFooterComponent={
              <View
                style={{
                  marginTop: 20,
                }}
              >
                <BlockButton
                  title={'Reply'}
                  onPress={() => {
                    props.navigation.navigate('ReplyToConvo', {
                      convo: props.navigation.getParam('convo'),
                      editMode: false,
                    });
                  }}
                />
              </View>
            }
            data={conversations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => renderConversationItem(item)}
          />
        </View>
      </Async>
    </Connectivity>
  );
}

export default ConversationView;
