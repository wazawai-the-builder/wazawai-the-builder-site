export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      const { nickname, platform, profileLink } = await request.json();

      if (!nickname || !platform) {
        return new Response(
          JSON.stringify({ ok: false, error: "nickname and platform are required" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          }
        );
      }

      const safeNickname = String(nickname).slice(0, 80);
      const safePlatform = String(platform).slice(0, 24);
      const safeProfileLink = String(profileLink || "-").slice(0, 160);

      const text = [
        "New lead from WAZAWAI site",
        "",
        `Platform: ${safePlatform}`,
        `Nickname: ${safeNickname}`,
        `Profile: ${safeProfileLink}`
      ].join("\n");

      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text
          })
        }
      );

      if (!telegramResponse.ok) {
        const errorText = await telegramResponse.text();
        return new Response(
          JSON.stringify({ ok: false, error: `telegram_error: ${errorText}` }),
          {
            status: 502,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          }
        );
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ ok: false, error: "invalid_json_or_worker_error" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};
