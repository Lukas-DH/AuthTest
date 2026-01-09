import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import BlogList from "@/components/blogList";

const BlogScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fertility Blog</Text>
      <BlogList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#f8fafc",
  //   alignItems: "center",
  // },
  container: {
    padding: 20,
    backgroundColor: "#f8fafc",
    flexGrow: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#064e3b",
    textAlign: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#064e3b",
    marginBottom: 10,
  },
});

export default BlogScreen;
