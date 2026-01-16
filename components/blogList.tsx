import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Pressable } from "react-native";
import BlogCard from "./blogCard";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import type { Post } from "@/types/post";

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/posts?populate=image`
        );
        // if (!res.ok) throw new Error("Primary API failed");
        let json = await res.json();
        setPosts(json.data);
      } catch (error) {
        console.warn("Falling back to localhost:", error);
        // try {
        //   let res = await fetch(
        //     "http://localhost:1337/api/posts?populate=image"
        //   );
        //   let json = await res.json();
        //   setPosts(json.data);
        // } catch (err) {
        //   console.error("Failed to fetch from both APIs", err);
        // }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;
  console.log("posts", posts);
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      {Array.isArray(posts) &&
        posts.map((post) => {
          const isPdf = post.image?.mime === "application/pdf";

          return (
            <Pressable
              key={post.documentId}
              onPress={async () => {
                if (isPdf && post.image?.url) {
                  // For PDFs, open directly in browser (same as results page)
                  try {
                    await WebBrowser.openBrowserAsync(post.image.url);
                  } catch (error) {
                    console.error("Error opening PDF:", error);
                  }
                } else {
                  // For markdown posts, navigate to the post viewer
                  router.push({
                    pathname: "/posts/[documentId]",
                    params: { documentId: post.documentId.toString() }
                  });
                }
              }}
              style={{ width: '100%' }}
            >
              <BlogCard
                key={post.documentId}
                title={post.title}
                summary={post.summary}
                author={post.author || ""}
              />
            </Pressable>
          );
        })}
    </View>
  );
}
