import { getCountForSectionAndTag, TagAndSectionCount } from "./fetchData";
import Bottleneck from "bottleneck";
import { appendFileSync, writeFileSync } from "fs";
import {
  buildTagAndSectionList,
  TagAndSection,
} from "./buildTagAndSectionList";

const CSV_FILENAME = "./results/list.csv";
const JSON_FILENAME = "./results/datafromlist.json";
const dateRange = {
  fromDate: "2022-09-01",
  toDate: "2022-09-30",
};

const fetchResultsAndOutputCsv = async (list: TagAndSection[]) => {
  writeFileSync(CSV_FILENAME, "tagId,SectionId,count,error");
  const results: TagAndSectionCount[] = [];

  const getDataAndUse = async (tagAndSection: TagAndSection) => {
    const result = await getCountForSectionAndTag({
      ...tagAndSection,
      ...dateRange,
    });

    const output = `${result.tagId},${result.sectionId},${result.count},${
      result.error || "OK"
    }\n`;

    if (result.error) {
      console.warn(output);
    }

    results.push(result);
    if (results.length % 10 === 0) {
      console.log(results.length, Date.now());
    }

    appendFileSync(CSV_FILENAME, output);
  };

  // create a simple limiter using https://github.com/SGrondin/bottleneck
  const limiter = new Bottleneck({
    maxConcurrent: 100,
    minTime: 35,
    reservoir: 100,
    reservoirRefreshInterval: 4000,
    reservoirRefreshAmount: 100,
  });

  for (const tagAndSection of list) {
    limiter.schedule(getDataAndUse, tagAndSection);
  }
  console.log("start", list.length, "queries");

  await new Promise<void>((resolve) => {
    limiter.on("idle", () => {
      resolve();
    });
  });

  console.log("finished");
  return results;
};

const processResults = async (results: TagAndSectionCount[]) => {
  const errors = results.filter((result) => result.error);
  console.log("errors:", errors);

  const data: Record<string, any> = {};

  results.forEach((result) => {
    const { tagId, count, sectionId, error } = result;
    if (!data[tagId]) {
      data[tagId] = { tagId, sections: {} };
    }

    data[tagId].sections[sectionId] = count;
  });

  writeFileSync(JSON_FILENAME, JSON.stringify(data, undefined, 1));
};

const jobList = buildTagAndSectionList();

fetchResultsAndOutputCsv(jobList).then(processResults);
