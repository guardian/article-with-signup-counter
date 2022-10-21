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
import { get } from "https";

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

const getCountOrError = async (
  url: URL
): Promise<{ count?: number | undefined; error?: string | undefined }> => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.response && typeof data.response.total === "number") {
      return { count: data.response.total };
    } else if (data.response && data.response.status === "error") {
      return { error: data.response.message };
    } else if (!response.ok) {
      return { error: `error: ${response.status}, ${response.statusText}` };
    } else {
      return { error: "UNKNOWN_ERROR" };
    }
  } catch (fetchError) {
    return { error: "FETCH_ERROR" };
  }
};

export const getCountForSectionAndTag = async (
  input: SearchCriteriaInput
): Promise<TagAndSectionCount> => {
  const { sectionId = "", tagId = "" } = input;
  const url = buildUrl(endpoints.search, buildSearchCriteria(input));

  const { error, count } = await getCountOrError(url);

  if (error) {
    console.log("failed:", input);
    console.error(error);
  }

  return {
    sectionId,
    tagId,
    count,
    error,
  };
};

export const getCountForOldEmbedAndSection = async (
  input: OldEmbedSearchCriteriaInput
): Promise<embedAndSectionCount> => {
  const { sectionId = "", embedPath = "" } = input;
  const url = buildUrl(endpoints.search, buildSearchCriteriaForOldEmbed(input));

  const { error, count } = await getCountOrError(url);
  if (error) {
    console.log("failed:", input);
    console.error(error);
  }

  return {
    sectionId,
    embedPath,
    count,
    error,
  };

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
