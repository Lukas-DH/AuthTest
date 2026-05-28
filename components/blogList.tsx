import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import BlogCard from "./blogCard";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import type { Post } from "@/types/post";

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setFetchError(false);
      try {
        let res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/posts?populate=image`,
        );
        let json = await res.json();
        setPosts(json.data);
      } catch (error) {
        console.warn("Failed to fetch posts:", error);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [retryKey]);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#047857"
        style={{ marginTop: 40 }}
      />
    );

  if (fetchError) {
    return (
      <View style={{ alignItems: "center", paddingTop: 40 }}>
        <Text style={styles.errorText}>
          Impossible de charger les articles. Vérifiez votre connexion internet.
        </Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => setRetryKey((k) => k + 1)}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }
  console.log("Posts loaded:", posts.length);
  return (
    <View style={{ width: "100%", alignItems: "center" }}>
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
                    params: { documentId: post.documentId.toString() },
                  });
                }
              }}
              style={{ width: "100%" }}
            >
              <BlogCard
                key={post.documentId}
                title={post.title}
                summary={post.summary}
                author={post.author || ""}
                audience={post.content}
              />
            </Pressable>
          );
        })}
      <View style={styles.referenceBox}>
        <Text style={styles.referenceText}>
          Les algorithmes de dépistage et de prévention de l'application ont été
          développés sous la supervision du Pr Nicolas Gatimel et Louana
          Clementoni du CHU de Toulouse, France. Ils sont fondés sur une revue
          structurée de la littérature scientifique selon une méthodologie
          validée, suivie d'un consensus d'experts au sein d'une équipe
          multidisciplinaire (gynécologues, andrologues et biologistes de la
          reproduction). Toutes les recommandations et évaluations du risque
          mises en œuvre dans l'application découlent de ce processus fondé sur
          les preuves, garantissant transparence, fiabilité et pertinence
          clinique.
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
  errorText: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#047857",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
