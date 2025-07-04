// utils/adviceGeneration.tsx

interface AdviceFactor {
  name: string;
  severity: string;
  description: string;
}

const adviceSheets = {
  1: {
    name: "Conseils généraux de santé",
    severity: "élevé",
    description:
      "Recommandations générales pour optimiser votre santé reproductive.",
  },
  2: {
    name: "Gestion du poids corporel",
    severity: "élevé",
    description:
      "Votre IMC nécessite une attention particulière pour  optimiser votre fertilité.",
  },
  3: {
    name: "Régularité du cycle menstruel",
    severity: "pas de risque élevé",
    description: "La durée de vos cycles peut affecter votre fertilité.",
  },
  4: {
    name: "Poids optimal masculin",
    severity: "pas de risque élevé",
    description: "Votre IMC peut impacter la qualité spermatique.",
  },
  5: {
    name: "Facteurs génétiques",
    severity: "pas de risque élevé",
    description: "Consultation génétique recommandée.",
  },
  6: {
    name: "Arrêt du tabac",
    severity: "pas de risque élevé",
    description: "Le tabagisme affecte significativement la fertilité.",
  },
  7: {
    name: "Réduction des substances",
    severity: "pas de risque élevé",
    description: "L'usage de drogues peut impacter votre fertilité.",
  },
  8: {
    name: "Gestion de l'alcool",
    severity: "pas de risque élevé",
    description: "Votre consommation d'alcool dépasse les recommandations.",
  },
  10: {
    name: "Activité physique",
    severity: "pas de risque élevé",
    description: "Optimisez votre niveau d'activité physique.",
  },
  11: {
    name: "Équilibre alimentaire",
    severity: "pas de risque élevé",
    description: "Votre régime alimentaire pourrait être optimisé.",
  },
  12: {
    name: "Qualité du sommeil",
    severity: "pas de risque élevé",
    description: "La durée de votre sommeil affecte votre fertilité.",
  },
};

export function generateAdviceFactors(
  answers: Record<string, string>
): AdviceFactor[] {
  const factors: AdviceFactor[] = [];

  // F.1 - Always systematic
  factors.push(adviceSheets[1]);

  // F.2 - BMI calculation for females
  const f2 = parseFloat(answers["F.2"]);
  const f3 = parseFloat(answers["F.3"]);
  if (f2 && f3) {
    const bmi = f2 / (f3 / 100) ** 2;
    if (bmi < 18 || bmi > 25) {
      factors.push(adviceSheets[2]);
    }
  }

  // F.6.2 - Cycle length
  const f6_2 = parseFloat(answers["F.6.2"]);
  if (f6_2 && (f6_2 < 21 || f6_2 > 35)) {
    factors.push(adviceSheets[3]);
  }

  // F.11 - Always systematic
  factors.push(adviceSheets[6]);

  // F.13 - Alcohol consumption
  const f13 = parseFloat(answers["F.13"]);
  if (f13 && f13 > 7) {
    factors.push(adviceSheets[8]);
  }

  // F.15 - Drug use
  if (answers["F.15"] === "yes") {
    factors.push(adviceSheets[7]);
  }

  // F.16 - Drug use
  if (answers["F.16"] === "yes") {
    factors.push(adviceSheets[7]);
  }

  // F.17 - Diet
  const f17 = answers["F.17"];
  if (f17 === "occidental" || f17 === "vegetalien") {
    factors.push(adviceSheets[11]);
  }

  // F.19 - Physical activity
  if (answers["F.19"] === "yes") {
    factors.push(adviceSheets[10]);
  }

  // F.20 - Physical activity level
  const f20 = parseFloat(answers["F.20"]);
  if (f20 && (f20 < 150 || f20 > 900)) {
    factors.push(adviceSheets[10]);
  }

  // F.21 - Sleep duration
  const f21 = parseFloat(answers["F.21"]);
  if (f21 && (f21 < 6 || f21 > 9)) {
    factors.push(adviceSheets[12]);
  }

  // Male factors (H.*)

  // H.2 - BMI calculation for males
  const h2 = parseFloat(answers["H.2"]);
  const h3 = parseFloat(answers["H.3"]);
  if (h2 && h3) {
    const bmi = h2 / (h3 / 100) ** 2;
    if (bmi < 18 || bmi > 25) {
      factors.push(adviceSheets[4]);
    }
  }

  // H.15 - Smoking
  if (answers["H.15"] === "yes") {
    factors.push(adviceSheets[6]);
  }

  // H.17 - Alcohol consumption
  const h17 = parseFloat(answers["H.17"]);
  if (h17 && h17 > 7) {
    factors.push(adviceSheets[8]);
  }

  // H.18 - Cannabis use
  if (answers["H.18"] === "yes") {
    factors.push(adviceSheets[7]);
  }

  // H.19 - Drug use
  if (answers["H.19"] === "yes") {
    factors.push(adviceSheets[7]);
  }

  // H.20 - Diet
  const h20 = answers["H.20"];
  if (h20 === "occidental" || h20 === "vegetalien") {
    factors.push(adviceSheets[11]);
  }

  // H.22 - Physical activity
  if (answers["H.22"] === "yes") {
    factors.push(adviceSheets[10]);
  }

  // H.23 - Physical activity level
  const h23 = parseFloat(answers["H.23"]);
  if (h23 && (h23 < 150 || h23 > 900)) {
    factors.push(adviceSheets[10]);
  }

  // H.24 - Sleep duration
  const h24 = parseFloat(answers["H.24"]);
  if (h24 && (h24 < 6 || h24 > 9)) {
    factors.push(adviceSheets[12]);
  }

  // H.36 - Genetic factors
  if (answers["H.36"] === "yes") {
    factors.push(adviceSheets[5]);
  }

  // Remove duplicates
  const uniqueFactors = factors.filter(
    (factor, index, self) =>
      index === self.findIndex((f) => f.name === factor.name)
  );

  return uniqueFactors;
}
