import React from "react";
import { View, Text, Pressable } from "react-native";
import Slider from "@react-native-community/slider";

export default function NumberQuestion({ question, answer, onChange }: any) {
  const value = Number(answer) || 0;
  const min = Number(question?.min) || 0;
  const max = Number(question?.max) || 100;

  return (
    <>
      <Text
        style={{
          textAlign: "center",
          paddingBottom: 30,
          paddingTop: 10,
          fontSize: 36, // Large font
          fontWeight: "bold", // Bold text
        }}
      >
        {value === min ? "-" : value === max ? "+" : ""}
        {answer || 0} {question.unit || ""}
      </Text>
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
    </>
  );
}

// CatsWinPeas88!
