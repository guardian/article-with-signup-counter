import identityNames from "../data/identityNames.json";
import { appendFileSync, writeFileSync } from "fs";
import { getCountForAllSections, TagCountBySection } from "./fetchData";
import { SearchCriteriaInput } from "./buildSearchCriteria";

const tagIds = identityNames.map((id) => `campaign/email/${id}`);

const writeResultsFile = async (
  fileName: string,
  dateRange: Partial<SearchCriteriaInput>
) => {
  let tagSectionCounts: TagCountBySection[] = [];

  writeFileSync(fileName, "[\n");

  for (let i = 0; i < tagIds.length; i++) {
    const tag = tagIds[i];
    const isLast = i === tagIds.length - 1;
    const tagResult = await getCountForAllSections({
      tagId: tag,
      ...dateRange,
    });
    tagSectionCounts.push(tagResult);
    appendFileSync(
      fileName,
      `${JSON.stringify(tagResult)}${isLast ? "\n" : ",\n"}`
    );

    console.log(`fetching counts for ${tag}`);
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }

  appendFileSync(fileName, "]");

  return tagSectionCounts;
};

writeResultsFile("./results/results.json", {
  fromDate: "2022-09-01",
  toDate: "2022-09-01",
}).then((results) => {
  const errors = results.filter((result) => result.hasErrors);
  console.log(
    `fetched data for ${results.length} tags. Errors with ${errors.length}`
  );
  console.log(
    "errors on:",
    errors.map((result) => result.tagId)
  );
});
