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
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.summary}>{summary}</Text>
        <Text style={styles.author}>By {author}</Text>
        {/* <View style={styles.footer}>
          <FontAwesome name="heart" size={18} color="#A4D65E" />
          <Text style={styles.likes}>{likes}</Text>
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0097A9",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
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
    color: "#FFF",
  },
  summary: {
    fontSize: 14,
    color: "#A4D65E",
    marginVertical: 5,
  },
  author: {
    fontSize: 12,
    color: "#00AB8E",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  likes: {
    fontSize: 14,
    color: "#A4D65E",
    marginLeft: 5,
  },
});

export default BlogCard;
