import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface BlogCardProps {
  title: string;
  image: ImageSourcePropType;
  summary: string;
  // likes: number;
  author: string;
}

function BlogCard({ title, image, summary, author }: BlogCardProps) {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <Image source={image} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.summary}>{summary}</Text>
          <Text style={styles.author}>Par {author}</Text>
          {/* <View style={styles.footer}>
            <FontAwesome name="heart" size={18} color="#A4D65E" />
            <Text style={styles.likes}>{likes}</Text>
          </View> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 600,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: 150,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#064e3b",
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
  },
  author: {
    fontSize: 12,
    color: "#0097A9",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  likes: {
    fontSize: 14,
    color: "#475569",
    marginLeft: 5,
  },
});

export default BlogCard;
