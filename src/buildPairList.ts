import identityNames from "../data/identityNames.json";
import sectionCount from "../data/sectionCounts2022.json";
import embedPaths from "../data/embedSrc.json";

const sectionIds = Object.entries(sectionCount)
  .filter((entry) => entry[1] > 0)
  .map((entry) => entry[0]);

const tagIds = identityNames.map((id) => `campaign/email/${id}`);


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

export type EmbedAndSection = {
  embedPath: string;
  sectionId: string;
};

export const buildEmbedAndSectionList = (): EmbedAndSection[] => {
  const list: EmbedAndSection[] = [];
  embedPaths.forEach((embedPath) => {
    sectionIds.forEach((sectionId) => {
      list.push({ sectionId, embedPath });
    });
  });

  return list;
};