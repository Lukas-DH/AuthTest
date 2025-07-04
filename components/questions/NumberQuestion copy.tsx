import React from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";

export default function NumberQuestion({ question, answer, onChange }: any) {
  const value = Number(answer) || 0;
  const min = Number(question?.min) || 0;
  const max = Number(question?.max) || 100;

  return (
    <>
      <Slider
        value={value}
        onValueChange={(value) =>
          onChange(question.id, String(Math.round(value)))
        }
        minimumValue={min}
        maximumValue={max}
        step={1}
        minimumTrackTintColor="#A4D65E"
        maximumTrackTintColor="#0097A9"
        thumbTintColor="#059669"
      />
      <Text style={{ textAlign: "center", marginTop: 10 }}>
        {value === min ? "-" : value === max ? "+" : ""}
        {answer || 0} {question.unit || ""}
      </Text>
    </>
  );
}
