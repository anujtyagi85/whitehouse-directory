function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPut({ request, env, params }) {
  if (request.headers.get("X-Admin-Password") !== env.ADMIN_PASSWORD) {
    return unauthorized();
  }
  const { id } = params;
  const body = await request.json();
  const services = await env.SERVICES_KV.get("services", "json") || [];
  const idx = services.findIndex((s) => s.id === id);
  if (idx === -1) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }
  services[idx] = { ...body, id };
  await env.SERVICES_KV.put("services", JSON.stringify(services));
  return Response.json(services[idx]);
}

export async function onRequestDelete({ request, env, params }) {
  if (request.headers.get("X-Admin-Password") !== env.ADMIN_PASSWORD) {
    return unauthorized();
  }
  const { id } = params;
  let services = await env.SERVICES_KV.get("services", "json") || [];
  const before = services.length;
  services = services.filter((s) => s.id !== id);
  if (services.length === before) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }
  await env.SERVICES_KV.put("services", JSON.stringify(services));
  return new Response(null, { status: 204 });
}
