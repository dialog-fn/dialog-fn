import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";

// https://astro.build/config
// Project page hosting: https://dialog-fn.github.io/dialog-fn/
export default defineConfig({
  site: "https://dialog-fn.github.io",
  base: "/dialog-fn",
  integrations: [
    react(),
    starlight({
      title: "dialog-fn",
      description:
        "One promise-dialog core, every framework. Drive any dialog as a single promise — open it, await the result.",
      customCss: ["./src/styles/custom.css"],
      social: {
        github: "https://github.com/dialog-fn/dialog-fn",
      },
      sidebar: [
        {
          label: "Start here",
          items: [
            { label: "Introduction", link: "/" },
            { label: "Getting started", link: "/getting-started/" },
            { label: "Core concepts", link: "/concepts/" },
          ],
        },
        {
          label: "Recipes",
          items: [
            { label: "Confirm dialog", link: "/recipes/confirm/" },
            { label: "Prompt / form", link: "/recipes/prompt/" },
            { label: "Toast", link: "/recipes/toast/" },
            { label: "Drawer / sheet", link: "/recipes/drawer/" },
            { label: "Animated", link: "/recipes/animated/" },
          ],
        },
        {
          label: "Frameworks",
          items: [
            { label: "React", link: "/frameworks/react/" },
            { label: "Svelte", link: "/frameworks/svelte/" },
          ],
        },
        {
          label: "Reference",
          items: [{ label: "API", link: "/api/" }],
        },
      ],
    }),
  ],
});
