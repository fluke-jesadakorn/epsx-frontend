export interface EpsGrowthRankingResponse {
  data: EpsGrowthData[];
  metadata: Metadata;
}

export interface EpsGrowthData {
  symbol: string;
  company_name: string;
  market_code: string;
  eps: number;
  eps_growth: number;
  rank: number;
  last_report_date: string;
}

export interface Metadata {
  skip: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
