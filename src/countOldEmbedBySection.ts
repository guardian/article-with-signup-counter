import Bottleneck from "bottleneck";
import { appendFileSync, writeFileSync } from "fs";
import { buildEmbedAndSectionList, EmbedAndSection} from "./modules/buildPairList";
import { getCountForOldEmbedAndSection, EmbedAndSectionCount } from "./modules/fetchData";
import { getSectionTotals } from "./modules/getSectionTotals";
import { toPercentage } from "./modules/util";

const JSON_FILENAME = "./results/old-embeds-sections-october-22.json";
const CSV_FILENAME = "./results/old-embed-list.csv";
const dateRange = {
  fromDate: "2022-10-01",
  toDate: "2022-10-31",
};

type EmbedReport = {
  embedPath: string;
  total: number;
  sections: Record<
    string,
    {
      count: number | undefined;
      sectionTotal: number | undefined;
      percentage: string | undefined;
    }
  >;
};

type DataOutput = Record<string, EmbedReport>;


const fetchResultsAndOutputCsv = async (list: EmbedAndSection[]) => {
  writeFileSync(CSV_FILENAME, "embedPath,SectionId,count,error\n");
  const results: EmbedAndSectionCount[] = [];

  const getDataAndUse = async (tagAndSection: EmbedAndSection) => {
    const result = await getCountForOldEmbedAndSection({
      ...tagAndSection,
      ...dateRange,
    });

    const output = `${result.embedPath},${result.sectionId},${result.count},${
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

const processResults = async (results: EmbedAndSectionCount[]) => {
  const errors = results.filter((result) => result.error);
  console.log("errors:", errors);

  const sectionTotals = await getSectionTotals(dateRange);
  const data: DataOutput = {};

  results.forEach((result) => {
    const { embedPath, count, sectionId } = result;
    const sectionTotal = sectionTotals[sectionId];

    if (!data[embedPath]) {
      data[embedPath] = { embedPath, sections: {}, total: 0 };
    }

    if (count) {
      data[embedPath].total = data[embedPath].total + count;
    }
    data[embedPath].sections[sectionId] = {
      count,
      sectionTotal,
      percentage: toPercentage(count, sectionTotal),
    };
  });

  writeFileSync(JSON_FILENAME, JSON.stringify(data, undefined, 1));
};

const list = buildEmbedAndSectionList()
fetchResultsAndOutputCsv(list).then(processResults)