// Vercel Routing Middleware: Vercel only hosts the static frontend, so API and
// uploaded-media requests are forwarded to the PHP backend at PTRP_BACKEND_URL
// (e.g. https://api.example.com). Responses, including Set-Cookie, are passed
// through so the session cookie stays on the Vercel domain.

export const config = {
  matcher: ["/api/:path*", "/uploads/:path*"],
};

const HOP_BY_HOP_HEADERS = [
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
];

function jsonError(status: number, error: string): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export default async function middleware(request: Request): Promise<Response> {
  const backend = (process.env.PTRP_BACKEND_URL ?? "").trim().replace(/\/+$/, "");
  if (!/^https:\/\//i.test(backend) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(backend)) {
    return jsonError(503, "The PTRP API is not configured. Set PTRP_BACKEND_URL to the https:// address of the PHP backend.");
  }

  const incoming = new URL(request.url);
  const target = `${backend}${incoming.pathname}${incoming.search}`;

  const headers = new Headers(request.headers);
  for (const name of HOP_BY_HOP_HEADERS) headers.delete(name);
  headers.delete("X-PTRP-Proxy-Secret");
  headers.delete("X-PTRP-Client-IP");
  const proxySecret = process.env.PTRP_PROXY_SECRET ?? "";
  const clientIp = (request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "").trim();
  if (proxySecret && clientIp) {
    headers.set("X-PTRP-Proxy-Secret", proxySecret);
    headers.set("X-PTRP-Client-IP", clientIp);
  }
  headers.set("X-Forwarded-Host", incoming.host);
  headers.set("X-Forwarded-Proto", incoming.protocol.replace(":", ""));

  const hasBody = !["GET", "HEAD"].includes(request.method.toUpperCase());
  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: "manual",
    });
  } catch {
    return jsonError(502, "The PTRP API could not be reached. Please try again later.");
  }

  const responseHeaders = new Headers(upstream.headers);
  for (const name of [...HOP_BY_HOP_HEADERS, "content-encoding"]) responseHeaders.delete(name);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
