"use server";

/**
 * This file contains server actions for stock data fetching.
 * The "use server" directive is placed at the top of the file to ensure all exports
 * are treated as server actions when imported by client components.
 *
 * Future Considerations:
 * - Add request caching for improved performance
 * - Implement rate limiting for API requests
 * - Add error handling middleware
 * - Add request validation
 * - Implement data transformation utilities
 * - Add response compression
 * - Consider implementing GraphQL for more flexible data fetching
 * - Add metrics and monitoring for API calls
 * - Implement circuit breaker pattern for API failures
 * - Add request retries with exponential backoff
 */

// Types for EPS Growth Ranking
interface EpsGrowthData {
  current: {
    symbol: string;
    companyName: string;
    eps: number;
    epsGrowthPercent: number;
    reportDate: string;
  };
  previous: {
    symbol: string;
    companyName: string;
    eps: number;
    epsGrowthPercent: number;
    reportDate: string;
  };
}

export async function fetchEpsGrowthRanking({
  limit = 10,
  skip = 0,
}: {
  limit?: number;
  skip?: number;
}): Promise<{ data: EpsGrowthData[]; total: number }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error(
      "NEXT_PUBLIC_API_URL is not defined in environment variables"
    );
    return { data: [], total: 0 };
  }

  try {
    const response = await fetch(
      `${baseUrl}/financial/eps-growth-ranking?limit=${limit}&skip=${skip}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!data || typeof data !== "object") {
      console.error("API returned invalid data:", data);
      return { data: [], total: 0 };
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch EPS growth ranking:", error);
    return { data: [], total: 0 };
  }
}

// Types for Stock Ranking
export interface StockRankingData {
  columns: Array<{
    label: string;
    metric: string;
  }>;
  rows: Array<{
    asset: {
      ticker: string;
    };
    data: Array<{
      value: string | number;
    }>;
  }>;
  page: {
    total: number;
    current: number;
    size: number;
  };
}

// Fetch stock ranking data
export async function fetchStockRanking({
  limit = 10,
  skip = 0,
}: {
  limit?: number;
  skip?: number;
}): Promise<StockRankingData> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error(
      "NEXT_PUBLIC_API_URL is not defined in environment variables"
    );
    return {
      columns: [],
      rows: [],
      page: {
        total: 0,
        current: 1,
        size: limit,
      },
    };
  }

  try {
    const response = await fetch(
      `${baseUrl}/financial/eps-growth-ranking?limit=${limit}&skip=${skip}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();

    // Transform the data to match our interface
    const transformedData: StockRankingData = {
      columns: rawData.columns.map((col: any) => ({
        label: col.name || col.label,
        metric: col.id || col.metric,
      })),
      rows: rawData.rows.map((row: any) => ({
        asset: {
          ticker: row.symbol || row.ticker,
        },
        data: Object.entries(row).map(([_, value]) => ({
          value: value,
        })),
      })),
      page: {
        total: rawData.page?.total || rawData.total || 0,
        current: rawData.page?.current || skip / limit + 1,
        size: rawData.page?.size || limit,
      },
    };

    return transformedData;
  } catch (error) {
    console.error("Failed to fetch stock ranking:", error);
    return {
      columns: [],
      rows: [],
      page: {
        total: 0,
        current: 1,
        size: limit,
      },
    };
  }
}
