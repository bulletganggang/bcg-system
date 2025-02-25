import React, { useState, useEffect } from "react";
import { Card, List, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./style.module.scss";

interface HistoryRecord {
  timestamp: string;
  averageHeartRate: number;
  hasWarning: boolean;
}

// 模拟数据库中的数据
const mockDatabase: HistoryRecord[] = (() => {
  const mockData: HistoryRecord[] = [];
  const startDate = dayjs("2024-12-01");

  // 生成30天的数据，每天3-4条记录
  for (let i = 0; i < 30; i++) {
    const currentDate = startDate.add(i, "day");
    const recordsCount = 3 + Math.floor(Math.random() * 2); // 每天3-4条记录

    for (let j = 0; j < recordsCount; j++) {
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const heartRate = 60 + Math.floor(Math.random() * 41); // 60-100之间的心率
      const hasWarning = heartRate > 90; // 心率超过90就标记为警告

      mockData.push({
        timestamp: currentDate
          .hour(hour)
          .minute(minute)
          .format("YYYY-MM-DD HH:mm:00"),
        averageHeartRate: heartRate,
        hasWarning,
      });
    }
  }

  // 按时间戳降序排序
  return mockData.sort(
    (a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf()
  );
})();

// 模拟API请求函数
const fetchHistoryData = async (page: number, pageSize: number) => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // 返回分页数据和总记录数
  return {
    records: mockDatabase.slice(startIndex, endIndex),
    total: mockDatabase.length,
  };
};

const History: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 加载历史数据
  const loadHistoryData = async (page: number, size: number) => {
    try {
      setLoading(true);
      const { records, total } = await fetchHistoryData(page, size);
      setHistoryData(records);
      setTotal(total);
    } catch (error) {
      console.error("加载历史数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 首次加载和分页参数变化时获取数据
  useEffect(() => {
    loadHistoryData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // 处理记录点击
  const handleRecordClick = (timestamp: string) => {
    // 从时间戳中提取日期（YYYY-MM-DD格式）
    const date = dayjs(timestamp).format("YYYY-MM-DD");
    // 跳转到睡眠数据页面，并携带日期参数
    navigate(`/sleep?date=${date}`);
  };

  // 处理页码变化
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };

  return (
    <div>
      <Card title="历史记录" loading={loading}>
        {!loading && historyData.length > 0 && (
          <>
            <List
              dataSource={historyData}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    className={styles.recordCard}
                    onClick={() => handleRecordClick(item.timestamp)}
                    hoverable
                  >
                    <div className={styles.timestamp}>{item.timestamp}</div>
                    <div className={styles.dataRow}>
                      <div className={styles.heartRate}>
                        <span className={styles.label}>平均心率：</span>
                        <span className={styles.value}>
                          {item.averageHeartRate}
                        </span>
                      </div>
                      <div className={styles.warning}>
                        <span
                          className={styles.label}
                          style={{
                            color: item.hasWarning ? "#ff4d4f" : "#000",
                          }}
                        >
                          警报：
                        </span>
                        <span
                          className={styles.value}
                          style={{
                            color: item.hasWarning ? "#ff4d4f" : "#000",
                          }}
                        >
                          {item.hasWarning ? "有" : "无"}
                        </span>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
            <div className={styles.pagination}>
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
                showTotal={(total) => `共 ${total} 条记录`}
                showSizeChanger={true}
                pageSizeOptions={[10, 20, 50]}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default History;
