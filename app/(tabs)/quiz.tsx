import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { useState, useEffect } from "react";
import OnboardingCard from "../../components/onboardingCard";
import QuestionCard from "@/components/questionCard";
import ResponseSummary from "@/components/responseSummary";
import ChangeSexCard from "@/components/ChangeSex";
import { useSession } from "@/components/ctx";
import { router } from "expo-router";
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
    sex: string;
    advice: string;
    topic: string;
    label: string;
    type: "text" | "number" | "boolean" | "choice" | "list";
    unit?: string;
    choices?: string[];
    followUp?: Question[];
    points?: number;
    min: string;
    max: string;
  }

  const [quizJson, setQuizJson] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAtRisk, setIsAtRisk] = useState(false);
  const [riskyResponses, setRiskyResponses] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { session, isLoading } = useSession();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/quizzes/`
        );
        const json = await res.json();
        setQuizJson(json.data[1].question);
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

  const handleSubmit = async () => {
    let score = 0;

    if (parseInt(answers["F.19"]) >= 12) score += 1;
    if (answers["F.20"] && parseInt(answers["F.20"]) >= 35) score += 1;
    if (answers["F.21"] && answers["F.21"].length > 0) score += 1;

    const isHighRisk = score >= 1;
    setIsAtRisk(isHighRisk);
    setRiskyResponses(
      isHighRisk
        ? quizJson
            // .filter((q) => Object.keys(answers).includes(q.id))
            .map((q) => q.label)
        : []
    );
    setIsSubmitted(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        data: {
          response: answers,
          users_permissions_user: {
            connect: [{ id: "1" }],
          },
        },
      });

      await fetch("http://localhost:1337/api/xresponses", {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      });
    } catch (error) {
      console.error("Failed to submit answers:", error);
    }
    router.push("/results");
  };

  const handleRetake = () => {
    setShowOnboarding(true);
    setAnswers({});
    setIsSubmitted(false);
    setIsAtRisk(false);
    setRiskyResponses([]);
    setCurrentQuestionIndex(0);
  };

  const currentQuestion = quizJson[currentQuestionIndex];
  const isCurrentAnswerEmpty = !answers[currentQuestion?.id];
  console.log(answers);
  console.log(session ? JSON.parse(session).user.username : null);
  // const { jwt } = session ? JSON.parse(session) : { jwt: null };

  return (
    <>
      {showOnboarding ? (
        <ScrollView contentContainerStyle={styles.container}>
          <OnboardingCard
            title="Bienvenue"
            description="Répondez à quelques questions pour recevoir des conseil personnalisés."
            buttonText="Commencer"
            onNext={() => setShowOnboarding(false)}
          >
            <Text style={styles.extraInfo}>
              L’évaluation vous prendra environ 10 à 15 minutes et inclue des
              questions sur:
              {"\n\n"}• Sur votre santé en général
              {"\n"}• Sur vos antécédents médicaux
              {"\n"}• Sur vos modes de vie
            </Text>
          </OnboardingCard>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {loading ? (
            <Text style={styles.title}>Chargement du questionnaire...</Text>
          ) : !isSubmitted ? (
            <>
              <Text style={styles.title}>Questionnaire d'auto-évaluation</Text>

              {currentQuestion && currentQuestion.id === "999" ? (
                <ChangeSexCard
                  sex={currentQuestion.sex === "male" ? "male" : "female"}
                  onConfirm={() => {
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQuestion.id]: currentQuestion.sex,
                    }));
                    if (currentQuestionIndex < quizJson.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    } else {
                      handleSubmit();
                    }
                  }}
                />
              ) : (
                currentQuestion && (
                  <QuestionCard
                    title={
                      currentQuestion.id +
                      " " +
                      currentQuestion.topic +
                      " Question\n"
                    }
                    sex={currentQuestion.sex}
                    description={
                      "Question " +
                      (currentQuestionIndex + 1) +
                      " of " +
                      quizJson.length
                    }
                    onNext={async () => {
                      if (currentQuestionIndex < quizJson.length - 1) {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                      } else {
                        await handleSubmit();
                      }
                    }}
                    onBack={
                      currentQuestionIndex > 0
                        ? () =>
                            setCurrentQuestionIndex(currentQuestionIndex - 1)
                        : undefined
                    }
                    isLastQuestion={
                      currentQuestionIndex === quizJson.length - 1
                    }
                    nextDisabled={isCurrentAnswerEmpty}
                  >
                    <Text style={styles.question}>{currentQuestion.label}</Text>

                    {currentQuestion.type === "text" && (
                      <TextInput
                        style={styles.input}
                        keyboardType="default"
                        placeholder={
                          currentQuestion.unit
                            ? `en ${currentQuestion.unit}`
                            : "Entrez votre réponse"
                        }
                        placeholderTextColor="#A4D65E"
                        onChangeText={(text) =>
                          handleAnswerChange(currentQuestion.id, text)
                        }
                        value={answers[currentQuestion.id] || ""}
                      />
                    )}

                    {currentQuestion.type === "number" && (
                      <>
                        <Slider
                          value={Number(answers[currentQuestion.id]) || 0}
                          onValueChange={(value) =>
                            handleAnswerChange(
                              currentQuestion.id,
                              String(Math.round(value))
                            )
                          }
                          minimumValue={Number(currentQuestion?.min) || 0}
                          maximumValue={Number(currentQuestion?.max) || 100}
                          step={1}
                          minimumTrackTintColor="#A4D65E"
                          maximumTrackTintColor="#0097A9"
                          thumbTintColor="#059669"
                        />
                        <Text style={{ textAlign: "center", marginTop: 10 }}>
                          {Number(answers[currentQuestion.id]) ==
                          (currentQuestion?.min || 0)
                            ? "-"
                            : Number(answers[currentQuestion.id]) ==
                              (currentQuestion?.max || 100)
                            ? "+"
                            : ""}
                          {answers[currentQuestion.id] || 0}{" "}
                          {currentQuestion.unit ? currentQuestion.unit : ""}
                        </Text>
                      </>
                    )}

                    {currentQuestion.type === "boolean" && (
                      <Picker
                        selectedValue={answers[currentQuestion.id] || ""}
                        onValueChange={(value) =>
                          handleAnswerChange(currentQuestion.id, value)
                        }
                        style={styles.picker}
                      >
                        <Picker.Item label="" value="" />
                        <Picker.Item label="yes" value="yes" />
                        <Picker.Item label="no" value="no" />
                      </Picker>
                    )}

                    {(currentQuestion.type === "choice" ||
                      currentQuestion.type === "list") &&
                      currentQuestion.choices && (
                        <Picker
                          selectedValue={answers[currentQuestion.id] || ""}
                          onValueChange={(value) =>
                            handleAnswerChange(currentQuestion.id, value)
                          }
                          style={styles.picker}
                        >
                          {currentQuestion.choices.map((choice, index) => (
                            <Picker.Item
                              key={index}
                              label={choice}
                              value={choice}
                            />
                          ))}
                        </Picker>
                      )}

                    {currentQuestion.followUp &&
                      answers[currentQuestion.id] === "yes" &&
                      currentQuestion.followUp.map((subQuestion) => (
                        <View
                          key={subQuestion.id}
                          style={styles.questionContainer}
                        >
                          <Text style={styles.question}>
                            {subQuestion.label}
                          </Text>
                          {subQuestion.type === "number" ? (
                            <>
                              <Slider
                                value={Number(answers[subQuestion.id]) || 0}
                                onValueChange={(value) =>
                                  handleAnswerChange(
                                    subQuestion.id,
                                    String(Math.round(value))
                                  )
                                }
                                minimumValue={Number(currentQuestion?.min) || 0}
                                maximumValue={
                                  Number(currentQuestion?.max) || 100
                                }
                                step={1}
                                minimumTrackTintColor="#A4D65E"
                                maximumTrackTintColor="#0097A9"
                                thumbTintColor="#059669"
                              />
                              <Text
                                style={{ textAlign: "center", marginTop: 10 }}
                              >
                                {answers[subQuestion.id] || 0}{" "}
                                {subQuestion.unit ? subQuestion.unit : ""}
                              </Text>
                            </>
                          ) : (
                            <TextInput
                              style={styles.input}
                              keyboardType="default"
                              placeholder="Entrez votre réponse"
                              placeholderTextColor="#A4D65E"
                              onChangeText={(text) =>
                                handleAnswerChange(subQuestion.id, text)
                              }
                              value={answers[subQuestion.id] || ""}
                            />
                          )}
                        </View>
                      ))}
                  </QuestionCard>
                )
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleRetake}
              >
                <Text style={styles.buttonText}>Recommencer</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.title,
                  isAtRisk ? styles.atRisk : styles.lowRisk,
                ]}
              >
                {true ? "Risque élevé" : "Pas de risque élevé"}
              </Text>

              <ResponseSummary
                responses={answers}
                questions={quizJson.map((q) => ({ id: q.id, label: q.label }))}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleRetake}
              >
                <Text style={styles.buttonText}>Recommencer</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f8fafc" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#064e3b",
    marginBottom: 10,
  },
  atRisk: { color: "#FF4F4F" },
  lowRisk: { color: "red" },
  questionContainer: { marginBottom: 15 },
  question: {
    fontSize: 18,
    color: "#475569",
    marginBottom: 20,
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
  riskItemPressed: { backgroundColor: "#00AB8E" },
  riskText: { color: "#FFF", textAlign: "center" },
  noRiskText: {
    fontSize: 16,
    color: "#A4D65E",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  buttonPressed: {
    backgroundColor: "#047857",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  extraInfo: {
    fontSize: 13,
    color: "#334155",
    marginTop: 10,
    lineHeight: 20,
  },
});
