import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface SelectQuestionProps {
  question: {
    id: string;
    choices?: string[];
    [key: string]: any;
  };
  answer: string | undefined;
  onChange: (questionId: string, value: string) => void;
}

const SelectQuestion: React.FC<SelectQuestionProps> = ({
  question,
  answer,
  onChange,
}) => {
  const selectedValue = answer || "";

  const handleSelect = (value: string) => {
    onChange(question.id, value);
  };

  return (
    <View>
      {question.choices?.map((choice: string, idx: number) => {
        const isSelected = selectedValue === choice;
        return (
          <Pressable
            key={choice}
            style={styles.row}
            onPress={() => handleSelect(choice)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <View style={[styles.radioButton, isSelected && styles.selected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.label}>{choice}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#0097A9",
    borderRadius: 11, // Make it circular
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  selected: {
    backgroundColor: "#FFF", // Keep background white
    borderColor: "#0097A9",
  },
  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: "#0097A9",
    borderRadius: 5, // Make inner circle
  },
  label: {
    fontSize: 16,
    color: "#222",
  },
});

export default SelectQuestion;
