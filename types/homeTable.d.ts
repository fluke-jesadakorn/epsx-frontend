interface Column {
  metric: string;
  label: string;
  description: string;
  format: string;
  sortable: boolean;
}

interface Data {
  hidden: boolean;
  value: string | null;
  raw: number | null;
  sentiment: number | null;
}

interface Asset {
  hidden: boolean;
  uid: string;
  pairID: number;
  ticker: string;
  name: string;
  primary: string;
  path: string;
  logo: string;
  logoDark: string;
  sector: string;
}

interface Row {
  asset: Asset;
  data: Data[];
}

interface Response {
  page: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    pageSize: number;
    totalItems: number;
  };
  rows: Row[];
  columns: Column[];
  ssid: string;
  allowCustom: boolean;
  currency: string;
}
