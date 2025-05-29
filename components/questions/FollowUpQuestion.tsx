import React from "react";
import { View, Text } from "react-native";
import QuestionRenderer from "./QuestionRenderer";

export default function FollowUpQuestion({
  questions,
  answers,
  onChange,
}: any) {
  return questions.map((q: any) => (
    <View key={q.id} style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>{q.label}</Text>
      <QuestionRenderer
        question={q}
        answer={answers[q.id] || ""}
        onChange={(qid, value) => onChange(qid, value)}
        answers={answers}
      />
    </View>
  ));
}
