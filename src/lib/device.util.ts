import { Platform } from "react-native";
import * as Application from "expo-application";

export const getDeviceId = async (): Promise<string> => {
  const DEFAULT_DEVICE_ID = "NO_DEVICE_ID";

  const deviceId =
    Platform.OS === "ios"
      ? await Application.getIosIdForVendorAsync()
      : Application.getAndroidId();

  return deviceId || DEFAULT_DEVICE_ID;
};
