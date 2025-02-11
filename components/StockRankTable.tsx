"use client";

import { AnyObject } from "antd/es/_util/type";
import { Table, Alert, Row, Skeleton, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import React, { useState, useCallback } from "react";
import { fetchEpsGrowthRanking } from "@/app/actions/stockData";
import { EpsGrowthRankingResponse } from "@/types/epsGrowthRanking";

interface StockRankTableProps {
  style?: React.CSSProperties;
  role?: "public" | "free" | "admin";
}

const StockRankTable: React.FC<StockRankTableProps> = ({
  style,
  role = "public",
}) => {
  const [columns, setColumns] = useState<TableColumnsType<AnyObject>>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableData, setTableData] = useState<
    { [key: string]: string | number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<EpsGrowthRankingResponse | null>(null);

  // Convert API data to table format
  const processTableData = useCallback((apiData: EpsGrowthRankingResponse) => {
    return apiData.data.map((item, index) => ({
      key: index,
      symbol: item.symbol,
      companyName: item.company_name,
      currentEps: item.eps.toFixed(2),
      epsGrowth: item.eps_growth.toFixed(2),
      reportDate: new Date(item.last_report_date).toLocaleDateString(),
      market: item.market_code,
    }));
  }, []);

  // Create table columns
  const createColumns = useCallback(() => {
    const baseColumns = [
      {
        title: <Tooltip title="Stock symbol">Symbol</Tooltip>,
        dataIndex: "symbol",
        key: "symbol",
        width: 100,
      },
      {
        title: (
          <Tooltip title="Full registered name of the company">
            Company Name
          </Tooltip>
        ),
        dataIndex: "companyName",
        key: "companyName",
        width: 200,
      },
      {
        title: (
          <Tooltip title="Latest reported Earnings Per Share">
            Current EPS
          </Tooltip>
        ),
        dataIndex: "currentEps",
        key: "currentEps",
        width: 120,
        sorter: (a: any, b: any) =>
          parseFloat(a.currentEps) - parseFloat(b.currentEps),
      },
      {
        title: <Tooltip title="Stock market code">Market</Tooltip>,
        dataIndex: "market",
        key: "market",
        width: 100,
      },
      {
        title: (
          <Tooltip title="Percentage change in EPS from previous to current period">
            EPS Growth (%)
          </Tooltip>
        ),
        dataIndex: "epsGrowth",
        key: "epsGrowth",
        width: 150,
        sorter: (a: any, b: any) =>
          parseFloat(a.epsGrowth) - parseFloat(b.epsGrowth),
        render: (value: string) => {
          const numValue = parseFloat(value);
          return (
            <span style={{ color: numValue >= 0 ? "#52c41a" : "#f5222d" }}>
              {numValue >= 0 ? "+" : ""}
              {value}%
            </span>
          );
        },
      },
      {
        title: (
          <Tooltip title="Date of latest earnings report">Report Date</Tooltip>
        ),
        dataIndex: "reportDate",
        key: "reportDate",
        width: 120,
      },
    ];

    const rowNumberColumn = {
      title: "No.",
      dataIndex: "rowNumber",
      key: "rowNumber",
      width: 50,
      fixed: "left" as const,
      render: (_: string, __: any, index: number) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    };

    return [rowNumberColumn, ...baseColumns];
  }, [currentPage, pageSize]);

  // Function to fetch data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchEpsGrowthRanking({
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
      });

      setData(response);
      const processedData = processTableData(response);
      setColumns(createColumns());
      setTableData(processedData);
      setTotalRecords(response.metadata.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch data"));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, processTableData, createColumns]);

  // Initial data fetch and setup pagination changes
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading && !data) {
    return (
      <div
        style={{
          minHeight: 500,
          width: "100%",
          background: "var(--background-color)",
          borderRadius: 8,
          padding: 24,
        }}
      >
        <Skeleton active paragraph={{ rows: 10 }} title={false} />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <Alert
        message="Error Loading Data"
        description={error?.message || "Failed to load stock data"}
        type="error"
        showIcon
      />
    );
  }

  return (
    <Row justify="center" align="middle" style={{ width: "100%", ...style }}>
      <div className="scroll-container">
        <Table
          style={{ width: "100%" }}
          columns={columns}
          dataSource={tableData}
          loading={isLoading}
          pagination={{
            pageSize,
            current: currentPage,
            total: totalRecords,
            responsive: true,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          scroll={{
            x: "max-content",
            y: 500,
            scrollToFirstRowOnChange: true,
          }}
          size="large"
        />
      </div>
    </Row>
  );
};

export default StockRankTable;

// TODO: Future features:
// - Add more advanced filtering options (by date range, EPS threshold, growth percentage)
// - Add column customization with saveable presets
// - Add export functionality (CSV, Excel with calculated metrics)
// - Add data visualization options (growth trends, comparative charts)
// - Add real-time updates with websocket connection
// - Add sorting indicators with multi-column sort support
// - Add column resizing and reordering
// - Add row selection for multi-stock comparison
// - Add favorites/watchlist feature with email alerts
// - Add historical data comparison with quarterly/yearly views
// - Add conditional formatting for significant EPS changes
// - Implement caching for paginated data
// - Consider adding a debounce for rapid page changes
// - Add validation for pagination parameters
// - Implement persistent user preferences (page size, column order, sorting)
// - Add role-based access control for advanced features
// - Add tooltip explanations for metrics
// - Add performance indicators (green/red) for growth metrics
// - Consider adding "average sector EPS" comparison
// - Add YoY and QoQ growth rate calculations
