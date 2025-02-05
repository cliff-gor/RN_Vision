import * as React from "react";
import { ThemedText } from "@/components/ThemedText";
import VisionButton from "@/components/VisionButton";
import { Redirect, useRouter } from "expo-router";
import {
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { BlurView } from "expo-blur";

export default function HomeScreen() {
  const { hasPermission } = useCameraPermission();
  const microPhonePermission = Camera.getMicrophonePermissionStatus();
  const redirectToPermissions =
    !hasPermission || microPhonePermission === "not-determined";

  const [cameraPosition, setCameraPosition] = React.useState<"front" | "back">(
    "back"
  );
  const device = useCameraDevice(cameraPosition);
  const [zoom, setZoom] = React.useState(device?.neutralZoom);
  const [exposure, setExposure] = React.useState(0);
  const [flash, setFlash] = React.useState<"off" | "on">("off");
  const [torch, setTorch] = React.useState<"off" | "on">("off");

  const router = useRouter();
  if (redirectToPermissions) return <Redirect href={"/permissions"} />;
  if (!device) return <></>;

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* <ThemedText>Hello Camera</ThemedText> */}
        <View style={{ flex: 2 }}>
          <Camera
            style={{ flex: 1, borderRadius: 10, overflow: "hidden" }}
            device={device}
            isActive
            zoom={zoom}
            resizeMode="cover"
            exposure={exposure}
            torch={torch}
          />

          <BlurView
            intensity={100}
            tint="dark"
            style={{
              flex: 1,
              position: "absolute",
              bottom: 0,
              right: 0,
              padding: 10,
            }}
            experimentalBlurMethod="dimezisBlurView"
          >
            <Text
              style={{
                color: "white",
              }}
            >
              Exposure: {exposure} | Zoom: x{zoom}
            </Text>
          </BlurView>
        </View>
        <View style={{ flex: 1 }}>
          {/* Top Section of controls */}
          <View style={{ flex: 0.7 }}>
            <ThemedText>Max FPS: {device.formats[0].maxFps}</ThemedText>
            <ThemedText>
              Width: {device.formats[0].photoWidth} Height:{" "}
              {device.formats[0].photoHeight}
            </ThemedText>
            <ThemedText>Camera Name: {device.name}</ThemedText>
          </View>

          <View
            style={{
              flex: 0.7,
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            {/* Middle Section */}
            <VisionButton
              iconName={torch === "on" ? "flashlight" : "flashlight-outline"}
              onPress={() => setTorch((t) => (t === "off" ? "on" : "off"))}
              containerStyle={{ alignSelf: "center" }}
            />

            <VisionButton
              iconName={flash === "on" ? "flash-outline" : "flash-off-outline"}
              onPress={() => setFlash((f) => (f === "off" ? "on" : "off"))}
              containerStyle={{ alignSelf: "center" }}
            />

            <VisionButton
              iconName="camera-reverse-outline"
              onPress={() =>
                setCameraPosition((p) => (p === "back" ? "front" : "back"))
              }
              containerStyle={{ alignSelf: "center" }}
            />

            <VisionButton
              iconName="image-outline"
              onPress={() => {
                const link = Platform.select({
                  ios: "photos-redirect://",
                  android: "content://media/external/images/media",
                });
                Linking.openURL(link!);
              }}
              containerStyle={{ alignSelf: "center" }}
            />

            <VisionButton
              iconName="settings-outline"
              onPress={() => router.push("/_sitemap")}
              containerStyle={{ alignSelf: "center" }}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
  },
});
