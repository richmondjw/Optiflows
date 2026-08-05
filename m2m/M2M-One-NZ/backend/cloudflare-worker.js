/*
  M2M One NZ — Review Packet shared-comments backend
  ----------------------------------------------------
  A tiny Cloudflare Worker that stores reviewer comments so EVERYONE who opens
  the packet sees EVERYONE'S comments, persistently.

  The packet already speaks this contract:
    GET  <url>        -> returns a JSON array of all comment objects
    POST <url>  body  -> one comment object {id,name,text,route,xPct,yPct,ts,resolved,deleted}
                         (upsert by id; deletes are soft — they re-POST with deleted:true)

  ── DEPLOY (about 15 minutes, free tier) ────────────────────────────────────
  1. dash.cloudflare.com -> Workers & Pages -> Create -> Create Worker. Name it
     e.g. "m2m-review-comments". Deploy the default, then "Edit code" and paste
     this whole file in, replacing what's there. Deploy.
  2. Storage & Databases -> KV -> Create a namespace, e.g. "m2m_review_notes".
  3. Back in the Worker -> Settings -> Bindings -> add a KV namespace binding:
        Variable name:  NOTES        (must be exactly NOTES)
        KV namespace:   m2m_review_notes
     Save and re-deploy.
  4. Copy the Worker URL (looks like https://m2m-review-comments.<you>.workers.dev).
  5. In m2m-one-nz-review-packet.html, change the one line near the top of the
     comment module from:
        var REVIEW_BACKEND = { url: "", pollMs: 5000 };
     to:
        var REVIEW_BACKEND = { url: "https://m2m-review-comments.<you>.workers.dev", pollMs: 5000 };
     Re-upload the packet to your host. Done — comments are now shared + live.

  (Send me the Worker URL and I'll make that one-line edit for you.)
*/

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    // Return every stored comment as a single JSON array.
    if (request.method === "GET") {
      const out = [];
      let cursor;
      do {
        const list = await env.NOTES.list({ prefix: "note:", cursor });
        for (const k of list.keys) {
          const v = await env.NOTES.get(k.name);
          if (v) { try { out.push(JSON.parse(v)); } catch (e) {} }
        }
        cursor = list.list_complete ? null : list.cursor;
      } while (cursor);
      return new Response(JSON.stringify(out), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Upsert one comment (also handles soft-deletes / resolve toggles by id).
    if (request.method === "POST") {
      let n;
      try { n = await request.json(); } catch (e) {
        return new Response(JSON.stringify({ error: "invalid json" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
      }
      if (!n || !n.id) {
        return new Response(JSON.stringify({ error: "missing id" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
      }
      await env.NOTES.put("note:" + n.id, JSON.stringify(n));
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405, headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};
