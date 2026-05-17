// utils/adviceGeneration.tsx

// Return an array of post titles to fetch from the API
export function generateAdviceFactors(
  answers: Record<string, string>,
): string[] {
  const postTitles: string[] = [];

  // F.2 / F.3 - BMI for females
  const f2 = parseFloat(answers["F.2"]);
  const f3 = parseFloat(answers["F.3"]);
  if (f2 && f3) {
    const bmi = f2 / (f3 / 100) ** 2;
    if (bmi > 25) {
      postTitles.push("2 : Surpoids et obésité chez la femme");
    } else if (bmi < 18.5) {
      postTitles.push("14 : Insuffisance pondérale chez la femme");
    }
  }

  // F.11 - Smoking (female)
  if (answers["F.11"] === "yes") {
    postTitles.push("6 : Tabagisme");
  }

  // F.13 - Alcohol consumption
  const f13 = parseFloat(answers["F.13"]);
  if (f13 && f13 > 7) {
    postTitles.push("8 : Consommation d'alcool");
  }

  // F.15 / F.16 - Drug use
  if (answers["F.15"] === "yes") {
    postTitles.push("7 : Consommation de drogues");
  }
  if (answers["F.16"] === "yes") {
    postTitles.push("7 : Consommation de drogues");
  }

  // F.17 - Diet
  const f17 = answers["F.17"];
  if (f17 === "occidental" || f17 === "vegetalien") {
    postTitles.push("11 : Alimentation");
  }

  // F.19 - Sedentary hours per day
  const f19 = parseFloat(answers["F.19"]);
  if (f19 && f19 >= 8) {
    postTitles.push("13 : Excès de sédentarité");
  }

  // F.20 - Physical activity level (minutes/week)
  const f20 = parseFloat(answers["F.20"]);
  if (f20 && f20 < 150) {
    postTitles.push("10 : Activité physique insuffisante");
  }

  // F.21 - Sleep duration
  const f21 = parseFloat(answers["F.21"]);
  if (f21 && f21 < 6) {
    postTitles.push("12 : Sommeil");
  }

  // Male factors (H.*)

  // H.2 / H.3 - BMI for males
  const h2 = parseFloat(answers["H.2"]);
  const h3 = parseFloat(answers["H.3"]);
  if (h2 && h3) {
    const bmi = h2 / (h3 / 100) ** 2;
    if (bmi > 25) {
      postTitles.push("4 : Surpoids et obésité chez l'homme");
    }
  }

  // H.15 - Smoking (male)
  if (answers["H.15"] === "yes") {
    postTitles.push("6 : Tabagisme");
  }

  // H.17 - Alcohol consumption
  const h17 = parseFloat(answers["H.17"]);
  if (h17 && h17 > 7) {
    postTitles.push("8 : Consommation d'alcool");
  }

  // H.18 / H.19 - Drug use
  if (answers["H.18"] === "yes") {
    postTitles.push("7 : Consommation de drogues");
  }
  if (answers["H.19"] === "yes") {
    postTitles.push("7 : Consommation de drogues");
  }

  // H.20 - Diet
  const h20 = answers["H.20"];
  if (h20 === "occidental" || h20 === "vegetalien") {
    postTitles.push("11 : Alimentation");
  }

  // H.22 - Sedentary hours per day
  const h22 = parseFloat(answers["H.22"]);
  if (h22 && h22 >= 8) {
    postTitles.push("13 : Excès de sédentarité");
  }

  // H.23 - Physical activity level (minutes/week)
  const h23 = parseFloat(answers["H.23"]);
  if (h23 && h23 < 150) {
    postTitles.push("10 : Activité physique insuffisante");
  }

  // H.24 - Sleep duration
  const h24 = parseFloat(answers["H.24"]);
  if (h24 && h24 < 6) {
    postTitles.push("12 : Sommeil");
  }

  // H.36 - Heat exposure
  if (answers["H.36"] === "yes") {
    postTitles.push("5 : Exposition à la chaleur chez l'homme");
  }

  // Always shown for all users
  postTitles.push("1 : Age féminin et fertilité");
  postTitles.push("3 : Le cycle menstruel");
  postTitles.push("9 : Exposition aux perturbateurs endocriniens et aux polluants environnementaux");

  // Remove duplicates
  const uniqueTitles = [...new Set(postTitles)];

  return uniqueTitles;
}
