"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const POST_COOLDOWN_MS = 10000;
const AUTO_COLLAPSE_LEVEL = 3;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch {
    return null;
  }
}
function getDeviceId() {
  try {
    let id = localStorage.getItem("revuu_device_id");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("revuu_device_id", id);
    }
    return id;
  } catch {
    return "dev";
  }
}
function EmojiPicker({ onPick }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);
  const EMOJIS = [
    "😀",
    "😂",
    "🤣",
    "😍",
    "🥰",
    "😎",
    "🤔",
    "😭",
    "🔥",
    "👍",
    "👎",
    "✨",
    "💯",
    "👏",
    "🙌",
    "🫡",
    "🤝",
    "⭐",
    "🍿",
    "⚔️",
  ];
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="px-2 py-1 rounded border border-neutral-800 bg-neutral-950 text-sm"
      >
        😊
      </button>
      {open && (
        <div className="absolute z-20 mt-1 p-2 rounded-lg border border-neutral-800 bg-neutral-900 grid grid-cols-8 gap-1 shadow">
          {EMOJIS.map((e, i) => (
            <button
              key={i}
              type="button"
              className="hover:bg-neutral-800 rounded text-lg"
              onClick={() => {
                onPick(e);
                setOpen(false);
              }}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentsSupabase({ animeId, title }) {
  const supa = getSupabase();
  const deviceId = getDeviceId();
  const [rows, setRows] = useState([]);
  const [myVotes, setMyVotes] = useState({});
  const [loading, setLoading] = useState(!!supa);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  async function load() {
    if (!supa) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supa
      .from("anime_comments")
      .select("id,name,text,created_at,parent_id,score")
      .eq("anime_id", Number(animeId))
      .order("created_at", { ascending: true });
    if (error) setError(error.message);
    const list = data || [];
    setRows(list);

    const ids = list.map((r) => r.id);
    if (ids.length) {
      const { data: vData } = await supa
        .from("comment_votes")
        .select("comment_id,value")
        .in("comment_id", ids)
        .eq("device_id", deviceId);
      const map = {};
      (vData || []).forEach((v) => (map[v.comment_id] = v.value));
      setMyVotes(map);
    } else setMyVotes({});
    setLoading(false);
  }
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [animeId]);

  function checkCooldown(parentId) {
    try {
      const key = `cool_${animeId}_${parentId || "root"}`;
      const last = Number(localStorage.getItem(key) || 0);
      const now = Date.now();
      if (now - last < POST_COOLDOWN_MS) {
        const s = Math.ceil((POST_COOLDOWN_MS - (now - last)) / 1000);
        throw new Error("Please wait " + s + "s before posting again.");
      }
      localStorage.setItem(key, String(now));
    } catch (e) {
      throw e;
    }
  }

  async function addComment(e, parent_id = null, replyText) {
    e?.preventDefault?.();
    if (!supa) return;
    const t = (replyText ?? text).trim();
    if (!t) return;
    try {
      checkCooldown(parent_id);
    } catch (err) {
      setError(err.message);
      return;
    }
    const n = (name || "Anonymous").slice(0, 40);
    const payload = {
      anime_id: Number(animeId),
      name: n,
      text: t.slice(0, 1000),
      parent_id,
    };
    const { error } = await supa.from("anime_comments").insert(payload);
    if (error) {
      setError(error.message);
      return;
    }
    if (replyText === undefined) setText("");
    setName(n);
    load();
  }

  async function handleVote(c, value) {
    if (!supa) return;
    const prev = myVotes[c.id] || 0;
    const newVal = prev === value ? 0 : value;
    const delta = newVal - prev;
    try {
      if (newVal === 0) {
        await supa
          .from("comment_votes")
          .delete()
          .eq("comment_id", c.id)
          .eq("device_id", deviceId);
      } else {
        await supa
          .from("comment_votes")
          .upsert({ comment_id: c.id, device_id: deviceId, value: newVal });
      }
      if (delta !== 0) {
        await supa
          .from("anime_comments")
          .update({ score: (c.score || 0) + delta })
          .eq("id", c.id);
      }
      setMyVotes((v) => ({ ...v, [c.id]: newVal }));
      setRows((rs) =>
        rs.map((r) =>
          r.id === c.id ? { ...r, score: (r.score || 0) + delta } : r
        )
      );
    } catch (err) {
      setError(String(err.message || err));
    }
  }

  function VoteBox({ c }) {
    const mine = myVotes[c.id] || 0;
    return (
      <div className="flex items-center gap-2 text-xs select-none">
        <button
          aria-label="Upvote"
          className={`px-1.5 py-0.5 rounded border ${
            mine === 1
              ? "bg-emerald-700 border-emerald-600"
              : "border-neutral-800 bg-neutral-950 hover:bg-neutral-900"
          }`}
          onClick={() => handleVote(c, 1)}
        >
          ▲
        </button>
        <span className="w-6 text-center">{c.score ?? 0}</span>
        <button
          aria-label="Downvote"
          className={`px-1.5 py-0.5 rounded border ${
            mine === -1
              ? "bg-red-700 border-red-600"
              : "border-neutral-800 bg-neutral-950 hover:bg-neutral-900"
          }`}
          onClick={() => handleVote(c, -1)}
        >
          ▼
        </button>
      </div>
    );
  }

  const tree = useMemo(() => {
    const map = new Map();
    for (const r of rows) {
      const k = r.parent_id || "root";
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(r);
    }
    return map;
  }, [rows]);

  const CommentItem = React.memo(function Item({ c, level = 0 }) {
    const children = tree.get(c.id) || [];
    const [collapsed, setCollapsed] = useState(level >= AUTO_COLLAPSE_LEVEL);
    const [openReply, setOpenReply] = useState(false);
    const [replyText, setReplyText] = useState("");
    const ref = useRef(null);
    useEffect(() => {
      if (openReply) ref.current?.focus();
    }, [openReply]);

    return (
      <div className={level > 0 ? "ml-4 border-l border-neutral-800 pl-4" : ""}>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 mb-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium">{c.name}</div>
            <div className="flex items-center gap-3">
              <VoteBox c={c} />
              <div className="text-xs text-neutral-400">
                {new Date(c.created_at).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-sm whitespace-pre-wrap mt-1">{c.text}</div>
          <div className="mt-2 text-xs flex items-center gap-3">
            <button
              className="text-emerald-400 hover:underline"
              onClick={() => setOpenReply((v) => !v)}
            >
              {openReply ? "Cancel" : "Reply"}
            </button>
            <button
              className="text-neutral-400 hover:underline"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "Expand" : "Collapse"}
            </button>
          </div>
          {openReply && (
            <div className="mt-2 grid gap-2">
              <div className="flex items-start gap-2">
                <textarea
                  ref={ref}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  placeholder="Reply..."
                  className="flex-1 px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-sm"
                />
                <EmojiPicker onPick={(e) => setReplyText((t) => t + e)} />
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-sm"
                  onClick={(e) => addComment(e, c.id, replyText)}
                >
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
        {!collapsed &&
          children.map((ch) => <Item key={ch.id} c={ch} level={level + 1} />)}
      </div>
    );
  });

  const roots = tree.get("root") || [];

  return (
    <section className="mt-8">
      <h3 className="font-semibold mb-3">Community Comments</h3>
      {!supa && (
        <div className="text-sm text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-xl p-3">
          <div className="mb-2">
            Add NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY in
            .env.local
          </div>
        </div>
      )}
      {supa && (
        <>
          <form
            onSubmit={(e) => addComment(e, null)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 grid gap-2"
          >
            <div className="grid gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (optional)"
                className="px-3 py-2 rounded-[10px] bg-neutral-950 border border-neutral-800 text-sm"
              />
              <div className="flex items-start gap-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Say something about ${title}...`}
                  rows={3}
                  className="flex-1 px-3 py-2 rounded-[10px] bg-neutral-950 border border-neutral-800 text-sm"
                />
                <EmojiPicker onPick={(e) => setText((t) => t + e)} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={loading}
                className="px-3 py-1.5 rounded-[10px] bg-emerald-600 hover:bg-emerald-500 text-sm"
                type="submit"
              >
                Post
              </button>
              {loading && (
                <span className="text-xs text-neutral-400">Loading...</span>
              )}
              {error && (
                <span className="text-xs text-red-400">{String(error)}</span>
              )}
              <span className="text-xs text-neutral-500 ml-auto">
                Anti-spam: {POST_COOLDOWN_MS / 1000}s cooldown
              </span>
            </div>
          </form>
          <div className="mt-4 space-y-2">
            {roots.map((r) => (
              <CommentItem key={r.id} c={r} />
            ))}
            {!roots.length && !loading && (
              <div className="text-sm text-neutral-400">
                No comments yet. Be the first!
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
