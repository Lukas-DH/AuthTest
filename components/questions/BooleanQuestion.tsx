import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const options = [
  { label: "Oui", value: "yes" },
  { label: "Non", value: "no" },
];

export default function BooleanQuestion({ question, answer, onChange }: any) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.squareButton,
            answer === option.value && styles.squareButtonSelected,
          ]}
          onPress={() => onChange(question.id, option.value)}
        >
          <Text style={styles.buttonText}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginVertical: 12,
  },
  squareButton: {
    width: 64,
    height: 64,
    backgroundColor: "#fff",
    borderColor: "#059669",
    borderWidth: 2,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  squareButtonSelected: {
    backgroundColor: "#E0F7FA",
    borderColor: "#0097A9",
  },
  buttonText: {
    fontSize: 18,
    color: "#475569",
    fontWeight: "bold",
    textAlign: "center",
  },
});
