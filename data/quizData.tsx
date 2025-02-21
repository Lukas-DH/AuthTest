export type QuestionType = "date" | "text" | "multiple-choice" | "boolean";

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
}

const quizData: QuizQuestion[] = [
  {
    id: "dob",
    question: "Date of Birth",
    type: "date",
  },
  {
    id: "weight",
    question: "Weight (kg)",
    type: "text",
  },
  {
    id: "height",
    question: "Height (cm)",
    type: "text",
  },
  {
    id: "smoking",
    question: "Do you smoke cigarettes?",
    type: "multiple-choice",
    options: ["No", "1-5/day", "5-10", "10-20", ">20", ">40"],
  },
  {
    id: "alcohol",
    question: "Do you drink alcohol?",
    type: "multiple-choice",
    options: [
      "No or exceptional",
      "1-3 glasses of wine or 1 strong drink /week",
      "3-5 glasses of wine or 3 strong drinks /week",
      ">5 glasses of wine/day and/or >5 strong drinks /week",
    ],
  },
  {
    id: "drugs",
    question: "Have you used any drugs?",
    type: "multiple-choice",
    options: [
      "Never or exceptional (less than 10 times)",
      "In the past (no consumption for 5 years)",
      "I am currently (or recently within the last 5 years) taking drugs",
    ],
  },
  {
    id: "physical_activity",
    question: "Do you have a regular physical activity?",
    type: "boolean",
  },
  {
    id: "diet",
    question: "What is your diet?",
    type: "multiple-choice",
    options: ["Normal", "Pescatarian", "Plant-based", "Vegetarian", "Vegan"],
  },
  {
    id: "education",
    question: "What is your level of education?",
    type: "multiple-choice",
    options: ["High school", "College", "Post-Graduate"],
  },
  {
    id: "sleep_quality",
    question: "What is the quality of your sleep?",
    type: "multiple-choice",
    options: ["Good", "Average", "Poor"],
  },
  {
    id: "night_shifts",
    question:
      "Are you working night shifts or have intermittent night and day shifts?",
    type: "boolean",
  },
  {
    id: "physical_job",
    question:
      "Does your job involve physical activity such as lifting heavy loads, or do you feel physically exhausted by your occupation?",
    type: "boolean",
  },
  {
    id: "stress",
    question: "What is your level of stress/anxiety?",
    type: "multiple-choice",
    options: ["Low", "Moderate", "High"],
  },
  {
    id: "medical_conditions",
    question:
      "Please select if you have been diagnosed or are treated for any of the following medical conditions. Click Next if none of the below applies to you.",
    type: "multiple-choice",
    options: [
      "Sexually transmitted infection",
      "Hypothyroidism",
      "Diabetes mellitus Type 1",
      "Diabetes mellitus Type 2",
      "High blood pressure",
    ],
  },
  {
    id: "cancer_treatment",
    question: "Have you undergone cancer treatment?",
    type: "multiple-choice",
    options: ["No", "Yes"],
  },
  {
    id: "cancer_type",
    question:
      "Please select the type of cancer for which you received treatment.",
    type: "multiple-choice",
    options: [
      "Breast cancer treated with chemotherapy",
      "Hodgkin lymphoma",
      "Non-Hodgkin Lymphoma",
      "Thyroid cancer",
    ],
  },
];

export default quizData;
