import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider, SearchBar, Tooltip } from 'react-native-elements';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import WebView from 'react-native-webview';
import Async from '../../Components/Async';
import Connectivity from '../../Components/Connectivity';
import { LargeText } from '../../Components/LargeText';
import NoRecords from '../../Components/NoRecords';
import { NormalText } from '../../Components/NormalText';
import { SmallText } from '../../Components/SmallText';
import Urls from '../../Constants/Urls';
import { getMonthDay, getMonthLetters, getTimeInAmPm } from '../../Lib/Utils';
import Api from '../../Services/Api';
import { mainAppStyles } from '../../styles';
import { EventsSvg } from '../../Svgs';
import { Colors } from '../../Themes';
import { eventsStyle } from './styles';

interface IEventsProps {
  eventId: string;
  name: string;
  description: string;
  length: string;
  locationHeadline: string;
  createdAt: string;
  eventAt: string;
  ticketUrl: string;
  eventType: string;
  organiser: string;
  startTime: string;
  eventImage: string;
  tags: [];
  suitableFor: [];
  promoMessage: string;
  latitude: string;
  longitude: string;
  aictyComment: string;
  aboutTheOrganiser: string;
}
let filters = [
  'All',
  'Workshops & Masterclasses',
  'Retreats & Wellness Breaks',
  'Conferences & Exhibitions',
  'Festivals & Celebrations',
  'Courses & Classes',
  'Talks & Seminars',
];

function Events(props: any) {
  const [search, updateSearch] = useState('');
  const [events, setEvents] = useState<IEventsProps[]>();
  const [filteredEvents, setFilteredEvents] = useState<IEventsProps[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [ticketsUrl, setTicketsUrl] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterName, setFilterName] = useState('All');
  /**
   *  Fetch events on did mount
   */
  useEffect(() => {
    setIsFetching(true);
    Api({
      method: 'GET',
      url: Urls.events.events,
    })
      .then((response) => {
        setEvents(Object.values(response.data.allEvents));
        setFilteredEvents(Object.values(response.data.allEvents));
        setIsFetching(false);
      })
      .catch((error) => {
        setIsFetching(false);
      });
  }, []);

  function filterEvents(filterName: string) {
    setFilterName(filterName);
    if (filterName === 'All') {
      setFilteredEvents(events);
      return;
    }
    setFilteredEvents(events.filter((item) => item.eventType === filterName));
  }

  /** Filter single item */
  function renderFilter(filter: string) {
    return (
      <TouchableOpacity
        onPress={() => {
          filterEvents(filter);
        }}
        style={{
          paddingHorizontal: 10,
        }}
      >
        <SmallText
          color={filter == filterName ? Colors.background : Colors.lightGray}
          text={filter}
        />
      </TouchableOpacity>
    );
  }

  /** Horizontal filter view  */
  function horizontalFilterSection() {
    return (
      <ScrollView
        horizontal={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps={true}
        keyboardDismissMode='on-drag'
        style={{
          paddingVertical: 10,
        }}
      >
        {filters.map((filter, index) => {
          return renderFilter(filter);
        })}
      </ScrollView>
    );
  }

  /** Open tickets url in web view */
  function openTicketUrl(webUrl: string) {
    return (
      <WebView
        source={{
          uri: webUrl,
        }}
        startInLoadingState
        scalesPageToFit
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{ flex: 1 }}
      />
    );
  }

  /**
   *  onRefresh will be called when the
   *  user will refresh the report screen
   *  by pulling scroll view downwards
   */
  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    Api({
      method: 'GET',
      url: Urls.events.events,
    })
      .then((response) => {
        setIsRefreshing(false);
        setEvents(Object.values(response.data.allEvents));
      })
      .catch((error) => {
        setIsRefreshing(false);
      });
  }, []);

  function searchBar() {
    return (
      <SearchBar
        inputContainerStyle={{
          backgroundColor: '#F7F7F7',
        }}
        containerStyle={eventsStyle.searchBarContainer}
        inputStyle={mainAppStyles.searchBarInput}
        placeholder={`Search Places...`}
        onChangeText={updateSearch}
        value={search}
        round={true}
        cancelIcon={true}
        showCancel={true}
        cancelButtonTitle={'Cancel'}
        searchIcon={false}
      />
    );
  }

  function eventThumbnail(item: IEventsProps) {
    return (
      <View style={eventsStyle.thumbnailContainer}>
        <View
          style={{
            backgroundColor: '#F7F7F7',
            borderColor: '#F7F7F7',
            borderWidth: 1,
            borderRadius: 7,
          }}
        >
          {/* Image Container */}
          <View style={eventsStyle.imageContainer}>
            <Image
              source={{
                uri: item.eventImage,
              }}
              style={eventsStyle.imageStyles}
            />
            {/* Suitable and hour buttons */}
            <View style={eventsStyle.suitableButtonContainer}>
              <View style={eventsStyle.suitableForBtn}>
                <SmallText
                  fontSize={12}
                  color={Colors.white}
                  text={item.suitableFor[0].toUpperCase()}
                />
              </View>

              <View style={eventsStyle.timingBtn}>
                <SmallText
                  fontSize={12}
                  color={Colors.background}
                  text={item.length.toUpperCase()}
                />
              </View>
            </View>
          </View>

          {/* Date and name container */}
          <View style={eventsStyle.dateTitleContainer}>
            <View
              style={{
                paddingHorizontal: 10,
              }}
            >
              <Text style={eventsStyle.eventDay}>
                {getMonthDay(item.eventAt)}
              </Text>
              <NormalText
                textAlign={'center'}
                text={getMonthLetters(item.eventAt).toUpperCase()}
              />
            </View>

            <Text style={eventsStyle.eventTitle}>{item.name}</Text>
          </View>

          {/* Description time and location view */}
          <View style={eventsStyle.descriptionContainer}>
            <SmallText
              fontSize={14}
              textAlign={'justify'}
              color={'#C3C3C3'}
              marginTop={10}
              text={item.description}
            />
            <SmallText
              fontSize={14}
              color={Colors.black}
              marginTop={15}
              marginBottom={5}
              text={`Starts ${getTimeInAmPm(item.startTime)}`}
            />
            <SmallText
              fontSize={14}
              color={Colors.black}
              marginBottom={10}
              text={`Location ${item.locationHeadline}`}
            />
            <SmallText
              fontSize={14}
              color={Colors.black}
              text={`Type: ${item.eventType}`}
            />
          </View>

          {/* Tickets and comments container */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingVertical: 10,
            }}
          >
            <TouchableOpacity
              style={eventsStyle.ticketsBtn}
              onPress={() => {
                setTicketsUrl(item.ticketUrl);
              }}
            >
              <NormalText color={Colors.background} text={'Tickets'} />
            </TouchableOpacity>

            {item.aictyComment ? (
              <Tooltip
                containerStyle={eventsStyle.commentsBtn}
                withPointer={true}
                backgroundColor={'#907AD6'}
                popover={
                  <SmallText
                    flexWrap={'wrap'}
                    text={item.aictyComment}
                    color={Colors.white}
                  />
                }
              >
                <AntDesignIcon
                  style={{ textAlign: 'right' }}
                  name={'infocirlce'}
                  color={'#907AD6'}
                />
                <NormalText
                  marginLeft={15}
                  text={'Comments'}
                  color={'#8F7AD6'}
                />
              </Tooltip>
            ) : null}
          </View>

          {item.promoMessage ? (
            <View
              style={{
                alignItems: 'center',
              }}
            >
              <NormalText text={`Dicount Code:  ${item.promoMessage}`} />
            </View>
          ) : null}

          <View style={eventsStyle.hashTagContainer}>
            {item.tags.map((tag) => {
              return (
                <SmallText
                  textAlign={'left'}
                  text={` #${tag}`}
                  color={Colors.lightGray}
                />
              );
            })}
          </View>
        </View>
      </View>
    );
  }

  return (
    <Connectivity>
      <Async displayChildren={isFetching}>
        {ticketsUrl ? (
          <>
            <TouchableOpacity
              onPress={() => {
                setTicketsUrl('');
              }}
              style={{
                backgroundColor: Colors.transparent,
                flexDirection: 'row',
                alignSelf: 'flex-end',
              }}
            >
              <EntypoIcons name={'cross'} size={25} color={Colors.lightGray} />
            </TouchableOpacity>
            {openTicketUrl(ticketsUrl)}
          </>
        ) : (
          <React.Fragment>
            <View style={{ paddingHorizontal: 20 }}>
              <View
                style={{
                  marginTop: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <EventsSvg size={20} />
                <LargeText text={'Events'} marginLeft={10} fontSize={18} />
              </View>
              {horizontalFilterSection()}
            </View>
            <Divider />
            {/* {searchBar()} */}
            {filteredEvents && filteredEvents.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    tintColor={Colors.background}
                  />
                }
                data={filteredEvents}
                renderItem={({ item }) => eventThumbnail(item)}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={{
                        alignSelf: 'stretch',
                        height: 20,
                        width: '100%',
                        backgroundColor: Colors.white,
                      }}
                    ></View>
                  );
                }}
              />
            ) : (
              <NoRecords title={'Nothing to display'} />
            )}
          </React.Fragment>
        )}
      </Async>
    </Connectivity>
  );
}

export default Events;
