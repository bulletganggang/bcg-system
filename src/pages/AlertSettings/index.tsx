import React, { useState } from "react";
import { Tabs, Card } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import AlertRules from "./components/AlertRules";
import AlertRecords from "./components/AlertRecords";
import styles from "./style.module.scss";

/**
 * 预警设置页面
 */
const AlertSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("1");
  const { records } = useSelector((state: RootState) => state.alert);

  // 未处理的预警记录数量
  const unprocessedCount = records.filter(
    (record) => record.status === 0
  ).length;

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: "1",
      label: "预警规则",
      children: <AlertRules />,
    },
    {
      key: "2",
      label: (
        <>
          预警记录
          {unprocessedCount > 0 && (
            <span className={styles.badgeCount}>{unprocessedCount}</span>
          )}
        </>
      ),
      children: <AlertRecords />,
    },
  ];

  return (
    <div className={styles.alertSettingsContainer}>
      <Card className={styles.alertSettingsCard} title="预警设置">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type="card"
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default AlertSettings;
