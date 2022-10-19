import identityNames from "../data/identityNames.json";
import { appendFileSync, writeFileSync } from "fs";
import { getCountForAllSections, TagCountBySection } from "./fetchData";

const tagIds = identityNames.map((id) => `campaign/email/${id}`);

const writeResultsFile = async () => {
  let tagSectionCounts: TagCountBySection[] = [];

  writeFileSync("./results.json", "[\n");

  for (let i = 0; i < tagIds.length; i++) {
    const tag = tagIds[i];
    const isLast = i === tagIds.length - 1;
    const tagResult = await getCountForAllSections(tag);
    tagSectionCounts.push(tagResult);
    appendFileSync(
      "./results.json",
      `${JSON.stringify(tagResult)}${isLast ? "\n" : ",\n"}`
    );

    console.log(`fetching counts for ${tag}`);
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }

  appendFileSync("./results.json", "]");

  return tagSectionCounts;
};

writeResultsFile().then((results) => {
  const errors = results.filter((result) => result.hasErrors);
  console.log(
    `fetched data for ${results.length} tags. Errors accorded with ${errors.length}`
  );
});
