import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export const AI_CONCIERGE_SETTING_KEY = "ai_concierge_enabled";

export const getAiConciergeEnabled = unstable_cache(
  async () => {
    const setting = await prisma.siteSetting.findUnique({
      where: {
        key: AI_CONCIERGE_SETTING_KEY,
      },
      select: {
        booleanValue: true,
      },
    });

    return setting?.booleanValue ?? true;
  },
  [AI_CONCIERGE_SETTING_KEY],
  { tags: [AI_CONCIERGE_SETTING_KEY] }
);
