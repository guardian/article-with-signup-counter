import sections from "../../data/sections.json";
import { SearchCriteriaInput } from "./buildSearchCriteria";
import { TagAndSection } from "./buildPairList";
import { getCountForSectionAndTag } from "./fetchData";

const sectionIds = sections.response.results.map((section) => section.id);


export const buildTotalsList = (): TagAndSection[] => {
  const list: TagAndSection[] = [];

  sectionIds.forEach((sectionId) => {
    list.push({
      sectionId,
      tagId: "",
    });
  });

  return list;
};

export const getSectionTotals = async (
  dateRange: SearchCriteriaInput
): Promise<Partial<Record<string, number>>> => {
  const counts = await Promise.all(
    sectionIds.map((sectionId) =>
      getCountForSectionAndTag({ ...dateRange, sectionId })
    )
  );

  const results: Record<string, number | undefined> = {};

  counts
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .forEach((count) => {
      results[count.sectionId] = count.count;
    });

  return results;
};


