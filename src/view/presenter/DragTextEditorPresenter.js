import React, {useState} from "react";

import Animated from "react-native-reanimated";
import {TextInput} from "react-native-gesture-handler";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const DragTextEditorPresenter = ({animatedStyle}) => {
    const [text, setText] = useState('');

    return (
            <AnimatedTextInput
                multiline={true}
                style={
                    [
                        animatedStyle,
                        {
                            borderColor: '#000000',
                            borderWidth: 1,
                            color: '#000000',
                            position: 'absolute',
                            minWidth: '10%',
                            // minHeight: '10%',
                        }
                    ]
                }
                value={text}
                onChangeText={(text) => setText(text)}
            />
    );
}

// const styles = StyleSheet.create({
//
// });

export default DragTextEditorPresenter;
