import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import BlogList from "@/components/blogList";

const BlogScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Fertility Blog</Text>
      <BlogList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#064e3b",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default BlogScreen;
