import { franc, francAll } from "franc";
import langs from "langs";

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

console.log(detectLanguageFranc("This is a test")); // English
console.log(detectLanguageFranc("Ceci est un test")); // French
console.log(detectLanguageFranc("Esto es una prueba")); // Spanish

console.log(getLanguageProbabilityListWithFranc("This is a test"));

console.log(
  franc("Yep det var det :-) Litt merkelig med julemat før desember da:-P "),
);

console.log(
  getLanguageProbabilityListWithFranc(
    "Yep det var det :-) Litt merkelig med julemat før desember da:-P ",
  ),
);

console.log(
  getLanguageProbabilityListWithFranc(
    "Thanks for swiping right#klisjeLiker du Star Wars? ",
  ),
);

console.log(
  getLanguageProbabilityListWithFranc(
    "I fucking love science er sykt bra :-) kult at du liker det ;-) ",
  ),
);

console.log(getLanguageProbabilityListWithFranc(""));
