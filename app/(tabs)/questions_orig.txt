import { Picker } from "@react-native-picker/picker";
import { useState, useEffect } from "react";

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
  interface Question {
    id: string;
    advice: string;
    label: string;
    type: "text" | "number" | "boolean" | "choice" | "list";
    unit?: string;
    choices?: string[];
    followUp?: Question[];
    points?: number;
  }

  const [quizJson, setQuizJson] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAtRisk, setIsAtRisk] = useState(false);
  const [riskyResponses, setRiskyResponses] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/quizzes/`
          // "https://nice-agreement-f5d7ffb584.strapiapp.com/api/quizzes/gp18g5pglh6ejbf554m0k9o4"
        );
        const json = await res.json();
        // console.log(json);
        setQuizJson(json.data[0].question);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    let score = 0;

    if (parseInt(answers["F.19"]) >= 12) score += 1;
    if (answers["F.20"] && parseInt(answers["F.20"]) >= 35) score += 1;
    if (answers["F.21"] && answers["F.21"].length > 0) score += 1;

    const isHighRisk = score >= 1;
    setIsAtRisk(isHighRisk);
    setRiskyResponses(
      isHighRisk
        ? quizJson
            .filter((q) => Object.keys(answers).includes(q.id))
            .map((q) => q.advice)
        : []
    );
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setIsSubmitted(false);
    setIsAtRisk(false);
    setRiskyResponses([]);
  };
  console.log(Object.keys(answers));
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <Text style={styles.title}>Loading quiz...</Text>
      ) : !isSubmitted ? (
        <>
          <Text style={styles.title}>Self-Assessment Questionnaire</Text>

          {quizJson.map((question) => (
            <View key={question.id} style={styles.questionContainer}>
              <Text style={styles.question}>
                {question.id + " " + question.label}
              </Text>

              {question.type === "text" || question.type === "number" ? (
                <TextInput
                  style={styles.input}
                  keyboardType={
                    question.type === "number" ? "numeric" : "default"
                  }
                  placeholder={
                    question.unit
                      ? `en ${question.unit}`
                      : "Entrez votre réponse"
                  }
                  placeholderTextColor="#A4D65E"
                  onChangeText={(text) => handleAnswerChange(question.id, text)}
                />
              ) : null}

              {question.type === "boolean" ? (
                <Picker
                  selectedValue={answers[question.id] || ""}
                  onValueChange={(value) =>
                    handleAnswerChange(question.id, value)
                  }
                  style={styles.picker}
                  // mode="dropdown"
                >
                  <Picker.Item label="" value="" />
                  <Picker.Item label="yes" value="yes" />
                  <Picker.Item label="no" value="no" />
                </Picker>
              ) : null}

              {question.type === "choice" && question.choices ? (
                <Picker
                  selectedValue={answers[question.id] || ""}
                  onValueChange={(value) =>
                    handleAnswerChange(question.id, value)
                  }
                  style={styles.picker}
                >
                  {question.choices.map((choice, index) => (
                    <Picker.Item key={index} label={choice} value={choice} />
                  ))}
                </Picker>
              ) : null}

              {question.type === "list" && question.choices ? (
                <Picker
                  selectedValue={answers[question.id] || ""}
                  onValueChange={(value) =>
                    handleAnswerChange(question.id, value)
                  }
                  style={styles.picker}
                >
                  {question.choices.map((choice, index) => (
                    <Picker.Item key={index} label={choice} value={choice} />
                  ))}
                </Picker>
              ) : null}

              {question.followUp &&
                answers[question.id] === "yes" &&
                question.followUp.map((subQuestion) => (
                  <View key={subQuestion.id} style={styles.questionContainer}>
                    <Text style={styles.question}>{subQuestion.label}</Text>
                    {subQuestion.type === "text" ||
                    subQuestion.type === "number" ? (
                      <TextInput
                        style={styles.input}
                        keyboardType={
                          subQuestion.type === "number" ? "numeric" : "default"
                        }
                        placeholder={
                          subQuestion.unit
                            ? `en ${subQuestion.unit}`
                            : "Entrez votre réponse"
                        }
                        placeholderTextColor="#A4D65E"
                        onChangeText={(text) =>
                          handleAnswerChange(subQuestion.id, text)
                        }
                      />
                    ) : null}
                  </View>
                ))}
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
                  // onPress={() => Linking.openURL(articles[risk])}
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
  picker: {
    fontSize: 18,
    backgroundColor: "#0097A9",
    color: "#FFF",
    borderRadius: 8,
  },
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
