/**
 * Decides how a lesson's video link can be played. The link comes from data
 * (the CMS), so only known shapes are ever put inside the page.
 */
export type VideoSource =
  /** Played in YouTube's player; watchUrl opens it on YouTube itself. */
  | { kind: "youtube"; embedUrl: string; watchUrl: string }
  /** A video file, played by the browser's own player. */
  | { kind: "file"; src: string }
  /** Anything else on the web: many sites refuse to be framed, so open it. */
  | { kind: "link"; href: string };

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "www.youtube-nocookie.com",
]);

const YOUTUBE_ID = /^[\w-]{11}$/;
const VIDEO_FILE = /\.(mp4|webm|ogg)$/i;

function youtubeId(url: URL): string | null {
  let id: string | null | undefined;
  if (url.hostname === "youtu.be") {
    id = url.pathname.split("/")[1];
  } else if (YOUTUBE_HOSTS.has(url.hostname)) {
    const [, first, second] = url.pathname.split("/");
    if (first === "watch") id = url.searchParams.get("v");
    else if (["embed", "shorts", "live"].includes(first)) id = second;
  }
  return id && YOUTUBE_ID.test(id) ? id : null;
}

/** Reads "90", "90s" or "1m30s" as seconds. */
function startSeconds(value: string | null): number {
  const match = value?.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
  if (!match) return 0;
  const [, h = 0, m = 0, s = 0] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

export function parseVideoSource(link: string | undefined): VideoSource | null {
  const value = link?.trim();
  if (!value) return null;

  // A path on this site: one leading slash, not "//host" or "/\host".
  if (/^\/(?![/\\])/.test(value)) {
    return VIDEO_FILE.test(value.split(/[?#]/)[0]) ? { kind: "file", src: value } : null;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const id = youtubeId(url);
  if (id) {
    const start = startSeconds(url.searchParams.get("t"));
    return {
      kind: "youtube",
      // The no-cookie host, and no request at all until the visitor presses Play.
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&cc_load_policy=1${
        start ? `&start=${start}` : ""
      }`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    };
  }

  if (VIDEO_FILE.test(url.pathname)) return { kind: "file", src: value };
  return { kind: "link", href: value };
}
