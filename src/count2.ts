import { getCountForSectionAndTag, TagAndSectionCount } from "./fetchData";
import Bottleneck from "bottleneck";
import { appendFileSync, writeFileSync } from "fs";
import { buildTagAndSectionList, TagAndSection } from "./buildTagAndSectionList";
import { config } from "dotenv";

config();
const FILENAME = "./results/list.csv";
const dateRange = {
  fromDate: "2022-09-01",
  toDate: "2022-09-01",
};



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
  if (results.length % 100 === 0) {
    console.log(results.length);
  }

  appendFileSync(FILENAME, output);
};

const scheduleAndWaitIdle = async (list: TagAndSection[]) => {
  // create a simple limiter using https://github.com/SGrondin/bottleneck
  const limiter = new Bottleneck({
    maxConcurrent: 20,
    minTime: 10,
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

  const errors = results.filter((result) => result.error);
  console.log("finished");
  console.log("errors:", errors);
};

writeFileSync(FILENAME, "tagId,SectionId,count,error");
scheduleAndWaitIdle(buildTagAndSectionList());
