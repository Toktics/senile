import type { Metadata } from "next";

export const SITE_URL = "https://www.senile.online";
export const SITE_NAME = "S.E.N.I.L.E. Interactive Archive";
export const DEFAULT_OG_IMAGE = "/opengraph-image.png";
export const DEFAULT_TWITTER_IMAGE = "/twitter-image.png";

type BuildPageMetadataArgs = {
  title: string;
  description: string;
  path: string;
};

export function buildPageMetadata({ title, description, path }: BuildPageMetadataArgs): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      siteName: SITE_NAME,
      title: `${title} | S.E.N.I.L.E.`,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "S.E.N.I.L.E. archive access panel",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | S.E.N.I.L.E.`,
      description,
      images: [DEFAULT_TWITTER_IMAGE],
    },
  };
}
