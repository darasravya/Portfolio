export const METADATA = {
  author: "Sravya Dara",
  title: "Portfolio | Sravya Dara",
  description:
    "Sravya Dara is a Frontend Developer, interested in crafting beautiful and functional applications.",
  siteUrl: "https://www.sravyadara.me/",
  keywords: [
    "Sravya Dara",
    "Frontend Developer",
    "Web Developer",
    "React Native Developer",
    "Software Developer",
    "Software Engineer",
    "Portfolio",
    "Devfolio",
    "Folio",
  ].join(", "),
  language: "English",
};

export const MENULINKS = [
  {
    name: "Home",
    ref: "home",
  },
  {
    name: "Skills",
    ref: "skills",
  },
  {
    name: "Work",
    ref: "work",
  },
  {
    name: "Contact",
    ref: "contact",
  },
];

export const TYPED_STRINGS = [
  "I build things for the web",
  "I create aesthetic and modern apps",
];

export const SOCIAL_LINKS = [
  {
    name: "mail",
    url: "mailto: darasravya30@gmail.com",
  },
  {
    name: "linkedin",
    url: "https://www.linkedin.com/in/dara-sravya/",
  },
  {
    name: "github",
    url: "https://github.com/darasravya",
  }
];

export const SKILLS = {
  languagesAndTools: [
    "html",
    "css",
    "javascript",
    "typescript",
    "sass",
    "nodejs",
    "webpack"
  ],
  librariesAndFrameworks: [
    "react",
    "redux",
    "nextjs",
    "tailwindcss",
    "expressjs"
  ],
  databases: ["mysql", "postgresql"],
  other: ["git", "docker"],
};

export const skillCategory = [
  { text: 'LANGUAGES AND TOOLS', objName: 'languagesAndTools' }, 
  { text: 'LIBRARIES AND FRAMEWORKS', objName: 'librariesAndFrameworks' }, 
  { text: 'DATABASES', objName: 'databases' }, 
  { text: 'Other', objName: 'other' }]

export const Branch = {
  LEFT: "leftSide",
  RIGHT: "rightSide",
}

export const NodeTypes = {
  CONVERGE: "converge",
  DIVERGE: "diverge",
  CHECKPOINT: "checkpoint",
}

export const ItemSize = {
  SMALL: "small",
  LARGE: "large",
}

export const TIMELINE = [
  {
    type: NodeTypes.CHECKPOINT,
    title: "2023",
    size: ItemSize.LARGE,
    shouldDrawLine: false,
    alignment: Branch.LEFT,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "Senior Product Engineer (Current)",
    size: ItemSize.SMALL,
    subtitle: "Developing UI components, leading projects and mentoring Jr devs",
    image: "/timeline/servify.svg",
    slideImage: "/timeline/servify.png",
    shouldDrawLine: true,
    alignment: Branch.LEFT,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "2021",
    size: ItemSize.LARGE,
    shouldDrawLine: false,
    alignment: Branch.LEFT,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "Software Engineer",
    size: ItemSize.SMALL,
    subtitle:
      "Contributed for developing user friendly functionalities on the panels of Printer @ Toshiba 😎",
    image: "/timeline/toshiba.svg",
    slideImage: "/timeline/tosh.gif",
    shouldDrawLine: true,
    alignment: Branch.LEFT,
  },
  // {
  //   type: NodeTypes.CHECKPOINT,
  //   title: "2017",
  //   size: ItemSize.LARGE,
  //   shouldDrawLine: false,
  //   alignment: Branch.LEFT,
  // },
];

export const GTAG = "G-5HCTL2TJ5W";
