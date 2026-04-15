import { Product, ProductFeature, DecisionResult, BiasCorrection, UserInput, DecisionPath, UserProfile } from '../types';

// 品类默认权重分配
const CATEGORY_WEIGHTS = {
  phone: { system: 9, camera: 8, battery: 7, resale: 6, screen: 5 },
  computer: { performance: 9, screen: 8, portability: 7, battery: 6, cooling: 5 },
  camera: { image_quality: 9, focusing: 8, portability: 7, video: 6, battery: 5 },
  headphone: { sound: 9, comfort: 8, noise_cancelling: 7, connectivity: 5, battery: 6 },
  unknown: { price: 8, performance: 7, after_sales: 6, portability: 5 }
};

// 决策偏差检测与修正
const BIAS_CORRECTIONS: Record<string, BiasCorrection> = {
  status_quo: {
    biasType: 'status_quo',
    description: '现状偏差：用户对现有设备的惰性',
    correction: '评估不换机的隐性维护成本'
  },
  projection: {
    biasType: 'projection',
    description: '投射偏差：用自己的偏好替他人做决定',
    correction: '追问使用者的实际使用场景'
  },
  confirmation: {
    biasType: 'confirmation',
    description: '确认偏差：只关注正面评价',
    correction: '强制列出2个核心负面评价'
  },
  recency: {
    biasType: 'recency',
    description: '最近效应：冲动追新',
    correction: '检查上一代产品的长期口碑'
  },
  hollow: {
    biasType: 'hollow',
    description: '参数空心化：虚高参数',
    correction: '权重 × 0.4 折算'
  },
  anchor: {
    biasType: 'anchor',
    description: '低价锚定：价格差 > 15%',
    correction: '检查低价端的隐形成本'
  },
  sunk_cost: {
    biasType: 'sunk_cost',
    description: '吸铁石效应：已有配件/全家桶',
    correction: '标记为外力，不计入产品物理分值'
  },
  availability: {
    biasType: 'availability',
    description: '可用性启发：只选知名品牌',
    correction: '挖掘同价位性能更优的"黑马"'
  },
  framing: {
    biasType: 'framing',
    description: '框架效应：营销形容词影响',
    correction: '剥离营销术语，还原为绝对数值'
  }
};

// 路径识别
function identifyPath(input: UserInput): DecisionPath {
  const productCount = input.products.length;
  const requirementCount = input.requirements.length;
  
  if (productCount === 0) {
    return 'invalid';
  }
  
  if (productCount <= 2 && requirementCount === 0) {
    return 'quick';
  }
  
  return 'standard';
}

// 计算产品得分
function calculateProductScore(product: Product): number {
  let score = 0;
  
  product.features.forEach(feature => {
    if (feature.isPositive) {
      score += feature.weight;
    } else {
      score -= feature.weight * 1.5; // 损失厌恶校准
    }
    
    if (feature.isHollow) {
      score *= 0.4; // 空心参数惩罚
    }
  });
  
  return score;
}

// 计算胜率
function calculateWinRate(products: Product[]): void {
  if (products.length < 2) return;
  
  const totalScore = products.reduce((sum, p) => sum + p.score, 0);
  products.forEach(product => {
    product.winRate = product.score / totalScore;
  });
}

// 检测致命因素
function detectLethalFactor(product: Product): string | null {
  const totalWeight = product.features.reduce((sum, f) => sum + f.weight, 0);
  
  for (const feature of product.features) {
    const weightRatio = feature.weight / totalWeight;
    if (weightRatio > 0.4) {
      return `${feature.name} (权重占比: ${(weightRatio * 100).toFixed(1)}%)`;
    }
  }
  
  return null;
}

// 生成推荐
function generateRecommendations(products: Product[], profile: UserProfile): string[] {
  const recommendations: string[] = [];
  
  switch (profile) {
    case 'geek':
      recommendations.push('极客选择：优先考虑性能和配置');
      break;
    case 'long_term':
      recommendations.push('长持选择：优先考虑耐用性和保值率');
      break;
    case 'practical':
      recommendations.push('实用选择：优先考虑性价比和使用场景');
      break;
  }
  
  return recommendations;
}

// 主决策引擎
export function processDecision(input: UserInput): DecisionResult {
  // 路径识别
  const path = identifyPath(input);
  
  if (path === 'invalid') {
    return {
      products: [],
      winner: null,
      lethalFactor: null,
      biasCorrections: [],
      recommendations: ['请提供至少一个产品名称']
    };
  }
  
  // 模拟产品数据（实际应用中应从数据库或API获取）
  const products: Product[] = input.products.map((name, index) => {
    const product: Product = {
      id: `product_${index}`,
      name,
      type: 'unknown',
      features: [
        { id: `f1_${index}`, name: '性能', weight: 8, isPositive: true, material: 'gold' },
        { id: `f2_${index}`, name: '价格', weight: 7, isPositive: index === 0, material: index === 0 ? 'gold' : 'bubble' },
        { id: `f3_${index}`, name: '续航', weight: 6, isPositive: true, material: 'gold' },
        { id: `f4_${index}`, name: '外观', weight: 5, isPositive: true, material: 'gold' },
        { id: `f5_${index}`, name: '售后', weight: 4, isPositive: true, material: 'gold' }
      ],
      score: 0
    };
    
    product.score = calculateProductScore(product);
    return product;
  });
  
  // 计算胜率
  calculateWinRate(products);
  
  // 确定 winner
  let winner = null;
  if (products.length > 0) {
    winner = products.reduce((max, p) => p.score > max.score ? p : max, products[0]);
  }
  
  // 检测致命因素
  const lethalFactor = winner ? detectLethalFactor(winner) : null;
  
  // 生成偏差修正
  const biasCorrections = Object.values(BIAS_CORRECTIONS);
  
  // 生成推荐
  const recommendations = generateRecommendations(products, 'practical');
  
  return {
    products,
    winner,
    lethalFactor,
    biasCorrections,
    recommendations
  };
}

// 调整权重
export function adjustWeights(input: UserInput, adjustments: Record<string, number>): DecisionResult {
  // 实现权重调整逻辑
  return processDecision(input);
}