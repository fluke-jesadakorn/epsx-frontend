"use client";

import { SWRConfig } from "swr";
import useSWR from "swr";
import type { Query } from "@/types/stockFetchData";
import { API_HEADERS } from "@/configs/header";
import { SortDirection, Market, Metrics } from "@/constants/query";

const initialQuery: Query = {
  query: {
    filters: [
      {
        metric: Metrics.EPS_DILUTED_QTR_GROWTH,
        preset:
          "7b226b657973223a5b2267742e696e636c7573697665222c2267742e7363616c65222c2267742e76616c7565222c226d6574726963225d2c2276616c756573223a5b747275652c312c312c226570735f64696c757465645f7174725f67726f777468225d7d",
      },
    ],
    sort: {
      metric: Metrics.ANALYST_TARGET_UPSIDE,
      direction: SortDirection.DESC,
    },
    prefilters: { primaryOnly: true, market: Market.US },
  },
  metrics: [
    "ticker",
    Metrics.EPS_DILUTED_QTR_GROWTH,
    Metrics.PE_LTM_LATEST,
    Metrics.EPS_BASIC_GROWTH,
    Metrics.TOTAL_REV_QTR_GROWTH,
    Metrics.TOTAL_REV_GROWTH,
    Metrics.TOTAL_REV_CAGR_5Y,
  ],
  page: { skip: 0, limit: 10 },
};

export const fetcher = async ({
  url = "https://www.investing.com/pro/_/screener-v2/query",
  query = initialQuery,
  page = { skip: 0, limit: 10 },
}: {
  url: string;
  query?: Query;
  page?: { skip: number; limit: number };
}) => {
  const optionsQuery = { ...query, page };

  return fetch(url, {
    method: "POST",
    headers: {
      ...API_HEADERS,
      "accept-language": "en-US,en;q=0.9",
      "x-requested-with": "investing-client/0910922",
    },
    body: JSON.stringify(optionsQuery),
  }).then((res) => res.json());
};

// SWR Provider for data fetching with caching and revalidation
export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        // TODO: Add more configuration options as needed:
        // - refreshInterval for periodic revalidation
        // - dedupingInterval for request deduplication
        // - error handling and retry logic
      }}
    >
      {children}
    </SWRConfig>
  );
};

// Custom SWR hook wrapper with default options
export const useSWRFetch = (key: string) => {
  return useSWR(key, {
    // Default options for all SWR hooks
    // TODO: Add more options as needed:
    // - Custom error handling
    // - Loading states
    // - Prefetching
  });
};
