import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Lock, Heart } from "lucide-react";

import { unlockSite } from "@/lib/gate.functions";

export const Route = createFileRoute("/unlock")({
  component: Unlock,
  head: () => ({
    meta: [
      { title: "Enter Our Special Date — Birthday Surprise" },
      {
        name: "description",
        content: "A private birthday surprise. Enter our special date to unlock the celebration.",
      },
      { property: "og:title", content: "Enter Our Special Date — Birthday Surprise" },
      {
        property: "og:description",
        content: "A private birthday surprise, unlocked with our special date.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function Unlock() {
  const router = useRouter();
  const unlock = useServerFn(unlockSite);
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    setPending(true);
    setError(false);
    try {
      const { ok } = await unlock({ data: { password } });
      if (ok) {
        await router.navigate({ to: "/" });
        router.invalidate();
      } else {
        setError(true);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-warm-cream font-sans text-stone-800 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-stone-200/60 border border-stone-100 text-center pop-in">
        <div className="size-14 mx-auto rounded-2xl bg-soft-mint flex items-center justify-center mb-6">
          <Lock className="size-6 text-celebrate-gold" />
        </div>
        <h1 className="font-display text-4xl text-party-pink mb-3">A Little Secret</h1>
        <p className="text-stone-500 mb-8 leading-relaxed">
          This celebration is private. Enter our special date to unlock it.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="password"
            type="password"
            required
            maxLength={200}
            autoComplete="current-password"
            placeholder="Our special date"
            className="w-full rounded-full border border-stone-200 bg-warm-cream px-6 py-4 text-center outline-none focus:border-party-pink focus:ring-2 focus:ring-party-pink/20 transition"
          />
          {error && (
            <p className="text-sm text-party-pink font-semibold">
              That's not quite it — try again.
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-party-pink text-white rounded-full font-bold shadow-lg shadow-party-pink/30 hover:scale-105 transition-transform active:scale-95 disabled:opacity-60 disabled:hover:scale-100 cursor-pointer"
          >
            {pending ? "Unlocking..." : "Unlock the surprise"} <Heart className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}