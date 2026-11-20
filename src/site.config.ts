interface Profile {
  url: string;
  handle: string;
}

/** Profile links used in the header, footer and post endings. */
export const site: { github: Profile; linkedin?: Profile; rss: string } = {
  github: { url: "https://github.com/JoostGevaert", handle: "JoostGevaert" },
  linkedin: { url: "https://www.linkedin.com/in/joost-gevaert/", handle: "joost-gevaert" },
  rss: "/rss.xml",
};
