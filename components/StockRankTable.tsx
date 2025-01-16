"use client";

import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Row } from "antd";
import type { TableColumnsType } from "antd";
import useSWR from "swr";
import { AnyObject } from "antd/es/_util/type";
import { fetcherStock } from "@/lib/fetchData";
import type { Response } from "@/types/stockFetchData";

const StockRankTable: React.FC = () => {
  const [columns, setColumns] = useState<TableColumnsType<AnyObject>>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableData, setTableData] = useState<
    { [key: string]: string | number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { data, error } = useSWR<Response>(
    ["https://www.investing.com/pro/_/screener-v2/query", currentPage, pageSize],
    ([url, page, size]: [string, number, number]) => 
      fetcherStock(url, {
        query: {
          filters: [
            {
              metric: "eps_diluted_qtr_growth",
              preset:
                "7b226b657973223a5b2267742e696e636c7573697665222c2267742e7363616c65222c2267742e76616c7565222c226d6574726963225d2c2276616c756573223a5b747275652c312c312c226570735f64696c757465645f7174725f67726f777468225d7d",
            },
          ],
          sort: { metric: "analyst_target_upside", direction: "DESC" },
          prefilters: { primaryOnly: true, market: "US" },
        },
        metrics: [
          "ticker",
          "eps_diluted_qtr_growth",
          "pe_ltm_latest",
          "eps_basic_growth",
          "total_rev_qtr_growth",
          "total_rev_growth",
          "total_rev_cagr_5y",
        ],
        page: { skip: (page - 1) * size, limit: size },
      }),
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (data?.columns && data?.rows) {
      // Set total records from API response if available
      if (data.total) {
        setTotalRecords(data.total);
      }
      
      // Create table columns from API response
      const tableColumns = data.columns.map((col, index) => ({
        title: col.label,
        dataIndex: col.metric,
        key: col.metric,
        ...(index < 2 && {
          fixed: "left" as "left" | "right" | undefined,
          width: 100,
        }),
      }));

      // Create table data from API response
      const tableData = data.rows.map((row, index) => {
        const rowData: { [key: string]: string | number } = {
          key: index,
          ticker: row.asset.ticker,
        };

        row.data.forEach((dataItem, idx) => {
          const columnMetric = data.columns?.[idx]?.metric;
          if (columnMetric) {
            rowData[columnMetric] = dataItem.value || "-";
          }
        });

        return rowData;
      });

      setColumns(tableColumns);
      setTableData(tableData);
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error || !data?.columns || !data?.rows) {
    return (
      <Alert
        message="Error"
        description={JSON.stringify(error)}
        type="error"
        showIcon
      />
    );
  }

  return (
    <Row justify={"center"} align={"middle"}>
      <Table
        style={{ width: "100%" }}
        columns={columns}
        dataSource={tableData}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          total: totalRecords,
          responsive: true,
          showSizeChanger: true,
        }}
        onChange={(pagination) => {
          setCurrentPage(pagination.current || 1);
          setPageSize(pagination.pageSize || 10);
        }}
        scroll={{
          x: "max-content",
        }}
        size="large"
      />
    </Row>
  );
};

export default StockRankTable;

// TODO: Add error handling for pagination failures
// TODO: Implement caching for paginated data
// TODO: Add loading state for pagination changes
// TODO: Consider adding a debounce for rapid page changes
