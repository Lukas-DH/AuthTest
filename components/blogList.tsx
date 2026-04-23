import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
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
      <View style={styles.referenceBox}>
        <Text style={styles.referenceText}>
          Les algorithmes de dépistage et de prévention de l'application ont été développés sous la supervision du Pr Nicolas Gatimel du CHU de Toulouse, France. Ils sont fondés sur une revue structurée de la littérature scientifique selon une méthodologie validée, suivie d'un consensus d'experts au sein d'une équipe multidisciplinaire (gynécologues, andrologues et biologistes de la reproduction). Toutes les recommandations et évaluations du risque mises en œuvre dans l'application découlent de ce processus fondé sur les preuves, garantissant transparence, fiabilité et pertinence clinique.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  referenceBox: {
    marginTop: 8,
    marginHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    width: "100%",
    maxWidth: 600,
  },
  referenceText: {
    fontSize: 11,
    color: "#94a3b8",
    fontStyle: "italic",
    lineHeight: 16,
  },
});
