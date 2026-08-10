import type { Component } from "svelte";
import type { CodeBlock } from "$lib/types/code";
import type { PropsTable } from "$lib/types/structure";
import type { SEO } from "$lib/types/seo";
import NumberPaginationPreview from "./examples/number-pagination-preview.svelte";
import ArrowPaginationPreview from "./examples/arrow-pagination-preview.svelte";
import NumberPaginationPreviewRaw from "./examples/number-pagination-preview.svelte?raw";
import ArrowPaginationPreviewRaw from "./examples/arrow-pagination-preview.svelte?raw";
import TablePaginationCode from "$lib/components/table/pagination/pagination.svelte?raw";
import TablePaginationIndexCode from "$lib/components/table/pagination/index.ts?raw";
import TablePaginationArrowCode from "$lib/components/table/pagination-arrow/pagination-arrow.svelte?raw";
import TablePaginationArrowIndexCode from "$lib/components/table/pagination-arrow/index.ts?raw";

export type PaginationVariant = {
	id: string;
	title: string;
	description: string;
	installPath: string;
	installCodeBlocks: CodeBlock[];
	installPackages?: string[];
	folderStructure: string;
	preview: Component;
	previewCode: CodeBlock;
	usageCode: CodeBlock;
	propsTable: PropsTable;
};

export type PaginationGuide = {
	label: string;
	href: string;
};

export const seo: SEO = {
	title: "Pagination",
	description:
		"Minimal docs for number pagination and arrow pagination components for Svelte tables.",
	keywords: [
		"pagination",
		"svelte pagination",
		"table pagination",
		"tanstack table",
		"svelte table"
	]
};

const sharedProps = [
	{
		name: "currentPage",
		type: "number",
		default: "required",
		required: true,
		description: "Current page number. Use a `1`-based value."
	},
	{
		name: "pageCount",
		type: "number",
		default: "required",
		required: true,
		description: "Total number of pages."
	},
	{
		name: "canPreviousPage",
		type: "boolean",
		default: "required",
		required: true,
		description:
			"Disable previous actions when the current page is the first page."
	},
	{
		name: "canNextPage",
		type: "boolean",
		default: "required",
		required: true,
		description:
			"Disable next actions when the current page is the last page."
	},
	{
		name: "onPrevious",
		type: "() => void",
		default: "required",
		required: true,
		description: "Runs when the previous control is pressed."
	},
	{
		name: "onNext",
		type: "() => void",
		default: "required",
		required: true,
		description: "Runs when the next control is pressed."
	},
	{
		name: "onGoToPage",
		type: "(page: number) => void",
		default: "required",
		required: true,
		description: "Runs with a `1`-based page number."
	},
	{
		name: "siblingCount",
		type: "number",
		default: "1",
		description:
			"How many page links to show on each side of the active page."
	}
] as const;

const numberUsageCode = `<script lang="ts">
  import Pagination from "$lib/components/table/pagination";

  let currentPage = $state(3);
  const pageCount = 12;

  const canPreviousPage = $derived(currentPage > 1);
  const canNextPage = $derived(currentPage < pageCount);

  function onPrevious() {
    if (!canPreviousPage) return;
    currentPage -= 1;
  }

  function onNext() {
    if (!canNextPage) return;
    currentPage += 1;
  }

  function onGoToPage(page: number) {
    currentPage = page;
  }
</script>

<Pagination
  {currentPage}
  {pageCount}
  {canPreviousPage}
  {canNextPage}
  {onPrevious}
  {onNext}
  {onGoToPage}
/>`;

const arrowUsageCode = `<script lang="ts">
  import PaginationArrow from "$lib/components/table/pagination-arrow";

  let currentPage = $state(2);
  const pageCount = 8;
  const pageSize = 10;
  const totalRows: number = 73;

  const canPreviousPage = $derived(currentPage > 1);
  const canNextPage = $derived(currentPage < pageCount);
  const firstVisibleRow = $derived(
    totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1
  );
  const lastVisibleRow = $derived(
    Math.min(currentPage * pageSize, totalRows)
  );

  function onPrevious() {
    if (!canPreviousPage) return;
    currentPage -= 1;
  }

  function onNext() {
    if (!canNextPage) return;
    currentPage += 1;
  }

  function onGoToPage(page: number) {
    currentPage = page;
  }
</script>

<PaginationArrow
  {currentPage}
  {pageCount}
  {canPreviousPage}
  {canNextPage}
  {onPrevious}
  {onNext}
  {onGoToPage}
  {firstVisibleRow}
  {lastVisibleRow}
  {totalRows}
/>`;

export const variants: PaginationVariant[] = [
	{
		id: "pagination",
		title: "Number pagination",
		description:
			"Use this when you want numbered page links with `Previous`, `Next`, and ellipsis handling.",
		installPath: "/r/pagination.json",
		installCodeBlocks: [
			{
				name: "table/pagination/pagination.svelte",
				lang: "svelte",
				code: TablePaginationCode,
				isExpand: true
			},
			{
				name: "table/pagination/index.ts",
				lang: "typescript",
				code: TablePaginationIndexCode
			}
		],
		folderStructure: `src/
└── lib/
    └── components/
        └── table/
            └── pagination/
                ├── pagination.svelte
                └── index.ts`,
		preview: NumberPaginationPreview,
		previewCode: {
			name: "number-pagination-preview.svelte",
			lang: "svelte",
			code: NumberPaginationPreviewRaw
		},
		usageCode: {
			name: "usage.svelte",
			lang: "svelte",
			code: numberUsageCode
		},
		propsTable: {
			name: "Number pagination props",
			props: [...sharedProps]
		}
	},
	{
		id: "pagination-arrow",
		title: "Arrow pagination",
		description:
			"Use this when you want compact first, previous, next, and last controls with range details.",
		installPath: "/r/pagination-arrow.json",
		installPackages: ["@lucide/svelte"],
		installCodeBlocks: [
			{
				name: "table/pagination-arrow/pagination-arrow.svelte",
				lang: "svelte",
				code: TablePaginationArrowCode,
				isExpand: true
			},
			{
				name: "table/pagination-arrow/index.ts",
				lang: "typescript",
				code: TablePaginationArrowIndexCode
			}
		],
		folderStructure: `src/
└── lib/
    └── components/
        └── table/
            └── pagination-arrow/
                ├── pagination-arrow.svelte
                └── index.ts`,
		preview: ArrowPaginationPreview,
		previewCode: {
			name: "arrow-pagination-preview.svelte",
			lang: "svelte",
			code: ArrowPaginationPreviewRaw
		},
		usageCode: {
			name: "usage.svelte",
			lang: "svelte",
			code: arrowUsageCode
		},
		propsTable: {
			name: "Arrow pagination props",
			props: [
				...sharedProps,
				{
					name: "firstVisibleRow",
					type: "number",
					default: "required",
					required: true,
					description: "One-based index of the first visible row."
				},
				{
					name: "lastVisibleRow",
					type: "number",
					default: "required",
					required: true,
					description: "One-based index of the last visible row."
				},
				{
					name: "totalRows",
					type: "number",
					default: "required",
					required: true,
					description: "Total rows across all pages."
				},
				{
					name: "class",
					type: "string",
					default: '""',
					description:
						"Optional class for the root navigation wrapper."
				}
			]
		}
	}
];

export const guides: PaginationGuide[] = [
	{
		label: "Design Better Pagination",
		href: "https://coyleandrew.medium.com/design-better-pagination-a022a3b161e1"
	},
	{
		label: "Pagination UI Guide",
		href: "https://www.eleken.co/blog-posts/pagination-ui"
	}
];
