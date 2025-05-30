import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface SelectQuestionProps {
  question: {
    id: string;
    choices?: string[];
    [key: string]: any;
  };
  answer: string[] | undefined;
  onChange: (questionId: string, values: string[]) => void;
}

const SelectQuestion: React.FC<SelectQuestionProps> = ({
  question,
  answer,
  onChange,
}) => {
  const selectedValues = Array.isArray(answer) ? answer : [];

  const handleToggle = (value: string) => {
    let newSelected: string[];
    if (selectedValues.includes(value)) {
      newSelected = selectedValues.filter((v) => v !== value);
    } else {
      newSelected = [...selectedValues, value];
    }
    onChange(question.id, newSelected);
  };

  return (
    <View>
      {question.choices?.map((choice: string, idx: number) => {
        const checked = selectedValues.includes(choice);
        return (
          <Pressable
            key={choice}
            style={styles.row}
            onPress={() => handleToggle(choice)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
          >
            <View style={[styles.checkbox, checked && styles.checked]}>
              {checked && <View style={styles.innerCheck} />}
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
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#0097A9",
    borderRadius: 5,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  checked: {
    backgroundColor: "#0097A9",
    borderColor: "#0097A9",
  },
  innerCheck: {
    width: 10,
    height: 10,
    backgroundColor: "#FFF",
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
    color: "#222",
  },
});

export default SelectQuestion;
