// UPDATE: This imports the base plugin
import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
	// UPDATE: This uses the base plugin
	eleventyConfig.addPlugin(HtmlBasePlugin);

    // This sets the input directory for our site
	eleventyConfig.setInputDirectory("source");

	// Copy any CSS and Javascript files to the output directory
	// Keeps the same directory structure.
	eleventyConfig.addPassthroughCopy("source/**/*.css");
	eleventyConfig.addPassthroughCopy("source/**/*.js");
	eleventyConfig.addPassthroughCopy("source/**/*.jpg");
	eleventyConfig.addPassthroughCopy("source/**/*.JPG");
	eleventyConfig.addPassthroughCopy("source/**/*.png");



	eleventyConfig.addGlobalData("layout", "base.html");
};