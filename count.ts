import fetch from 'node-fetch';
import * as CAPI from '../search-triage/src/services/capi';
import { ArticeSearchCriteria } from '../search-triage/src/services/capi/definitions';

import sections from './sections.json';
import identityNames from './identityNames.json';

const sectionIds = sections.response.results.map((section) => section.id);
const tagIds = identityNames.slice(0,5).map((id) => `campaign/email/${id}`);

const buildSearchCriteria = (input: {
	sectionId?: string;
	tagId?: string;
}): ArticeSearchCriteria => ({
	'from-date': '2022-09-01',
	'to-date': '2022-10-01',
	'page-size': 0,
	tag: input.tagId,
	section: input.sectionId,
});

const getCountForSectionAndTag = async (sectionId: string, tagId: string) => {
	const url = CAPI.buildUrl(
		CAPI.endpoints.search,
		buildSearchCriteria({ sectionId, tagId }),
	);

	try {
		const response = await fetch(url);
		const data = await response.json();

		let count: undefined | number = undefined;
		if (data.response && typeof data.response.total === 'number') {
			count = data.response.total;
		} else if (data.response && data.response.status === 'error') {
			console.log({ sectionId, tagId }, data.response.message);
		} else {
			console.log(data);
		}

		return {
			sectionId,
			tagId,
			count,
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

const getCountForAllSections = async (tagId: string) => {
	const resultList = await Promise.all(
		sectionIds.map((sectionId) => getCountForSectionAndTag(sectionId, tagId)),
	);
	const map: Partial<Record<string, number>> = {};
	let total = 0;

	resultList.forEach((result) => {
		if (typeof result.count === 'number') {
			total += result.count;
			if (result.count > 0) {
				map[result.sectionId] = result.count;
			}
		}
	});

	return {
		tagId,
		total,
		setions: {
			...map,
		},
	};
};

const getAllCounts = async () => {
	let tagSectionCounts: {
		tagId: string;
		total: number;
		setions: {
			[x: string]: number | undefined;
		};
	}[] = [];

	const getResults = async (tagId: string) => {
		console.log(tagId, Date.now());
		const tagResult = await getCountForAllSections(tagId);
		tagSectionCounts.push(tagResult);
	};

	for (let i = 0; i < tagIds.length; i++) {
		await getResults(tagIds[i]);
        await new Promise((resolve) => {
			setTimeout(resolve, 500);
		});
	}

	return tagSectionCounts;
};

// getCountForSectionAndTag('government-computing-network','campaign/email/us-election-australia').then((r) => console.log(r));
// getCountForAllSections('campaign/email/us-election-australia').then((r) =>
// 	console.log(r),
// );
getAllCounts().then((r) => console.log(r));
