import React from "react";
import { TextInput, StyleSheet } from "react-native";

interface Question {
  id: string;
  unit?: string;
}

interface Props {
  question: Question;
  answer: string;
  onChange: (questionId: string, value: any) => void;
}

export default function TextQuestion({ question, answer, onChange }: Props) {
  return (
    <TextInput
      style={styles.input}
      keyboardType="default"
      placeholder={
        question.unit ? `en ${question.unit}` : "Entrez votre réponse"
      }
      placeholderTextColor="#A4D65E"
      onChangeText={(text) => onChange(question.id, text)}
      value={answer}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: "#0097A9",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
  },
});
