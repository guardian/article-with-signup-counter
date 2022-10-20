import embedPaths from "../data/embedSrc.json";
import sections from "../data/sections.json";
import { getCountForOldEmbedAndSection } from "./fetchData";



const doQuery = async (embedPath: string) => {
  const criteriaInput = {
    embedPath,
    fromDate: "2022-05-01",
    toDate: "2022-05-31",
  };
  const result = await getCountForOldEmbedAndSection(criteriaInput);

  return result;
};

// getCountForOldEmbedAndSection(criteriaInput).then(result => {
//     console.log(result)
// })

const stripLeading = (input:string) => {
    const parts = input.split('/')
    return parts[parts.length-1]
}

Promise.all(embedPaths.map((embedPath) => doQuery(embedPath))).then(
  (results) => {
    console.log(results.map(result => ({embed:stripLeading(result.embedPath), count:result.count})));
  }
);
