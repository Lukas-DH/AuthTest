import quizData, { QuizQuestion } from "@/data/quizData";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
} from "react-native";

export default function QuestionnaireScreen() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAtRisk, setIsAtRisk] = useState(false);
  const [riskyResponses, setRiskyResponses] = useState<string[]>([]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    // 🚨 Dummy Risk Analysis 🚨
    const risks: string[] = [];
    if (answers["smoking"] && answers["smoking"] !== "No")
      risks.push("Smoking");
    if (answers["alcohol"] && answers["alcohol"] !== "No or exceptional")
      risks.push("Alcohol");
    if (answers["weight"] && parseInt(answers["weight"]) > 100)
      risks.push("Overweight");

    setIsAtRisk(risks.length > 0);
    setRiskyResponses(risks);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setIsSubmitted(false);
    setIsAtRisk(false);
    setRiskyResponses([]);
  };

  const articles: { [key: string]: string } = {
    Smoking: "https://www.who.int/news-room/fact-sheets/detail/tobacco",
    Alcohol: "https://www.cdc.gov/alcohol/fact-sheets/alcohol-use.htm",
    Overweight: "https://www.nhs.uk/live-well/healthy-weight/",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!isSubmitted ? (
        <>
          <Text style={styles.title}>Self-Assessment Questionnaire</Text>

          {quizData.map((question: QuizQuestion) => (
            <View key={question.id} style={styles.questionContainer}>
              <Text style={styles.question}>{question.question}</Text>

              {question.type === "text" || question.type === "date" ? (
                <TextInput
                  style={styles.input}
                  placeholder={
                    question.type === "date"
                      ? "dd/mm/yyyy"
                      : "Enter your answer"
                  }
                  placeholderTextColor="#A4D65E"
                  onChangeText={(text) => handleAnswerChange(question.id, text)}
                />
              ) : null}

              {question.type === "multiple-choice" && question.options ? (
                <Picker
                  selectedValue={answers[question.id] || ""}
                  onValueChange={(value) =>
                    handleAnswerChange(question.id, value)
                  }
                  style={styles.picker}
                >
                  {question.options.map((option, index) => (
                    <Picker.Item key={index} label={option} value={option} />
                  ))}
                </Picker>
              ) : null}
            </View>
          ))}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Submit Assessment</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text
            style={[styles.title, isAtRisk ? styles.atRisk : styles.lowRisk]}
          >
            {isAtRisk ? "At Risk" : "Low Risk"}
          </Text>

          {riskyResponses.length > 0 ? (
            <View style={styles.riskList}>
              <Text style={styles.riskTitle}>Risk Factors Identified:</Text>
              {riskyResponses.map((risk, index) => (
                <Pressable
                  key={index}
                  onPress={() => Linking.openURL(articles[risk])}
                  style={({ pressed }) => [
                    styles.riskItem,
                    pressed && styles.riskItemPressed,
                  ]}
                >
                  <Text style={styles.riskText}>{risk} - Learn More</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text style={styles.noRiskText}>
              No major risk factors detected. Keep up your healthy habits!
            </Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleRetake}
          >
            <Text style={styles.buttonText}>Retake Questionnaire</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#004F71" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#A4D65E",
  },
  atRisk: { color: "#FF4F4F" },
  lowRisk: { color: "#A4D65E" },
  questionContainer: { marginBottom: 15 },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00AB8E",
    marginBottom: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: "#0097A9",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
  },
  picker: { backgroundColor: "#0097A9", color: "#FFF", borderRadius: 8 },
  riskList: { marginBottom: 20 },
  riskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00AB8E",
    marginBottom: 10,
  },
  riskItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#0097A9",
    marginBottom: 5,
  },
  riskItemPressed: { backgroundColor: "#00AB8E" }, // Changes color on press
  riskText: { color: "#FFF", textAlign: "center" },
  noRiskText: {
    fontSize: 16,
    color: "#A4D65E",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#A4D65E",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonPressed: { backgroundColor: "#86C250" }, // Lighter green on press
  buttonText: { fontSize: 18, fontWeight: "bold", color: "#004F71" },
});
