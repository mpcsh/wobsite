import path from "node:path";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import description from "eleventy-plugin-description";
import readingTime from "reading-time";

export default function (config) {
	config.addPassthroughCopy("src/fonts");

	config.addFilter("dateFormat", (date) =>
		new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: "UTC",
		}).format(date),
	);

	config.addPlugin(description, {
		htmlToTextOptions: {
			selectors: ["h1", "h2", "h3", "h4", "h5", "h6"].map((selector) => ({
				selector,
				format: "skip",
			})),
		},
	});

	config.addFilter("readingTime", (templateContent) =>
		Math.ceil(readingTime(templateContent).minutes),
	);

	config.addPlugin(eleventyImageTransformPlugin, {
		extensions: "html",
		formats: ["avif"],
		widths: ["auto"],
		defaultAttributes: {
			loading: "lazy",
			decoding: "async",
		},
		filenameFormat: function (_id, src, _width, format, _options) {
			return `${path.parse(src).name}.${format}`;
		},
	});

	return {
		dir: {
			input: "src",
			output: "build",
		},
	};
}
