import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme, Caption } from 'react-native-paper';

import { Twitt } from './components/twitt';
import { twitts } from './data';
import { StackNavigatorParamlist } from './types';

type TwittProps = React.ComponentProps<typeof Twitt>;

function renderItem({ item }: { item: TwittProps }) {
  return <Twitt {...item} />;
}

function keyExtractor(item: TwittProps) {
  return item.id.toString();
}

type Props = {
  navigation?: StackNavigationProp<StackNavigatorParamlist>;
};

export const Foto = (props: Props) => {
  const theme = useTheme();

  const data = twitts.map(twittProps => ({
    ...twittProps,
    onPress: () =>
      props.navigation &&
      props.navigation.push('Details', {
        ...twittProps,
      }),
  }));

  return (
    <Caption style={styles.centerText}>
      Fotos...
    </Caption>
// <FlatList
    //   contentContainerStyle={{ backgroundColor: theme.colors.background }}
    //   style={{ backgroundColor: theme.colors.background }}
    //   data={data}
    //   renderItem={renderItem}
    //   keyExtractor={keyExtractor}
    //   ItemSeparatorComponent={() => (
    //     <View style={{ height: StyleSheet.hairlineWidth }} />
    //   )}
    // />
  );
};

const styles = StyleSheet.create({
  centerText: {
    textAlign: 'center',
  },
});
