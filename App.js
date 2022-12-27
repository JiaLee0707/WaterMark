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
  useColorScheme, View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import PermissionsConfig from "./src/config/PermissionsConfig";
import {launchImageLibrary} from "react-native-image-picker";
import ViewShot from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

import {Btn, Img} from "./src/view/styled/TestStyled";
import {PanGestureHandler, GestureHandlerRootView} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {DragTextEditor} from "react-native-drag-text-editor";

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
    onEnd: (event, context) => {
      if (event.absoluteY> 150) {
        // withSpring animation our moveable box will move originial coordinate more user friendly.
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
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
    const localUri = result.assets[0].uri;
    const uriPath = localUri.split("//").pop();
    const imageName = localUri.split("/").pop();
    setPhoto("file://"+uriPath);
  }

  const save = () => {
    viewShotRef.current.capture().then((url) => {
      console.log('url', url);
      CameraRoll.saveToCameraRoll(url).then(r => {
        console.log('🐤result', r);
      });
    });
  }

  const viewComponent = () => <View style={styles.cornerStyles}/>;

  const _cornerComponent = [
    {
      side: 'TR',
      customCornerComponent: () => viewComponent()
    },
  ];

  const _rotateComponent = {
    side: 'bottom',
    customRotationComponent: () => viewComponent()
  };

  const _resizerSnapPoints = ['right', 'left'];

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

      <View
          style={[
            styles.dropzone,
            {
              top: 0,
              height: 200,
              width: '100%',
              position: 'absolute',
            },
          ]}></View>
        <PanGestureHandler onGestureEvent={panGestureEvent}>

          <DragTextEditor
              visible={true}
              resizerSnapPoints={_resizerSnapPoints}
              cornerComponents={_cornerComponent}
              rotationComponent={_rotateComponent}
              externalTextStyles={styles.textStyles}
              externalBorderStyles={styles.borderStyles}
          />
          {/*<Animated.View*/}
          {/*    style={[styles.square, { height: 100, width: 100 }, rStyle]}*/}
          {/*/>*/}
        </PanGestureHandler>
        {/*<ViewShot ref={viewShotRef} style={{flex: 2}}>*/}
        {/*  <Img source={{uri:photo}} resizeMode="contain"/>*/}
        {/*  /!*<PanGestureHandler onGestureEvent={panGestureEvent}>*!/*/}
        {/*    /!*<Animated.View*!/*/}
        {/*    /!*    style={[styles.square, { height: 100, width: 100 }, rStyle]}*!/*/}
        {/*    /!*//*/}
        {/*  /!*</PanGestureHandler>*!/*/}
        {/*</ViewShot>*/}
        {/*<Btn title="이미지 선택" onPress={showPicker} style={{flex: 1}}></Btn>*/}
        {/*<Btn title="텍스트 추가" onPress={showPicker} style={{flex: 1}}></Btn>*/}
        {/*<Btn title="저장?" onPress={save} 스타일={{flex: 1}}></Btn>*/}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Screen: {
    // display: "flex",
    flex: 1,
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
    backgroundColor: 'rgba(0, 0, 256, 0.5)',
  },
  square: {
    borderRadius: 15,
    backgroundColor: 'red',
  },
  cornerStyles: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    borderColor: '#aaa',
  },
  borderStyles: {
    borderStyle: 'dashed',
    borderColor: 'gray',
  },
});

export default App;
