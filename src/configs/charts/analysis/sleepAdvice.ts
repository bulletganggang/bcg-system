import { AnalysisData } from "../../../types/analysis";

/**
 * 睡眠建议类型
 */
export interface SleepAdvice {
  type: "success" | "info" | "warning" | "error";
  title: string;
  content: string;
}

/**
 * 获取个性化睡眠建议
 * @param analysisData 分析数据
 * @returns 睡眠建议数组
 */
export const getSleepAdvice = (
  analysisData: AnalysisData | null
): SleepAdvice[] => {
  if (!analysisData) return [];

  const advices: SleepAdvice[] = [];

  // 睡眠评分建议
  if (analysisData.avg_sleep_score !== undefined) {
    if (analysisData.avg_sleep_score >= 90) {
      advices.push({
        type: "success",
        title: "睡眠质量优秀",
        content: "您的睡眠质量非常好，请继续保持良好的睡眠习惯。",
      });
    } else if (analysisData.avg_sleep_score >= 80) {
      advices.push({
        type: "success",
        title: "睡眠质量良好",
        content: "您的睡眠质量良好，可以尝试优化睡眠环境，进一步提高睡眠质量。",
      });
    } else if (analysisData.avg_sleep_score >= 70) {
      advices.push({
        type: "info",
        title: "睡眠质量一般",
        content:
          "您的睡眠质量一般，建议保持规律的作息时间，避免睡前使用电子设备。",
      });
    } else if (analysisData.avg_sleep_score >= 60) {
      advices.push({
        type: "warning",
        title: "睡眠质量较差",
        content:
          "您的睡眠质量较差，建议增加适量运动，避免睡前饮用咖啡、茶等含咖啡因的饮料。",
      });
    } else {
      advices.push({
        type: "error",
        title: "睡眠质量差",
        content:
          "您的睡眠质量较差，建议咨询医生或睡眠专家，了解可能的睡眠障碍问题。",
      });
    }
  }

  // 睡眠时长建议
  if (analysisData.avg_sleep_duration_time !== undefined) {
    const avgHours = analysisData.avg_sleep_duration_time / 60;

    if (avgHours < 6) {
      advices.push({
        type: "error",
        title: "睡眠时间不足",
        content: `您的平均睡眠时间为${Math.floor(avgHours)}小时${Math.round(
          (avgHours - Math.floor(avgHours)) * 60
        )}分钟，明显低于健康成人推荐的7-9小时睡眠时间，长期睡眠不足可能导致免疫力下降、注意力不集中等问题。`,
      });
    } else if (avgHours < 7) {
      advices.push({
        type: "warning",
        title: "睡眠时间略短",
        content: `您的平均睡眠时间为${Math.floor(avgHours)}小时${Math.round(
          (avgHours - Math.floor(avgHours)) * 60
        )}分钟，略低于健康成人推荐的7-9小时睡眠时间，建议适当延长睡眠时间。`,
      });
    } else if (avgHours <= 9) {
      advices.push({
        type: "success",
        title: "睡眠时间适宜",
        content: `您的平均睡眠时间为${Math.floor(avgHours)}小时${Math.round(
          (avgHours - Math.floor(avgHours)) * 60
        )}分钟，符合健康成人推荐的7-9小时睡眠时间，请继续保持。`,
      });
    } else {
      advices.push({
        type: "info",
        title: "睡眠时间较长",
        content: `您的平均睡眠时间为${Math.floor(avgHours)}小时${Math.round(
          (avgHours - Math.floor(avgHours)) * 60
        )}分钟，高于健康成人推荐的7-9小时睡眠时间，过长的睡眠时间可能与某些健康问题相关，建议咨询医生。`,
      });
    }
  }

  // 睡眠规律性建议
  if (
    analysisData.sleep_time_distribute_list &&
    analysisData.sleep_time_distribute_list.length > 3
  ) {
    // 计算入睡时间的标准差
    const sleepTimes = analysisData.sleep_time_distribute_list.map(
      ([startTime]) => {
        const date = new Date(startTime * 1000);
        return date.getHours() + date.getMinutes() / 60;
      }
    );

    // 计算平均值
    const avgSleepTime =
      sleepTimes.reduce((sum, time) => sum + time, 0) / sleepTimes.length;

    // 计算方差
    const variance =
      sleepTimes.reduce((sum, time) => {
        return sum + Math.pow(time - avgSleepTime, 2);
      }, 0) / sleepTimes.length;

    // 计算标准差
    const stdDev = Math.sqrt(variance);

    if (stdDev < 0.5) {
      advices.push({
        type: "success",
        title: "睡眠时间非常规律",
        content:
          "您的睡眠时间非常规律，这对保持良好的生物钟和睡眠质量非常有益。",
      });
    } else if (stdDev < 1) {
      advices.push({
        type: "success",
        title: "睡眠时间较为规律",
        content: "您的睡眠时间较为规律，建议继续保持这种良好的习惯。",
      });
    } else if (stdDev < 1.5) {
      advices.push({
        type: "info",
        title: "睡眠时间规律性一般",
        content:
          "您的睡眠时间规律性一般，建议尽量在固定的时间入睡和起床，包括周末。",
      });
    } else if (stdDev < 2) {
      advices.push({
        type: "warning",
        title: "睡眠时间不太规律",
        content:
          "您的睡眠时间不太规律，不规律的睡眠可能导致睡眠质量下降和日间疲劳，建议建立规律的睡眠时间表。",
      });
    } else {
      advices.push({
        type: "error",
        title: "睡眠时间非常不规律",
        content:
          "您的睡眠时间非常不规律，这可能严重影响您的睡眠质量和整体健康，建议尽快调整作息时间，建立规律的睡眠习惯。",
      });
    }
  }

  // 深睡眠比例建议
  if (
    analysisData.sleep_stage_time_list &&
    analysisData.sleep_stage_time_list.length > 0
  ) {
    // 计算平均深睡眠比例
    let totalDeepSleep = 0;
    let totalSleepTime = 0;

    analysisData.sleep_stage_time_list.forEach((item) => {
      const deepSleep = item.deep_sleep_overall_minutes;
      const totalTime =
        item.light_sleep_overall_minutes +
        item.deep_sleep_overall_minutes +
        item.rem_sleep_overall_minutes;

      totalDeepSleep += deepSleep;
      totalSleepTime += totalTime;
    });

    if (totalSleepTime > 0) {
      const deepSleepPercentage = (totalDeepSleep / totalSleepTime) * 100;

      if (deepSleepPercentage < 10) {
        advices.push({
          type: "error",
          title: "深睡眠比例过低",
          content: `您的深睡眠比例仅为${deepSleepPercentage.toFixed(
            1
          )}%，明显低于健康水平（约20-25%）。深睡眠是身体恢复和记忆巩固的重要阶段，建议改善睡眠环境，避免睡前饮酒和使用电子设备。`,
        });
      } else if (deepSleepPercentage < 15) {
        advices.push({
          type: "warning",
          title: "深睡眠比例较低",
          content: `您的深睡眠比例为${deepSleepPercentage.toFixed(
            1
          )}%，低于健康水平（约20-25%）。建议增加适量运动，但避免睡前3小时内进行剧烈运动。`,
        });
      } else if (deepSleepPercentage <= 30) {
        advices.push({
          type: "success",
          title: "深睡眠比例适宜",
          content: `您的深睡眠比例为${deepSleepPercentage.toFixed(
            1
          )}%，处于健康范围内。深睡眠对身体恢复和免疫系统非常重要，请继续保持良好的睡眠习惯。`,
        });
      } else {
        advices.push({
          type: "info",
          title: "深睡眠比例较高",
          content: `您的深睡眠比例为${deepSleepPercentage.toFixed(
            1
          )}%，高于一般水平。虽然深睡眠对身体恢复有益，但比例过高可能与某些因素如睡眠不足或剧烈运动后的恢复有关。`,
        });
      }
    }
  }

  // 如果没有生成任何建议，添加一个默认建议
  if (advices.length === 0) {
    advices.push({
      type: "info",
      title: "数据收集中",
      content:
        "我们正在收集更多的睡眠数据，以便提供更准确的个性化建议。请继续使用设备记录您的睡眠情况。",
    });
  }

  return advices;
};
