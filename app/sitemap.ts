import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = SITE_URL;
    const now = new Date();

    return [
        {
            url: base,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${base}/studio`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${base}/shop`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.9,
        },
    ];
}
