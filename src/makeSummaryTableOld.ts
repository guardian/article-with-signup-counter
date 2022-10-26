import { appendFileSync, writeFileSync } from "fs";
import input from "../results/old-embeds-sections-may-22.json";

type SectionName =
  | "world"
  | "australia-news"
  | "football"
  | "sport"
  | "commentisfree"
  | "us-news"
  | "business"
  | "politics"
  | "uk-news"
  | "lifeandstyle"
  | "environment"
  | "film"
  | "music"
  | "books"
  | "tv-and-radio"
  | "society"
  | "artanddesign"
  | "stage"
  | "culture"
  | "money"
  | "food"
  | "technology"
  | "crosswords"
  | "global-development"
  | "education"
  | "media"
  | "news"
  | "science"
  | "fashion"
  | "games"
  | "theobserver"
  | "inequality"
  | "info"
  | "law"
  | "travel"
  | "cities"
  | "animals-farmed"
  | "weather"
  | "help"
  | "theguardian";

const sections: SectionName[] = [
  "world",
  "australia-news",
  "football",
  "sport",
  "commentisfree",
  "us-news",
  "business",
  "politics",
  "uk-news",
  "lifeandstyle",
  "environment",
  "film",
  "music",
  "books",
  "tv-and-radio",
  "society",
  "artanddesign",
  "stage",
  "culture",
  "money",
  "food",
  "technology",
  "crosswords",
  "global-development",
  "education",
  "media",
  "news",
  "science",
  "fashion",
  "games",
  "theobserver",
  "inequality",
  "info",
  "law",
  "travel",
  "cities",
  "animals-farmed",
  "weather",
  "help",
  "theguardian",
];

type EmbedReport = {
  embedPath: string;
  total: number;
  sections: Record<
    SectionName,
    {
      count?: number | undefined;
      percentage?: string | undefined;
    }
  >;
};
const CSV_OUTPUT_FILENAME = "./tables/old-embeds-may-22.csv";
// const JSON_INPUT_FILENAME = "./results/old-embeds-may-22.json";

const list = Object.values(input);

const buildHeader = (): string => {
  return `embed,${sections.join(",")}\n`;
};

const buildLine = (item: EmbedReport): string => {
  const percentages = sections.map(
    (section) => item.sections[section].percentage || '??'
  );

  return `${item.embedPath},${percentages.join(",")}\n`;
};

writeFileSync(CSV_OUTPUT_FILENAME, buildHeader());

list.forEach((item) => {
  appendFileSync(CSV_OUTPUT_FILENAME, buildLine(item));
});
