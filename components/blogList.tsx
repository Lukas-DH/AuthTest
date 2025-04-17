import React, { useEffect, useState } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import BlogCard from "./blogCard";
import { Link } from "expo-router";

interface Post {
  documentId: number;
  title: string;
  summary: string;
  author: string;
  image: {
    url: string;
    formats?: {
      thumbnail?: {
        url: string;
      };
    };
  };
}

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
    <ScrollView>
      {Array.isArray(posts) &&
        posts.map(
          (post) => (
            console.log("URL", post.image?.url),
            (
              <Link
                key={post.documentId}
                href={{
                  pathname: "/posts/[documentId]",
                  params: { documentId: post.documentId.toString() },
                }}
              >
                <BlogCard
                  key={post.documentId}
                  title={post.title}
                  summary={post.summary}
                  author={post.author}
                  image={{
                    uri: `${
                      post.image?.formats?.thumbnail?.url ?? post.image?.url
                    }`,
                  }}
                />
              </Link>
            )
          )
        )}
    </ScrollView>
  );
}
