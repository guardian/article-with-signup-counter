import { ArticeSearchCriteria } from "./definitions";

export type SearchCriteriaInput = {
  sectionId?: string;
  tagId?: string;
};

export const buildSearchCriteria = (
  input: SearchCriteriaInput
): ArticeSearchCriteria => ({
  "from-date": "2022-09-01",
  "to-date": "2022-10-01",
  "page-size": 0,
  tag: input.tagId,
  section: input.sectionId,
});
