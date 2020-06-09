import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme, Caption } from 'react-native-paper';
import { Camera } from 'expo-camera';

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
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const theme = useTheme();

  const data = twitts.map(twittProps => ({
    ...twittProps,
    onPress: () =>
      props.navigation &&
      props.navigation.push('Details', {
        ...twittProps,
      }),
  }));

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Caption style={styles.centerText}>
      Sem acesso a camera
      </Caption>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          {/* <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
          </TouchableOpacity> */}
        </View>
      </Camera>
    </View>
    
    // <Caption style={styles.centerText}>
    //   Fotos...
    // </Caption>
    
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
