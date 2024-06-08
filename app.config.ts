import { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const projectId = config.extra?.eas?.projectId;
  const { APP_ENV } = process.env;

  return {
    name: APP_ENV === "production" ? "Life Routine" : "Life Routine (DEV)",
    slug: APP_ENV === "production" ? "liferoutine" : "liferoutine-dev",
    ios: {
      bundleIdentifier:
        APP_ENV === "production"
          ? "me.ph7.liferoutine"
          : "dev.ph7.liferoutine-dev",
    },
    android: {
      package:
        APP_ENV === "production"
          ? "me.ph7.liferoutine"
          : "dev.ph7.liferoutine.dev",
    },
    extra: {
      eas: {
        projectId,
      },
    },
  };
};
