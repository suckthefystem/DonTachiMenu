function jsonResponse(body, status = 200, origin = "*") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

const MENU_KEY = "menu_data";

function resolveOrigin(request, env) {
  const requestOrigin = request.headers.get("Origin") || "";
  const allowedOrigin = env.ALLOWED_ORIGIN || "*";

  if (allowedOrigin === "*") {
    return "*";
  }

  return requestOrigin === allowedOrigin ? requestOrigin : allowedOrigin;
}

function isUsableMenuData(data) {
  return Boolean(data && Array.isArray(data.sections) && data.sections.length > 0);
}

export default {
  async fetch(request, env) {
    const origin = resolveOrigin(request, env);

    if (request.method === "OPTIONS") {
      return jsonResponse({ ok: true }, 200, origin);
    }

    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, "") || "/";

    if (request.method === "GET" && pathname === "/") {
      return jsonResponse({ ok: true, service: "dontachi-menu-publisher" }, 200, origin);
    }

    if (request.method === "GET" && pathname === "/menu") {
      if (!env.MENU_KV) {
        return jsonResponse({ message: "KV binding is missing." }, 500, origin);
      }

      const raw = await env.MENU_KV.get(MENU_KEY);
      if (!raw) {
        return jsonResponse({ message: "No published menu yet." }, 404, origin);
      }

      try {
        const parsed = JSON.parse(raw);
        if (!isUsableMenuData(parsed)) {
          return jsonResponse({ message: "Published menu is invalid." }, 500, origin);
        }
        return jsonResponse({ ok: true, menuData: parsed }, 200, origin);
      } catch {
        return jsonResponse({ message: "Published menu is corrupted." }, 500, origin);
      }
    }

    if (request.method !== "PUT" || pathname !== "/menu") {
      return jsonResponse({ message: "Method not allowed." }, 405, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON body." }, 400, origin);
    }

    const password = String(body?.password || "").trim();
    const menuData = body?.menuData;

    if (!env.PUBLISH_PASSWORD) {
      return jsonResponse({ message: "Worker password is not configured." }, 500, origin);
    }

    if (password !== env.PUBLISH_PASSWORD) {
      return jsonResponse({ message: "Invalid publish password." }, 401, origin);
    }

    if (!isUsableMenuData(menuData)) {
      return jsonResponse({ message: "Menu data is missing or invalid." }, 400, origin);
    }

    if (!env.MENU_KV) {
      return jsonResponse({ message: "KV binding is missing." }, 500, origin);
    }

    try {
      await env.MENU_KV.put(MENU_KEY, JSON.stringify(menuData));
      return jsonResponse({ ok: true }, 200, origin);
    } catch (error) {
      return jsonResponse({ message: error.message || "Publish failed." }, 500, origin);
    }
  }
};
