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
