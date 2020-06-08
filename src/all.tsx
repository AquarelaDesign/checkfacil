import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useTheme, Caption } from 'react-native-paper';

import { NotificationTwitt } from './components/notificationTwitt';
import { notificationTweets } from './data';

type NotificationTwittProps = React.ComponentProps<typeof NotificationTwitt>;

function renderItem({ item }: { item: NotificationTwittProps }) {
  return <NotificationTwitt {...item} />;
}

function keyExtractor(item: NotificationTwittProps) {
  return item.id.toString();
}

export const AllAlbuns = () => {
  const theme = useTheme();

  return (
    <Caption style={styles.centerText}>
      Albuns...
    </Caption>
    // <FlatList
    //   contentContainerStyle={{ backgroundColor: theme.colors.background }}
    //   style={{ backgroundColor: theme.colors.background }}
    //   data={notificationTweets}
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
