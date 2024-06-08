import { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const projectId = config.extra?.eas?.projectId;
  const { APP_ENV } = process.env;

  return {
    name: APP_ENV === "production" ? "Life Routine" : "Life Routine (DEV)",
    slug: APP_ENV === "production" ? "life-routine" : "life-routine-dev",
    ios: {
      bundleIdentifier:
        APP_ENV === "production"
          ? "me.ph7.life-routine"
          : "dev.ph7.life-routine-dev",
    },
    android: {
      package:
        APP_ENV === "production"
          ? "me.ph7.life_routine"
          : "dev.ph7.life_routine.dev",
    },
    extra: {
      eas: {
        projectId,
      },
    },
  };
};
