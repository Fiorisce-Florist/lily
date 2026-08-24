const MIXPANEL_API_HOST = "https://api-js.mixpanel.com";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function getForwardHeaders(request: Request) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  return headers;
}

async function getMixpanelUrl(request: Request, context: RouteContext) {
  const params = await context.params;
  const path = (params.path ?? []).join("/");
  const sourceUrl = new URL(request.url);
  const targetUrl = new URL(`${MIXPANEL_API_HOST}/${path}`);

  targetUrl.search = sourceUrl.search;

  return targetUrl;
}

async function forwardToMixpanel(request: Request, context: RouteContext) {
  const targetUrl = await getMixpanelUrl(request, context);
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: getForwardHeaders(request),
    body: request.method === "GET" ? undefined : await request.text(),
    cache: "no-store",
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "text/plain",
      "cache-control": "no-store",
    },
  });
}

export async function GET(request: Request, context: RouteContext) {
  return forwardToMixpanel(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return forwardToMixpanel(request, context);
}
