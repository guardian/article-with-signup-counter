import { ArticeSearchCriteria } from "./definitions";

export type SearchCriteriaInput = {
  sectionId?: string;
  tagId?: string;
  fromDate?: string;
  toDate?: string;
};

export const buildSearchCriteria = (
  input: SearchCriteriaInput
): ArticeSearchCriteria => ({
  "from-date": input.fromDate,
  "to-date": input.toDate,
  "page-size": 0,
  tag: input.tagId,
  section: input.sectionId,
});

export type OldEmbedSearchCriteriaInput = {
  sectionId?: string;
  embedPath?: string;
  fromDate?: string;
  toDate?: string;
};

const iframeClass = "email-sub__iframe";

export const buildSearchCriteriaForOldEmbed = (
  input: OldEmbedSearchCriteriaInput
): ArticeSearchCriteria => ({
  "from-date": input.fromDate,
  "to-date": input.toDate,
  "page-size": 0,
  section: input.sectionId,
  "query-fields": "body",
  q: input.embedPath ?  `"${input.embedPath}" AND ${iframeClass}` : undefined,
});
