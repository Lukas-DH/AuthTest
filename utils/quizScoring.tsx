export function calculateScore(answers: Record<string, any>): number {
  let score = 0;

  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const toList = (val: any): string[] =>
    Array.isArray(val) ? val : (val ? [val] : []);

  if (parseFloat(answers["F.4.1"]) > 12) score += 1;
  if (answers["F.5.2"] === "yes") score += 1;
  if (answers["F.6"] === "no") score += 1;
  if (parseFloat(answers["F.6.1"]) < 21 && parseFloat(answers["F.1"]) > 37)
    score += 1;
  if (answers["F.7"] === "yes") score += 1;
  if (answers["F.8"] === "yes") score += 1;
  if (["both", "les deux"].includes(normalize(answers["F.9.2.1"] ?? ""))) score += 1;
  if (["both", "les deux"].includes(normalize(answers["F.9.1.1"] ?? ""))) score += 1;
  if (answers["F.9.3"] === "yes") score += 1;
  if (answers["F.9.4"] === "yes") score += 1;
  if (toList(answers["F.16.1"]).map(normalize).includes("steroides anabolisants"))
    score += 1;

  if (answers["H.5"] === "yes") score += 1;
  if (answers["H.6"] === "yes") score += 1;
  if (answers["H.10"] === "yes") score += 1;
  if (answers["H.11"] === "yes") score += 1;
  if (
    (typeof answers["H.12"] === "string" &&
      (answers["H.12"].toLowerCase() === "très souvent" ||
        answers["H.12"].toLowerCase() === "souvent")) ||
    (Array.isArray(answers["H.12"]) &&
      answers["H.12"].some(
        (val: string) =>
          val.toLowerCase() === "très souvent" ||
          val.toLowerCase() === "souvent"
      ))
  )
    score += 1;
  if (answers["H.13.1"] === "yes") score += 1;
  if (answers["H.14.1"] === "yes") score += 1;
  if (answers["H.15"] === "yes") score += 1;
  if (toList(answers["H.19.1"]).map(normalize).includes("steroides anabolisants"))
    score += 1;

  return score;
}
