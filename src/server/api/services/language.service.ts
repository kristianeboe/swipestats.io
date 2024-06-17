import { franc, francAll } from "franc";

import langs from "langs";

export function getFrancLanguageContext(text: string) {
  const trigrams = francAll(text, {
    minLength: 1,
  });

  const mostProbableLanguageTrigram = trigrams[0]!; // always at least [["und", 1]]
  const mostProbableLanguageCode = mostProbableLanguageTrigram[0];
  const mostProbableLanguage = langs.where("3", mostProbableLanguageCode)?.name;

  const topTrigrams = trigrams.slice(0, 5);
  console.log("language context", text, mostProbableLanguage, topTrigrams);

  return {
    mostProbableLanguage:
      !mostProbableLanguage || mostProbableLanguageCode === "und"
        ? null
        : mostProbableLanguage,
    topTrigrams,
  };
}

export function getLanguageProbabilityListWithFranc(text: string) {
  // returns most probable language over all. Not very good with mixed language sentances
  const trigrams = francAll(text);
  return trigrams.filter((trigram) => trigram[0] !== "und").slice(0, 5);
}

export function detectLanguageFranc(text: string): string | null {
  // Use franc to detect the language code
  const langCode = franc(text);

  // If franc returns 'und', it means the language is undetermined
  if (langCode === "und") {
    return null; // "Language could not be determined";
  }

  // Use langs to get the language name from the language code
  const language = langs.where("3", langCode);

  if (language) {
    return language.name;
  } else {
    return "Unknown language";
  }
}
