import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import type { Post } from "@/types/post";

export default function PdfViewerScreen() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndOpenPdf = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/posts/${documentId}?populate=image`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch post");
        }

        const json = await res.json();
        const postData = json.data;

        if (!postData.image?.url) {
          setError("No PDF available for this post");
          setLoading(false);
          return;
        }

        if (postData.image?.mime !== "application/pdf") {
          setError("The file is not a PDF");
          setLoading(false);
          // Redirect to markdown viewer after a delay
          setTimeout(() => {
            router.replace(`/posts/${documentId}`);
          }, 2000);
          return;
        }

        // Open PDF in browser
        await WebBrowser.openBrowserAsync(postData.image.url);

        // Navigate back after opening browser
        router.back();
      } catch (err) {
        console.error("Error fetching PDF:", err);
        setError("Failed to load PDF. Please try again.");
        setLoading(false);
      }
    };

    if (documentId) {
      fetchAndOpenPdf();
    }
  }, [documentId]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Opening PDF...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
});
