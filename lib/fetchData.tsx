"use client";

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
  page: { skip: 0, limit: 30 },
};

export const fetcher = ({
  url = "https://www.investing.com/pro/_/screener-v2/query",
  query = initialQuery,
  page = { skip: 0, limit: 30 },
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
      "accept-language": "th-TH,th;q=0.9,en;q=0.8",
      "x-requested-with": "investing-client/22c96aa",
      Referer:
        "https://www.investing.com/stock-screener?ssid=v2%24eyJrZXlzIjpbImNvbm5lY3RpdmUiLCJmaWx0ZXJzLjAuZ3QuaW5jbHVzaXZlIiwiZmlsdGVycy4wLmd0LnNjYWxlIiwiZmlsdGVycy4wLmd0LnZhbHVlIiwiZmlsdGVycy4wLm1ldHJpYyIsImxpbWl0IiwicHJlZmlsdGVycy5tYXJrZXQiLCJwcmVmaWx0ZXJzLnByaW1hcnlPbmx5Iiwic29ydC5kaXJlY3Rpb24iLCJzb3J0Lm1ldHJpYyJdLCJ2YWx1ZXMiOlsiQUxMIix0cnVlLDEsMSwiZXBzX2RpbHV0ZWRfcXRyX2dyb3d0aCIsMzAsIlVTIix0cnVlLCJERVNDIiwiYW5hbHlzdF90YXJnZXRfdXBzaWRlIl19",
    },
    body: JSON.stringify(optionsQuery),
  }).then((res) => res.json());
};
