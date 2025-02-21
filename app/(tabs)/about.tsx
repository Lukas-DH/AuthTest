import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import BlogList from "@/components/blogList";

const BlogScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Fertility Blog</Text>
      <BlogList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004F71",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A4D65E",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default BlogScreen;
