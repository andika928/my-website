export async function onRequest(context) {
    return new Response(JSON.stringify({ pesan: "Halo dari Cloudflare API!" }), {
        headers: { "content-type": "application/json" },
    });
}
