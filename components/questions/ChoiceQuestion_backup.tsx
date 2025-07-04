import React from "react";
import { Picker } from "@react-native-picker/picker";

export default function ChoiceQuestion({ question, answer, onChange }: any) {
  //   console.log("ChoiceQuestion", question, answer);
  return (
    <Picker
      selectedValue={answer || ""}
      onValueChange={(value) => onChange(question.id, value)}
      style={{
        backgroundColor: "#0097A9",
        color: "#FFF",
        borderRadius: 8,
      }}
    >
      {question.choices?.map((choice: string, index: number) => (
        <Picker.Item key={index} label={choice} value={choice} />
      ))}
    </Picker>
  );
}
