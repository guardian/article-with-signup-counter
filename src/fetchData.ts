import fetch from "node-fetch";
import { endpoints } from "./endpoints";
import { buildUrl } from "./buildUrl";
import {
  buildSearchCriteria,
  buildSearchCriteriaForOldEmbed,
  OldEmbedSearchCriteriaInput,
  SearchCriteriaInput,
} from "./buildSearchCriteria";
import sections from "../data/sections.json";

const sectionIds = sections.response.results.map((section) => section.id);

export type TagAndSectionCount = {
  sectionId: string;
  tagId: string;
  count?: number;
  error?: string;
};

export type embedAndSectionCount = {
  sectionId: string;
  embedPath: string;
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

export const getCountForSectionAndTag = async (
  input: SearchCriteriaInput
): Promise<TagAndSectionCount> => {
  const { sectionId = "", tagId = "" } = input;
  const url = buildUrl(endpoints.search, buildSearchCriteria(input));

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

export const getCountForOldEmbedAndSection = async (
  input: OldEmbedSearchCriteriaInput
): Promise<embedAndSectionCount> => {
  const { sectionId = "", embedPath = "" } = input;
  const url = buildUrl(endpoints.search, buildSearchCriteriaForOldEmbed(input));

  try {
    const response = await fetch(url);
    const data = await response.json();

    let count: undefined | number = undefined;
    let error: undefined | string = undefined;
    if (data.response && typeof data.response.total === "number") {
      count = data.response.total;
    } else if (data.response && data.response.status === "error") {
      console.log(input, data.response.message);
      error = data.response.message;
    } else if (!response.ok) {
      error = `error: ${response.status}, ${response.statusText}`;
    } else {
      error = "UNKNOWN_ERROR";
      console.log(data);
    }

    return {
      sectionId,
      embedPath,
      count,
      error,
    };
  } catch (error) {
    console.warn({ sectionId, embedPath }, error);

    return {
      sectionId,
      embedPath,
      count: undefined,
    };
  }
};

export const getCountForAllSections = async (
  input: SearchCriteriaInput
): Promise<TagCountBySection> => {
  const { tagId = "" } = input;
  const resultList = await Promise.all(
    sectionIds.map((sectionId) =>
      getCountForSectionAndTag({ ...input, sectionId })
    )
  );
  const sectionMap: Partial<Record<string, number>> = {};
  let total = 0;
  let hasErrors = false;

  resultList.forEach((result) => {
    if (typeof result.count === "number") {
      total += result.count;
    }

    sectionMap[result.sectionId] = result.count;

    if (result.error) {
      hasErrors = true;
    }
  });

  return {
    tagId,
    total,
    hasErrors,
    setions: {
      ...sectionMap,
    },
  };
};
