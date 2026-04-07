export interface DocsNavItem {
  title: string;
  href: string;
}

export interface DocsNavGroup {
  title: string;
  items: DocsNavItem[];
}

export const docsNavigation: DocsNavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/getting-started" },
      { title: "Folder Structure", href: "/docs/folder-structure" },
    ],
  },
  {
    title: "Customization",
    items: [
      { title: "Theming", href: "/docs/theming" },
      { title: "Adding Pages", href: "/docs/adding-pages" },
      { title: "Components", href: "/docs/components" },
      { title: "Charts", href: "/docs/charts" },
      { title: "Internationalization", href: "/docs/i18n" },
      { title: "Storybook", href: "/docs/storybook" },
    ],
  },
  {
    title: "Development",
    items: [
      { title: "Testing", href: "/docs/testing" },
      { title: "Deploy to Production", href: "/docs/deployment" },
      { title: "Seed / Starter", href: "/docs/seed-starter" },
      { title: "Changelog", href: "/docs/changelog" },
    ],
  },
];
