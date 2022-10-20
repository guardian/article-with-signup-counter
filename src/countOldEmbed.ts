import { writeFileSync } from "fs";
import embedPaths from "../data/embedSrc.json";
import { getCountForOldEmbedAndSection } from "./fetchData";
import { toPercentage } from "./util";

const FILENAME = "./results/old-embeds-september-22.json";

const dateRange = {
  fromDate: "2022-09-01",
  toDate: "2022-09-30",
};

const doQuery = async (embedPath: string) => {
  const criteriaInput = {
    embedPath,
    ...dateRange,
  };
  const result = await getCountForOldEmbedAndSection(criteriaInput);

  return result;
};

const stripLeading = (input: string) => {
  const parts = input.split("/");
  return parts[parts.length - 1];
};

console.log(FILENAME, dateRange);
Promise.all(embedPaths.map((embedPath) => doQuery(embedPath))).then(
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
