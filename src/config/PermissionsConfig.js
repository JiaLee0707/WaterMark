import {PermissionsAndroid} from 'react-native';

const PermissionsConfig = async () => {
    const grantedStorage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
            title: "title",
            message: "message",
            buttonNeutral: "buttonNeutral",
            buttonNegative: "buttonNegative",
            buttonPositive: "buttonPositive",
        }
    );

    if (grantedStorage === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("GRANTED");
    }
}

export default PermissionsConfig;