export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context;
  const { href: reqURL } = getRequestURL(event);
  let cacheManager = {
    cache: null as any,
    cacheKey: null as Request | null
  };

  // Check cache
  if (!process.dev) {
    const cacheKey = new Request(reqURL, cloudflare.req);
    // @ts-ignore
    const cache = caches.default;
    cacheManager = { cache, cacheKey };
    const response = await cache.match(cacheKey);

    if (response) {
      console.info("Found in cache!");
      return response;
    }
  }

  const { slug } = getQuery(event);
  const cat_title = categories.find((c) => fixSlug(c.name) === slug)?.name || null;
  const cat_type = categories.find((c) => fixSlug(c.name) === slug)?.type || null;
  const option = slug ? cat_type === "genre" ? { genres: [cat_title] } : { tags: [cat_title] } : null;
  const popular = await getPopular(option) as Record<string, any>;
  const rated = await getTopRated(option) as Record<string, any>;
  const newly = await getNewlyReleased(option) as Record<string, any>;
  const data = {
    preview: [
      { title: newly.data.title, data: newly.data.media, route: `/c/new${slug ? `/${slug}` : ""}` },
      { title: rated.data.title, data: rated.data.media, route: `/c/top-rated${slug ? `/${slug}` : ""}` },
      { title: popular.data.title, data: popular.data.media, route: `/c/trending${slug ? `/${slug}` : ""}` },
    ]
  } as Record<string, any>;
  data.category = cat_title || null;

  const response = new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "s-maxage=43200" // 12h cache
    }
  });

  if (data && !process.dev) {
    console.info("Stored in cache!");
    cloudflare.context.waitUntil(cacheManager.cache.put(cacheManager.cacheKey, response.clone()));
  }

  return response;
});