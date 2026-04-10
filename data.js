/**
 * data.js - YourRank 数据文件
 * 包含各省高考难度、学历分布、收入分布等基础数据
 */

// ============================================================
// 省份数据：高考难度评分 (1-100，越高表示该省考生竞争越激烈)
// 基于：录取率、人均教育资源、省内竞争激烈程度综合评估
// ============================================================
const PROVINCE_DATA = [
  { name: "北京", icon: "🏙️", score: 30, label: "容易", desc: "本地录取率极高" },
  { name: "上海", icon: "🌆", score: 32, label: "容易", desc: "本地录取优势明显" },
  { name: "天津", icon: "🏭", score: 38, label: "较易", desc: "录取分数线较低" },
  { name: "重庆", icon: "🌉", score: 65, label: "中等", desc: "竞争较为激烈" },
  { name: "河南", icon: "🏯", score: 98, label: "地狱", desc: "全国最难省份之一" },
  { name: "山东", icon: "⛰️", score: 95, label: "极难", desc: "高考人数全国最多" },
  { name: "河北", icon: "🏔️", score: 93, label: "极难", desc: "竞争异常激烈" },
  { name: "广东", icon: "🌴", score: 78, label: "较难", desc: "人口大省竞争激烈" },
  { name: "江苏", icon: "🌾", score: 85, label: "难", desc: "历来高考大省" },
  { name: "浙江", icon: "🍵", score: 72, label: "较难", desc: "竞争激烈教育强省" },
  { name: "湖南", icon: "🌶️", score: 88, label: "难", desc: "竞争激烈" },
  { name: "湖北", icon: "🦜", score: 86, label: "难", desc: "教育强省" },
  { name: "四川", icon: "🐼", score: 83, label: "难", desc: "人口大省" },
  { name: "安徽", icon: "🎋", score: 87, label: "难", desc: "高考竞争激烈" },
  { name: "江西", icon: "🌿", score: 85, label: "难", desc: "高考大省" },
  { name: "福建", icon: "🌊", score: 70, label: "较难", desc: "竞争较为激烈" },
  { name: "山西", icon: "🏛️", score: 80, label: "难", desc: "竞争激烈" },
  { name: "陕西", icon: "🏺", score: 78, label: "较难", desc: "有高校资源优势" },
  { name: "辽宁", icon: "❄️", score: 65, label: "中等", desc: "东北教育强省" },
  { name: "吉林", icon: "🌨️", score: 60, label: "中等", desc: "竞争相对适中" },
  { name: "黑龙江", icon: "🎿", score: 58, label: "中等", desc: "人口减少竞争降低" },
  { name: "内蒙古", icon: "🐎", score: 52, label: "中等", desc: "地广人稀录取率高" },
  { name: "广西", icon: "🎑", score: 75, label: "较难", desc: "竞争较为激烈" },
  { name: "贵州", icon: "🌧️", score: 72, label: "较难", desc: "教育资源相对匮乏" },
  { name: "云南", icon: "🌸", score: 68, label: "中等", desc: "录取率逐年改善" },
  { name: "甘肃", icon: "🌵", score: 70, label: "较难", desc: "教育资源有限" },
  { name: "新疆", icon: "🕌", score: 48, label: "较易", desc: "少数民族加分政策" },
  { name: "西藏", icon: "🏔️", score: 35, label: "容易", desc: "录取分数线最低" },
  { name: "青海", icon: "🦌", score: 42, label: "较易", desc: "人口少竞争小" },
  { name: "宁夏", icon: "🌙", score: 45, label: "较易", desc: "录取率较高" },
  { name: "海南", icon: "🏝️", score: 40, label: "较易", desc: "录取优惠政策多" },
  { name: "北京", icon: "🏙️", score: 30, label: "容易", desc: "已列出" },
];

// 去重
const PROVINCES = [
  { name: "北京", icon: "🏙️", score: 30, label: "容易" },
  { name: "上海", icon: "🌆", score: 32, label: "容易" },
  { name: "天津", icon: "🏭", score: 38, label: "较易" },
  { name: "重庆", icon: "🌉", score: 65, label: "中等" },
  { name: "河南", icon: "🏯", score: 98, label: "地狱" },
  { name: "山东", icon: "⛰️", score: 95, label: "极难" },
  { name: "河北", icon: "🏔️", score: 93, label: "极难" },
  { name: "广东", icon: "🌴", score: 78, label: "较难" },
  { name: "江苏", icon: "🌾", score: 85, label: "难" },
  { name: "浙江", icon: "🍵", score: 72, label: "较难" },
  { name: "湖南", icon: "🌶️", score: 88, label: "难" },
  { name: "湖北", icon: "🦜", score: 86, label: "难" },
  { name: "四川", icon: "🐼", score: 83, label: "难" },
  { name: "安徽", icon: "🎋", score: 87, label: "难" },
  { name: "江西", icon: "🌿", score: 85, label: "难" },
  { name: "福建", icon: "🌊", score: 70, label: "较难" },
  { name: "山西", icon: "🏛️", score: 80, label: "难" },
  { name: "陕西", icon: "🏺", score: 78, label: "较难" },
  { name: "辽宁", icon: "❄️", score: 65, label: "中等" },
  { name: "吉林", icon: "🌨️", score: 60, label: "中等" },
  { name: "黑龙江", icon: "🎿", score: 58, label: "中等" },
  { name: "内蒙古", icon: "🐎", score: 52, label: "中等" },
  { name: "广西", icon: "🎑", score: 75, label: "较难" },
  { name: "贵州", icon: "🌧️", score: 72, label: "较难" },
  { name: "云南", icon: "🌸", score: 68, label: "中等" },
  { name: "甘肃", icon: "🌵", score: 70, label: "较难" },
  { name: "新疆", icon: "🕌", score: 48, label: "较易" },
  { name: "西藏", icon: "🏔️", score: 35, label: "容易" },
  { name: "青海", icon: "🦌", score: 42, label: "较易" },
  { name: "宁夏", icon: "🌙", score: 45, label: "较易" },
  { name: "海南", icon: "🏝️", score: 40, label: "较易" },
  { name: "河南", icon: "🏯", score: 98, label: "地狱" },
];

// 最终省份列表（去重排序）
const PROVINCE_LIST = [
  { name: "北京", icon: "🏙️", score: 30, label: "容易" },
  { name: "上海", icon: "🌆", score: 32, label: "容易" },
  { name: "天津", icon: "🏭", score: 38, label: "较易" },
  { name: "重庆", icon: "🌉", score: 65, label: "中等" },
  { name: "河南", icon: "🏯", score: 98, label: "地狱" },
  { name: "山东", icon: "⛰️", score: 95, label: "极难" },
  { name: "河北", icon: "🏔️", score: 93, label: "极难" },
  { name: "广东", icon: "🌴", score: 78, label: "较难" },
  { name: "江苏", icon: "🌾", score: 85, label: "难" },
  { name: "浙江", icon: "🍵", score: 72, label: "较难" },
  { name: "湖南", icon: "🌶️", score: 88, label: "难" },
  { name: "湖北", icon: "🦜", score: 86, label: "难" },
  { name: "四川", icon: "🐼", score: 83, label: "难" },
  { name: "安徽", icon: "🎋", score: 87, label: "难" },
  { name: "江西", icon: "🌿", score: 85, label: "难" },
  { name: "福建", icon: "🌊", score: 70, label: "较难" },
  { name: "山西", icon: "🏛️", score: 80, label: "难" },
  { name: "陕西", icon: "🏺", score: 78, label: "较难" },
  { name: "辽宁", icon: "❄️", score: 65, label: "中等" },
  { name: "吉林", icon: "🌨️", score: 60, label: "中等" },
  { name: "黑龙江", icon: "🎿", score: 58, label: "中等" },
  { name: "内蒙古", icon: "🐎", score: 52, label: "中等" },
  { name: "广西", icon: "🎑", score: 75, label: "较难" },
  { name: "贵州", icon: "🌧️", score: 72, label: "较难" },
  { name: "云南", icon: "🌸", score: 68, label: "中等" },
  { name: "甘肃", icon: "🌵", score: 70, label: "较难" },
  { name: "新疆", icon: "🕌", score: 48, label: "较易" },
  { name: "西藏", icon: "🏔️", score: 35, label: "容易" },
  { name: "青海", icon: "🦌", score: 42, label: "较易" },
  { name: "宁夏", icon: "🌙", score: 45, label: "较易" },
  { name: "海南", icon: "🏝️", score: 40, label: "较易" },
];

// ============================================================
// 排名算法权重配置
// 基于各因素对综合社会竞争力的影响程度
// ============================================================
const WEIGHTS = {
  gaokao:  0.12,  // 高考省份难度：12%
  edu1:    0.18,  // 第一学历：18%
  edu2:    0.10,  // 第二学历：10%
  work:    0.20,  // 工作单位：20%
  salary:  0.22,  // 月收入：22%
  saving:  0.12,  // 存款：12%
  asset:   0.06,  // 车房资产：6%
};

// ============================================================
// 各省份中考生人口百分比（用于估算高考优势转化率）
// ============================================================
const GAOKAO_POPULATION_RATIO = {
  "河南": 0.079, "山东": 0.075, "广东": 0.070, "四川": 0.062,
  "江苏": 0.059, "湖南": 0.048, "湖北": 0.043, "安徽": 0.046,
  "河北": 0.053, "江西": 0.034, "浙江": 0.040, "广西": 0.033,
  "陕西": 0.027, "山西": 0.026, "云南": 0.030, "贵州": 0.027,
  "福建": 0.026, "黑龙江": 0.022, "辽宁": 0.024, "内蒙古": 0.018,
  "甘肃": 0.019, "吉林": 0.018, "重庆": 0.022, "新疆": 0.015,
  "北京": 0.014, "上海": 0.014, "天津": 0.010, "宁夏": 0.006,
  "青海": 0.004, "海南": 0.006, "西藏": 0.002,
};

// ============================================================
// 排名描述语
// ============================================================
const RANK_DESCRIPTIONS = {
  top1:   { emoji: "🚀", title: "顶尖精英", desc: "你处于全中国前1%！这是极少数人能达到的高度，无论学历、工作、收入还是资产，你都站在社会金字塔的塔尖。" },
  top5:   { emoji: "💎", title: "社会精英", desc: "恭喜！你位居全国前5%，是绝对的社会精英阶层。你的综合竞争力远超绝大多数人。" },
  top10:  { emoji: "🏆", title: "优秀人才", desc: "你跻身全国前10%，属于优秀人才群体。在各个维度上你都有突出表现，是同龄人中的佼佼者。" },
  top20:  { emoji: "⭐", title: "中上层次", desc: "你位于全国前20%，超越了80%的中国人。你在学历、工作或收入上有显著优势，继续加油！" },
  top30:  { emoji: "📈", title: "良好水平", desc: "你处于全国前30%，属于中等偏上水平。你有不错的基础，进一步提升收入和资产积累是下一步目标。" },
  top50:  { emoji: "🌱", title: "中等水平", desc: "你处于全国中等水平（前50%），恰好是中位数附近。中国还有一半的人在你之后，继续努力！" },
  top70:  { emoji: "💪", title: "继续奋斗", desc: "你目前处于中等偏下水平，但不用气馁！中国农村和低收入人口众多，前70%已经超越很多人了。" },
  other:  { emoji: "🌟", title: "潜力无限", desc: "每个人都有自己的人生轨迹，排名只是参考。重要的是找到自己的方向，持续成长。" },
};

// ============================================================
// 工资分布数据（税后月收入，中国劳动力市场）
// 数据来源：国家统计局、智联招聘等公开报告综合估算
// ============================================================
const SALARY_DISTRIBUTION = {
  "无收入":    { percentile: 5,  population: "约1.5亿学生/待业人员" },
  "3000以下":  { percentile: 20, population: "约3.5亿农村及低收入劳动者" },
  "3000-5000": { percentile: 45, population: "约2.8亿基层劳动者" },
  "5000-1万":  { percentile: 68, population: "约1.8亿城镇普通白领" },
  "1-2万":     { percentile: 85, population: "约6000万中产阶级" },
  "2-3万":     { percentile: 93, population: "约2500万高收入人群" },
  "3-5万":     { percentile: 97, population: "约800万精英人群" },
  "5万+":      { percentile: 99, population: "约200万顶尖收入人群" },
};

// ============================================================
// 存款分布数据（个人名下流动资产）
// 数据来源：央行报告、招行私行报告综合估算
// ============================================================
const SAVING_DISTRIBUTION = {
  "负债":      { percentile: 10, note: "净负债状态" },
  "1万以下":   { percentile: 35, note: "月光族/无储蓄习惯" },
  "1-10万":    { percentile: 60, note: "初步积累阶段" },
  "10-20万":   { percentile: 78, note: "有一定储蓄" },
  "20-50万":   { percentile: 88, note: "小康积累" },
  "50-100万":  { percentile: 94, note: "较好的财富积累" },
  "100-500万": { percentile: 98, note: "高资产人群" },
  "500万+":    { percentile: 99.5, note: "高净值人群（HNWI）" },
};
