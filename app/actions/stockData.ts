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

import { EpsGrowthRankingResponse, EpsGrowthData } from "@/types/epsGrowthRanking";

/**
 * Fetches EPS growth ranking data from the API
 *
 * @param params - Query parameters for pagination
 * @param params.limit - Number of records to return (default: 20)
 * @param params.skip - Number of records to skip (default: 0)
 *
 * Future Considerations:
 * - Add market filter support (e.g., filter by TYO, BOM, OTC)
 * - Add date range filter for last_report_date
 * - Add minimum/maximum EPS filter
 * - Add sorting options (e.g., by eps, eps_growth, company_name)
 * - Add company search functionality
 * - Implement data caching with configurable TTL
 * - Add market cap and sector filters
 * - Consider adding data export functionality (CSV, Excel)
 *
 * @returns Promise<EpsGrowthRankingResponse>
 */
export async function fetchEpsGrowthRanking({
  limit = 3,
  skip = 0,
}: {
  limit?: number;
  skip?: number;
}): Promise<EpsGrowthRankingResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined in environment variables"
    );
  }

  try {
    const response = await fetch(
      `${baseUrl}/financial/eps-growth-ranking?limit=${limit}&skip=${skip}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
          "X-Source": "Cloudflare-Workers",
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate response structure and data
    if (!data?.data || !Array.isArray(data.data)) {
      throw new Error("Invalid API response structure: missing or invalid data array");
    }

    if (!data?.metadata) {
      console.warn("Missing metadata in API response, using default values");
      data.metadata = {
        skip,
        total: data.data.length,
        page: 1,
        limit,
        totalPages: Math.ceil(data.data.length / limit),
      };
    }

    // Validate each item in the data array
    const validatedData = data.data.filter((item: unknown): item is EpsGrowthData => 
      item !== null &&
      typeof item === 'object' &&
      'symbol' in item &&
      'company_name' in item &&
      typeof (item as EpsGrowthData).symbol === 'string' &&
      typeof (item as EpsGrowthData).company_name === 'string'
    );

    return {
      data: validatedData,
      metadata: {
        skip: data.metadata.skip ?? skip,
        total: data.metadata.total ?? validatedData.length,
        page: data.metadata.page ?? 1,
        limit: data.metadata.limit ?? limit,
        totalPages: data.metadata.totalPages ?? Math.ceil(validatedData.length / limit),
      }
    } as EpsGrowthRankingResponse;
  } catch (error) {
    console.error("Failed to fetch EPS growth ranking:", error);
    return {
      data: [],
      metadata: {
        skip,
        total: 0,
        page: 1,
        limit,
        totalPages: 0,
      },
    };
  }
}
