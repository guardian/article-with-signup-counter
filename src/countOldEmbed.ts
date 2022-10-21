import { writeFileSync } from "fs";
import embedPaths from "../data/embedSrc.json";
import { getCountForOldEmbedAndSection } from "./fetchData";
import { stripLeading, toPercentage } from "./util";

const FILENAME = "./results/old-embeds-sections-june-22.json";

const dateRange = {
  fromDate: "2022-06-01",
  toDate: "2022-06-30",
};

const doCount = async (embedPath: string, sectionId?: string) => {
  const criteriaInput = {
    embedPath,
    sectionId,
    ...dateRange,
  };
  const result = await getCountForOldEmbedAndSection(criteriaInput);

  return result;
};

console.log(FILENAME, dateRange);
Promise.all(embedPaths.map((embedPath) => doCount(embedPath))).then(
  async (results) => {
    const totalResult = await getCountForOldEmbedAndSection(dateRange);

    const list = results
      .filter((result) => result.count)
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .map((result) => ({
        embed: stripLeading(result.embedPath),
        count: result.count,
        percentage: toPercentage(result.count, totalResult.count),
      }));
    console.log(list);
    writeFileSync(FILENAME, JSON.stringify(list, undefined, 1));
  }
);
