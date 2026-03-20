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
  if (isImagePath(reel.poster)) {
    return reel.poster as string;
  }

  if (isImagePath(reel.src)) {
    return reel.src;
  }

  return FALLBACK_THUMBNAIL;
}

export async function attachInstagramThumbnails<T extends InstagramReel>(
  reels: T[],
): Promise<InstagramReelWithThumbnail<T>[]> {
  return reels.map((reel) => ({
    ...reel,
    thumbnailUrl: resolveThumbnail(reel),
  }));
}
