/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useRef, useState} from 'react';
import type {Node} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet, Text,
  useColorScheme, View, TextInput
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import PermissionsConfig from "./src/config/PermissionsConfig";
import {launchImageLibrary} from "react-native-image-picker";
import ViewShot from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

import {PanGestureHandler, GestureHandlerRootView} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {Btn, Img} from "./src/view/styled/TestStyled";

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [photo, setPhoto] = useState(null);

  const viewShotRef = useRef(null);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      console.log('onStart');
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
    // onEnd: (event, context) => {
    //   if (event.absoluteY> 150) {
    //     // withSpring animation our moveable box will move originial coordinate more user friendly.
    //     translateX.value = withSpring(0);
    //     translateY.value = withSpring(0);
    //   }
    // },
  });
  // When shared value changes. animated style update the values accordingly that.
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  useEffect(() => {
    PermissionsConfig();
  }, []);

  const showPicker = async() =>{
    const result = await launchImageLibrary();
    if (result.didCancel){
      return null;
    }
    console.log('result', result.didCancel);
    const localUri = result.assets[0].uri;
    const uriPath = localUri.split("//").pop();
    const imageName = localUri.split("/").pop();
    setPhoto("file://"+uriPath);
  }

  const save = () => {
    viewShotRef.current.capture().then((url) => {
      console.log('url', url);
      // CameraRoll.saveToCameraRoll(url).then(r => {
      //   console.log('🐤result', r);
      // });
      CameraRoll.save(url, "photo").then(r => {
        console.log('🐤result', r);
      });
    });
  }

  return (
    <SafeAreaView style={[backgroundStyle, styles.Screen]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <GestureHandlerRootView
          style={styles.Screen}
        // contentInsetAdjustmentBehavior="automatic"
        >

      {/*<View*/}
      {/*    style={[*/}
      {/*      styles.dropzone,*/}
      {/*      {*/}
      {/*        top: 0,*/}
      {/*        height: 200,*/}
      {/*        width: '100%',*/}
      {/*        position: 'absolute',*/}
      {/*      },*/}
      {/*    ]}></View>*/}
        <ViewShot ref={viewShotRef} style={{flex: 2, width: '100%'}}>
          <Img source={{uri:photo}} resizeMode="contain"/>
          <PanGestureHandler onGestureEvent={panGestureEvent} style={{position: "relative", backgroundColor: '#000000'}}>
            <Animated.View
                style={[styles.square, { height: 100, width: 100 }, rStyle]}
            >
              <TextInput style={{ height: 50, width: 50, backgroundColor: 'white' }} />
            </Animated.View>
          </PanGestureHandler>
        </ViewShot>
        <Btn title="이미지 선택" onPress={showPicker}></Btn>
        <Btn title="텍스트 추가" onPress={showPicker}></Btn>
        <Btn title="저장?" onPress={save}></Btn>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Screen: {
    // display: "flex",
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#000000",
  },
  img: {
    width: '100%',
    height: '100%',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  dropzone: {
    backgroundColor: 'rgb(153,187,255)',
  },
  square: {
    borderRadius: 15,
    backgroundColor: "#99BBFFFF",
  },
});

export default App;
