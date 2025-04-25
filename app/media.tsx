import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Image, StyleSheet } from "react-native";
import { Video } from "expo-video";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { saveToLibraryAsync } from "expo-media-library";
import VisionButton from "@/components/VisionButton";

export default function MediaScreen() {
  const { media, type } = useLocalSearchParams();
  const router = useRouter();

  const mediaUri =
    typeof media === "string" && media.startsWith("file://")
      ? media
      : `file://${media}`;

  if (!media || !type) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Invalid media input</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go back</ThemedText>
        </Link>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {type === "photo" ? (
        <Image
          source={{ uri: mediaUri }}
          style={{ width: "100%", height: "80%", resizeMode: "contain" }}
        />
      ) : type === "video" ? (
        <Video
          source={{ uri: mediaUri }}
          style={{ width: "100%", height: "80%" }}
          useNativeControls
          resizeMode="contain"
          isLooping
          shouldPlay
        />
      ) : null}

      <VisionButton
        title="Save to gallery"
        containerStyle={{ alignSelf: "center" }}
        onPress={async () => {
          try {
            await saveToLibraryAsync(media as string);
            Alert.alert("Saved to gallery!");
            router.back();
          } catch (error) {
            console.error("Failed to save:", error);
            Alert.alert("Error", "Could not save the file.");
          }
        }}
      />

      <Link href="/" style={styles.link}>
        <ThemedText type="link">Delete and go back</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    alignSelf: "center",
  },
});
