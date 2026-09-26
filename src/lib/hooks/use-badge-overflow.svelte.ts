import { onMount } from "svelte";
import { watch } from "runed";

export interface BadgeOverflowOptions<T> {
	readonly items: readonly T[];
	readonly container: HTMLElement | null;
	readonly lineCount: number;
	getLabel: (item: T) => string;
}

class BadgeOverflow<T> {
	#options: BadgeOverflowOptions<T>;
	#visibleCount = $state(0);

	constructor(options: BadgeOverflowOptions<T>) {
		this.#options = options;
		watch(
			[
				() => options.items,
				() => options.container,
				() => options.lineCount
			],
			() => this.measure()
		);

		onMount(() => {
			const observer = new ResizeObserver(() => this.measure());
			if (options.container) observer.observe(options.container);
			this.measure();
			return () => observer.disconnect();
		});
	}

	get visibleItems() {
		return this.#options.items.slice(0, this.#visibleCount);
	}

	get hiddenCount() {
		return Math.max(0, this.#options.items.length - this.#visibleCount);
	}

	measure = () => {
		const { container, items, lineCount, getLabel } = this.#options;
		if (!container || items.length === 0) {
			this.#visibleCount = items.length;
			return;
		}
		const style = getComputedStyle(container);
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		if (!context) return;
		context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
		const available = Math.max(0, container.clientWidth - 16) * lineCount;
		let used = 0;
		let count = 0;
		for (const item of items) {
			const width = context.measureText(getLabel(item)).width + 22;
			if (used + width > available) break;
			used += width + 4;
			count += 1;
		}
		this.#visibleCount = count;
	};
}

export function useBadgeOverflow<T>(options: BadgeOverflowOptions<T>) {
	return new BadgeOverflow(options);
}
