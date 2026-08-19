export type Person = {
	id: number;
	name: string;
	email: string;
	location: string;
	flag: string;
	status: "Active" | "Inactive" | "Pending";
	performance: string;
	balance: number;
};

// In a real app, load the initial data with a remote function,
// a SvelteKit load function, or your own API endpoint.
export async function fetchData(): Promise<Person[]> {
	const response = await fetch("/dummy-data/data.json");
	return (await response.json()) as Person[];
}
