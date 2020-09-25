import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Async from '../../Components/Async';
import BtnGroupItem from '../../Components/ButtonGroupItem';
import Connectivity from '../../Components/Connectivity';
import BackButton from '../../Components/General/BackButton';
import TopBar from '../../Components/General/TopBar';
import { LargeText } from '../../Components/LargeText';
import { NormalText } from '../../Components/NormalText';
import WithoutLoginComponent from '../../Components/WithoutLoginComponent';
import Urls from '../../Constants/Urls';
import { AppContext } from '../../Contexts/AppContext';
import Api from '../../Services/Api';
import { Colors } from '../../Themes';
import BlockedUsers from './BlockedUsers';
import Followers from './Followers';
import ProfileInformation from './ProfileInformation';
import ProfileInterests from './ProfileInterests';

export interface IProfileData {
  id: string;
  isAnonymous: boolean;
  isAdmin: boolean;
  newsSubscription: boolean;
  avatar: string;
  general: {
    email: string;
    displayName: string;
    firstName: string;
    lastName: string;
    description: string;
    birthday: string;
    pseudonim: string;
    phone: string;
    hometown: string;
  };
  visibility: {
    birthday: string;
    firstName: string;
    lastName: string;
    hometown: string;
    phone: string;
    description: string;
    avatar: string;
    interests: string;
    pseudonim: string;
    photos: string;
    email: string;
  };
  interests: [
    {
      id: string;
      title: string;
      question: string;
      values: [];
    },
  ];
  photos: [];
  bioAnswers: [];
  settings: {};
}

const options = {
  title: 'Select Avatar',
  // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

function Profile(props: any) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [profileData, setProfileData] = useState<IProfileData>();
  const [loading, setIsLoading] = useState(false);
  const [responseUrl, setResponseUrl] = useState('');
  const [pfpLoading, setPfPLoading] = useState(false);
  const appCtx = useContext(AppContext);

  useEffect(() => {
    setIsLoading(true);
    Api({
      method: 'GET',
      url: Urls.profile.me,
    })
      .then((result) => {
        setIsLoading(false);
        setProfileData(result.data);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);
  function updateIndex(selectedIndex: number) {
    setSelectedIndex(selectedIndex);
  }

  const buttons = [
    {
      element: () => (
        <BtnGroupItem
          title={'Profile Info'}
          color={selectedIndex == 0 ? Colors.black : Colors.lightGray}
        />
      ),
    },
    {
      element: () => (
        <BtnGroupItem
          title={'Profile Interests'}
          color={selectedIndex == 1 ? Colors.black : Colors.lightGray}
        />
      ),
    },
    {
      element: () => (
        <BtnGroupItem
          title={'Followers'}
          color={selectedIndex == 2 ? Colors.black : Colors.lightGray}
        />
      ),
    },
    {
      element: () => (
        <BtnGroupItem
          title={'Blocked'}
          color={selectedIndex == 3 ? Colors.black : Colors.lightGray}
        />
      ),
    },
  ];

  return (
    <Connectivity>
      <Async displayChildren={loading}>
        <View style={{ flex: 1 }}>
          {appCtx.isAuthenticated ? (
            <ScrollView contentInset={{ bottom: 200 }}>
              {profileData && profileData.general ? (
                <View style={{ paddingHorizontal: 23, marginTop: 10 }}>
                  <BackButton
                    navigation={props.navigation}
                    routeName={'MainApp'}
                  />

                  {/* Profile View */}
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    {profileData.avatar ? (
                      <TouchableOpacity
                        onPress={() => {
                          ImagePicker.launchImageLibrary(
                            options,
                            (response) => {
                              setPfPLoading(true);

                              if (response.didCancel) {
                                setPfPLoading(false);
                              } else if (response.error) {
                                setPfPLoading(false);
                              } else {
                                /** From data to upload file at the backend */
                                const request = new FormData();
                                request.append(
                                  'avatar',
                                  `data:image/png;base64,${response.data}`,
                                );
                                Api({
                                  method: 'POST',
                                  url: Urls.profile.avatar,
                                  data: request,
                                })
                                  .then((response) => {
                                    setResponseUrl(response.data.avatarUrl);
                                    setPfPLoading(false);
                                  })
                                  .catch((error) => {
                                    setPfPLoading(false);
                                  });
                              }
                            },
                          );
                        }}
                      >
                        {pfpLoading ? (
                          <ActivityIndicator
                            size={'large'}
                            color={Colors.darkSkyBlue}
                          />
                        ) : (
                          <Image
                            style={{ width: 88, height: 88, borderRadius: 44 }}
                            source={{
                              uri: responseUrl
                                ? responseUrl
                                : profileData.avatar,
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={{
                          width: 88,
                          height: 88,
                          borderRadius: 44,
                          justifyContent: 'center',
                          alignItems: 'center',

                          marginTop: 20,
                          backgroundColor: Colors.background,
                        }}
                      >
                        <LargeText
                          text={`${profileData.general.firstName.charAt(
                            0,
                          )}${profileData.general.lastName.charAt(0)} `}
                          color={Colors.white}
                        />
                      </View>
                    )}
                  </View>
                  {/* <AvatarComponent
                  avatar={profileData.avatar}
                  firstName={profileData.general.firstName}
                  lastName={profileData.general.lastName}
                /> */}
                  <LargeText
                    text={`${profileData.general.firstName} ${profileData.general.lastName}`}
                    marginTop={20}
                    textAlign={'center'}
                  />
                  <NormalText
                    textAlign={'center'}
                    text={profileData.general.description}
                    marginTop={20}
                  />
                  {/* Profile View ends */}

                  {/* Trust View */}
                  {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 20,
                  }}
                >
                  <NormalText
                    text={'Your Trusted Level'}
                    color={Colors.black}
                  />
                  <NormalText text={'Improve ?'} />
                </View>

                <View>
                  <ProgressBarAnimated
                    {...progressCustomStyles}
                    width={barWidth}
                    height={35}
                    maxValue={100}
                    value={20}
                    text={'Level 2'}
                  />
                </View> */}
                </View>
              ) : null}

              <ButtonGroup
                onPress={updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={{
                  backgroundColor: '#F7F7F7',
                  width: '100%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                innerBorderStyle={{ color: Colors.transparent }}
                selectedButtonStyle={{
                  backgroundColor: Colors.transparent,
                }}
                textStyle={{
                  color: Colors.background,
                }}
                disabledTextStyle={{ color: Colors.lightGray }}
              />
              <View style={{ marginBottom: 30 }}>
                {selectedIndex === 0 ? (
                  profileData && profileData.general ? (
                    <ProfileInformation
                      profileInfo={profileData}
                      selected={selectedIndex}
                      navigation={props.navigation}
                    />
                  ) : null
                ) : null}
                {selectedIndex === 1 ? (
                  <ProfileInterests
                    interests={
                      profileData.interests ? profileData.interests : []
                    }
                    selected={selectedIndex}
                  />
                ) : null}
                {selectedIndex === 2 ? (
                  <Followers selected={selectedIndex} />
                ) : null}

                {selectedIndex === 3 ? (
                  <BlockedUsers selected={selectedIndex} />
                ) : null}
              </View>
            </ScrollView>
          ) : (
            <WithoutLoginComponent
              navigation={props.navigation}
              title={'Login or create account to view Profile'}
              btnTitle={'Proceed to Login'}
            />
          )}
        </View>
      </Async>
    </Connectivity>
  );
}

Profile.navigationOptions = ({ navigation }) => ({
  title: 'Detail',
  header: <TopBar navigation={navigation} />,
});

export default Profile;
