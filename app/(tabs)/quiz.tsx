import Slider from "@react-native-community/slider";
import { Platform } from "react-native";
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
  KeyboardAvoidingView,
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
    null
  );
  const [maleCompleted, setMaleCompleted] = useState(false);
  const [femaleCompleted, setFemaleCompleted] = useState(false);
  const [scoreRisk, setScoreRisk] = useState(0);
  const [answersId, setAnswersId] = useState<string | null>(null);
  const user = session ? JSON.parse(session).user : null;

  const fetchUserProgress = async () => {
    if (!user?.id) return;
    const response = await fetch(
      // `${API_URL}/xresponses?filters[users_permissions_user]=${user.id}&sort=createdAt:desc&pagination[limit]=1`
      // `http://localhost:1337/api/xresponses?filters[users_permissions_user][id][$eq]=${user.id}&sort=createdAt:desc&pagination[limit]=1`
      `${process.env.EXPO_PUBLIC_API_URL}/api/xresponses?filters[users_permissions_user][id][$eq]=${user.id}&sort=createdAt:desc&pagination[limit]=1`
    );
    const data = await response.json();

    if (data.data?.[0]) {
      const userResponse = data.data[0];
      setAnswersId(userResponse.documentId); // Store the ID
      setMaleCompleted(userResponse.maleCompleted || false);
      setFemaleCompleted(userResponse.femaleCompleted || false);
    }
  };
  // console.log("selectedSex", selectedSex);
  console.log("PINGING QUIZ!!!");

  useEffect(() => {
    if (user && user.id) {
      fetchUserProgress();
    }
    // }, [user?.id]);
  }, [maleCompleted, femaleCompleted]);

  useEffect(() => {
    if (!selectedSex) return;

    const fetchQuiz = async () => {
      setLoading(true);
      setCurrentQuestionIndex(0); // Reset question index
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/quizzes`
        );
        const json = await res.json();

        setQuizJson(
          (json.data[0]?.question ?? []).filter(
            (q: Question) => q.sex === selectedSex
          )
        );
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
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
    // setIsAtRisk(isHighRisk);
    // setRiskyResponses(isHighRisk ? quizJson.map((q) => q.label) : []);
    setShowOnboarding(true);

    const answerPayload = {
      [currentSex === "male" ? "answerMale" : "answerFemale"]: answers,
      [`${currentSex}Completed`]: true,
      users_permissions_user: { connect: [{ id: user.id }] },
    };

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      if (answersId) {
        // UPDATE existing entry
        // await fetch(`http://localhost:1337/api/xresponses/${answersId}`, {
        await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/xresponses/${answersId}`,
          {
            headers: myHeaders,
            method: "PUT",
            body: JSON.stringify({ data: answerPayload }),
          }
        );
        console.log("Updated entry with ID:", answerPayload);
        setSelectedSex(null);
        setAnswers({});
      } else {
        // CREATE new entry
        // const response = await fetch(`http://localhost:1337/api/xresponses`, {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/xresponses`,
          {
            headers: myHeaders,
            method: "POST",
            body: JSON.stringify({ data: answerPayload }),
          }
        );
        const data = await response.json();
        setSelectedSex(null);
        setAnswersId(data.data.documentId);
        setAnswers({});
        console.log("Updated entry with ID2:", answerPayload);
      }
      // Refresh user progress to update completion status
      await fetchUserProgress();
    } catch (error) {
      console.error("Failed to submit answers:", error);
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
    // setIsSubmitted(false);
    // setIsAtRisk(false);
    // setRiskyResponses([]);
    setCurrentQuestionIndex(0);
    // setMaleCompleted(false);
    // setFemaleCompleted(false);

    setSelectedSex(null);
    setScoreRisk(0);
    // Actually reset the database record
    // await fetch(`http://localhost:1337/api/xresponses`, {
  };

  const handleRetake = async () => {
    setAnswersId(null);
    setShowOnboarding(true);
    setAnswers({});
    // setIsSubmitted(false);
    // setIsAtRisk(false);
    // setRiskyResponses([]);
    setCurrentQuestionIndex(0);
    // setMaleCompleted(false);
    // setFemaleCompleted(false);

    setSelectedSex(null);
    setScoreRisk(0);
    // Actually reset the database record
    // await fetch(`http://localhost:1337/api/xresponses`, {
    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/xresponses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          maleCompleted: false,
          femaleCompleted: false,
          answerMale: {},
          answerFemale: {},
          users_permissions_user: { connect: [{ id: user.id }] },
        },
      }),
    });

    // Then fetch will get the reset values
    fetchUserProgress();
  };

  const currentQuestion = quizJson[currentQuestionIndex];
  const isCurrentAnswerEmpty = !answers[currentQuestion?.id];
  console.log("WHY HOIN", answers);
  console.log(
    session
      ? JSON.parse(session).user.username + " " + JSON.parse(session).user.id
      : null
  );
  // const { jwt } = session ? JSON.parse(session) : { jwt: null };

  return (
    <>
      {showOnboarding ? (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Questionnaire d'auto-évaluation</Text>
          <QuestionnaireSelection
            onSelectQuestionnaire={(sex) => {
              setSelectedSex(sex);
              setShowOnboarding(false);
            }}
            onViewResults={() => router.push("/results")}
            maleCompleted={maleCompleted}
            femaleCompleted={femaleCompleted}
            // buttonText="Commencer"
            onNext={() => setShowOnboarding(false)}
            onRestart={handleRetake}
          />
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
            {loading || !currentQuestion ? (
              <Text style={styles.title}>Chargement du questionnaire...</Text>
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
                    ((currentQuestionIndex + 1) / quizJson.length) * 100
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
                  nextDisabled={isCurrentAnswerEmpty}
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
});
