import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

const COOKIE_NAME = "birthday-gate";
const SITE_PASSWORD = "2712";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export const unlockSite = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    if (typeof data?.password !== "string" || data.password.length > 200) {
      return { ok: false as const };
    }
    if (normalize(data.password) !== normalize(SITE_PASSWORD)) {
      return { ok: false as const };
    }

    setCookie(COOKIE_NAME, "unlocked", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { ok: true as const };
  });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE_NAME, { path: "/" });
  return { ok: true as const };
});

export const getCelebration = createServerFn({ method: "GET" }).handler(async () => {
  if (getCookie(COOKIE_NAME) !== "unlocked") return { unlocked: false as const };

  return {
    unlocked: true as const,
    name: "Love of my life",
    heading: "Happy Birthday, Love!",
    subtitle:
      "To the person who brings sunshine to every room. Here's to another year of adventures, laughter, and chasing your dreams.",
    secretMessage:
      "Happiest Birthday to my baby, Wishing you many many happy return of the day. Wish you all the best things life offers you Stay as cute, adroable and funny as you are. My perfect partner for life and my all time teddy bear,Thank you so much for being there for me all the time. Thank you so much to make me feel like home even if we are so far form it.Thank you so much for everything you did just to make me smile. Your love is my life time achivement. I am super excited to spend this life with you.you are kind, brilliant, and endlessly inspiring. May this year bring you closer to everything your heart whispers about. Here's to cake, confetti, and a lifetime of moments that feel just like this one.",
  };
});
