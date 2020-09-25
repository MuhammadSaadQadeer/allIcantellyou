import { prop } from 'ramda';
import descend from 'ramda/es/descend';
import sortWith from 'ramda/es/sortWith';
import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import FeatherIcons from 'react-native-vector-icons/Feather';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Urls from '../../Constants/Urls';
import { AppContext, ISearchResult } from '../../Contexts/AppContext';
import Api from '../../Services/Api';
import { mainAppStyles } from '../../styles';
import { Colors } from '../../Themes';

function TopBar(props: any) {
  const [search, updateSearch] = useState('');
  const appCtx = useContext(AppContext);
  const [showLoading, setShowLoading] = useState(false);
  function searchAICTY() {
    setShowLoading(true);
    Api({
      method: 'GET',
      url: Urls.search.search_query(search),
    })
      .then((response) => {
        const sortByPublishedDate = sortWith([descend(prop('publishedAt'))]);
        let result: ISearchResult = {
          posts: response.data.posts
            ? sortByPublishedDate(response.data.posts)
            : [],
          diaryPosts: response.data.diaryPosts ? response.data.diaryPosts : [],
          resources: response.data.resources ? response.data.resources : [],
          users: response.data.users ? response.data.users : [],
        };

        appCtx.dispatch({
          type: 'SET_SEARCH_RESULT',
          searchResult: result,
        });
        setShowLoading(false);

        props.NavigationService.navigate('Search');
      })
      .catch((error) => {
        setShowLoading(false);
      });
  }

  useEffect(() => {
    updateSearch('');

    appCtx.dispatch({
      type: 'CLEAR_SEARCH',
      clearSearch: false,
    });
  }, [appCtx.clearSearch]);

  return (
    <View style={mainAppStyles.topBar}>
      <TouchableOpacity
        onPress={() => props.NavigationService.navigate('Profile')}
      >
        {/* <ProfileSvg size={20} /> */}
        <FeatherIcons name={'user'} size={25} color={Colors.white} />
      </TouchableOpacity>
      <View style={mainAppStyles.searchBarView}>
        <SearchBar
          showLoading={showLoading}
          onSubmitEditing={searchAICTY}
          inputContainerStyle={mainAppStyles.searchBarInputContainer}
          containerStyle={mainAppStyles.searchBarContainer}
          inputStyle={mainAppStyles.searchBarInput}
          placeholder={`Search For People, Feed & Articles`}
          onChangeText={updateSearch}
          value={search}
          round={true}
          placeholderTextColor={Colors.white}
          searchIcon={false}
          lightTheme={false}
          loadingProps={{
            color: Colors.white,
          }}
          clearIcon={false}
        />
      </View>

      <TouchableOpacity
        onPress={() => props.NavigationService.navigate('Notifications')}
      >
        {/* <ProfileSvg size={20} /> */}
        <IonIcons
          name={'ios-notifications-outline'}
          color={Colors.white}
          size={25}
        />
      </TouchableOpacity>
    </View>
  );
}

export default TopBar;
