import { config } from "dotenv";
import { RequestCriteria } from "./definitions";

config();

const apiKey = process.env.CAPI_KEY || "test";

export function buildUrl(endpoint: string, criteria: RequestCriteria = {}) {
  const url = new URL(endpoint);
  url.searchParams.set("api-key", apiKey);

  Object.entries(criteria).forEach(([key, value]) => {
    if (typeof value !== "undefined") {
      if (Array.isArray(value)) {
        url.searchParams.set(
          key,
          value.map((item) => item.toString()).join(",")
        );
      } else {
        url.searchParams.set(key, value.toString());
      }
    }
  });
  // console.log({
  //   path: url.pathname,
  //   search: url.search,
  // });

  return url;
}
