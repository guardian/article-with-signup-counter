import identityNames from "../data/identityNames.json";
import sections from "../data/sections.json";

const tagIds = identityNames.map((id) => `campaign/email/${id}`);
const sectionIds = sections.response.results.map((section) => section.id);

export type TagAndSection = {
  tagId: string;
  sectionId: string;
};

export const buildTagAndSectionList = (): TagAndSection[] => {
  const list: TagAndSection[] = [];
  tagIds.forEach((tagId) => {
    sectionIds.forEach((sectionId) => {
      list.push({ sectionId, tagId });
    });
  });

  return list;
};
