import { appendFileSync, writeFileSync } from "fs";
import input from "../results/old-embeds-sections-may-22.json";
import sectionCounts from "../data/nonZeroSectionCounts2022.json";

type SectionName = keyof typeof sectionCounts;
const sections = Object.keys(sectionCounts) as SectionName[];

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


const list = Object.values(input);

const buildHeader = (): string => {
  return `embed,${sections.join(",")}\n`;
};

const buildLine = (item: EmbedReport): string => {
  const percentages = sections.map(
    (section) => item.sections[section].percentage || "??"
  );

  return `${item.embedPath},${percentages.join(",")}\n`;
};

writeFileSync(CSV_OUTPUT_FILENAME, buildHeader());

list.forEach((item) => {
  appendFileSync(CSV_OUTPUT_FILENAME, buildLine(item));
});

console.log('created:', CSV_OUTPUT_FILENAME)
console.log(list.length, 'data lines')