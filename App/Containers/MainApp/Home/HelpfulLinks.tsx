import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Async from '../../../Components/Async';
import Connectivity from '../../../Components/Connectivity';
import NoRecords from '../../../Components/NoRecords';
import { NormalText } from '../../../Components/NormalText';
import { SmallText } from '../../../Components/SmallText';
import Urls from '../../../Constants/Urls';
import Api from '../../../Services/Api';
import {
  AgeingSvg,
  ChallengesSvg,
  HappinessSvg,
  MentalHealthSvg,
  RelationShipSvg,
  StartSvg,
} from '../../../Svgs';
import { Colors } from '../../../Themes';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Mental Health & Wellbeing',
    label: 'mental',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Happiness & Humour',
    label: 'happiness',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Ageing & Death',
    label: 'aging',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d92',
    title: 'Relationships',
    label: 'relation',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d32',
    title: 'Challenges & Crirses',
    label: 'challenges',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145591e29d32',
    title: 'Challenges & Crirses',
    label: 'challenges_1',
  },
];

function HelpfulLinks(props: any) {
  const [helpfulLinks, setHelpFulLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flatListData, setFlatListData] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    Api({
      method: 'GET',
      url: Urls.helpfulLinks.links,
    })
      .then((result) => {
        setHelpFulLinks(result.data.byCategory);

        let objectKeys = Object.entries(result.data.byCategory);
        let flatList = objectKeys.map((key, index) => {
          return {
            id: index,
            title: key[0],
            items: key[1],
          };
        });

        setFlatListData(flatList);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);

        //showNotification('Unable to fetch helpful links');
      });
  }, []);

  function renderSeparator() {
    return (
      <View
        style={{
          borderColor: '#EDEDED',
          borderWidth: 1,
        }}
      />
    );
  }

  function Item(item) {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('HelpfulLinkDetail', {
            links: item.items,
            backTitle: item.title,
          });
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 20,
            alignItems: 'center',
          }}
        >
          {item.title === 'Mental Health & Wellbeing' ? (
            <MentalHealthSvg size={40} />
          ) : null}
          {item.title === 'Happiness & Humour' ? (
            <HappinessSvg size={40} />
          ) : null}
          {item.title === 'Ageing & Death' ? <AgeingSvg size={40} /> : null}
          {item.title === 'Relationships' ? (
            <RelationShipSvg size={40} />
          ) : null}
          {item.title === 'Challenges & Crises' ? (
            <ChallengesSvg size={40} />
          ) : null}
          {item.title === 'Positivety & Self-esteem' ? (
            <StartSvg size={40} />
          ) : null}

          <View style={{ paddingLeft: 18 }}>
            <NormalText text={item.title} color={Colors.black} />
            <SmallText text={`${item.items.length} Resources`} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Connectivity>
      <Async displayChildren={isLoading}>
        <View
          style={{
            flex: 1,
          }}
        >
          {flatListData && flatListData.length > 0 ? (
            <FlatList
              ItemSeparatorComponent={renderSeparator}
              data={flatListData}
              renderItem={({ item }) => (
                <Item title={item.title} items={item.items} />
              )}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <NoRecords title={'Nothing to display'} />
          )}
        </View>
      </Async>
    </Connectivity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   marginTop: Constants.statusBarHeight,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  title: {
    fontSize: 32,
  },
});

export default HelpfulLinks;
