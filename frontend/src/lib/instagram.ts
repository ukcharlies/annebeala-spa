export type InstagramReel = {
  title: string;
  type: "video" | "image" | string;
  src: string;
  url: string;
  poster?: string;
  views?: string;
  likes?: string;
};

export type InstagramReelWithThumbnail<T extends InstagramReel = InstagramReel> =
  T & {
    thumbnailUrl: string;
  };

const FALLBACK_THUMBNAIL = "/PHOTO-2026-03-08-17-26-31.jpg";

const imageExtensionPattern = /\.(png|jpe?g|webp|avif|gif|svg)$/i;

function isImagePath(value?: string) {
  return Boolean(value && imageExtensionPattern.test(value));
}

function resolveThumbnail(reel: InstagramReel) {
  const instagramCover = getInstagramCoverUrl(reel.url);
  if (instagramCover) {
    return instagramCover;
  }

  if (isImagePath(reel.poster)) {
    return reel.poster as string;
  }

  if (isImagePath(reel.src)) {
    return reel.src;
  }

  return FALLBACK_THUMBNAIL;
}

export function getInstagramShortcode(url?: string) {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:reel|p)\/([^/?#]+)/i);
  return match ? match[1] : null;
}

export function getInstagramEmbedUrl(url?: string) {
  const shortcode = getInstagramShortcode(url);
  if (!shortcode) return null;
  return `https://www.instagram.com/reel/${shortcode}/embed`;
}

export function getInstagramCoverUrl(url?: string) {
  const shortcode = getInstagramShortcode(url);
  if (!shortcode) return null;
  return `https://www.instagram.com/p/${shortcode}/media/?size=l`;
}

export async function attachInstagramThumbnails<T extends InstagramReel>(
  reels: T[],
): Promise<InstagramReelWithThumbnail<T>[]> {
  return reels.map((reel) => ({
    ...reel,
    thumbnailUrl: resolveThumbnail(reel),
  }));
}
