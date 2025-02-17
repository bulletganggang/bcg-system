import React from "react";
import { Card, List } from "antd";
import styles from "./style.module.scss";

interface HistoryRecord {
  timestamp: string;
  averageHeartRate: number;
  hasWarning: boolean;
}

const History: React.FC = () => {
  // 模拟历史数据
  const mockHistoryData: HistoryRecord[] = [
    {
      timestamp: "2024-12-18 19:34:27",
      averageHeartRate: 62,
      hasWarning: false,
    },
    {
      timestamp: "2024-12-13 22:10:47",
      averageHeartRate: 92,
      hasWarning: false,
    },
    {
      timestamp: "2024-12-12 20:36:20",
      averageHeartRate: 97,
      hasWarning: true,
    },
    {
      timestamp: "2024-12-11 12:15:15",
      averageHeartRate: 71,
      hasWarning: false,
    },
    {
      timestamp: "2024-12-11 04:22:59",
      averageHeartRate: 90,
      hasWarning: false,
    },
    {
      timestamp: "2024-12-09 14:53:23",
      averageHeartRate: 71,
      hasWarning: true,
    },
    {
      timestamp: "2024-12-09 07:58:29",
      averageHeartRate: 100,
      hasWarning: true,
    },
  ];

  return (
    <div>
      <Card title="历史记录">
        <List
          dataSource={mockHistoryData}
          renderItem={(item) => (
            <List.Item>
              <Card className={styles.recordCard} style={{ width: "100%" }}>
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
                      style={{ color: item.hasWarning ? "#ff4d4f" : "#000" }}
                    >
                      警报：
                    </span>
                    <span
                      className={styles.value}
                      style={{ color: item.hasWarning ? "#ff4d4f" : "#000" }}
                    >
                      {item.hasWarning ? "有" : "无"}
                    </span>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default History;
