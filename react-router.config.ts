import type { Config } from "@react-router/dev/config";

import { PRERENDER_PATHS } from "./src/constants/routePaths";

export default {
  // MASTER.md §66 puts application code in src/, not the framework default app/.
  appDirectory: "src",
  // No server runtime: every route is prerendered to static HTML at build
  // time so WhatsApp/social link unfurling and Lighthouse SEO work without
  // running any JavaScript (crawlers that unfurl links never do).
  ssr: false,
  async prerender() {
    return PRERENDER_PATHS;
  },
} satisfies Config;
