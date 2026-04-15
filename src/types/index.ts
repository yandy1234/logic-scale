// 产品类型
export type ProductType = 'phone' | 'computer' | 'camera' | 'headphone' | 'unknown';

// 决策偏差类型
export type BiasType = 
  | 'status_quo'     // 现状偏差
  | 'projection'     // 投射偏差
  | 'confirmation'   // 确认偏差
  | 'recency'        // 最近效应
  | 'hollow'         // 参数空心化
  | 'anchor'         // 低价锚定
  | 'sunk_cost'      // 吸铁石效应
  | 'availability'   // 可用性启发
  | 'framing';       // 框架效应

// 产品特性
export interface ProductFeature {
  id: string;
  name: string;
  weight: number;      // 权重值
  isPositive: boolean; // 是否为优点
  isHollow?: boolean;  // 是否为空心参数
  material: 'gold' | 'glass' | 'bubble'; // 材质映射
}

// 产品信息
export interface Product {
  id: string;
  name: string;
  type: ProductType;
  features: ProductFeature[];
  score: number;       // 最终得分
  winRate?: number;    // 胜率
}

// 决策分析结果
export interface DecisionResult {
  products: Product[];
  winner: Product | null;
  lethalFactor: string | null;
  biasCorrections: BiasCorrection[];
  recommendations: string[];
}

// 偏差修正
export interface BiasCorrection {
  biasType: BiasType;
  description: string;
  correction: string;
}

// 用户输入
export interface UserInput {
  products: string[];
  requirements: string[];
  budget?: number;
  brandPreference?: string;
  usageScenario?: string;
}

// 决策路径
export type DecisionPath = 'quick' | 'standard' | 'invalid';

// 用户画像
export type UserProfile = 'geek' | 'long_term' | 'practical';

// 3D 视觉配置
export interface VisualConfig {
  scene: string;
  materials: {
    gold: string;
    glass: string;
    bubble: string;
  };
  lighting: string;
  animation: boolean;
}