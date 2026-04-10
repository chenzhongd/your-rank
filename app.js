/**
 * app.js - YourRank 核心逻辑
 * 表单交互 + 排名计算算法
 */

// ============================================================
// 状态管理
// ============================================================
const state = {
  currentStep: 1,
  totalSteps: 5,
  selections: {
    province: null,     // { name, score }
    skipGaokao: false,
    eduCategory: null,  // 'overseas' | 'domestic' | null (仅未参加高考时使用)
    edu1: null,         // { value, score }
    edu2: null,         // { value, score }
    work: null,         // { value, score }
    salary: null,       // { value, score }
    saving: null,       // { value, score }
    hasHouse: false,
    hasCar: false,
    hasMultiHouse: false,
  }
};

// ============================================================
// 初始化
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  buildProvinceGrid();
  initProvinceSearch();
  bindOptionCards();
  bindCheckboxes();
});

// 构建省份网格
function buildProvinceGrid() {
  const grid = document.getElementById('provinceGrid');
  if (!grid) return;

  PROVINCE_LIST.forEach(p => {
    const card = document.createElement('div');
    card.className = 'option-card province-card';
    card.dataset.group = 'province';
    card.dataset.value = p.name;
    card.dataset.score = p.score;

    const difficultyColor = getDifficultyColor(p.label);
    card.innerHTML = `
      <div class="opt-icon">${p.icon}</div>
      <div class="opt-label">${p.name}</div>
      <div class="opt-sub" style="color:${difficultyColor};font-weight:600;">${p.label}</div>
    `;
    grid.appendChild(card);
  });

  // 绑定省份卡片事件
  grid.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => handleOptionSelect(card));
  });
}

// 省份搜索过滤
function initProvinceSearch() {
  const input = document.getElementById('provinceSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    const query = input.value.trim();
    document.querySelectorAll('#provinceGrid .option-card').forEach(card => {
      const name = card.dataset.value || '';
      card.style.display = name.includes(query) ? '' : 'none';
    });
  });
}

function getDifficultyColor(label) {
  const map = {
    "容易": "#43e97b",
    "较易": "#38f9d7",
    "中等": "#f9c74f",
    "较难": "#f97316",
    "难":   "#ef4444",
    "极难": "#dc2626",
    "地狱": "#7c3aed",
  };
  return map[label] || "#718096";
}

// 绑定选项卡片点击
function bindOptionCards() {
  document.querySelectorAll('.option-card:not(.province-card)').forEach(card => {
    card.addEventListener('click', () => handleOptionSelect(card));
  });
}

// 绑定复选框
function bindCheckboxes() {
  const skipGaokao = document.getElementById('skipGaokao');
  if (skipGaokao) {
    skipGaokao.addEventListener('change', (e) => {
      state.selections.skipGaokao = e.target.checked;
      // 切换路径时清除教育相关选择
      state.selections.edu1 = null;
      state.selections.edu2 = null;
      state.selections.eduCategory = null;
      document.querySelectorAll('.option-card[data-group="edu1"], .option-card[data-group="edu2"]')
        .forEach(c => c.classList.remove('selected'));
      ['catOverseas', 'catDomestic'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('selected');
      });
      ['overseasSection', 'domesticSection'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
      const grid = document.getElementById('provinceGrid');
      if (e.target.checked) {
        grid.style.opacity = '0.4';
        grid.style.pointerEvents = 'none';
        state.selections.province = { name: '未参加高考', score: 0 };
      } else {
        grid.style.opacity = '1';
        grid.style.pointerEvents = '';
        state.selections.province = null;
      }
    });
  }

  ['hasHouse', 'hasCar', 'hasMultiHouse'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        state.selections[id] = e.target.checked;
      });
    }
  });
}

// 处理选项点击
function handleOptionSelect(card) {
  const group = card.dataset.group;

  // 同组取消选中
  document.querySelectorAll(`.option-card[data-group="${group}"]`).forEach(c => {
    c.classList.remove('selected');
  });

  card.classList.add('selected');

  // 更新状态
  const val = card.dataset.value;
  const score = parseFloat(card.dataset.score);

  if (group === 'province') {
    state.selections.province = { name: val, score };
  } else if (group === 'edu1') {
    state.selections.edu1 = { value: val, score };
  } else if (group === 'edu2') {
    state.selections.edu2 = { value: val, score };
  } else if (group === 'work') {
    state.selections.work = { value: val, score };
  } else if (group === 'salary') {
    state.selections.salary = { value: val, score };
  } else if (group === 'saving') {
    state.selections.saving = { value: val, score };
  }
}

// ============================================================
// 步骤导航
// ============================================================
function nextStep(current) {
  // 验证当前步骤
  const valid = validateStep(current);
  if (!valid.ok) {
    showError(current, valid.msg);
    return;
  }

  hideError(current);
  goToStep(current + 1);
}

function prevStep(current) {
  goToStep(current - 1);
}

function goToStep(target) {
  // 隐藏当前步骤
  document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));

  if (target <= state.totalSteps) {
    document.getElementById(`step${target}`).classList.add('active');
  } else {
    document.getElementById('stepResult').classList.add('active');
  }

  state.currentStep = target;
  updateStepsBar(target);

  // 切换到步骤2时更新教育路径视图
  if (target === 2) updateStep2View();

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 更新步骤进度条
function updateStepsBar(current) {
  document.querySelectorAll('.step').forEach(step => {
    const n = parseInt(step.dataset.step);
    step.classList.remove('active', 'done');
    if (n < current) step.classList.add('done');
    else if (n === current) step.classList.add('active');
  });

  document.querySelectorAll('.step-line').forEach((line, idx) => {
    line.classList.toggle('done', idx < current - 1);
  });
}

// 验证步骤
function validateStep(step) {
  switch(step) {
    case 1:
      if (!state.selections.province && !state.selections.skipGaokao) {
        return { ok: false, msg: '请选择你的高考省份，或勾选「未参加高考」' };
      }
      return { ok: true };
    case 2:
      if (state.selections.skipGaokao) {
        if (!state.selections.eduCategory)
          return { ok: false, msg: '请选择教育类型：海外留学 或 国内其他' };
        if (!state.selections.edu1)
          return { ok: false, msg: state.selections.eduCategory === 'overseas'
            ? '请选择留学国家 / 地区'
            : '请选择具体教育情况' };
        if (state.selections.eduCategory === 'overseas' && !state.selections.edu2)
          return { ok: false, msg: '请选择留学层次（本科 / 硕士 / 博士等）' };
      } else {
        if (!state.selections.edu1) return { ok: false, msg: '请选择高考录取院校类型' };
        if (!state.selections.edu2) return { ok: false, msg: '请选择是否继续深造（无则选「无研究生学历」）' };
      }
      return { ok: true };
    case 3:
      if (!state.selections.work) return { ok: false, msg: '请选择你的工作单位类型' };
      return { ok: true };
    case 4:
      if (!state.selections.salary) return { ok: false, msg: '请选择你的月收入范围' };
      return { ok: true };
    case 5:
      if (!state.selections.saving) return { ok: false, msg: '请选择你的存款范围' };
      return { ok: true };
    default:
      return { ok: true };
  }
}

// 显示/隐藏错误提示
function showError(step, msg) {
  const card = document.getElementById(`step${step}`);
  let toast = card.querySelector('.error-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'error-toast';
    card.querySelector('.card-actions').before(toast);
  }
  toast.textContent = '⚠️ ' + msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3500);
}

function hideError(step) {
  const card = document.getElementById(`step${step}`);
  const toast = card.querySelector('.error-toast');
  if (toast) toast.style.display = 'none';
}

// ============================================================
// 步骤2 视图切换
// ============================================================
function updateStep2View() {
  const isSkip = state.selections.skipGaokao;
  const gaokaoEl = document.getElementById('step2-gaokao');
  const nogaokaoEl = document.getElementById('step2-nogaokao');
  if (gaokaoEl) gaokaoEl.style.display = isSkip ? 'none' : 'block';
  if (nogaokaoEl) nogaokaoEl.style.display = isSkip ? 'block' : 'none';
}

// 选择未参加高考时的教育大类（海外 / 国内）
function selectEduCategory(type) {
  state.selections.eduCategory = type;
  // 切换大类时清除子选项
  state.selections.edu1 = null;
  state.selections.edu2 = null;
  document.querySelectorAll(
    '#overseasCountryGrid .option-card, #overseasLevelGrid .option-card, #domesticGrid .option-card'
  ).forEach(c => c.classList.remove('selected'));
  // 更新大类卡片高亮
  const catOverseas = document.getElementById('catOverseas');
  const catDomestic = document.getElementById('catDomestic');
  if (catOverseas) catOverseas.classList.toggle('selected', type === 'overseas');
  if (catDomestic) catDomestic.classList.toggle('selected', type === 'domestic');
  // 显示 / 隐藏子区域
  const overseasSection = document.getElementById('overseasSection');
  const domesticSection = document.getElementById('domesticSection');
  if (overseasSection) overseasSection.style.display = type === 'overseas' ? 'block' : 'none';
  if (domesticSection) domesticSection.style.display = type === 'domestic' ? 'block' : 'none';
}

// ============================================================
// 核心排名计算算法
// ============================================================
function calculateRank() {
  // 验证最后一步
  const valid = validateStep(5);
  if (!valid.ok) {
    showError(5, valid.msg);
    return;
  }

  const s = state.selections;

  // 1. 高考得分 (0-100)
  let gaokaoScore = 0;
  if (s.skipGaokao) {
    gaokaoScore = 15; // 未参加高考，给基础分
  } else if (s.province) {
    gaokaoScore = s.province.score;
  }

  // 2. 第一学历得分
  const edu1Score = s.edu1 ? s.edu1.score : 0;

  // 3. 第二学历得分
  const edu2Score = s.edu2 ? s.edu2.score : 0;
  // 若选了"无"，得分为0，并且不拉低整体
  const edu2Effective = (s.edu2 && s.edu2.value === '无') ? 0 : edu2Score;

  // 4. 工作得分
  const workScore = s.work ? s.work.score : 0;

  // 5. 收入得分（直接取百分位）
  const salaryVal = s.salary ? s.salary.value : '无收入';
  const salaryPercentile = SALARY_DISTRIBUTION[salaryVal]?.percentile || 5;
  const salaryScore = salaryPercentile;

  // 6. 存款得分（直接取百分位）
  const savingVal = s.saving ? s.saving.value : '1万以下';
  const savingPercentile = SAVING_DISTRIBUTION[savingVal]?.percentile || 35;
  const savingScore = savingPercentile;

  // 7. 资产得分（车房加分）
  let assetScore = 30; // 基础分
  if (s.hasHouse) assetScore += 25;
  if (s.hasCar)   assetScore += 15;
  if (s.hasMultiHouse) assetScore += 20;
  assetScore = Math.min(assetScore, 100);

  // -------------------------------------------------------
  // 加权综合得分
  // 各分项都是 0-100 的分数，代表超越了多少百分比的人
  // -------------------------------------------------------
  const W = WEIGHTS;
  const weightedSum =
    gaokaoScore    * W.gaokao  +
    edu1Score      * W.edu1    +
    edu2Effective  * W.edu2    +
    workScore      * W.work    +
    salaryScore    * W.salary  +
    savingScore    * W.saving  +
    assetScore     * W.asset;

  // 原始加权百分位 (0-100，表示超越了多少%的人)
  let rawPercentile = weightedSum;

  // 非线性映射：将分数映射到更真实的排名分布
  // 使用 sigmoid-like 函数让中间段更平滑
  rawPercentile = applyDistributionCorrection(rawPercentile);

  // 最终排名（前X%）
  const finalRankPercent = (100 - rawPercentile).toFixed(1);

  // -------------------------------------------------------
  // 渲染结果
  // -------------------------------------------------------
  renderResult({
    rankPercent: parseFloat(finalRankPercent),
    scores: {
      "高考省份": { score: gaokaoScore, weight: W.gaokao },
      "第一学历": { score: edu1Score, weight: W.edu1 },
      "第二学历": { score: edu2Effective, weight: W.edu2 },
      "工作单位": { score: workScore, weight: W.work },
      "月收入":   { score: salaryScore, weight: W.salary },
      "个人存款": { score: savingScore, weight: W.saving },
      "车房资产": { score: assetScore, weight: W.asset },
    },
    salaryPopulation: SALARY_DISTRIBUTION[salaryVal]?.population,
    savingNote: SAVING_DISTRIBUTION[savingVal]?.note,
  });

  // 跳转到结果页
  document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
  document.getElementById('stepResult').classList.add('active');
  updateStepsBar(6);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 触发动画
  setTimeout(() => animateResult(rawPercentile), 300);
}

// 分布矫正：让排名分布更贴近真实社会分布
// 中国社会财富分配高度不均，中等偏下人口更多
function applyDistributionCorrection(raw) {
  // raw: 0-100 的加权平均
  // 矫正：向下压缩（因为大多数人加权分数会集中在40-70）
  // 通过调整斜率和截距让结果更符合实际分布
  if (raw >= 90) return 90 + (raw - 90) * 0.8;
  if (raw >= 75) return 75 + (raw - 75) * 1.0;
  if (raw >= 60) return 60 + (raw - 60) * 1.1;
  if (raw >= 40) return 40 + (raw - 40) * 0.9;
  return raw * 0.95;
}

// ============================================================
// 渲染结果
// ============================================================
function renderResult({ rankPercent, scores, salaryPopulation, savingNote }) {
  // 确保排名在合理范围内
  const clampedRank = Math.max(0.1, Math.min(99.9, rankPercent));

  document.getElementById('rankPercent').textContent = clampedRank.toFixed(1);

  // 选择描述
  let descKey;
  if (clampedRank <= 1)       descKey = 'top1';
  else if (clampedRank <= 5)  descKey = 'top5';
  else if (clampedRank <= 10) descKey = 'top10';
  else if (clampedRank <= 20) descKey = 'top20';
  else if (clampedRank <= 30) descKey = 'top30';
  else if (clampedRank <= 50) descKey = 'top50';
  else if (clampedRank <= 70) descKey = 'top70';
  else                         descKey = 'other';

  const desc = RANK_DESCRIPTIONS[descKey];
  document.getElementById('resultTrophy').textContent = desc.emoji;

  // 描述文字
  const totalPopulation = estimatePopulation(clampedRank);
  document.getElementById('rankDescription').innerHTML = `
    <strong>${desc.title}</strong><br>
    ${desc.desc}<br><br>
    📌 换算成人数：你的综合竞争力超过了中国约 <strong>${totalPopulation}</strong> 的成年人。
    ${salaryPopulation ? `<br>💡 月收入参考：${salaryPopulation}的月收入与你相当。` : ''}
  `;

  // 各项得分条
  const breakdownList = document.getElementById('breakdownList');
  breakdownList.innerHTML = '';
  Object.entries(scores).forEach(([label, { score, weight }]) => {
    const item = document.createElement('div');
    item.className = 'breakdown-item';
    item.innerHTML = `
      <div class="breakdown-item-label">${label}</div>
      <div class="breakdown-bar-wrap">
        <div class="breakdown-bar" data-width="${score}%" style="width:0%"></div>
      </div>
      <div class="breakdown-item-val">${score.toFixed(0)}分</div>
    `;
    breakdownList.appendChild(item);
  });

  // 建议提示
  renderTips({ rankPercent: clampedRank, scores });
}

// 估算超越人口数
function estimatePopulation(rankPercent) {
  // 中国16岁以上人口约11亿
  const totalAdult = 110000;  // 万人
  const exceeded = totalAdult * (1 - rankPercent / 100);
  if (exceeded >= 10000) return `${(exceeded / 10000).toFixed(1)}亿`;
  return `${Math.round(exceeded)}万`;
}

// 渲染建议
function renderTips({ rankPercent, scores }) {
  const tipsEl = document.getElementById('rankTips');
  const tips = [];

  // 找出得分最低的维度
  const entries = Object.entries(scores).sort((a, b) => a[1].score - b[1].score);
  const weakest = entries[0];
  const strongest = entries[entries.length - 1];

  if (weakest[1].score < 50) {
    const adviceMap = {
      "月收入": "💡 收入是影响排名最大的因素，考虑技能升级、跳槽或副业增收。",
      "个人存款": "💡 存款积累需要时间，建议制定储蓄计划，每月强制储蓄20%以上收入。",
      "工作单位": "💡 平台决定上限，有机会可以尝试考公、考编或进入大型企业。",
      "第一学历": "💡 第一学历已无法改变，但可以通过提升第二学历（考研）来弥补。",
      "高考省份": "💡 高考省份是历史，无需纠结，后续努力更能改变命运。",
      "车房资产": "💡 积累资产是长期目标，保持良好的储蓄和投资习惯是关键。",
    };
    tips.push(adviceMap[weakest[0]] || `💡 你在「${weakest[0]}」维度相对薄弱，这是你提升排名的突破口。`);
  }

  tips.push(`🌟 你最强的维度是「${strongest[0]}」（${strongest[1].score.toFixed(0)}分），继续保持这个优势！`);

  if (rankPercent <= 10) {
    tips.push("🎯 你已经非常优秀了！维持现状并持续积累是你的核心策略。");
  } else if (rankPercent <= 30) {
    tips.push("📊 你处于社会中上层，距离前10%还有一段距离，主要突破口在收入和资产积累。");
  } else {
    tips.push("🚀 每个人都有无限可能，专注在自己可控的事情上：技能、收入、储蓄。");
  }

  tipsEl.innerHTML = tips.map(t => `
    <div class="tip-item">
      <span class="tip-icon">${t[0]}</span>
      <span>${t.slice(2)}</span>
    </div>
  `).join('');
}

// ============================================================
// 动画效果
// ============================================================
function animateResult(percentileBeaten) {
  // 环形进度动画
  const circle = document.getElementById('rankCircle');
  const circumference = 553; // 2 * π * 88
  const offset = circumference * (1 - percentileBeaten / 100);

  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 100);

  // 进度条动画
  setTimeout(() => {
    document.querySelectorAll('.breakdown-bar[data-width]').forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
  }, 400);

  // 数字跳动动画
  const rankEl = document.getElementById('rankPercent');
  const targetVal = parseFloat(rankEl.textContent);
  animateNumber(rankEl, 100, targetVal, 1500);
}

function animateNumber(el, from, to, duration) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = from + (to - from) * eased;
    el.textContent = current.toFixed(1);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ============================================================
// 重置 & 分享
// ============================================================
function resetAll() {
  // 重置状态
  state.currentStep = 1;
  state.selections = {
    province: null,
    skipGaokao: false,
    eduCategory: null,
    edu1: null,
    edu2: null,
    work: null,
    salary: null,
    saving: null,
    hasHouse: false,
    hasCar: false,
    hasMultiHouse: false,
  };

  // 清除所有选中状态
  document.querySelectorAll('.option-card.selected').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);

  // 重置 step2 子视图
  ['catOverseas', 'catDomestic'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('selected');
  });
  ['overseasSection', 'domesticSection'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // 恢复省份网格
  const grid = document.getElementById('provinceGrid');
  grid.style.opacity = '1';
  grid.style.pointerEvents = '';
  const searchInput = document.getElementById('provinceSearch');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('#provinceGrid .option-card').forEach(c => c.style.display = '');

  // 回到第一步
  document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
  document.getElementById('step1').classList.add('active');
  updateStepsBar(1);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function shareResult() {
  const rankEl = document.getElementById('rankPercent');
  const rank = rankEl.textContent;
  const trophy = document.getElementById('resultTrophy').textContent;

  const text = `${trophy} 我在中国处于前 ${rank}%！\n` +
    `🏆 YourRank - 测测你在中国处于前百分之几\n` +
    `快来测测你的排名 → https://yourrank.app`;

  // 尝试复制到剪贴板
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showShareToast());
  } else {
    // 降级方案
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showShareToast();
  }
}

function showShareToast() {
  const toast = document.getElementById('shareToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
