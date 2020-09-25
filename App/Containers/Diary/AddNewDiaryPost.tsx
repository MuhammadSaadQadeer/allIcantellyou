import { Formik, FormikProps } from 'formik';
import React, { useEffect, useReducer, useState } from 'react';
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import * as Yup from 'yup';
import Async from '../../Components/Async';
import Connectivity from '../../Components/Connectivity';
import BackButton from '../../Components/General/BackButton';
import BlockButton from '../../Components/General/BlockButton';
import { InputField } from '../../Components/InputField';
import Urls from '../../Constants/Urls';
import { getPubishedDateFormate, showNotification } from '../../Lib/Utils';
import Api from '../../Services/Api';
import { LogoSvg } from '../../Svgs';
import { Colors } from '../../Themes';
import { IDiaryFeed, IImage } from '../MainApp/Home/DiaryFeed';
import { diaryStyles } from './styles';


const options = {
  title: 'Select Image',
  // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const MyDiaryPostSchema = Yup.object().shape({
  post: Yup.string().required(' '),
});

export interface IVisibility {
  id: number;
  key: string;
  value: boolean;
}

export interface IPostDiary {
  body: string;
  mood: number;
  visibility: string; //'private//public';
  useFullName: boolean;
  images?: string[];
  usePseudonym: boolean;
  publishedAt: string; // '2019-11-20 20:09:24';
}
export interface IDiaryPost {
  post: string;
}

let visibilityOptions = [
  { id: 1, key: 'Private', value: true },
  { id: 2, key: 'Public(Full name)', value: false },
  { id: 3, key: 'Public(Pseudonym)', value: false },
];

export type MyDiaryActions =
  | { type: 'SET_MOOD_COUNT'; moodCount: number }
  | { type: 'IS_REACTION_IN_PROCESS'; isReactionProcessing: boolean }
  | { type: 'IS_PROCESSING'; isProcessing: boolean }
  | { type: 'SET_EDIT_POST'; editPost: IDiaryFeed }
  | { type: 'SET_IMAGE'; image: string }
  | { type: 'SET_VISIBILITY_COUNT'; visibilityCount: number }
  | { type: 'SET_VISIBILITY'; visibility: IVisibility };

export interface IMyDiaryState {
  moodCount: number;
  isReactionProcessing: boolean;
  visibility: IVisibility;
  isProcessing: boolean;
  editPost: IDiaryFeed;
  image: string;
  visibilityCount: number;
}
const reducer = (state: IMyDiaryState, action: MyDiaryActions) => {
  switch (action.type) {
    case 'SET_MOOD_COUNT':
      return {
        ...state,
        moodCount: action.moodCount,
      };

    case 'IS_REACTION_IN_PROCESS':
      return {
        ...state,
        isReactionProcessing: action.isReactionProcessing,
      };

    case 'SET_VISIBILITY':
      return {
        ...state,
        visibility: action.visibility,
      };

    case 'IS_PROCESSING':
      return {
        ...state,
        isProcessing: action.isProcessing,
      };
    case 'SET_EDIT_POST':
      return {
        ...state,
        editPost: action.editPost,
      };
    case 'SET_IMAGE':
      return {
        ...state,
        image: action.image,
      };
    case 'SET_VISIBILITY_COUNT':
      return { ...state, visibilityCount: action.visibilityCount };
    default:
      return state;
  }
};

let editedImagesTempArray = [];
let imageId = 0;

function AddNewDiaryPost(props: any) {
  const [editMode, setEditMode] = useState(false);
  const [post, setPost] = useState('');

  const [images, setImages] = useState<IImage[]>([]);
  const [setImagesIds, setSetImagesIds] = useState<string[]>();
  const [editModeImagesUrls, setEditModeImagesUrls] = useState<IImage[]>([]);

  const [isNewImage, isSetNewImage] = useState(false);
  const [newImageIsSet, setNewImageIsSet] = useState(false);

  const [myDiaryState, dispatch] = useReducer(reducer, {
    moodCount: 0,
    isReactionProcessing: false,
    visibility: visibilityOptions[0],
    isProcessing: false,
    image: '',
    visibilityCount: 0,
    editPost: {
      id: '',
      body: '',
      mood: 0,
      publishedAt: '',
      visibility: '',
      author: {
        id: '',
        displayName: '',
        isGuestAuthor: '',
        avatar: '',
      },
      useFullName: false,
      usePseudonym: false,
      images: [
        {
          id: '',
          thumbUrl: '',
          originalUrl: '',
        },
      ],
      reactions: {
        like: {
          count: 0,
          currentUserReacted: false,
        },
        clap: {
          count: 0,
          currentUserReacted: false,
        },
        heart: {
          count: 0,
          currentUserReacted: false,
        },
        respect: {
          count: 0,
          currentUserReacted: false,
        },
      },
    },
  });

  useEffect(() => {
    if (props.navigation.getParam('editPost')) {
      endableEditMode(props.navigation.getParam('post'));
    }
  }, []);

  useEffect(()=>{
    

  },[setImagesIds, images])

 


  function endableEditMode(feed: IDiaryFeed) {
    
    //    setImageUrl(feed.images && feed.images.length ? feed.images : []);
    setImages(feed.images.map((image) => image));
    setSetImagesIds(feed.images.map((image) => image.id));
    setEditMode(true);
    setPost(feed.body);
    dispatch({
      type: 'SET_IMAGE',
      image: feed.images && feed.images.length ? feed.images[0].id : '',
    });
    dispatch({
      type: 'SET_EDIT_POST',
      editPost: feed,
    });
    dispatch({
      type: 'SET_MOOD_COUNT',
      moodCount: feed.mood,
    });
    if (feed.visibility === 'private') {
      dispatch({
        type: 'SET_VISIBILITY',
        visibility: visibilityOptions[0],
      });
    } else if (feed.useFullName) {
      dispatch({
        type: 'SET_VISIBILITY',
        visibility: visibilityOptions[1],
      });
    } else if (feed.usePseudonym) {
      dispatch({
        type: 'SET_VISIBILITY',
        visibility: visibilityOptions[2],
      });
    }
  }

  function setPrivacy() {
    dispatch({
      type: 'SET_VISIBILITY_COUNT',
      visibilityCount: myDiaryState.visibilityCount + 1,
    });
    if (myDiaryState.visibilityCount > 2) {
      dispatch({
        type: 'SET_VISIBILITY_COUNT',
        visibilityCount: 1,
      });
      dispatch({
        type: 'SET_VISIBILITY',
        visibility: visibilityOptions[0],
      });
    } else {
      switch (myDiaryState.visibilityCount) {
        case 1:
          return dispatch({
            type: 'SET_VISIBILITY',
            visibility: visibilityOptions[1],
          });
        case 2:
          return dispatch({
            type: 'SET_VISIBILITY',
            visibility: visibilityOptions[2],
          });
        default:
          return dispatch({
            type: 'SET_VISIBILITY',
            visibility: visibilityOptions[0],
          });
      }
    }
  }

  function incrementMood() {
    if (myDiaryState.moodCount === 10) {
      dispatch({
        type: 'SET_MOOD_COUNT',
        moodCount: 0,
      });
      return;
    }
    dispatch({
      type: 'SET_MOOD_COUNT',
      moodCount: myDiaryState.moodCount + 1,
    });
  }

  function saveDiaryPost(values: IDiaryPost) {

   
    if (!values.post) {
      showNotification('Please add some text to your diary post');
      return;
    }
    dispatch({
      type: 'IS_PROCESSING',
      isProcessing: true,
    });


    


    // setIsProcessing(true);

    let payload: IPostDiary = {
      body: values.post,
      mood: myDiaryState.moodCount,

      visibility:
        myDiaryState.visibility.key === 'Private' ? 'private' : 'public',
      useFullName:
        myDiaryState.visibility.key === 'Public(Full name)' ? true : false,
      usePseudonym:
        myDiaryState.visibility.key === 'Public(Pseudonym)' ? true : false,
      publishedAt: getPubishedDateFormate(new Date()),
    };

    if(images && images.length){
      payload['images'] = images.map(image => image.thumbUrl)
    }

   

    Api({
      method: 'POST',
      url: Urls.home.my_diary,
      data: payload,
    })
      .then((response) => {
        // let localState = localDiaryFeed;
        // localState.unshift(response.data);
        // setLocalDiaryFeed(localState);
        dispatch({
          type: 'IS_PROCESSING',
          isProcessing: false,
        });

        dispatch({
          type: 'SET_MOOD_COUNT',
          moodCount: 0,
        });
        dispatch({
          type: 'SET_VISIBILITY',
          visibility: visibilityOptions[0],
        });
        props.navigation.navigate('MyDiary');
      })

      .catch((error) => {


        dispatch({
          type: 'IS_PROCESSING',
          isProcessing: false,
        });

       
        
        
      });
  }

  function updateDiaryPost(values: IDiaryPost) {
    if (!values.post) {
      showNotification('Please add some text to your diary post');
      return;
    }
    dispatch({
      type: 'IS_PROCESSING',
      isProcessing: true,
    });
    let payload = {
      body: values.post,
      mood: myDiaryState.moodCount,
      publishedAt: myDiaryState.editPost.publishedAt,

      visibility:
        myDiaryState.visibility.key === 'Private' ? 'private' : 'public',
    };

    if (isSetNewImage && setImagesIds && setImagesIds.length) {
      payload['setImages'] = setImagesIds;
      payload['images'] = editModeImagesUrls?.map((image)=>image.thumbUrl);
    } 
    else if(isSetNewImage && setImagesIds?.length ===0){
      payload['images'] = editModeImagesUrls?.map((image)=>image.thumbUrl);
    }
    else {
      payload['setImages'] = setImagesIds;
    }
   
    Api({
      method: 'PATCH',
      data: payload,
      url: Urls.home.edit_diary_post(encodeURIComponent(myDiaryState.editPost.id)),
    })
      .then((response) => {
        dispatch({
          type: 'IS_PROCESSING',
          isProcessing: false,
        });
        props.navigation.navigate('MyDiary');
        setEditMode(false);
        dispatch({
          type: 'SET_VISIBILITY',
          visibility: visibilityOptions[0],
        });
        dispatch({
          type: 'SET_MOOD_COUNT',
          moodCount: 0,
        });
        if (response.data) {
          showNotification('Feed updated successfully!');
        }
      })
      .catch((error) => {
        dispatch({
          type: 'IS_PROCESSING',
          isProcessing: false,
        });

        
         
        
      });
  }

  function renderPostControls(isValid: boolean) {
    return (
      <View style={diaryStyles.postContorls}>
        <TouchableOpacity
          style={[diaryStyles.btnStyle]}
          onPress={() => {
            ImagePicker.launchImageLibrary(options, (response) => {
              // Same code as in above section!
              isSetNewImage(true);
             
              if (response.didCancel) {
               
              } else if (response.error) {
                
              } else if (response.customButton) {
                
              } else {
                dispatch({
                  type: 'SET_IMAGE',
                  image: '',
                });

                if (editMode) {
                  imageId = imageId+1
                  let imageObject: IImage = {
                    id: String(imageId),
                    thumbUrl: `data:image/png;base64,${response.data}`,
                    originalUrl: `data:image/png;base64,${response.data}`,
                  };
                  
                  setEditModeImagesUrls([...editModeImagesUrls, imageObject]);
                  setImages([...images,imageObject])
                 
                }
                if (!editMode) {
                  imageId = imageId+1
                  let imageObject: IImage = {
                    id: String(imageId),
                    thumbUrl: `data:image/png;base64,${response.data}`,
                    originalUrl: `data:image/png;base64,${response.data}`,
                  };
                 
                  editedImagesTempArray.push(imageObject);
                  setImages([...images,imageObject]);

                }
                setNewImageIsSet(true);
              }
            });
          }}
        >
          <EntypoIcons name={'image'} size={20} />
          <Text style={[diaryStyles.btnText]}>Image</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={incrementMood} style={diaryStyles.btnStyle}>
          {myDiaryState.moodCount > 0 ? (
            <View style={diaryStyles.moodStyles}>
              <LogoSvg size={20} />
              <Text
                style={[
                  diaryStyles.btnText,
                  {
                    color:
                      myDiaryState.moodCount > 0
                        ? Colors.background
                        : Colors.black,
                  },
                ]}
              >
                {myDiaryState.moodCount}
              </Text>
            </View>
          ) : (
            <View style={diaryStyles.moodStyles}>
              <LogoSvg size={20} />
              <Text style={[diaryStyles.btnText, { color: Colors.background }]}>
                Set Mood
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={setPrivacy} style={diaryStyles.btnStyle}>
          <EntypoIcons
            name={!myDiaryState.visibility.value ? 'eye' : 'eye-with-line'}
            size={20}
          />
          <Text style={[diaryStyles.btnText, { fontSize: 10, marginLeft: 2 }]}>
            {myDiaryState.visibility.key}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function removeImage(imageId: string) {
    setSetImagesIds(
      setImagesIds && setImagesIds.filter((imageIds)=>{

        if(imageId!==imageIds){
          return imageIds
        }
         
       })
    )
    setImages(
     images && images.filter((image)=>{
        if(String(image.id)!=imageId){
          return image
        }
         
       })
    )
  }
  

  function renderTextInputHeader() {
    return (
      <View
        style={{
          paddingHorizontal: 15,
        }}
      >
        <Formik
          initialValues={{
            post: post,
          }}
          onSubmit={editMode ? updateDiaryPost : saveDiaryPost}
          enableReinitialize
        >
          {(formProps: FormikProps<IDiaryPost>) => {
            return (
              <View style={{ marginTop:  50 }}>
                <InputField
                  placeholder={`* Write Something ...                   
                  `}
                  fieldName='post'
                  fieldType={'text'}
                  returnKeyType={'next'}
                  typeTextColor={Colors.black}
                  placeHolderColor={'#888888'}
                  multiline={true}
                  borderNone={true}
                  borderRadius={7}
                  numberOfLines={6}
                  height={Platform.OS === 'android' ? 120:0}
                  backgroundColor={'#F7F7F7'}
                  {...formProps}
                />

                {images && images.length ? (
                  <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                    style={{
                      flexDirection: 'row',
                      marginTop: 25,
                    }}
                  >
                    {images.map((image) => {
                      return (
                        <>
                          <Image
                            source={{ uri: image.thumbUrl }}
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 7,
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              removeImage(image.id);
                            }}
                          >
                            <EntypoIcons name={'cross'} size={20} />
                          </TouchableOpacity>
                        </>
                      );
                    })}
                  </ScrollView>
                ) : null}

                {renderPostControls(formProps.isValid)}
                <BlockButton
                  title={editMode ? 'Update' : 'Post'}
                  onPress={formProps.handleSubmit}
                  color={Colors.black}
                  width={'100%'}
                />
              </View>
            );
          }}
        </Formik>
      </View>
    );
  }
  return (
    <Connectivity>
      <Async displayChildren={myDiaryState.isProcessing}>
        <ScrollView>
          <View
            style={{
              paddingVertical: 15,
              paddingHorizontal: 10,
              borderBottomWidth:1,
              borderBottomColor:Colors.lightGray
            }}
          >
            <BackButton navigation={props.navigation} />
          </View>
          {renderTextInputHeader()}
        </ScrollView>
      </Async>
    </Connectivity>
  );
}

export default AddNewDiaryPost;
