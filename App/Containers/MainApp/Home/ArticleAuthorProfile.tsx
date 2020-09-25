import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, ButtonGroup, Divider } from 'react-native-elements';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Async from '../../../Components/Async';
import Connectivity from '../../../Components/Connectivity';
import BackButton from '../../../Components/General/BackButton';
import { LargeText } from '../../../Components/LargeText';
import { NormalText } from '../../../Components/NormalText';
import { SmallText } from '../../../Components/SmallText';
import WithoutLoginComponent from '../../../Components/WithoutLoginComponent';
import Urls from '../../../Constants/Urls';
import { AppContext } from '../../../Contexts/AppContext';
import {
  getInitialsForDisplayName,
  saveInAsyncStorage,
  showNotification,
} from '../../../Lib/Utils';
import Api from '../../../Services/Api';
import { Colors, Fonts } from '../../../Themes';
import { IProfileData } from '../../Profile/Profile';
import { storyStyles } from '../../Story/styles';

// {
//   "id": "81b78bc7-bad8-4eff-8c8a-ea808dc228b3",
//   "avatar": "http://aictywebimages.s3-website-eu-west-1.amazonaws.com/avatars/4b3ff986-0fe3-48a6-a074-f958b9bf5a31.jpeg",
//   "followed": false,
//   "general": {
//     "email": "james@allicantellyou.com",
//     "displayName": "James McDougall",
//     "description": "All I Can Tell You Technical lead.  I hope you enjoy our platform!",
//     "birthday": "1992-09-12",
//     "pseudonim": "JM",
//     "phone": "+447766246415",
//     "hometown": "Edinburgh"
//   },
function ArticleAuthorProfile(props: IProfileData) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<IProfileData>();
  const [isFollowing, setIsFollowing] = useState(false);
  const appCtx = useContext(AppContext);
  useEffect(() => {
    setIsLoading(true);
    Api({
      method: 'GET',
      url: `${Urls.profile.user}${props.navigation.getParam('profileData').id}`,
    })
      .then((response) => {
        setProfileData(response.data);
        setIsFollowing(response.data.followed);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
    //   setProfileData(props.navigation.getParam('profileData'));
  }, []);

  function updateIndex(selectedIndex: number) {
    setSelectedIndex(selectedIndex);
  }

  useEffect(() => {}, [isFollowing]);

  const profileInterests = () => {
    return (
      <NormalText
        text='Profile Information'
        color={selectedIndex === 1 ? Colors.black : null}
      />
    );
  };
  const followers = () => {
    return (
      <NormalText
        text={'Profile Interests'}
        color={selectedIndex === 2 ? Colors.black : null}
      />
    );
  };

  function interestPills(title: string, category: string) {
    return (
      <View
        style={{
          borderColor: '#EFEFEF',
          borderRadius: 7,
          borderWidth: 1,
          backgroundColor: '#EFEFEF',
          marginRight: 8,
          marginBottom: 5,
        }}
      >
        <Text
          style={{
            padding: 10,
            color: '#888888',
          }}
        >
          {title ? title : 'Nothing to display'}
        </Text>
      </View>
    );
  }

  function followProfile(profileId) {
    Api({
      method: 'POST',
      url: 'follow',
      data: { userId: profileId },
    })
      .then((response) => {
        setIsFollowing(response.data.followed);
      })
      .catch((error) => {});
  }

  function blockUserAndGoBackToArticles(userId: string) {
    saveInAsyncStorage('blockedUsers', userId);
    showNotification(
      `User blocked has been blocked, we're sorry for your inconvenience`,
    );
    props.navigation.navigate('Articles', { refresh: true });
    if (isFollowing) {
      followProfile(userId);
    }
  }

  function renderInterests(interest: IInterests) {
    return (
      <View style={{ paddingVertical: 20 }}>
        <LargeText text={interest.title} />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',

            marginTop: 9,
          }}
        >
          {interest.values.length > 0 ? (
            interest.values.map((title) => {
              return interestPills(title, interest.title);
            })
          ) : (
            <Text style={{ color: '#888888' }}>Nothing to display</Text>
          )}
        </View>
      </View>
    );
  }

  const buttons = [{ element: profileInterests }, { element: followers }];

  return (
    <Connectivity>
      {appCtx.isAuthenticated ? (
        <Async displayChildren={loading}>
          <ScrollView>
            {profileData ? (
              <View>
                <View
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                  }}
                >
                  <BackButton navigation={props.navigation} />

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
                      <MenuOption
                        onSelect={() => {
                          Alert.alert(
                            'Report User',
                            `Write an email to us about the abusive conduct or behaviour by any user and we will get back to you with proper action with in 24 hours`,
                            [
                              {
                                text: 'Write Email',
                                onPress: () =>
                                  Linking.openURL(
                                    `mailto:hello@allicantellyou.com`,
                                  ),
                              },
                              { text: 'Cancel', onPress: () => {} },
                            ],
                          );
                        }}
                      >
                        <Text style={storyStyles.menuOptions}>Report</Text>
                      </MenuOption>

                      <MenuOption
                        onSelect={() => {
                          Alert.alert(
                            'Block User',
                            `On blocking user you won't be able to see the content posted by the user how ever you can unblock them from settings`,
                            [
                              {
                                text: 'Block User',
                                onPress: () =>
                                  blockUserAndGoBackToArticles(profileData.id),
                              },
                              { text: 'Cancel', onPress: () => {} },
                            ],
                          );
                        }}
                      >
                        <Text style={storyStyles.menuOptions}>Block</Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>

                  {/* <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Block User',
                        'Are you sure you want to block this user ?',
                        [
                          {
                            text: 'Yes',
                            onPress: () => blockUser(profileData.id),
                          },
                          { text: 'No', onPress: () => {} },
                        ],
                      );
                    }}
                  >
                    <Text>Block user</Text>
                  </TouchableOpacity> */}
                </View>
                {/* Profile View */}

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {profileData.avatar ? (
                    <Image
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: 44,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: Colors.background,
                        borderWidth: 1,
                      }}
                      source={{
                        uri: profileData.avatar,
                      }}
                    />
                  ) : profileData.general.displayName ? (
                    <Avatar
                      rounded
                      size={'medium'}
                      overlayContainerStyle={{
                        backgroundColor: Colors.background,
                      }}
                      title={getInitialsForDisplayName(
                        profileData.general.displayName,
                      )}
                    />
                  ) : null}

                  {profileData.general && profileData.general.displayName ? (
                    <LargeText
                      marginTop={20}
                      marginBottom={10}
                      fontSize={20}
                      text={profileData.general.displayName}
                      color={Colors.black}
                    />
                  ) : null}

                  {/* <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.background,
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      marginTop: 10,
                      borderRadius: 7,
                      backgroundColor: isFollowing
                        ? Colors.background
                        : Colors.transparent,
                    }}
                    onPress={() =>
                      Linking.openURL(`mailto:hello@allicantellyou.com`)
                    }
                  >
                    <Text
                      style={{
                        color: !isFollowing ? Colors.background : Colors.white,
                      }}
                    >
                      Report
                    </Text>
                  </TouchableOpacity> */}

                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.background,
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      marginTop: 10,
                      borderRadius: 7,
                      backgroundColor: isFollowing
                        ? Colors.background
                        : Colors.transparent,
                    }}
                    onPress={() => {
                      followProfile(profileData.id);
                    }}
                  >
                    <Text
                      style={{
                        color: !isFollowing ? Colors.background : Colors.white,
                      }}
                    >
                      {!isFollowing ? `Follow` : `Following`}
                    </Text>
                  </TouchableOpacity>

                  {profileData.general && profileData.general.description ? (
                    <Text
                      style={{
                        color: '#888888',
                        fontSize: 14,
                        fontFamily: Fonts.type.regular,
                        marginTop: 10,
                        textAlign: 'center',
                        paddingHorizontal: 35,
                      }}
                    >
                      {profileData.general.description}
                    </Text>
                  ) : null}
                </View>

                <ButtonGroup
                  onPress={updateIndex}
                  selectedIndex={selectedIndex}
                  buttons={buttons}
                  containerStyle={{
                    backgroundColor: '#F7F7F7',
                    width: '100%',

                    alignSelf: 'center',
                  }}
                  innerBorderStyle={{ color: Colors.transparent }}
                  //buttonStyle={homeStyles.homeNavButtonStyle}
                  selectedButtonStyle={{ backgroundColor: Colors.transparent }}
                  selectedTextStyle={{ color: Colors.black }}
                />
                <View style={{ marginBottom: 30, paddingHorizontal: 20 }}>
                  {selectedIndex === 0 ? (
                    <View>
                      <View style={{ paddingVertical: 20 }}>
                        {profileData.general &&
                        profileData.general.displayName ? (
                          <>
                            <SmallText
                              fontSize={10}
                              text={'Name'}
                              marginBottom={10}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <View style={{ width: '70%' }}>
                                <NormalText
                                  text={profileData.general.displayName}
                                  color={Colors.black}
                                />
                              </View>
                            </View>
                            <Divider />
                          </>
                        ) : null}

                        {profileData.general && profileData.general.email ? (
                          <>
                            <SmallText
                              fontSize={10}
                              text={'Email'}
                              marginBottom={10}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <View style={{ width: '70%' }}>
                                <NormalText
                                  text={profileData.general.email}
                                  color={Colors.black}
                                />
                              </View>
                            </View>
                            <Divider />
                          </>
                        ) : null}

                        {profileData.general && profileData.general.birthday ? (
                          <>
                            <SmallText
                              fontSize={10}
                              text={'BirthDay'}
                              marginBottom={10}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <View style={{ width: '70%' }}>
                                <NormalText
                                  text={profileData.general.birthday}
                                  color={Colors.black}
                                />
                              </View>
                            </View>
                            <Divider />
                          </>
                        ) : null}

                        {profileData.general && profileData.general.hometown ? (
                          <>
                            <SmallText
                              fontSize={10}
                              text={'Home Town'}
                              marginBottom={10}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <View style={{ width: '70%' }}>
                                <NormalText
                                  text={profileData.general.hometown}
                                  color={Colors.black}
                                />
                              </View>
                            </View>
                            <Divider />
                          </>
                        ) : null}

                        {profileData.pseudonim &&
                        profileData.general.pseudonim ? (
                          <>
                            <SmallText
                              fontSize={10}
                              text={'Pseudonim'}
                              marginBottom={10}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <View style={{ width: '70%' }}>
                                <NormalText
                                  text={profileData.general.pseudonim}
                                  color={Colors.black}
                                />
                              </View>
                            </View>
                            <Divider />
                          </>
                        ) : null}

                        {profileData.general && profileData.general.phone ? (
                          <>
                            <SmallText
                              fontSize={10}
                              text={'Phone'}
                              marginBottom={10}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <View style={{ width: '70%' }}>
                                <NormalText
                                  text={profileData.general.phone}
                                  color={Colors.black}
                                />
                              </View>
                            </View>
                            <Divider />
                          </>
                        ) : null}
                      </View>
                    </View>
                  ) : null}
                  {selectedIndex === 1 ? (
                    <React.Fragment>
                      {profileData.interests
                        ? profileData.interests.map(
                            (interest, index: number) => {
                              return (
                                <React.Fragment>
                                  <View
                                    style={{
                                      paddingHorizontal: 20,
                                    }}
                                  >
                                    {renderInterests(interest)}
                                  </View>
                                  <Divider />
                                </React.Fragment>
                              );
                            },
                          )
                        : null}
                    </React.Fragment>
                  ) : null}
                </View>
              </View>
            ) : null}
          </ScrollView>
        </Async>
      ) : (
        <WithoutLoginComponent
          navigation={props.navigation}
          title={'Login or create account to view Members'}
          btnTitle={'Proceed To Login'}
        />
      )}
    </Connectivity>
  );
}

export default ArticleAuthorProfile;
