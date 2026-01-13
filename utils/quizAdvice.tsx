// utils/adviceGeneration.tsx

// Return an array of post titles to fetch from the API
export function generateAdviceFactors(
  answers: Record<string, string>
): string[] {
  const postTitles: string[] = [];

  // For now, randomly add some posts (user will fix logic later)
  // These match the exact titles from the API

  // F.2 - BMI calculation for females
  const f2 = parseFloat(answers["F.2"]);
  const f3 = parseFloat(answers["F.3"]);
  if (f2 && f3) {
    const bmi = f2 / (f3 / 100) ** 2;
    if (bmi < 18 || bmi > 25) {
      postTitles.push("2 Poids élevé Mme");
    }
  }

  // F.6.2 - Cycle length
  const f6_2 = parseFloat(answers["F.6.2"]);
  if (f6_2 && (f6_2 < 21 || f6_2 > 35)) {
    postTitles.push("3 Le cycle menstruel");
  }

  // F.11 - Always systematic
  postTitles.push("6 Tabac quotidien homme et femme");

  // F.13 - Alcohol consumption
  const f13 = parseFloat(answers["F.13"]);
  if (f13 && f13 > 7) {
    postTitles.push("8 Alcool H et F");
  }

  // F.15 - Drug use
  if (answers["F.15"] === "yes") {
    postTitles.push("7 Drogues");
  }

  // F.16 - Drug use
  if (answers["F.16"] === "yes") {
    postTitles.push("7 Drogues");
  }

  // F.17 - Diet
  const f17 = answers["F.17"];
  if (f17 === "occidental" || f17 === "vegetalien") {
    postTitles.push("11 Alimentation");
  }

  // F.19 - Physical activity
  if (answers["F.19"] === "yes") {
    postTitles.push("10 Activité physique homme et femme");
  }

  // F.20 - Physical activity level
  const f20 = parseFloat(answers["F.20"]);
  if (f20 && (f20 < 150 || f20 > 900)) {
    postTitles.push("10 Activité physique homme et femme");
  }

  // F.21 - Sleep duration
  const f21 = parseFloat(answers["F.21"]);
  if (f21 && (f21 < 6 || f21 > 9)) {
    postTitles.push("12 Sommeil");
  }

  // Male factors (H.*)

  // H.2 - BMI calculation for males
  const h2 = parseFloat(answers["H.2"]);
  const h3 = parseFloat(answers["H.3"]);
  if (h2 && h3) {
    const bmi = h2 / (h3 / 100) ** 2;
    if (bmi < 18 || bmi > 25) {
      postTitles.push("4 Poids élevé Mr");
    }
  }

  // H.15 - Smoking
  if (answers["H.15"] === "yes") {
    postTitles.push("6 Tabac quotidien homme et femme");
  }

  // H.17 - Alcohol consumption
  const h17 = parseFloat(answers["H.17"]);
  if (h17 && h17 > 7) {
    postTitles.push("8 Alcool H et F");
  }

  // H.18 - Cannabis use
  if (answers["H.18"] === "yes") {
    postTitles.push("7 Drogues");
  }

  // H.19 - Drug use
  if (answers["H.19"] === "yes") {
    postTitles.push("7 Drogues");
  }

  // H.20 - Diet
  const h20 = answers["H.20"];
  if (h20 === "occidental" || h20 === "vegetalien") {
    postTitles.push("11 Alimentation");
  }

  // H.22 - Physical activity
  if (answers["H.22"] === "yes") {
    postTitles.push("10 Activité physique homme et femme");
  }

  // H.23 - Physical activity level
  const h23 = parseFloat(answers["H.23"]);
  if (h23 && (h23 < 150 || h23 > 900)) {
    postTitles.push("10 Activité physique homme et femme");
  }

  // H.24 - Sleep duration
  const h24 = parseFloat(answers["H.24"]);
  if (h24 && (h24 < 6 || h24 > 9)) {
    postTitles.push("12 Sommeil");
  }

  // Add a couple random ones for demo
  postTitles.push("5 Chaleur");
  postTitles.push("1 Age féminin");

  // Remove duplicates
  const uniqueTitles = [...new Set(postTitles)];

  return uniqueTitles;
}
