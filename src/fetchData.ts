import fetch from "node-fetch";
import { endpoints } from "./endpoints";
import { buildUrl } from "./buildUrl";
import { buildSearchCriteria } from "./buildSearchCriteria";
import sections from "../data/sections.json";


const sectionIds = sections.response.results.map((section) => section.id);


type TagAndSectionCount = {
  sectionId: string;
  tagId: string;
  count?: number;
  error?: string;
};

export type TagCountBySection = {
  tagId: string;
  total: number;
  hasErrors: boolean;
  setions: {
    [x: string]: number | undefined;
  };
};

const getCountForSectionAndTag = async (
  sectionId: string,
  tagId: string
): Promise<TagAndSectionCount> => {
  const url = buildUrl(
    endpoints.search,
    buildSearchCriteria({ sectionId, tagId })
  );

  try {
    const response = await fetch(url);
    const data = await response.json();

    let count: undefined | number = undefined;
    let error: undefined | string = undefined;
    if (data.response && typeof data.response.total === "number") {
      count = data.response.total;
    } else if (data.response && data.response.status === "error") {
      console.log({ sectionId, tagId }, data.response.message);
      error = data.response.message;
    } else if (!response.ok) {
      error = `error: ${response.status}, ${response.statusText}`;
    } else {
      error = "UNKNOWN_ERROR";
      console.log(data);
    }

    return {
      sectionId,
      tagId,
      count,
      error,
    };
  } catch (error) {
    console.warn({ sectionId, tagId }, error);

    return {
      sectionId,
      tagId,
      count: undefined,
    };
  }
};

export const getCountForAllSections = async (
  tagId: string
): Promise<TagCountBySection> => {
  const resultList = await Promise.all(
    sectionIds.map((sectionId) => getCountForSectionAndTag(sectionId, tagId))
  );
  const map: Partial<Record<string, number>> = {};
  let total = 0;
  let hasErrors = false;

  resultList.forEach((result) => {
    if (typeof result.count === "number") {
      total += result.count;
    }

    map[result.sectionId] = result.count;

    if (result.error) {
      hasErrors = true;
    }
  });

  return {
    tagId,
    total,
    hasErrors,
    setions: {
      ...map,
    },
  };
};
