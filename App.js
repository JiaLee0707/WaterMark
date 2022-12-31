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
    SafeAreaView,
    StatusBar,
    StyleSheet,
    useColorScheme,
} from 'react-native';

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';

import PermissionsConfig from "./src/config/PermissionsConfig";
import {launchImageLibrary} from "react-native-image-picker";
import ViewShot from "react-native-view-shot";
import {CameraRoll} from "@react-native-camera-roll/camera-roll";

import {
    Gesture,
    GestureHandlerRootView,
    GestureDetector,
} from "react-native-gesture-handler";
import {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import {Btn, Img} from "./src/view/styled/TestStyled";
import DragTextEditorPresenter from "./src/view/presenter/DragTextEditorPresenter";

const App: () => Node = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const [photo, setPhoto] = useState(null);

    const viewShotRef = useRef(null);

    const context = useSharedValue({x: 0, y: 0});
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const panGesture = Gesture.Pan()
        .onBegin((event) => {
            context.value = {x: translateX.value, y: translateY.value};
        })
        .onUpdate((event) => {
            console.log('onUpdate', event);
            translateX.value = event.translationX + context.value.x;
            translateY.value = event.translationY + context.value.y;
        })
        .enableTrackpadTwoFingerGesture(true);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = event.scale
        });

    const composed = Gesture.Simultaneous(panGesture, pinchGesture);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: translateX?.value},
                {translateY: translateY?.value},
                {scale: scale?.value}
            ],
        };
    });

    useEffect(() => {
        PermissionsConfig();
    }, []);

    const showPicker = async () => {
        const result = await launchImageLibrary();
        if (result.didCancel) return null;

        // console.log('result', result.didCancel);
        const localUri = result.assets[0].uri;
        const uriPath = localUri.split("//").pop();
        // const imageName = localUri.split("/").pop();
        setPhoto("file://" + uriPath);
    }

    const save = () => {
        viewShotRef.current.capture().then((url) => {
            // console.log('url', url);
            CameraRoll.save(url, "photo").then(r => {
                // console.log('🐤result', r);
            });
        });
    }

    return (
        <SafeAreaView style={[backgroundStyle, styles.Screen]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <GestureHandlerRootView style={styles.Screen}>
                <GestureDetector gesture={composed}>
                    <ViewShot
                        ref={viewShotRef}
                        style={{
                            position: 'relative',
                            flex: 2,
                            width: '100%',
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Img source={{uri: photo}} resizeMode="contain"/>
                        <DragTextEditorPresenter animatedStyle={animatedStyle}/>
                    </ViewShot>
                </GestureDetector>
                <Btn title="이미지 선택" onPress={showPicker}></Btn>
                <Btn title="텍스트 추가" onPress={showPicker}></Btn>
                <Btn title="저장?" onPress={save}></Btn>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    Screen: {
        display: "flex",
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: "center",
        justifyContent: "center",
    },
});

export default App;
