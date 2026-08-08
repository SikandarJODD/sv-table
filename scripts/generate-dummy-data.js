import { faker } from "@faker-js/faker";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const outputPath = fileURLToPath(
	new URL("../static/dummy-data/data.json", import.meta.url)
);
const statuses = ["Active", "Inactive", "Pending"];
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

function parseCount(value) {
	const count = Number(value);

	if (!Number.isSafeInteger(count) || count < 1) {
		throw new Error("Entry count must be a positive integer.");
	}

	return count;
}

function countryCodeToFlag(countryCode) {
	return [...countryCode]
		.map((character) =>
			String.fromCodePoint(character.charCodeAt(0) + 127397)
		)
		.join("");
}

function createItem(id) {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	const countryCode = faker.location.countryCode("alpha-2");

	return {
		id,
		name: faker.person.fullName({ firstName, lastName }),
		email: faker.internet.email({ firstName, lastName }).toLowerCase(),
		age: faker.number.int({ min: 18, max: 80 }),
		location: regionNames.of(countryCode) ?? countryCode,
		flag: countryCodeToFlag(countryCode),
		status: faker.helpers.arrayElement(statuses),
		balance: Number(faker.finance.amount({ min: 0, max: 25000, dec: 2 }))
	};
}

async function main() {
	const count = parseCount(process.argv[2]);
	const items = Array.from({ length: count }, (_, index) =>
		createItem(index + 1)
	);

	await writeFile(outputPath, `${JSON.stringify(items, null, "\t")}\n`);
	console.log(`Generated ${count} entries in ${outputPath}`);
}

main().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
