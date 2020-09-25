import React, { useContext, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { ButtonGroup, Divider } from 'react-native-elements';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { ProgressStep, ProgressSteps } from 'react-native-progress-steps';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { NavigationEvents } from 'react-navigation';
import Async from '../../Components/Async';
import BtnGroupItem from '../../Components/ButtonGroupItem';
import Connectivity from '../../Components/Connectivity';
import BlockButton from '../../Components/General/BlockButton';
import Header from '../../Components/Header';
import { LargeText } from '../../Components/LargeText';
import NoRecords from '../../Components/NoRecords';
import { SmallText } from '../../Components/SmallText';
import WithoutLoginComponent from '../../Components/WithoutLoginComponent';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../Constants';
import Urls from '../../Constants/Urls';
import { AppContext } from '../../Contexts/AppContext';
import { useApi } from '../../CustomHooks';
import { getFormatedDateDDMMYYY, showNotification } from '../../Lib/Utils';
import Api from '../../Services/Api';
import { MyStorySvg } from '../../Svgs';
import { Colors } from '../../Themes';
import { StoryContext } from './StoryContex';
import { storyStyles } from './styles';
import { IAnswer, IQuestion } from './Types';
function Story(props: any) {
  const storyCtx = useContext(StoryContext);
  const appCtx = useContext(AppContext);

  const [
    fetchStoryQuestions,
    myStory,
    isFetching,
    error,
    fetchSuccess,
  ] = useApi();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState('');
  const [answer, setAnswer] = useState('');
  const [collapseId, setCollapseId] = useState('');
  const [isPrivateAns, setIsPrivateAns] = useState(false);
  const [isRealName, setIsRealName] = useState(true);
  const [isStoryExist, setIsStoryExist] = useState(false);
  const [initQuestions, setInitQuestions] = useState<IQuestion[]>(
    storyCtx.myLifeStory.questions,
  );
  const [isClickedOnSubmit, setIsClickedOnSubmit] = useState(false);

  useEffect(() => {}, [isStoryExist]);

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

  useEffect(() => {
    if (appCtx.isAuthenticated) {
      if (fetchSuccess) {
        storyCtx.dispatch({
          type: 'FETCH_QUESTIONS',
          myLifeStory: myStory,
        });
        setInitQuestions(myStory.questions);
        if (!isClickedOnSubmit) {
          setIsStoryExist(Boolean(storyCtx.myLifeStory.answers.length));
        }
      }
    }
  }, [fetchSuccess]);

  function turnOnEditMode(
    editMode: boolean,
    questionId: string,
    answer: string,
  ) {
    setEditMode(editMode);
    setEditQuestionId(questionId);
    setAnswer(answer);
  }

  function onChangeText(text) {
    setAnswer(text);
  }

  function updateAnswer(item: IQuestion, useFullName: boolean) {
    Api({
      method: 'POST',
      url: Urls.my_story.answers,
      data: {
        questionId: item.id,
        text: answer,
        public: true,
        useFullName,
      },
    })
      .then((response) => {
        setEditMode(false);
        setEditQuestionId('');
        setAnswer('');

        if (response.data && response.data.id) {
          showNotification('Answer updated successfully!');
        }

        fetchMyStory();
      })
      .catch((error) => {});
  }

  function postAnswer(item: IQuestion) {
    Api({
      method: 'POST',
      url: Urls.my_story.answers,
      data: {
        questionId: item.id,
        text: answer,
        useFullName: isPrivateAns ? false : isRealName,
        public: !isPrivateAns,
      },
    })
      .then((response) => {
        setEditMode(false);
        setEditQuestionId('');
        setAnswer('');
        if (response.data && response.data.id) {
          showNotification('Answer posted successfully!');
        }
        let updatedQuestions = storyCtx.myLifeStory.questions.filter(
          (item) => item.id !== response.data.question.id,
        );
        setInitQuestions(updatedQuestions);
      })
      .catch((error) => {});
  }

  function fetchMyStory() {
    fetchStoryQuestions('GET', Urls.my_story.bio);
  }

  function navigateToAnswerQuestions() {
    setIsClickedOnSubmit(true);
    setIsStoryExist(true);
    fetchMyStory();
  }
  function updateIndex(selectedIndex: number) {
    setSelectedIndex(selectedIndex);
  }

  function deleteAnswer(questionId: string) {
    Api({
      method: 'DELETE',
      url: Urls.my_story.delete_answer(questionId),
    })
      .then((response) => {
        fetchMyStory();
      })
      .catch((error) => {});
  }
  function reset() {
    setEditMode(false);
    setEditQuestionId('');
    setAnswer('');
  }

  function renderItem({ item }: { item: IAnswer }) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            item.question.category === 'Present'
              ? Colors.background
              : item.question.category === 'Future'
              ? '#8F7AD6'
              : null,
        }}
      >
        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <SmallText
              fontSize={18}
              color={
                item.question.category === 'Present' ||
                item.question.category === 'Future'
                  ? Colors.white
                  : Colors.black
              }
              text={item.question.text}
            />
            <Menu>
              <MenuTrigger>
                <EntypoIcons
                  size={20}
                  color={
                    item.question.category === 'Present' ||
                    item.question.category === 'Future'
                      ? Colors.white
                      : Colors.black
                  }
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
                  onSelect={() =>
                    turnOnEditMode(!editMode, item.id, item.answer)
                  }
                >
                  <View style={storyStyles.menuOption}>
                    <EvilIcons name={'pencil'} size={25} />
                    <Text style={storyStyles.menuOptionIcon}>Edit</Text>
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => deleteAnswer(item.id)}>
                  <View style={storyStyles.menuOption}>
                    <EvilIcons size={25} name={'trash'} color={Colors.error} />
                    <Text style={storyStyles.menuOptionIcon}>Delete</Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>

          {editMode && item.id === editQuestionId ? (
            <>
              <TextInput
                style={[
                  {
                    borderBottomColor:
                      item.question.category === 'Present' ||
                      item.question.category === 'Future'
                        ? Colors.white
                        : Colors.black,

                    color:
                      item.question.category === 'Present' ||
                      item.question.category === 'Future'
                        ? Colors.white
                        : Colors.black,
                  },
                  storyStyles.textInput,
                ]}
                value={answer}
                multiline
                onChangeText={(text) => onChangeText(text)}
              />

              <View style={storyStyles.btnContainer}>
                <TouchableOpacity
                  style={storyStyles.saveBtn}
                  onPress={() => updateAnswer(item.question, item.useFullName)}
                >
                  <Text
                    style={[
                      {
                        color:
                          item.question.category === 'Present' ||
                          item.question.category === 'Future'
                            ? Colors.white
                            : Colors.black,
                      },
                      storyStyles.btnTxt,
                    ]}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={storyStyles.cancelBtn}
                  onPress={() => reset()}
                >
                  <Text
                    style={[
                      {
                        color:
                          item.question.category === 'Present' ||
                          item.question.category === 'Future'
                            ? Colors.white
                            : Colors.black,
                      },
                      storyStyles.btnTxt,
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <SmallText
              fontSize={14}
              marginTop={15}
              marginBottom={15}
              color={
                item.question.category === 'Present' ||
                item.question.category === 'Future'
                  ? Colors.white
                  : Colors.black
              }
              lineHeight={22}
              text={item.answer}
            />
          )}
        </View>

        <Divider
          style={{
            backgroundColor:
              item.question.category === 'Present' ||
              item.question.category === 'Future'
                ? Colors.white
                : '#EDEDED',
          }}
        />

        <View style={storyStyles.answerBaseLine}>
          <SmallText
            text={item.question.category}
            fontSize={14}
            color={
              item.question.category === 'Present' ||
              item.question.category === 'Future'
                ? Colors.white
                : Colors.background
            }
          />
          <SmallText
            text={`Answered: ${getFormatedDateDDMMYYY(item.answeredAt)}`}
            fontSize={14}
            color={
              item.question.category === 'Present' ||
              item.question.category === 'Future'
                ? Colors.white
                : Colors.background
            }
          />
        </View>
      </View>
    );
  }

  function renderList(data: any) {
    return data && data.length ? (
      <KeyboardAwareFlatList
        extraScrollHeight={150}
        extraHeight={150}
        renderItem={renderItem}
        data={data}
      />
    ) : (
      <NoRecords title={'Nothing to display'} />
    );
  }

  function renderQuestion({ item }: { item: IQuestion }) {
    return (
      <View>
        <View style={storyStyles.questionStatement}>
          <Text style={storyStyles.questionText}>{item.text}</Text>

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
          <View style={{ paddingHorizontal: 10 }}>
            <TextInput
              onBlur={() => {}}
              onFocus={() => {}}
              style={{
                height: 150,
                backgroundColor: Colors.white,
              }}
              onChangeText={(event) => {
                setAnswer(event);
              }}
              value={collapseId === item.id ? answer : ''}
              multiline
            />

            <View style={storyStyles.btnControls}>
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
                  size={20}
                  color={
                    isRealName && !isPrivateAns
                      ? Colors.black
                      : Colors.lightGray
                  }
                  name={'eye'}
                />
                <SmallText
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
                  size={20}
                  name={'eye'}
                />
                <SmallText
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
                  size={20}
                  color={isPrivateAns ? Colors.black : Colors.lightGray}
                  name={'eye-with-line'}
                />
                <SmallText
                  text={'Private Answer'}
                  color={isPrivateAns ? Colors.black : Colors.lightGray}
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 10 }}>
              <BlockButton
                title={'Post Answer'}
                onPress={() => postAnswer(item)}
              />
            </View>
          </View>
        </Collapsible>
      </View>
    );
  }

  function renderQuestionsOnly(data: any) {
    return data && data.length ? (
      <KeyboardAwareFlatList
        contentContainerStyle={{
          paddingHorizontal: 15,
          backgroundColor: Colors.newBg,
          width: SCREEN_WIDTH,
        }}
        contentInset={{
          bottom: 170,
        }}
        extraScrollHeight={150}
        extraHeight={150}
        showsVerticalScrollIndicator={false}
        renderItem={renderQuestion}
        data={data}
        ItemSeparatorComponent={() => <Divider />}
      />
    ) : (
      <NoRecords title={'Nothing to display'} />
    );
  }

  function createStoryStepper() {
    return (
      <ProgressSteps
        activeStepIconBorderColor={Colors.background}
        style={{
          borderStyle: Colors.background,
          height: SCREEN_HEIGHT,
        }}
        borderWidth={3}
        completedStepIconColor={Colors.background}
        progressBarColor={'#C3C3C3'}
        completedProgressBarColor={Colors.background}
        activeStepNumColor={Colors.background}
      >
        <ProgressStep
          nextBtnTextStyle={{
            color: Colors.background,
          }}
          previousBtnTextStyle={{
            color: Colors.background,
          }}
        >
          <LargeText text={'Step One: Your Past'} textAlign={'center'} />
          <Text style={storyStyles.stepperTextLabel}>
            Answer One Question from your past below to proceed to next section
          </Text>
          {renderQuestionsOnly(
            initQuestions.filter((item) => item.category === 'Past'),
          )}
        </ProgressStep>
        <ProgressStep
          nextBtnTextStyle={{
            color: Colors.background,
          }}
          previousBtnTextStyle={{
            color: Colors.background,
          }}
        >
          <LargeText text={'Step Two: Your Present'} textAlign={'center'} />
          <Text style={storyStyles.stepperTextLabel}>
            Answer One Question from your present below to proceed to next
            section
          </Text>

          {renderQuestionsOnly(
            initQuestions.filter((item) => item.category === 'Present'),
          )}
        </ProgressStep>
        <ProgressStep
          onSubmit={navigateToAnswerQuestions}
          nextBtnTextStyle={{
            color: Colors.background,
          }}
          previousBtnTextStyle={{
            color: Colors.background,
          }}
        >
          <LargeText text={'Step Three: Your Future'} textAlign={'center'} />
          <Text style={storyStyles.stepperTextLabel}>
            Answer One Question from your future below to proceed to next
            section
          </Text>
          {renderQuestionsOnly(
            initQuestions.filter((item) => item.category === 'Future'),
          )}
        </ProgressStep>
      </ProgressSteps>
    );
  }

  return (
    <Connectivity>
      <Async displayChildren={isFetching}>
        {appCtx.isAuthenticated ? (
          <View style={{ flex: 1 }}>
            <NavigationEvents onWillFocus={() => fetchMyStory()} />
            <Header title={'Your Life Story'}>
              <MyStorySvg size={20} />
            </Header>
            {storyCtx.myLifeStory.answers.length > 0 || isStoryExist ? (
              <>
                <BlockButton
                  title={'Post Answers ?'}
                  onPress={() => {
                    props.navigation.navigate('Questions');
                  }}
                />

                <ButtonGroup
                  onPress={updateIndex}
                  selectedIndex={selectedIndex}
                  buttons={buttons}
                  containerStyle={storyStyles.btnGroupStyle}
                  innerBorderStyle={{ color: Colors.transparent }}
                  selectedButtonStyle={storyStyles.btnGroupSelectedBtn}
                  textStyle={storyStyles.btnGroupTextStyle}
                  disabledTextStyle={{ color: Colors.lightGray }}
                />
                {selectedIndex === 0
                  ? renderList(storyCtx.myLifeStory.answers)
                  : null}
                {selectedIndex === 1
                  ? renderList(
                      storyCtx.myLifeStory.answers.filter(
                        (item) => item.question.category === 'Past',
                      ),
                    )
                  : null}
                {selectedIndex === 2
                  ? renderList(
                      storyCtx.myLifeStory.answers.filter(
                        (item) => item.question.category === 'Present',
                      ),
                    )
                  : null}
                {selectedIndex === 3
                  ? renderList(
                      storyCtx.myLifeStory.answers.filter(
                        (item) => item.question.category === 'Future',
                      ),
                    )
                  : null}
              </>
            ) : (
              <View style={storyStyles.stepperContainer}>
                {createStoryStepper()}
              </View>
            )}
          </View>
        ) : (
          <WithoutLoginComponent
            navigation={props.navigation}
            title={'Login or create account to view My Story'}
            btnTitle={'Proceed to Login'}
          />
        )}
      </Async>
    </Connectivity>
  );
}

export default Story;
