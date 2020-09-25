import AsyncStorage from '@react-native-community/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Divider } from 'react-native-elements';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { NormalText } from '../../Components/NormalText';
import { SmallText } from '../../Components/SmallText';
import Urls from '../../Constants/Urls';
import { AppContext } from '../../Contexts/AppContext';
import AuthenticationManager from '../../Lib/KeyChain/AuthenticationManager';
import { allTruthyProps } from '../../Lib/Utils';
import Api from '../../Services/Api';
import { Colors, Fonts } from '../../Themes';
import { IProfileData } from './Profile';
import { profileInformationStyles } from './styles';

interface IProfileGeneralInformation {
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  description: string;
  birthday: string;
  pseudonim: string;
  phone: string;
  hometown: string;
}

interface IProfileActiveFields {
  email: boolean;
  displayName: boolean;
  firstName: boolean;
  lastName: boolean;
  description: boolean;
  birthday: boolean;
  pseudonim: boolean;
  phone: boolean;
  hometown: boolean;
}

interface IProfileVisibility {
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
}
export interface IProfileInformation {
  profileInfo: IProfileData;
}
function ProfileInformation(props: IProfileInformation) {
  const appCtx = useContext(AppContext);

  const [updateProfileData, setUpdateProfileData] = useState<
    IProfileGeneralInformation
  >(props.profileInfo.general);
  const [editModeOn, setEditModeOn] = useState(false);
  const [visibility, setVisibility] = useState<IProfileVisibility>(
    props.profileInfo.visibility,
  );
  const [activeFields, setActiveFields] = useState<IProfileActiveFields>({
    email: false,
    displayName: false,
    firstName: false,
    lastName: false,
    description: false,
    birthday: false,
    pseudonim: false,
    phone: false,
    hometown: false,
  });

  useEffect(() => {
    setVisibility(props.profileInfo.visibility);
  }, []);
  function editModeOff() {
    setEditModeOn(false);
    setUpdateProfileData(props.profileInfo.general);
  }
  useEffect(() => {}, [activeFields]);
  function onChangeText(text, key) {
    setUpdateProfileData({
      ...updateProfileData,
      [key]: text,
    });
  }

  function changeFocus(key) {
    setActiveFields({
      ...activeFields,
      [key]: true,
    });
  }

  function changeBlur(key) {
    setActiveFields({
      ...activeFields,
      [key]: false,
    });
  }

  function updatePrivacyMode(payload: any) {
    Api({
      method: 'PATCH',
      url: Urls.profile.me,
      data: { visibility: payload },
    })
      .then((response) => {
        // setUpdateProfileData(response.data.general);
        setVisibility(response.data.visibility);
      })
      .catch((error) => {});
  }
  function renderPublicPrivate(scope: string, formValueName?: any) {
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onPress={() =>
          updatePrivacyMode({
            [formValueName]: scope === 'public' ? 'private' : 'public',
          })
        }
      >
        <EntypoIcons
          style={{ marginRight: 10 }}
          size={15}
          color={Colors.black}
          name={scope !== 'public' ? 'eye-with-line' : 'eye'}
        />
        <SmallText
          color={Colors.black}
          text={scope !== 'public' ? 'Private' : 'Public'}
        />
      </TouchableOpacity>
    );
  }

  function saveProfileInformation() {
    setEditModeOn(false);
    Api({
      method: 'PATCH',
      url: Urls.profile.me,
      data: { general: updateProfileData },
    })
      .then((response) => {
        setUpdateProfileData(response.data.general);
      })
      .catch((error) => {});
  }

  function renderNameAndSymbol(
    label: string,
    value: string,
    scope: string,
    formValueName?: string,
  ) {
    return (
      <View style={{ paddingVertical: 20 }}>
        {value ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'stretch',
              }}
            >
              <SmallText fontSize={10} text={label} marginBottom={10} />

              {renderPublicPrivate(scope, formValueName)}
            </View>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{ width: '70%' }}>
                <NormalText text={value} color={Colors.black} />
              </View>
            </View>
            <Divider />
          </>
        ) : null}
      </View>
    );
  }

  function topSection() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            editModeOn ? editModeOff() : setEditModeOn(true);
          }}
          style={{
            flexDirection: 'row',
            borderColor: editModeOn ? 'red' : Colors.black,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
            borderRadius: 7,
          }}
        >
          <Text
            style={{
              color: editModeOn ? 'red' : null,
            }}
          >
            {editModeOn ? 'Cancel ' : 'Edit '}
          </Text>
          <AntDesignIcons
            style={{
              color: editModeOn ? 'red' : null,
            }}
            name={'form'}
            size={15}
          />
        </TouchableOpacity>

        {editModeOn ? (
          <TouchableOpacity
            onPress={() => {
              saveProfileInformation();
            }}
            style={{
              flexDirection: 'row',
              padding: 8,
              borderRadius: 7,
              borderWidth: 1,
              backgroundColor: allTruthyProps(updateProfileData)
                ? Colors.black
                : Colors.black,
            }}
            disabled={!allTruthyProps(updateProfileData)}
          >
            <Text style={{ color: Colors.white }}>Save </Text>
            <AntDesignIcons name={'save'} size={15} color={Colors.white} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
  return (
    <View style={{ paddingHorizontal: 20 }}>
      {/* Shows save and cancel button in case of edit mode on */}
      {topSection()}
      {props.profileInfo && props.profileInfo.general && visibility ? (
        <View>
          {editModeOn ? (
            <View style={{ paddingVertical: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'stretch',
                }}
              >
                <SmallText
                  fontSize={10}
                  text={'First Name'}
                  marginBottom={10}
                />
                {renderPublicPrivate(visibility.firstName, 'firstName')}
              </View>
              {}
              <TextInput
                onBlur={() => {
                  changeBlur('firstName');
                }}
                onFocus={() => {
                  changeFocus('firstName');
                }}
                defaultValue={props.profileInfo.general.firstName}
                style={[
                  profileInformationStyles.profileInfoTextField,
                  {
                    borderBottomColor: activeFields.firstName
                      ? Colors.background
                      : null,
                  },
                  {
                    borderBottomColor: !updateProfileData.firstName
                      ? 'red'
                      : null,
                  },
                ]}
                onChangeText={(text) => onChangeText(text, 'firstName')}
                value={updateProfileData.firstName}
              />
            </View>
          ) : (
            renderNameAndSymbol(
              'First Name',
              updateProfileData.firstName,
              visibility.firstName,
              'firstName',
            )
          )}

          {editModeOn ? (
            <View style={{ paddingVertical: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'stretch',
                }}
              >
                <SmallText fontSize={10} text={'Last Name'} marginBottom={10} />
                {renderPublicPrivate(visibility.lastName, 'lastName')}
              </View>
              <TextInput
                onFocus={() => {
                  changeFocus('lastName');
                }}
                onBlur={() => {
                  changeBlur('lastName');
                }}
                style={[
                  profileInformationStyles.profileInfoTextField,
                  {
                    borderBottomColor: activeFields.lastName
                      ? Colors.background
                      : null,
                  },
                  {
                    borderBottomColor: !updateProfileData.lastName
                      ? 'red'
                      : null,
                  },
                ]}
                onChangeText={(text) => onChangeText(text, 'lastName')}
                value={updateProfileData.lastName}
              />
            </View>
          ) : (
            renderNameAndSymbol(
              'Second Name',
              updateProfileData.lastName,
              visibility.lastName,
              'lastName',
            )
          )}

          {editModeOn ? (
            <View style={{ paddingVertical: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'stretch',
                }}
              >
                <SmallText fontSize={10} text={'About You'} marginBottom={10} />
                {renderPublicPrivate(visibility.description, 'description')}
              </View>
              <TextInput
                onBlur={() => changeBlur('description')}
                onFocus={() => {
                  changeFocus('description');
                }}
                multiline={true}
                style={[
                  profileInformationStyles.profileInfoTextField,

                  {
                    borderBottomColor: activeFields.description
                      ? Colors.background
                      : null,
                  },
                  {
                    borderBottomColor: !updateProfileData.description
                      ? 'red'
                      : null,
                  },
                ]}
                onChangeText={(text) => onChangeText(text, 'description')}
                value={updateProfileData.description}
              />
            </View>
          ) : (
            renderNameAndSymbol(
              'About You',
              updateProfileData.description,
              visibility.description,
              'description',
            )
          )}

          {editModeOn ? (
            <View style={{ paddingVertical: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'stretch',
                }}
              >
                <SmallText fontSize={10} text={'Date Of Birth'} />
                {renderPublicPrivate(visibility.birthday, 'birthday')}
              </View>

              <DatePicker
                style={{
                  width: '100%',
                }}
                date={updateProfileData.birthday}
                mode='date'
                placeholder='Date of Birth'
                format='YYYY-MM-DD'
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                customStyles={{
                  dateInput: {
                    color: Colors.black,
                    textAlign: 'left',
                    alignItems: 'flex-start',
                    borderRightColor: Colors.transparent,
                    borderLeftColor: Colors.transparent,
                    borderTopColor: Colors.transparent,
                    borderBottomColor: Colors.black,
                  },
                  dateText: {
                    fontFamily: Fonts.type.regular,
                    fontSize: 16,
                  },

                  // ... You can check the source to find the other keys.
                }}
                showIcon={false}
                onDateChange={(date) => {
                  setUpdateProfileData({
                    ...updateProfileData,
                    birthday: date,
                  });
                }}
              />
            </View>
          ) : (
            renderNameAndSymbol(
              'Date Of Birth',
              updateProfileData.birthday,
              visibility.birthday,
              'birthday',
            )
          )}
          {editModeOn ? (
            <View style={{ paddingVertical: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'stretch',
                }}
              >
                <SmallText fontSize={10} text={'Phone'} marginBottom={10} />
                {renderPublicPrivate(visibility.phone, 'phone')}
              </View>
              <TextInput
                onBlur={() => changeBlur('phone')}
                onFocus={() => {
                  changeFocus('phone');
                }}
                style={[
                  profileInformationStyles.profileInfoTextField,

                  {
                    borderBottomColor: activeFields.phone
                      ? Colors.background
                      : null,
                  },
                  {
                    borderBottomColor: !updateProfileData.phone ? 'red' : null,
                  },
                ]}
                onChangeText={(text) => onChangeText(text, 'phone')}
                value={updateProfileData.phone}
              />
            </View>
          ) : (
            renderNameAndSymbol(
              'Phone Number',
              updateProfileData.phone,
              visibility.phone,
              'phone',
            )
          )}

          {editModeOn ? (
            <View style={{ paddingVertical: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'stretch',
                }}
              >
                <SmallText fontSize={10} text={'Hometown'} marginBottom={10} />
                {renderPublicPrivate(visibility.hometown, 'hometown')}
              </View>
              <TextInput
                onBlur={() => changeBlur('hometown')}
                onFocus={() => {
                  changeFocus('hometown');
                }}
                style={[
                  profileInformationStyles.profileInfoTextField,
                  {
                    borderBottomColor: activeFields.hometown
                      ? Colors.background
                      : null,
                  },
                  {
                    borderBottomColor: !updateProfileData.hometown
                      ? 'red'
                      : null,
                  },
                ]}
                onChangeText={(text) => onChangeText(text, 'hometown')}
                value={updateProfileData.hometown}
              />
            </View>
          ) : (
            renderNameAndSymbol(
              'Hometown',
              updateProfileData.hometown,
              visibility.hometown,
              'hometown',
            )
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingVertical: 15,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                const authManger = new AuthenticationManager();
                authManger.remove().then(() => {
                  props.navigation.navigate('Login');
                  appCtx.dispatch({
                    type: 'IS_AUTHENTICATED',
                    isAuthenticated: false,
                  });
                });

                AsyncStorage.removeItem('token').then(() => {});
              }}
            >
              <AntDesignIcons style={{ marginRight: 5 }} name={'logout'} />
              <NormalText text={'Logout'} />
            </TouchableOpacity>
          </View>
          <Divider />
        </View>
      ) : null}
    </View>
  );
}

export default ProfileInformation;
