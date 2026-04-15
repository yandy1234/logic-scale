import React, { useState } from 'react';
import { processDecision } from './utils/decisionEngine';
import { UserInput, DecisionResult } from './types';
import './App.css';

function App() {
  const [input, setInput] = useState<UserInput>({
    products: [],
    requirements: [],
    budget: undefined,
    brandPreference: undefined,
    usageScenario: undefined
  });
  
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'products') {
      setInput(prev => ({
        ...prev,
        products: value.split(',').map(p => p.trim()).filter(Boolean)
      }));
    } else if (name === 'requirements') {
      setInput(prev => ({
        ...prev,
        requirements: value.split(',').map(r => r.trim()).filter(Boolean)
      }));
    } else if (name === 'budget') {
      setInput(prev => ({
        ...prev,
        budget: parseFloat(value) || undefined
      }));
    } else if (name === 'brandPreference') {
      setInput(prev => ({
        ...prev,
        brandPreference: value
      }));
    } else if (name === 'usageScenario') {
      setInput(prev => ({
        ...prev,
        usageScenario: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // 模拟API调用延迟
    setTimeout(() => {
      const decisionResult = processDecision(input);
      setResult(decisionResult);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">⚖️</span>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              LogicScale
            </h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">首页</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">使用指南</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">关于我们</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">GitHub</a>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 英雄区 */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            购物决策物理仿真器
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            将产品对比转化为天平物理实验，通过倾斜度直观呈现优劣
          </p>
        </section>

        {/* 输入表单 */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">决策输入</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品名称（多个产品用逗号分隔，如：iPhone 15, iPhone 16）
              </label>
              <input
                type="text"
                name="products"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入产品名称"
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                需求维度（如：拍照好, 续航长, 价格低）
              </label>
              <input
                type="text"
                name="requirements"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入您的需求"
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预算（元）</label>
                <input
                  type="number"
                  name="budget"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入预算"
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">品牌倾向</label>
                <input
                  type="text"
                  name="brandPreference"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="如：苹果, 华为"
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">使用场景</label>
                <input
                  type="text"
                  name="usageScenario"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="如：办公, 游戏, 拍照"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 flex items-center justify-center"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  分析中...
                </>
              ) : (
                '开始分析'
              )}
            </button>
          </form>
        </section>

        {/* 分析结果 */}
        {result && (
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">决策分析结果</h3>
            
            {result.products.length > 0 ? (
              <div className="space-y-8">
                {/* 3D 仿真主视觉 */}
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⚖️</div>
                    <p className="text-gray-600">3D 天平仿真可视化</p>
                    <p className="text-sm text-gray-500 mt-2">（实际应用中会显示真实的 3D 天平）</p>
                  </div>
                </div>
                
                {/* 砝码与气球矩阵 */}
                <div>
                  <h4 className="text-xl font-semibold mb-4">砝码与气球矩阵</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.products.map(product => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-bold text-lg mb-2">{product.name}</h5>
                        <p className="text-lg font-semibold text-blue-600 mb-4">得分: {product.score.toFixed(2)}</p>
                        <div className="space-y-2">
                          {product.features.map(feature => (
                            <div key={feature.id} className="flex justify-between items-center">
                              <span>{feature.name}</span>
                              <span className={`px-2 py-1 rounded ${feature.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {feature.isPositive ? '+' : '-'}{feature.weight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 决策物理学报告 */}
                <div>
                  <h4 className="text-xl font-semibold mb-4">决策物理学报告</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="mb-2">推荐选择: <span className="font-bold">{result.winner?.name}</span></p>
                    {result.winner?.winRate && (
                      <p>胜率: {(result.winner.winRate * 100).toFixed(1)}%</p>
                    )}
                  </div>
                </div>
                
                {/* 致命一击提示 */}
                {result.lethalFactor && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <h4 className="text-xl font-semibold mb-2">⚠️ 致命一击提示</h4>
                    <p>{result.lethalFactor}</p>
                  </div>
                )}
                
                {/* 偏差修正建议 */}
                <div>
                  <h4 className="text-xl font-semibold mb-4">偏差修正建议</h4>
                  <div className="space-y-2">
                    {result.biasCorrections.slice(0, 3).map((correction, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <p className="font-medium">{correction.description}</p>
                        <p className="text-sm text-gray-600">{correction.correction}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 推荐 */}
                <div>
                  <h4 className="text-xl font-semibold mb-4">推荐</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">{result.recommendations[0]}</p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">⚖️</span>
                </div>
                <span className="text-xl font-bold">LogicScale</span>
              </div>
              <p className="text-gray-400 mt-2">购物决策物理仿真器</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-white">使用指南</a>
              <a href="#" className="text-gray-400 hover:text-white">关于我们</a>
              <a href="#" className="text-gray-400 hover:text-white">联系我们</a>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
            <p>© 2026 LogicScale. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;