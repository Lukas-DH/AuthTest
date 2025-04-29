import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import Markdown from "react-native-markdown-display";

interface Post {
  documentId: string;
  title: string;
  content: string;
  author: string;
  image: {
    url: string;
  };
}

export default function BlogDetail() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/posts/${documentId}`
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

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{post.title}</Text>
      <Text style={{ marginVertical: 10, fontStyle: "italic" }}>
        par {post.author}
      </Text>
      {/* <Image
        source={{ uri: post.image?.url }}
        style={{ width: "100%", height: 200, borderRadius: 10 }}
        resizeMode="cover"
      /> */}
      <Markdown style={{ body: { marginTop: 20, fontSize: 16 } }}>
        {post.content}
      </Markdown>
    </ScrollView>
  );
}
