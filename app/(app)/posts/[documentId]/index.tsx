import { useLocalSearchParams, Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import Markdown from "react-native-markdown-display";
import type { Post } from "@/types/post";

export default function BlogDetail() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/posts/${documentId}?populate=image`
        );
        const json = await res.json();
        setPost(json.data);
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };

    if (documentId) fetchPost();
  }, [documentId]);

  if (!post) return <ActivityIndicator size="large" />;

  const hasPdf = post.image?.mime === "application/pdf";

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{post.title}</Text>
      {post.author && (
        <Text style={{ marginVertical: 10, fontStyle: "italic" }}>
          par {post.author}
        </Text>
      )}

      {hasPdf && (
        <Link href={`/posts/${documentId}/pdf`} asChild>
          <TouchableOpacity style={styles.pdfButton}>
            <Text style={styles.pdfButtonText}>📄 View as PDF</Text>
          </TouchableOpacity>
        </Link>
      )}

      {post.content && (
        <Markdown style={{ body: { marginTop: 20, fontSize: 16 } }}>
          {post.content}
        </Markdown>
      )}

      {!post.content && !hasPdf && (
        <Text style={styles.noContent}>No content available for this post.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pdfButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noContent: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
