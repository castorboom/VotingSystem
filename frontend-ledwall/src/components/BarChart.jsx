// frontend-ledwall/src/components/BarChart.jsx
/**
 * Componente grafico a barre animato
 * Visualizza voti in tempo reale con animazioni fluide
 */
import React, { useEffect, useState } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

const BarChart = ({ data, theme, isActive }) => {
  const [animatedData, setAnimatedData] = useState(data);
  
  // Animazione incrementale voti
  useEffect(() => {
    setAnimatedData(data);
  }, [data]);
  
  // Colori barre (usa tema o default)
  const barColors = [
    theme?.primaryColor || '#DC2626',
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899'
  ];
  
  // Custom label per mostrare percentuale
  const renderCustomLabel = (props) => {
    const { x, y, width, height, value, index } = props;
    const percentage = animatedData[index]?.percentage || 0;
    
    return (
      <g>
        <text 
          x={x + width / 2} 
          y={y - 10} 
          fill={theme?.textColor || '#F3F4F6'} 
          textAnchor="middle"
          className="text-lg font-bold"
        >
          {value} voti ({percentage}%)
        </text>
      </g>
    );
  };
  
  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={animatedData}
          margin={{ top: 40, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme?.textColor || '#374151'} opacity={0.3} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: theme?.textColor || '#F3F4F6', fontSize: 16 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            tick={{ fill: theme?.textColor || '#F3F4F6', fontSize: 14 }}
            label={{ 
              value: 'Numero di voti', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: theme?.textColor || '#F3F4F6', fontSize: 16 }
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme?.backgroundColor || '#1F2937',
              border: `1px solid ${theme?.primaryColor || '#DC2626'}`,
              borderRadius: '8px'
            }}
            labelStyle={{ color: theme?.textColor || '#F3F4F6' }}
            itemStyle={{ color: theme?.primaryColor || '#DC2626' }}
          />
          <Bar 
            dataKey="votes" 
            animationDuration={500}
            radius={[8, 8, 0, 0]}
          >
            <LabelList content={renderCustomLabel} position="top" />
            {animatedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
      
      {/* Messaggio quando non ci sono voti */}
      {animatedData.every(d => d.votes === 0) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl" style={{ color: theme?.textColor || '#9CA3AF' }}>
            {isActive ? 'In attesa dei primi voti...' : 'Nessun voto registrato'}
          </p>
        </div>
      )}
    </div>
  );
};