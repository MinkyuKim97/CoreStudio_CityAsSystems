# Garden Static Site

This is a demo of using the [Eleventy](https://www.11ty.dev/) site generator to build a static site. We'll use this in class as a template project for experimentation.

## Getting started

First, you need to have [Node.js downloaded and installed](https://nodejs.org/en/download).

Once you have that done, then clone this repository to a folder on your local computer.

Then, you need to install this project's dependencies. Open a terminal, and type this command:

```
npm install
```

Then, you can build the site with this terminal command:

```
npm run build
```

Now, you should see that all of the files from the `source` folder have been converted to HTML pages in the `_site` folder. If you're in the middle of development, you can instead use this command to build the site and start a development server:

```
npm run serve
```

## Adding content

At this point, you're ready to go! You can add markdown files to the `source` folder in order to add pages to the site. If you need a reminder, [here's a good cheat sheet on the basic markdown
features](https://www.markdownguide.org/basic-syntax/). You can also add metadata at the top of your
file in YAML format. [Here's an overview of how data can be entered](https://learnxinyminutes.com/yaml/).


