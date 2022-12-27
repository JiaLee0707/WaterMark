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
  Button, Dimensions,
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
import {launchImageLibrary} from "react-native-image-picker"; // 이미지 불러오기
import ViewShot from "react-native-view-shot";  // 이미지 캡쳐
import { CameraRoll } from "@react-native-camera-roll/camera-roll"; // 이미지 저장
import {DragTextEditor} from 'react-native-drag-text-editor'; // 텍스트

import {Btn, Img} from "./src/view/styled/TestStyled";
import {PanGestureHandler, GestureHandlerRootView} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const WINDOW = Dimensions.get("window");

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [photo, setPhoto] = useState(null);
  const ID = {
    defTextID: 1,
    defTextValue: 1,
    defAlign: "center",
    defLetterSpacing: 0,
    defColor: "#000000",
    defFontSize: 15,
  }

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
              style={{flex: 2, width: '100%'}}

              visible={true}
              isDraggable={true}
              isResizable={true}
              resizerSnapPoints={_resizerSnapPoints}
              cornerComponents={_cornerComponent}
              rotationComponent={_rotateComponent}
              externalTextStyles={styles.textStyles}
              externalBorderStyles={styles.borderStyles}
              onResizeStart={() => console.log('aaa')}
          />
          <DragTextEditor
              minWidth={100}
              minHeight={100}
              w={200}
              h={200}
              x={WINDOW.width / 4}
              y={WINDOW.height / 3}
              FontColor={ID.defColor}
              TextAlign={ID.defAlign}
              LetterSpacing={ID.defLetterSpacing}
              FontSize={ID.defFontSize}
              // TopRightAction={() => this.removeText(ID.defTextID)}
              centerPress={() => console.log('eeee')}
              onItemActive={(e) => console.log('eeee', e)}
              isDraggable={true}
              isResizable={true}
              resizerSnapPoints={_resizerSnapPoints}
              onDragStart={() => console.log("-Drag Started")}
              onDragEnd={() => console.log("- Drag ended")}
              onDrag={() => console.log("- Dragging...")}
              onResizeStart={() => console.log("- Resize Started")}
              onResize={() => console.log("- Resizing...")}
              onResizeEnd={() => console.log("- Resize Ended")}
          />
          <Animated.View
              style={[styles.square, { height: 100, width: 100 }, rStyle]}
          />
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
  borderStyles: {
    borderStyle: 'dashed',
    borderColor: 'gray',
  },
  textStyles: {
    color: '#000',
  },
  cornerStyles: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    borderColor: '#aaa',
  },
});

export default App;
