import Slider from "@react-native-community/slider";
import { Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import QuestionnaireSelection from "@/components/questions/QuestionnaireSelection";
import { calculateScore } from "@/utils/quizScoring";

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
  // const [isSubmitted, setIsSubmitted] = useState(false);
  // const [isAtRisk, setIsAtRisk] = useState(false);
  // const [riskyResponses, setRiskyResponses] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { session, isLoading } = useSession();
  const [selectedSex, setSelectedSex] = useState<"male" | "female" | null>(
    null,
  );
  const [maleCompleted, setMaleCompleted] = useState(false);
  const [femaleCompleted, setFemaleCompleted] = useState(false);
  const [scoreRisk, setScoreRisk] = useState(0);
  const [answersId, setAnswersId] = useState<string | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [retaking, setRetaking] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user, jwt } = session
    ? JSON.parse(session)
    : { user: null, jwt: null };

  const fetchUserProgress = async () => {
    if (!user?.id) return;
    setProgressLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/me?populate=xresponses`,
        { headers: { Authorization: `Bearer ${jwt}` } },
      );
      const data = await response.json();
      const xresponses = (data.xresponses || []).sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      const latest = xresponses[0];
      if (latest) {
        setAnswersId(latest.documentId);
        setMaleCompleted(latest.maleCompleted || false);
        setFemaleCompleted(latest.femaleCompleted || false);
      }
    } catch {
      // network error — don't throw, caller handles feedback if needed
    } finally {
      setProgressLoading(false);
    }
  };
  // console.log("selectedSex", selectedSex);

  useFocusEffect(
    useCallback(() => {
      // Don't fetch if session is still loading or user is not available
      if (isLoading || !user?.id) {
        return;
      }

      fetchUserProgress();
    }, [user?.id, isLoading]),
  );

  useEffect(() => {
    if (!selectedSex) return;

    const fetchQuiz = async () => {
      setLoading(true);
      setFetchError(null); // Clear any stale error from a previous attempt
      setCurrentQuestionIndex(0); // Reset question index
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/quizzes`,
        );
        const json = await res.json();

        setQuizJson(
          (json.data[0]?.question ?? []).filter(
            (q: Question) => q.sex === selectedSex,
          ),
        );
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        setFetchError("Impossible de charger le questionnaire. Vérifiez votre connexion internet.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [selectedSex]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    const currentSex = selectedSex;
    let score = scoreRisk;
    score = score + calculateScore(answers);
    answers["score"] = score.toString();
    setScoreRisk(score);
    const isHighRisk = score >= 1;

    const answerPayload = {
      [currentSex === "male" ? "answerMale" : "answerFemale"]: answers,
      [`${currentSex}Completed`]: true,
    };

    setSubmitError(null);
    setSubmitting(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${jwt}`);

      const body = JSON.stringify({ data: answerPayload });
      // console.log("[submit] payload:", body);

      if (answersId) {
        // UPDATE existing entry
        await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/xresponses/${answersId}`,
          {
            headers: myHeaders,
            method: "PUT",
            body,
          },
        );
        setSelectedSex(null);
        setAnswers({});
      } else {
        // CREATE new entry
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/xresponses`,
          {
            headers: myHeaders,
            method: "POST",
            body,
          },
        );
        if (!response.ok) {
          throw new Error(`Failed to create response: ${response.status}`);
        }
        const data = await response.json();
        setSelectedSex(null);
        setAnswersId(data.data.documentId);
        setAnswers({});
      }
      // Refresh user progress to update completion status
      await fetchUserProgress();
      setShowOnboarding(true);
    } catch (error) {
      console.error("Failed to submit answers:", error);
      setSubmitError("Impossible d'enregistrer vos réponses. Vérifiez votre connexion internet et réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  // const handleRetake = () => {
  //   setAnswersId(null);
  //   setShowOnboarding(true);
  //   setAnswers({});
  //   // setIsSubmitted(false);
  //   // setIsAtRisk(false);
  //   // setRiskyResponses([]);
  //   setCurrentQuestionIndex(0);
  //   // setMaleCompleted(false);
  //   // setFemaleCompleted(false);

  //   setSelectedSex(null);
  //   setScoreRisk(0);
  // };

  const handleCancel = async () => {
    // setAnswersId(null);
    setShowOnboarding(true);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSelectedSex(null);
    setScoreRisk(0);
    setFetchError(null);
    setSubmitError(null);
  };

  const handleRetake = async () => {
    setAnswersId(null);
    setShowOnboarding(true);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSelectedSex(null);
    setScoreRisk(0);
    setRetaking(true);
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/xresponses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            maleCompleted: false,
            femaleCompleted: false,
            answerMale: {},
            answerFemale: {},
          },
        }),
      });
      await fetchUserProgress();
    } catch (error) {
      console.error("Failed to retake:", error);
    } finally {
      setRetaking(false);
    }
  };

  const currentQuestion = quizJson[currentQuestionIndex];
  const isCurrentAnswerEmpty = !answers[currentQuestion?.id];

  return (
    <>
      {showOnboarding ? (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Questionnaire d'auto-évaluation</Text>
          {progressLoading ? (
            <ActivityIndicator size="large" color="#059669" style={{ marginTop: 40 }} />
          ) : (
            <QuestionnaireSelection
              onSelectQuestionnaire={(sex) => {
                setSelectedSex(sex);
                setShowOnboarding(false);
              }}
              onViewResults={() => router.push("/results")}
              maleCompleted={maleCompleted}
              femaleCompleted={femaleCompleted}
              onNext={() => setShowOnboarding(false)}
              onRestart={handleRetake}
              retaking={retaking}
            />
          )}
        </ScrollView>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({
            ios: "padding",
            android: "height",
          })}
          keyboardVerticalOffset={Platform.select({
            ios: 100,
            android: 20,
          })}
        >
          <ScrollView contentContainerStyle={styles.container}>
            {fetchError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{fetchError}</Text>
                <Pressable
                  style={styles.button}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>Retour</Text>
                </Pressable>
              </View>
            ) : loading || !currentQuestion ? (
              <ActivityIndicator size="large" color="#059669" style={{ marginTop: 40 }} />
            ) : (
              // !isSubmitted ?
              <>
                <Text style={styles.title}>
                  Questionnaire d'auto-évaluation
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 8,
                    backgroundColor: "#e5e7eb",
                    borderRadius: 4,
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      width: `${
                        ((currentQuestionIndex + 1) / quizJson.length) * 100
                      }%`,
                      height: "100%",
                      backgroundColor: "#059669",
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    color: "#475569",
                    marginBottom: 8,
                  }}
                >
                  {Math.round(
                    ((currentQuestionIndex + 1) / quizJson.length) * 100,
                  )}
                  % complété
                </Text>
                <QuestionCard
                  title={`${currentQuestion.id} ${currentQuestion.topic}\n`}
                  sex={currentQuestion.sex}
                  description={`Question ${currentQuestionIndex + 1} sur ${
                    quizJson.length
                  }`}
                  onNext={async () => {
                    if (currentQuestionIndex < quizJson.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    } else {
                      await handleSubmit();
                    }
                  }}
                  onBack={
                    currentQuestionIndex > 0
                      ? () => setCurrentQuestionIndex(currentQuestionIndex - 1)
                      : undefined
                  }
                  isLastQuestion={currentQuestionIndex === quizJson.length - 1}
                  nextDisabled={isCurrentAnswerEmpty || submitting}
                  isSubmitting={submitting}
                >
                  <Text style={styles.question}>{currentQuestion.label}</Text>
                  <QuestionRenderer
                    question={currentQuestion}
                    answer={answers[currentQuestion.id] || ""}
                    answers={answers}
                    // onChange={(value) =>
                    //   handleAnswerChange(currentQuestion.id, value)
                    // }
                    onChange={handleAnswerChange}
                  />
                </QuestionCard>

                {submitError && (
                  <Text style={styles.submitErrorText}>{submitError}</Text>
                )}
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>Annuler</Text>
                </Pressable>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
    fontSize: 14,
    color: "#475569",
    marginTop: 10,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  submitErrorText: {
    fontSize: 14,
    color: "#b91c1c",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 20,
  },
});
