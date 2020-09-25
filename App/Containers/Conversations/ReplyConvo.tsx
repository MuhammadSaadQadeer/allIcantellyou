import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import BackButton from '../../Components/General/BackButton';
import BlockButton from '../../Components/General/BlockButton';
import { SmallText } from '../../Components/SmallText';
import Urls from '../../Constants/Urls';
import Api from '../../Services/Api';
import { Colors } from '../../Themes';

interface IPostAnswer {
  body: string;
  parentId: string;
  topicId: string;
  useFullName: boolean;
  usePseudonym: boolean;
}

interface IUpdateAnswer {
  body: string;
  useFullName: boolean;
  usePseudonym: boolean;
}
function ReplyConvo(props: any) {
  const [convo, setConvo] = useState(props.navigation.getParam('convo'));
  const [editMode, setEditMode] = useState(
    props.navigation.getParam('editMode'),
  );

  const [reply, setReply] = useState(editMode ? convo.body : '');

  const [isPseudonym, setisPseudonym] = useState(false);
  function postAnswerAndNavigateBack() {
    let payload: IPostAnswer = {
      body: reply,
      parentId: convo.id,
      topicId: convo.id,
      useFullName: !isPseudonym ? true : false,
      usePseudonym: isPseudonym ? isPseudonym : false,
    };

    Api({
      method: 'POST',
      data: payload,
      url: Urls.conversations.post_answer,
    })
      .then((response) => {
        props.navigation.navigate('ConversationView');
      })
      .catch((error) => {});
  }

  function updateAnswerAndNavigateBack() {
    let payload: IUpdateAnswer = {
      body: reply,
      useFullName: true,
      usePseudonym: false,
    };

    Api({
      method: 'PATCH',
      data: payload,
      url: Urls.conversations.join(convo.id),
    })
      .then((response) => {
        props.navigation.navigate('ConversationView');
      })
      .catch((error) => {});
  }
  return (
    <KeyboardAvoidingView behavior='padding'>
      <ScrollView contentInset={{ bottom: 100 }}>
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 10,
          }}
        >
          <BackButton navTitle={'Back'} navigation={props.navigation} />
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}
        >
          <TextInput
            style={{
              alignSelf: 'center',
              height: 170,
              width: '100%',
              color: Colors.black,
              backgroundColor: '#F7F7F7',
              borderRadius: 7,
              paddingVertical: 30,
              paddingHorizontal: 18,
              textAlignVertical: 'top',
            }}
            multiline={true}
            placeholder={'Write something ... '}
            value={reply}
            onChangeText={(event) => setReply(event)}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 40,
              paddingVertical: 10,
            }}
          >
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setisPseudonym(false);
              }}
            >
              <EntypoIcons
                size={20}
                color={!isPseudonym ? Colors.black : Colors.lightGray}
                name={'eye-with-line'}
              />
              <SmallText
                text={'Public Real Name'}
                color={!isPseudonym ? Colors.black : Colors.lightGray}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setisPseudonym(true);
              }}
            >
              <EntypoIcons
                size={20}
                color={isPseudonym ? Colors.black : Colors.lightGray}
                name={'eye-with-line'}
              />
              <SmallText
                text={'Public (Pseudonym)'}
                color={isPseudonym ? Colors.black : Colors.lightGray}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingVertical: 20,
            }}
          >
            <BlockButton
              width={'100%'}
              title={editMode ? 'Update' : 'Post'}
              onPress={
                editMode
                  ? updateAnswerAndNavigateBack
                  : postAnswerAndNavigateBack
              }
              color={Colors.black}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ReplyConvo;
