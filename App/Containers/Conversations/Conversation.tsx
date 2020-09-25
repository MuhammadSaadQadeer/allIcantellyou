import AsyncStorage from '@react-native-community/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { NavigationEvents } from 'react-navigation';
import Async from '../../Components/Async';
import Connectivity from '../../Components/Connectivity';
import { LargeText } from '../../Components/LargeText';
import NoRecords from '../../Components/NoRecords';
import { NormalText } from '../../Components/NormalText';
import { SmallText } from '../../Components/SmallText';
import Urls from '../../Constants/Urls';
import { AppContext } from '../../Contexts/AppContext';
import { useApi } from '../../CustomHooks';
import { displayInDays, getDateWithMonthName, saveInAsyncStorage } from '../../Lib/Utils';
import Api from '../../Services/Api';
import { MyStorySvg } from '../../Svgs';
import { Colors } from '../../Themes';
import { storyStyles } from '../Story/styles';

let filters = [
  'All',
  'Relationships',
  'Work',
  'Mental Health',
  'Happiness',
  'Technology',
  'Dreams',
  'Travel',
  'Students',
  'Other',
];
let conversations = [1, 1, 1, 1, 1];

export interface IConversationProps {
  id: string;
  title: string;
  body: string;
  topic: string;
  usePseudonym: boolean;
  useFullName: boolean;
  author: {
    id: string;
    displayName: string;
    isGuestAuthor: boolean;
    avatar: string;
  };
  answersCount: number;
  lastMessageInfo: {
    messageId: string;
    createdAt: string;
    author: {
      id: string;
      displayName: string;
      isGuestAuthor: boolean;
      avatar: string;
    };
  };
  createdAt: string;
  paginationKey: string;
}
function Conversation(props: any) {
  const appCtx = useContext(AppContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterState, setFilterState] = useState('All');
  const [getConversations, conversations, isLoading, error, success] = useApi();

  const [relationShipConvos, setRelationShipConvos] = useState<
    IConversationProps[]
  >();
  const [workConvos, setWorkConvos] = useState<IConversationProps[]>();
  const [happinessConvos, setHappinessConvos] = useState<
    IConversationProps[]
  >();
  const [mentalHealthConvos, setMentalHealthConvos] = useState<
    IConversationProps[]
  >();
  const [technologyConvos, setTechnologyConvos] = useState<
    IConversationProps[]
  >();
  const [dreamsConvos, setDreamConvos] = useState<IConversationProps[]>();
  const [travelConvos, setTravelConvos] = useState<IConversationProps[]>();
  const [studentsConvos, setStudentsConvos] = useState<IConversationProps[]>();
  const [otherConvos, setOtherConvos] = useState<IConversationProps[]>();

  function fetchAndCategorizeConvos() {
    setIsProcessing(true);
    Api({
      method: 'GET',
      url: Urls.conversations.my_conversations,
    })
      .then((response) => {


        AsyncStorage.getItem('conversations')
          .then((convos) => {
            if (convos) {
              JSON.parse(convos).map((id) => {
                var removeIndex = response.data
                  .map((item) => {
                    return item.id;
                  })
                  .indexOf(id);


                response.data.splice(removeIndex, 1);



                setStudentsConvos(
                  response.data.filter(
                    (item: IConversationProps) => item.topic === 'Students',
                  ),
                );

                setMentalHealthConvos(
                  response.data.filter(
                    (item: IConversationProps) => item.topic === 'Mental Health',
                  ),
                );

                setRelationShipConvos(
                  response.data.filter(
                    (item: IConversationProps) => item.topic === 'Relationships',
                  ),
                );

                setOtherConvos(
                  response.data.filter(
                    (item: IConversationProps) => item.topic === 'Other',
                  ),
                );

                setWorkConvos(
                  response.data.filter(
                    (item: IConversationProps) => item.topic === 'Work',
                  ),
                );

                setDreamConvos(
                  response.data.filter(
                    (item: IConversationProps) => item.topic === 'Dreams',
                  ),
                );

                setHappinessConvos(
                  response.data.filter(
                    (item: IConversationProps) => item.topic === 'Happiness',
                  ),
                );

                setTravelConvos(
                  response.data.filter(
                    (item: IConversationProps) => item.topic === 'Travel',
                  ),
                );

                setTechnologyConvos(
                  response.data.filter(
                    (item: IConversationProps) => item.topic === 'Technology',
                  ),
                );

                setIsProcessing(false);

              });

            } else {
              setStudentsConvos(
                response.data.filter(
                  (item: IConversationProps) => item.topic === 'Students',
                ),
              );

              setMentalHealthConvos(
                response.data.filter(
                  (item: IConversationProps) => item.topic === 'Mental Health',
                ),
              );

              setRelationShipConvos(
                response.data.filter(
                  (item: IConversationProps) => item.topic === 'Relationships',
                ),
              );

              setOtherConvos(
                response.data.filter(
                  (item: IConversationProps) => item.topic === 'Other',
                ),
              );

              setWorkConvos(
                response.data.filter(
                  (item: IConversationProps) => item.topic === 'Work',
                ),
              );

              setDreamConvos(
                response.data.filter(
                  (item: IConversationProps) => item.topic === 'Dreams',
                ),
              );

              setHappinessConvos(
                response.data.filter(
                  (item: IConversationProps) => item.topic === 'Happiness',
                ),
              );

              setTravelConvos(
                response.data.filter(
                  (item: IConversationProps) => item.topic === 'Travel',
                ),
              );

              setTechnologyConvos(
                response.data.filter(
                  (item: IConversationProps) => item.topic === 'Technology',
                ),
              );
              setIsProcessing(false);
            }
          })



      })
      .catch((error) => {
        
       

        setIsProcessing(false);

      });
  }

  useEffect(() => {
    fetchAndCategorizeConvos();
  }, []);

  function renderFilter(filter: string) {
    return (
      <TouchableOpacity
        onPress={() => setFilterState(filter)}
        style={{ paddingHorizontal: 10 }}
      >
        <SmallText
          color={filterState === filter ? Colors.background : Colors.lightGray}
          text={filter}
        />
      </TouchableOpacity>
    );
  }

  function horizontalFilterSection() {
    return (
      <ScrollView
        horizontal={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps={true}
        keyboardDismissMode='on-drag'
        style={{
          paddingVertical: 20,
        }}
      >
        {filters.map((filter, index) => {
          return renderFilter(filter);
        })}
      </ScrollView>
    );
  }

  function navigateToLogin() {
    props.navigation.navigate('Login');
    appCtx.dispatch({
      type: 'IS_CONTINUE_WITHOUT_LOGIN',
      isContinueWithoutLogin: false,
    });
  }

  function reportAndHideConversation(convoId: string) {

    saveInAsyncStorage('conversations', convoId);
    setStudentsConvos(
      studentsConvos?.filter((convo) => {
        return convo.id !== convoId;
      }),
    );

    setMentalHealthConvos(
      mentalHealthConvos?.filter((convo) => {
        return convo.id !== convoId;
      }),
    );

    setRelationShipConvos(
      relationShipConvos?.filter((convo) => {
        return convo.id !== convoId;
      }),
    );

    setOtherConvos(
      otherConvos?.filter((convo) => {
        return convo.id !== convoId;
      }),
    );

    setWorkConvos(
      workConvos?.filter((convo) => {
        return convo.id !== convoId;
      }),
    );

    setDreamConvos(
      dreamsConvos?.filter((convo) => {
        return convo.id !== convoId;
      }),
    );

    setHappinessConvos(
      happinessConvos?.filter((convo) => {
        return convo.id !== convoId;
      }),
    );

    setTravelConvos(
      travelConvos?.filter((convo) => {
        return convo.id !== convoId;
      }),
    );

    setTechnologyConvos(
      technologyConvos?.filter((convo) => {
        return convo.id !== convoId;
      }),
    );

  }

  function renderConversationItem(item: IConversationProps) {
    let colorInvert = false;
    return (
      <View
        style={{
          backgroundColor: colorInvert ? Colors.background : '#F4FAFC',
          paddingHorizontal: 10,
          paddingVertical: 24,
          marginRight: 15,
          alignSelf: 'stretch',
          width: 250,
          borderRadius: 7,
        }}
      >
        <View
          style={{
            height: 70,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Text
            style={{
              flex: 1,
              flexWrap: 'wrap',
              fontSize: 16,
              lineHeight: 23,
              color: colorInvert ? Colors.white : Colors.black,
            }}
          >
            {item.title}
          </Text>

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
                    'Hide Conversation',
                    `Are you sure you want to hide this conversation. You won't be able to see this conversation any longer?`,
                    [
                      {
                        text: 'Yes',
                        onPress: () => reportAndHideConversation(item.id),
                      },
                      { text: 'No', onPress: () => { } },
                    ],
                  );
                }}
              >
                <Text style={storyStyles.menuOptionIcon}>
                  Hide
                    </Text>
              </MenuOption>
              <MenuOption
                  onSelect={() => {
                    Alert.alert(
                      'Report',
                      `Write an email to us about any objectionable content and we will get back to you with proper action with in 24 hours`,
                      [
                        {
                          text: 'Write Email',
                          onPress: () =>
                            Linking.openURL(`mailto:hello@allicantellyou.com`),
                        },
                        { text: 'Cancel', onPress: () => {} },
                      ],
                    );
                  }}
                >
                  <Text style={storyStyles.menuOptionIcon}>Report</Text>
                </MenuOption>
            </MenuOptions>
          </Menu>
        </View>

        {/* Avatar view */}
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('AuthorProfileConv', {
              profileData: item.author,
            });
          }}
          style={{
            flexDirection: 'row',
          }}

          disabled={item.usePseudonym}
        >
           
          {item.author.avatar ? (
            <Avatar
              rounded
              source={{
                uri: item.author.avatar,
              }}
              size={'medium'}
            />
          ) : item.author.displayName ? (
            <Avatar
              overlayContainerStyle={{ backgroundColor: Colors.background }}
              size={'medium'}
              rounded
              title={item.author.displayName.charAt(0)}
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
        {/* Avatar view end */}

        <View
          style={{
            paddingVertical: 20,
            flexDirection: 'row',
          }}
        >
          <SmallText
            color={colorInvert ? Colors.white : Colors.black}
            text={getDateWithMonthName(item.createdAt)}
          />
          <SimpleLineIcons
            name={'bubble'}
            color={colorInvert ? Colors.white : Colors.black}
            style={{
              marginLeft: 15,
              marginTop: 3,
              justifyContent: 'center',
              alignItems: 'baseline',
            }}
          />
          <SmallText
            marginLeft={5}
            color={colorInvert ? Colors.white : Colors.black}
            text={item.answersCount}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: colorInvert ? Colors.white : Colors.background,
            padding: 10,
            borderRadius: 7,
            width: 100,
          }}
          onPress={
            appCtx.isAuthenticated
              ? () => {
                props.navigation.navigate('ConversationView', {
                  convo: item,
                });
              }
              : () =>
                Alert.alert(
                  'Proceed To Login',
                  'Login is required to join conversation',
                  [
                    {
                      text: 'Proceed to Login',
                      onPress: () => navigateToLogin(),
                    },
                    {
                      text: 'Cancel',
                      onPress: () => {},
                    },
                  ],
                )
          }
        >
          <LargeText
            color={colorInvert ? Colors.background : Colors.white}
            text={'Join'}
            textAlign={'center'}
          />
        </TouchableOpacity>



      </View>
    );
  }

  function renderFlatList(data: IConversationProps[], category: string) {
    return (
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
          }}
        >
          <LargeText text={category} fontSize={20} />
        </View>

        {data && data.length > 0 ? (
          <FlatList
            horizontal={true}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => renderConversationItem(item)}
          />
        ) : (
            <NoRecords title={'Nothing To Display'} />
          )}
      </View>
    );
  }
  return (
    <Connectivity>
      <Async displayChildren={isProcessing}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <NavigationEvents onWillFocus={() => fetchAndCategorizeConvos()} />
          <ScrollView
          showsHorizontalScrollIndicator={false} 
          >
            <View style={{ paddingHorizontal: 20 }}>
              <View style={{ paddingVertical: 20, flexDirection: 'row' }}>
                <MyStorySvg size={20} />
                <LargeText
                  text={'Conversations'}
                  marginLeft={10}
                  fontSize={20}
                />
              </View>
              <TouchableOpacity
                style={{
                  borderRadius: 7,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  backgroundColor: Colors.background,
                }}
                onPress={() => props.navigation.navigate('AddNewTopic')}
              >
                <NormalText
                  color={Colors.white}
                  text={'Add Your Topic'}
                  textAlign={'center'}
                />
              </TouchableOpacity>

              {horizontalFilterSection()}
            </View>

            <Divider />
            {filterState === 'All' ? (
              <>
                {renderFlatList(
                  relationShipConvos ? relationShipConvos : [],
                  'Relationships',
                )}
                {renderFlatList(workConvos ? workConvos : [], 'Work')}
                {renderFlatList(
                  happinessConvos ? happinessConvos : [],
                  'Happiness',
                )}
                {renderFlatList(
                  mentalHealthConvos ? mentalHealthConvos : [],
                  'Mental Health',
                )}
                {renderFlatList(
                  technologyConvos ? technologyConvos : [],
                  'Technology',
                )}
                {renderFlatList(dreamsConvos ? dreamsConvos : [], 'Dreams')}
                {renderFlatList(travelConvos ? travelConvos : [], 'Travel')}
                {renderFlatList(
                  studentsConvos ? studentsConvos : [],
                  'Students',
                )}
                {renderFlatList(otherConvos ? otherConvos : [], 'Other')}
                {/* TODO: Let phill update the api then update this code */}
                {/* <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
                  <LargeText text={'Trending'} fontSize={20} />
                  <NormalText
                    marginTop={8}
                    text={'Not Interested'}
                    fontFamily={Fonts.type.light_italic}
                  />
                </View> */}
              </>
            ) : (
                <>
                  {filterState === 'Relationships'
                    ? renderFlatList(
                      relationShipConvos ? relationShipConvos : [],
                      'Relationships',
                    )
                    : null}
                  {filterState === 'Students'
                    ? renderFlatList(
                      studentsConvos ? studentsConvos : [],
                      'Students',
                    )
                    : null}
                  {filterState === 'Happiness'
                    ? renderFlatList(
                      happinessConvos ? happinessConvos : [],
                      'Happiness',
                    )
                    : null}

                  {filterState === 'Mental Health'
                    ? renderFlatList(
                      mentalHealthConvos ? mentalHealthConvos : [],
                      'Mental Health',
                    )
                    : null}
                  {filterState === 'Dreams'
                    ? renderFlatList(dreamsConvos ? dreamsConvos : [], 'Dreams')
                    : null}

                  {filterState === 'Travel'
                    ? renderFlatList(travelConvos ? travelConvos : [], 'Travel')
                    : null}

                  {filterState === 'Other'
                    ? renderFlatList(otherConvos ? otherConvos : [], 'Other')
                    : null}

                  {filterState === 'Technology'
                    ? renderFlatList(
                      technologyConvos ? technologyConvos : [],
                      'Technology',
                    )
                    : null}

                  {filterState === 'Work'
                    ? renderFlatList(workConvos ? workConvos : [], 'Work')
                    : null}
                </>
              )}
          </ScrollView>
        </View>
      </Async>
    </Connectivity>
  );
}

export default Conversation;
