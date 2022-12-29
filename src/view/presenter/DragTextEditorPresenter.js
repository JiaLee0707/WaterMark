import React from "react";
import {TextInput} from "react-native";

import Animated from "react-native-reanimated";

const DragTextEditorPresenter = () => {
    return (
        <Animated.View
            // style={[styles.square, { height: 100, width: 100 }, rStyle]}
        >
            <TextInput style={{ height: 50, width: 50, backgroundColor: 'white' }} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({

});

export default DragTextEditorPresenter;
