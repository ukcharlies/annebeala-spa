type SocialReel = {
  title: string;
  url: string;
  type: "video" | "image";
  src: string;
  poster?: string;
};

export type SocialReelWithThumbnail = SocialReel & {
  thumbnailUrl: string;
};

const OEMBED_ENDPOINT = "https://graph.facebook.com/instagram_oembed";

const getFallbackThumbnail = (reel: SocialReel) => reel.poster ?? reel.src;

const fetchInstagramThumbnail = async (url: string) => {
  const accessToken = process.env.INSTAGRAM_OEMBED_ACCESS_TOKEN;
  if (!accessToken) {
    return null;
  }

  const endpoint = `${OEMBED_ENDPOINT}?url=${encodeURIComponent(url)}&access_token=${accessToken}&omitscript=true`;
  const response = await fetch(
    endpoint,
    process.env.NODE_ENV === "development"
      ? { cache: "no-store" }
      : { next: { revalidate: 60 * 60 * 6 } },
  );

  if (!response.ok) {
    console.warn("Instagram oEmbed failed", {
      status: response.status,
      url,
    });
    return null;
  }

  const data = (await response.json()) as { thumbnail_url?: string };
  return data.thumbnail_url ?? null;
};

export const attachInstagramThumbnails = async (
  reels: SocialReel[],
): Promise<SocialReelWithThumbnail[]> => {
  const thumbnails = await Promise.all(
    reels.map((reel) => fetchInstagramThumbnail(reel.url)),
  );

  return reels.map((reel, index) => ({
    ...reel,
    thumbnailUrl: thumbnails[index] ?? getFallbackThumbnail(reel),
  }));
};
