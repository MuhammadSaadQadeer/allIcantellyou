import React, { useContext, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { ButtonGroup, Divider } from 'react-native-elements';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Async from '../../Components/Async';
import BtnGroupItem from '../../Components/ButtonGroupItem';
import Connectivity from '../../Components/Connectivity';
import BackButton from '../../Components/General/BackButton';
import BlockButton from '../../Components/General/BlockButton';
import { LargeText } from '../../Components/LargeText';
import { SmallText } from '../../Components/SmallText';
import Urls from '../../Constants/Urls';
import { showNotification } from '../../Lib/Utils';
import Api from '../../Services/Api';
import { Colors, Fonts } from '../../Themes';
import { StoryContext } from './StoryContex';

interface IQuestion {
  id: string;
  text: string;
  answered: boolean;
  category: string;
  collapsed: boolean;
}

interface IAnswer {
  id: string;
  answer: string;
  answeredAt: string;
  public: boolean;
  useFullName: boolean;
  question: {
    id: string;
    text: string;
    answered: boolean;
    category: string;
  };
}

interface IPostAnswerPayload {
  public: boolean;
  questionId: string;
  text: string;
  useFullName: boolean;
}

interface IMyStory {
  questions: IQuestion[];
  answers: IAnswer[];
}
function Questions(props: any) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [myLifeStory, setMyLifeStory] = useState<IMyStory>({
    questions: [],
    answers: [],
  });

  const [past, setPast] = useState();
  const [present, setPresent] = useState();
  const [future, setFuture] = useState();
  const [collapseId, setCollapseId] = useState('');
  const [answer, setAnswer] = useState('');
  const [isPrivateAns, setIsPrivateAns] = useState(false);
  const [isRealName, setIsRealName] = useState(true);
  const [isPostingAnswer, setIsPostingAnswer] = useState(false);
  const storyCtx = useContext(StoryContext);
  useEffect(() => {}, [collapseId]);

  useEffect(() => {
    if (myLifeStory.answers && myLifeStory.answers.length) {
      const pastQuestions = myLifeStory.questions.filter(
        (item) => item.category === 'Past',
      );

      setPast(pastQuestions);

      const prsentQuestions = myLifeStory.questions.filter(
        (item) => item.category === 'Present',
      );
      setPresent(prsentQuestions);

      const futureQuestions = myLifeStory.questions.filter(
        (item) => item.category === 'Future',
      );
      setFuture(futureQuestions);
    }
  }, [myLifeStory]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  function fetchQuestions() {
    setIsPostingAnswer(true);
    Api({
      method: 'GET',
      url: Urls.my_story.bio,
    })
      .then((response) => {
        storyCtx.dispatch({
          type: 'FETCH_QUESTIONS',
          myLifeStory: response.data,
        });
        setMyLifeStory(response.data);
        setIsPostingAnswer(false);
      })
      .catch((error) => {
        showNotification('Something went wrong');
        setIsPostingAnswer(false);
      });
  }

  function updateIndex(selectedIndex: number) {
    setSelectedIndex(selectedIndex);
  }

  const buttons = [
    {
      element: () => (
        <BtnGroupItem
          title={'All'}
          color={selectedIndex == 0 ? Colors.black : Colors.lightGray}
        />
      ),
    },
    {
      element: () => (
        <BtnGroupItem
          title={'Past'}
          color={selectedIndex == 1 ? Colors.black : Colors.lightGray}
        />
      ),
    },
    {
      element: () => (
        <BtnGroupItem
          title={'Present'}
          color={selectedIndex == 2 ? Colors.black : Colors.lightGray}
        />
      ),
    },
    {
      element: () => (
        <BtnGroupItem
          title={'Future'}
          color={selectedIndex == 3 ? Colors.black : Colors.lightGray}
        />
      ),
    },
  ];

  function postAnswer(collapsibleId: string) {
    Api({
      method: 'POST',
      url: Urls.my_story.answers,
      data: {
        questionId: collapsibleId,
        text: answer,
        useFullName: isPrivateAns ? false : isRealName,
        public: !isPrivateAns,
      },
    })
      .then((response) => {
        if (response.data && response.data.id) {
          showNotification('Answer posted successfully!');
          setAnswer('');
        }

        setIsRealName(true);
        setIsPrivateAns(false);
        fetchQuestions();
      })
      .catch((error) => {});
  }

  function renderItem({ item }: { item: IQuestion }) {
    return (
      <View style={{ backgroundColor: '#F7F7F7' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.type.regular,
              color: '#3F3F3F',
              flexWrap: 'wrap',
              flex: 1,
            }}
          >
            {item.text}
          </Text>

          {collapseId === item.id ? (
            <TouchableOpacity
              onPress={() => {
                setCollapseId('');
              }}
            >
              <SmallText
                fontSize={14}
                text={'Close'}
                color={Colors.background}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setCollapseId(item.id);
              }}
            >
              <SmallText
                fontSize={14}
                text={'Answer'}
                color={Colors.background}
              />
            </TouchableOpacity>
          )}
        </View>
        <Collapsible
          collapsed={collapseId !== item.id ? true : false}
          align='center'
        >
          <View style={{ paddingHorizontal: 20 }}>
            <TextInput
              onBlur={() => {}}
              onFocus={() => {}}
              style={{
                height: 80,
                backgroundColor: Colors.white,
              }}
              onChangeText={(event) => {
                setAnswer(event);
              }}
              value={collapseId === item.id ? answer : ''}
              multiline
            />

            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 20,
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setIsRealName(true);
                  setIsPrivateAns(false);
                }}
              >
                <EntypoIcons
                  size={18}
                  color={
                    isRealName && !isPrivateAns
                      ? Colors.black
                      : Colors.lightGray
                  }
                  name={'eye'}
                />
                <SmallText
                  fontSize={10}
                  text={'Public (Real Name)'}
                  color={
                    isRealName && !isPrivateAns
                      ? Colors.black
                      : Colors.lightGray
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setIsRealName(false);
                  setIsPrivateAns(false);
                }}
              >
                <EntypoIcons
                  color={
                    !isRealName && !isPrivateAns
                      ? Colors.black
                      : Colors.lightGray
                  }
                  size={18}
                  name={'eye'}
                />
                <SmallText
                  fontSize={10}
                  color={
                    !isRealName && !isPrivateAns
                      ? Colors.black
                      : Colors.lightGray
                  }
                  text={'Public (Pseudonym)'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                activeOpacity={1}
                onPress={() => {
                  setIsPrivateAns(!isPrivateAns);
                }}
              >
                <EntypoIcons
                  size={18}
                  color={isPrivateAns ? Colors.black : Colors.lightGray}
                  name={'eye-with-line'}
                />
                <SmallText
                  fontSize={10}
                  text={'Private Answer'}
                  color={isPrivateAns ? Colors.black : Colors.lightGray}
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 10 }}>
              <BlockButton
                title={'Post Answer'}
                onPress={() => postAnswer(item.id)}
              />
            </View>
          </View>
        </Collapsible>
        <Divider style={{ height: 2, backgroundColor: Colors.white }} />
      </View>
    );
  }

  return (
    <Connectivity>
      <Async displayChildren={isPostingAnswer}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              marginTop: 15,
              marginLeft: 15,
            }}
          >
            <BackButton navigation={props.navigation} isOnlyIcon={true} />
            <LargeText
              text={'Your Story Questions'}
              marginLeft={5}
              fontSize={18}
            />
          </View>

          <ButtonGroup
            onPress={updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{
              marginTop: 17,
              alignSelf: 'center',
              backgroundColor: Colors.transparent,
              width: '100%',
              borderTopColor: Colors.white,

              borderLeftColor: Colors.white,
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

          {selectedIndex === 0 ? (
            <KeyboardAwareFlatList
              extraScrollHeight={150}
              extraHeight={150}
              renderItem={renderItem}
              data={myLifeStory.questions}
            />
          ) : null}
          {selectedIndex === 1 ? (
            <KeyboardAwareFlatList
              extraScrollHeight={150}
              extraHeight={150}
              renderItem={renderItem}
              data={past}
            />
          ) : null}
          {selectedIndex === 2 ? (
            <KeyboardAwareFlatList
              extraScrollHeight={150}
              extraHeight={150}
              renderItem={renderItem}
              data={present}
            />
          ) : null}
          {selectedIndex === 3 ? (
            <KeyboardAwareFlatList
              extraScrollHeight={150}
              extraHeight={150}
              renderItem={renderItem}
              data={future}
            />
          ) : null}
        </View>
      </Async>
    </Connectivity>
  );
}

export default Questions;
