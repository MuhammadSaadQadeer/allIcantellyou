import { Formik, FormikProps } from 'formik';
import React, { useContext, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import * as Yup from 'yup';
import BackButton from '../../Components/General/BackButton';
import { InputField } from '../../Components/InputField';
import { NormalText } from '../../Components/NormalText';
import { SmallText } from '../../Components/SmallText';
import WithoutLoginComponent from '../../Components/WithoutLoginComponent';
import Urls from '../../Constants/Urls';
import { AppContext } from '../../Contexts/AppContext';
import { showNotification } from '../../Lib/Utils';
import Api from '../../Services/Api';
import { Colors, Fonts } from '../../Themes';
import { convoStyles } from './styles';
interface INewTopicFormValues {
  title: string;
  body: string;
}

interface INewTopicPost {
  useFullName: boolean;
  usePseudonym: boolean;
  topic: string;
  title: string;
  body: string;
}

const NewTopicSchema = Yup.object().shape({
  title: Yup.string().required(' '),
  body: Yup.string()
    .min(20)
    .required(' '),
});

let filters = [
  'All',
  'Relationships',
  'Work',
  'Mental Health',
  'Technology',
  'Dreams',
  'Happiness',
  'Travel',
  'Students',
  'Other',
];

function AddNewTopic(props: any) {
  const [topic, setTopic] = useState('');
  const [isPseudonym, setisPseudonym] = useState(false);
  const appCtx = useContext(AppContext);

  function postTopicAndNavigateBack(values: INewTopicFormValues) {
    if (values.body.length < 20) {
      showNotification('Description should be greater than 20 characters');
      return;
    }
    let paylaod: INewTopicPost = {
      title: values.title,
      body: values.body,
      topic: topic,
      useFullName: !isPseudonym ? true : false,
      usePseudonym: isPseudonym ? isPseudonym : false,
    };
    Api({
      method: 'POST',
      url: Urls.conversations.add_topic,
      data: paylaod,
    })
      .then((response) => {
        if (response && response.data) {
          showNotification('Topic added successfully!');
        }
        props.navigation.goBack();
      })
      .catch((error) => {});
  }

  return (
    <View style={convoStyles.container}>
      {appCtx.isAuthenticated ? (
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              paddingVertical: 5,
            }}
          >
            <BackButton navigation={props.navigation} />
          </View>
          <Formik
            initialValues={{
              body: '',
              title: '',
            }}
            onSubmit={postTopicAndNavigateBack}
            validationSchema={NewTopicSchema}
          >
            {(formProps: FormikProps<INewTopicFormValues>) => {
              return (
                <View>
                  <InputField
                    placeholder={'Title'}
                    fieldName='title'
                    fieldType={'text'}
                    returnKeyType={'next'}
                    typeTextColor={Colors.black}
                    borderColor={Colors.black}
                    placeHolderColor={Colors.lightGray}
                    borderRadius={5}
                    {...formProps}
                  />

                  <View
                    style={{
                      justifyContent: 'center',
                    }}
                  >
                    <Menu>
                      <MenuTrigger>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderColor: Colors.black,
                            borderWidth: 2,
                            borderRadius: 7,
                            paddingVertical: 20,
                            paddingHorizontal: 10,
                            marginBottom: 20,
                          }}
                        >
                          <NormalText text={topic ? topic : `Pick a Topic`} />
                          <FontistoIcon name={'caret-down'} />
                        </View>
                      </MenuTrigger>
                      <MenuOptions
                        optionsContainerStyle={{
                          width: 150,
                          paddingHorizontal: 10,
                        }}
                      >
                        {filters.map((filter) => {
                          return (
                            <MenuOption onSelect={() => setTopic(filter)}>
                              <NormalText text={filter} />
                            </MenuOption>
                          );
                        })}
                      </MenuOptions>
                    </Menu>
                  </View>

                  <InputField
                    placeholder={'Description'}
                    fieldName='body'
                    fieldType={'text'}
                    typeTextColor={Colors.black}
                    borderColor={Colors.black}
                    borderRadius={5}
                    placeHolderColor={Colors.lightGray}
                    {...formProps}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 40,
                      marginBottom: 12,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      activeOpacity={1}
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
                      activeOpacity={1}
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

                  <TouchableOpacity
                    onPress={formProps.handleSubmit}
                    style={{
                      alignItems: 'center',
                      height: 47,
                      backgroundColor: Colors.black,
                      justifyContent: 'center',
                      marginVertical: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.type.regular,
                        color: Colors.white,
                      }}
                    >
                      Post
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => props.navigation.goBack()}
                    style={{
                      alignItems: 'center',
                      height: 47,

                      justifyContent: 'center',
                      marginVertical: 4,
                      borderRadius: 6,
                      borderColor: 'red',
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.type.regular,
                        color: Colors.black,
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          </Formik>
        </View>
      ) : (
        <WithoutLoginComponent
          navigation={props.navigation}
          title={'Login or create account to add New Topic'}
          btnTitle={'Proceed To Login'}
        />
      )}
    </View>
  );
}

export default AddNewTopic;
