import { ContentFields } from '@guardian/content-api-models/v1/contentFields';

export type RequestCriteria = Record<
	string,
	string | number | boolean | (string | number)[]
>;

export type SearchField = 'standfirst' | 'trailText' | 'body' | 'headline';
export const searchFields: SearchField[] = [
	'standfirst',
	'trailText',
	'body',
	'headline',
];

export type TagType =
	| 'blog'
	| 'contributor'
	| 'keyword'
	| 'newspaper-book'
	| 'newspaper-book-section'
	| 'publication'
	| 'series'
	| 'tone'
	| 'type'
	| 'all';

export const tagTypes: TagType[] = [
	'blog',
	'contributor',
	'keyword',
	'newspaper-book',
	'newspaper-book-section',
	'publication',
	'series',
	'tone',
	'type',
	'all',
];

export type UseDateType =
	| 'published'
	| 'first-publication'
	| 'newspaper-edition'
	| 'last-modified';
export const useDateTypes: UseDateType[] = [
	'published',
	'first-publication',
	'newspaper-edition',
	'last-modified',
];

export type OrderByOption = 'newest' | 'oldest' | 'relevance';
export const orderByOptions: OrderByOption[] = [
	'newest',
	'oldest',
	'relevance',
];

export type ArticeSearchCriteria = {
	q?: string;
	page?: number;
	tag?: string;
	section?: string;
	'query-fields'?: SearchField | SearchField[];
	'show-fields'?: (keyof ContentFields)[];
	'page-size'?: number;
	'from-date'?: string;
	'to-date'?: string;
	'use-date'?: UseDateType;
	'order-by'?: OrderByOption;
	'show-tags'?: string | string[];
};

export type SectionSearchCriteria = {
	q?: string;
};

export type TagSearchCriteria = {
	q?: string;
	'web-title'?: string;

	type?: string;
	reference?: string;
	'reference-type'?: string;

	page?: number;
	'page-size'?: number;

	'show-references'?: string;
};

export type SingleItemCriteria = {
	section?: string;
	reference?: string;
	'reference-type'?: string;
	tag?: string;
	ids?: string;
	'production-office'?: string;
	lang?: string;
	'star-rating'?: string;

	'from-date'?: string;
	'to-date'?: string;
	'use-date'?: UseDateType;

	'show-fields'?: (keyof ContentFields)[];
	'show-tags'?: TagType | TagType[];
	'show-section'?: boolean;

	// TO DO - support the rest: https://open-platform.theguardian.com/documentation/item

	'show-story-package'?:boolean;
	'show-editors-picks'?:boolean;
	'show-most-viewed'?:boolean;
	'show-related'?:boolean;
};

export type Criteria =
	| ArticeSearchCriteria
	| SectionSearchCriteria
	| TagSearchCriteria
	| SingleItemCriteria;
