import fetch from "node-fetch";
import { endpoints } from "./endpoints";
import { buildUrl } from "./buildUrl";
import {
  buildSearchCriteria,
  buildSearchCriteriaForOldEmbed,
  OldEmbedSearchCriteriaInput,
  SearchCriteriaInput,
} from "./buildSearchCriteria";


export type TagAndSectionCount = {
  tagId: string;
  sectionId: string;
  count?: number;
  error?: string;
};

export type EmbedAndSectionCount = {
  embedPath: string;
  sectionId: string;
  count?: number;
  error?: string;
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
): Promise<EmbedAndSectionCount> => {
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
