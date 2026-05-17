import React from "react";
import {
  View,
  Text,
  // Image,
  StyleSheet,
  // ImageSourcePropType,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface BlogCardProps {
  title: string;
  summary: string;
  author: string;
  audience?: string | null;
}

const AUDIENCE_BADGES: Record<string, { label: string; backgroundColor: string }> = {
  "Pour tout le monde": { label: "Pour tout le monde", backgroundColor: "#FFF9C4" },
  female:               { label: "Madame",             backgroundColor: "#F3E3F9" },
  male:                 { label: "Monsieur",           backgroundColor: "#EAF2FB" },
};

function BlogCard({ title, summary, author, audience }: BlogCardProps) {
  const badge = audience ? AUDIENCE_BADGES[audience] : null;
  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.summary}>{summary}</Text>
          <Text style={styles.author}>Par {author}</Text>
          {badge && (
            <Text style={[styles.badge, { backgroundColor: badge.backgroundColor }]}>
              {badge.label}
            </Text>
          )}
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
    width: "100%",
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
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#065f46",
    overflow: "hidden",
    marginTop: 10,
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
