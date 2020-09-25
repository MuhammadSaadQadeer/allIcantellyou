import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider } from 'react-native-elements';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { LargeText } from '../../Components/LargeText';
import { NormalText } from '../../Components/NormalText';
import { SmallText } from '../../Components/SmallText';
import Urls from '../../Constants/Urls';
import { showNotification } from '../../Lib/Utils';
import Api from '../../Services/Api';
import { Colors } from '../../Themes';

interface IInterests {
  id: string;
  title: string;
  question: string;
  values: [];
}

function ProfileInterests(props: any) {
  const [interests, setInterests] = useState<IInterests[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [editingValueName, setEditingValueName] = useState({
    id: '',
    inputValue: '',
  });
  const [value, setValue] = useState('');
  useEffect(() => {
    setInterests(props.interests);
  }, []);

  useEffect(() => {
    setShouldUpdate(false);
  }, [interests, shouldUpdate]);
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
          {title}
        </Text>
        {editingValueName.inputValue === category ? (
          <TouchableOpacity
            onPress={() => {
              // setPillToRemove(title);
              removeInterest(title);
            }}
            style={{ position: 'absolute', alignSelf: 'flex-end', top: -5 }}
          >
            <AntDesignIcon name={'closecircle'} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  function saveAndUpdateInterests() {
    if (!value) {
      setEditingValueName({
        inputValue: '',
        id: '',
      });
      return;
    }
    let tempObject = interests;
    for (let i = 0; i < tempObject.length; i++) {
      if (tempObject[i].id == editingValueName.id) {
        if (value) {
          tempObject[i].values.push(value);
        }
        setInterests(tempObject);
        updateInterestRequest(tempObject[i]);
        setEditingValueName({
          inputValue: '',
          id: '',
        });
        setValue('');
        return;
      }
    }
  }

  function updateInterestRequest(payload) {
    Api({
      method: 'PATCH',
      url: Urls.profile.me,
      data: { interests: [payload] },
    })
      .then((response) => {
        if (response.data) {
          showNotification('Profile interests updated successfully');
        }
      })
      .catch((error) => {});
  }

  function removeInterest(pillToRemove: string) {
    let tempObject = interests;
    for (let i = 0; i < tempObject.length; i++) {
      if (tempObject[i].id == editingValueName.id) {
        for (let j = 0; j < tempObject[i].values.length; j++) {
          if (tempObject[i].values[j] === pillToRemove) {
            tempObject[i].values.splice(j, 1);
            setInterests(tempObject);
            updateInterestRequest(tempObject[i]);
            setShouldUpdate(true);
            setValue('');
            return;
          }
        }
      }
    }
  }

  function onChangeText(text) {
    setValue(text);
  }
  function renderInterests(interest: IInterests) {
    return (
      <View style={{ paddingVertical: 20 }}>
        <LargeText text={interest.title} />
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 7,
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setEditingValueName({
                inputValue: interest.title,
                id: interest.id,
              });
            }}
            style={{ flexDirection: 'row' }}
          >
            <AntDesignIcon name={'plussquareo'} color={'#888888'} size={20} />
            <SmallText marginLeft={10} text={`Add ${interest.title}`} />
          </TouchableOpacity>
          {editingValueName.inputValue === interest.title ? (
            <TouchableOpacity
              onPress={() => {
                saveAndUpdateInterests();
              }}
              style={{ backgroundColor: Colors.black, borderRadius: 3 }}
            >
              <Text style={{ color: Colors.white, padding: 8 }}>Done</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {editingValueName.inputValue === interest.title ? (
          <ScrollView>
            <TextInput
              style={{
                borderColor: 'gray',
                borderWidth: 1,
                borderTopColor: Colors.transparent,
                borderRightColor: Colors.transparent,
                borderLeftColor: Colors.transparent,
                marginBottom: 5,
              }}
              onActi
              onChangeText={(text) => onChangeText(text)}
              value={value}
            />
          </ScrollView>
        ) : null}

        {interest.values.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',

              marginTop: 9,
            }}
          >
            {interest.values.map((title) => {
              return interestPills(title, interest.title);
            })}
          </View>
        ) : (
          <NormalText
            text={`Please add your first ${interest.title}. This helps you connect with like minded people if you choose to share your information`}
            marginTop={5}
            marginBottom={5}
          />
        )}
      </View>
    );
  }

  return (
    <View>
      {interests
        ? interests.map((interest: IInterests, index: number) => {
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
          })
        : null}
    </View>
  );
}

export default ProfileInterests;
