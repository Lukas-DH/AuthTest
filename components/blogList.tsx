import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import BlogCard from "@/components/blogCard";
import BLOG_POSTS from "../data/blogPosts";

const BlogList: React.FC = () => {
  return (
    <FlatList
      data={BLOG_POSTS}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <BlogCard
          title={item.title}
          image={item.image}
          summary={item.summary}
          // likes={item.likes}
          author={item.author}
        />
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
});

export default BlogList;
