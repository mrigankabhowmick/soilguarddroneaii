"use client";
import React from 'react';
import { AgriAnalysis } from './types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  AlertTriangle, Droplets, Sun, Bug, Sprout, CheckCircle2, 
  AlertOctagon, TrendingUp, Grid, Plane, Map as MapIcon, 
  Wind, ThermometerSun, ScanEye, Leaf
} from 'lucide-react';

interface DashboardProps {
  data: AgriAnalysis;
  imagePreview: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ data, imagePreview }) => {
  // Color palette helpers
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const coverageData = [
    { name: 'Healthy', value: data.area_analysis.healthy_percent, color: '#059669' },
    { name: 'Stressed', value: data.area_analysis.stressed_percent, color: '#EAB308' },
    { name: 'Diseased', value: data.area_analysis.diseased_percent, color: '#DC2626' },
    { name: 'Dry', value: data.area_analysis.dry_percent, color: '#F97316' },
    { name: 'Weeds', value: data.area_analysis.weed_percent, color: '#7C3AED' },
    { name: 'Bare Soil', value: data.area_analysis.bare_soil_percent, color: '#78350F' },
  ].filter(d => d.value > 0);

  const confidenceData = [
    { name: 'Crop', value: data.confidence.crop_condition },
    { name: 'Weed', value: data.confidence.weed_detection },
    { name: 'Disease', value: data.confidence.disease_detection },
    { name: 'Water', value: data.confidence.water_stress },
    { name: 'Zones', value: data.confidence.zonal_mapping },
  ];

  // Heatmap Grid Logic
  const maxRow = Math.max(0, ...data.mapping.heatmap_grid.map(c => c.row));
  const maxCol = Math.max(0, ...data.mapping.heatmap_grid.map(c => c.col));
  
  return (
    <div className="space-y-6">
      
      {/* 1. Header Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Health Score Card */}
        <div className={`p-6 rounded-2xl border-2 flex flex-col justify-between ${getHealthColor(data.field_health_score)}`}>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold opacity-80">Health Score</h3>
            <ActivityIcon score={data.field_health_score} />
          </div>
          <div className="mt-4">
            <span className="text-4xl font-bold">{data.field_health_score}</span>
            <span className="text-sm opacity-70">/100</span>
          </div>
          <p className="text-sm mt-2 font-medium">{data.crop_condition} - {data.growth_stage}</p>
        </div>

        {/* Growth & Yield */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-slate-500">Growth & Yield</h3>
            <Sprout className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 space-y-1">
             <div className="text-sm text-slate-600">Prediction: <span className="font-medium text-slate-900">{data.recommendations.yield_prediction}</span></div>
             <div className="text-sm text-slate-600">Height: <span className="font-medium text-slate-900">{data.plant_height_estimate}</span></div>
             <div className="text-sm text-slate-600">Uniformity: <span className="font-medium text-slate-900">{data.growth_uniformity}%</span></div>
          </div>
        </div>

        {/* Environment & Water */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-slate-500">Environment</h3>
            <Droplets className="h-5 w-5 text-blue-500" />
          </div>
          <div className="mt-2 space-y-1">
             <div className="text-sm text-slate-600">Water Stress: <span className="font-medium text-blue-700 capitalize">{data.water_stress}</span></div>
             <div className="text-sm text-slate-600">Soil Dryness: <span className="font-medium text-amber-700">{data.soil_dryness}</span></div>
             <div className="text-sm text-slate-600">Sunlight: <span className="font-medium text-orange-600">{data.sunlight_exposure}</span></div>
          </div>
        </div>

         {/* Drone Telemetry */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-slate-500">Telemetry</h3>
            <Plane className="h-5 w-5 text-slate-500" />
          </div>
          <div className="mt-2 space-y-1">
             <div className="text-sm text-slate-600">Altitude: <span className="font-medium text-slate-900">{data.mapping.relative_altitude}</span></div>
             <div className="text-sm text-slate-600">Heading: <span className="font-medium text-slate-900">{data.mapping.drone_heading}</span></div>
             <div className="text-sm text-slate-600">Quality: <span className="font-medium text-slate-900">{data.report_metadata.image_quality}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Main Content: Heatmap & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Field Health Heatmap */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Grid className="h-5 w-5 text-indigo-500" />
              Field Health Heatmap
            </h3>
            
            <div className="w-full overflow-x-auto">
              <div 
                className="grid gap-1 min-w-[300px]"
                style={{ 
                  gridTemplateColumns: `repeat(${maxCol + 1}, minmax(0, 1fr))`,
                  aspectRatio: '16/9'
                }}
              >
                {data.mapping.heatmap_grid.map((cell) => (
                  <div 
                    key={cell.cell_id}
                    className="relative group rounded hover:ring-2 ring-slate-400 transition-all cursor-pointer"
                    style={{ 
                      backgroundColor: cell.color,
                      opacity: 0.8 
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white font-bold text-xs shadow-sm">
                      {cell.health_score}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 w-32 bg-slate-800 text-white text-xs rounded p-2 pointer-events-none">
                      <div className="font-bold">Cell {cell.cell_id}</div>
                      <div>Score: {cell.health_score}</div>
                      <div>Weeds: {cell.weed_density}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-green-500"></span> Healthy
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-yellow-400"></span> Stressed
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-500"></span> Critical
              </div>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Agronomic Action Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RecommendationCard 
                title="Irrigation Strategy" 
                content={data.recommendations.irrigation} 
                icon={<Droplets className="h-4 w-4 text-blue-500" />}
              />
              <RecommendationCard 
                title="Fertilizer Application" 
                content={data.recommendations.fertilizer} 
                icon={<Sprout className="h-4 w-4 text-emerald-500" />}
              />
              <RecommendationCard 
                title="Pest & Disease Control" 
                content={`${data.recommendations.pest_control} ${data.recommendations.disease_management}`} 
                icon={<Bug className="h-4 w-4 text-red-500" />}
              />
              <RecommendationCard 
                title="Weed Management" 
                content={data.recommendations.weed_control} 
                icon={<AlertOctagon className="h-4 w-4 text-amber-500" />}
              />
            </div>
            
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
               <ScanEye className="h-5 w-5 text-slate-400 mt-0.5" />
               <div>
                 <h4 className="font-semibold text-sm text-slate-800">Next Scan Suggestion</h4>
                 <p className="text-sm text-slate-600">{data.recommendations.scan_suggestion}</p>
               </div>
            </div>
          </div>

          {/* Zone Analysis Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-slate-500" />
                Zonal Analysis
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Zone</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Health</th>
                    <th className="px-6 py-3 font-medium">Dominant Issue</th>
                    <th className="px-6 py-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.mapping.zones.map((zone) => (
                    <tr key={zone.zone_id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-900">{zone.zone_id}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                          ${zone.health_status.toLowerCase().includes('healthy') ? 'bg-green-100 text-green-700' : 
                            zone.health_status.toLowerCase().includes('stressed') ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'}`}>
                          {zone.health_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono">{zone.health_score}</td>
                      <td className="px-6 py-4 capitalize text-slate-700">{zone.dominant_issue}</td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={zone.notes}>{zone.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* 3. Sidebar: Charts & Details */}
        <div className="space-y-6">
          
          {/* Coverage Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Area Coverage</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={coverageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {coverageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detections List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Detections</h3>
             <div className="space-y-4">
                <DetectionItem 
                   label="Weeds Detected" 
                   detected={data.weed_detected} 
                   value={`${data.weed_coverage_percent}% coverage`}
                   type="negative"
                />
                <DetectionItem 
                   label="Disease Detected" 
                   detected={data.disease_detected} 
                   value={data.disease_type}
                   type="negative"
                />
                <DetectionItem 
                   label="Pests Detected" 
                   detected={data.pest_detected} 
                   value={data.pest_type}
                   type="negative"
                />
                
                {data.anomalies.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 mt-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Anomalies</span>
                    <ul className="mt-2 space-y-1">
                      {data.anomalies.map((a, i) => (
                        <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 mt-1 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
             </div>
          </div>

          {/* Object Counts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Object Counts</h3>
            <div className="space-y-3">
              <CountRow label="Plants" count={data.object_counts.plants} />
              <CountRow label="Weeds" count={data.object_counts.weeds} />
              <CountRow label="Bare Patches" count={data.object_counts.bare_soil_patches} />
              <CountRow label="Waterlogged" count={data.object_counts.waterlogged_areas} />
            </div>
          </div>

          {/* AI Confidence */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">AI Confidence</h3>
            <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 10}} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" fill="#64748b" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper Components

const ActivityIcon = ({ score }: { score: number }) => {
  if (score >= 80) return <CheckCircle2 className="h-6 w-6" />;
  if (score >= 50) return <AlertTriangle className="h-6 w-6" />;
  return <AlertOctagon className="h-6 w-6" />;
};

const RecommendationCard = ({ title, content, icon }: { title: string; content: string; icon: React.ReactNode }) => (
  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h4 className="font-semibold text-sm text-slate-700">{title}</h4>
    </div>
    <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">{content}</p>
  </div>
);

const CountRow = ({ label, count }: { label: string; count: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="font-mono font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">{count}</span>
  </div>
);

const DetectionItem = ({ label, detected, value, type }: { label: string; detected: boolean; value: string; type: 'positive' | 'negative' }) => {
  const isGood = type === 'positive' ? detected : !detected;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
         {detected ? (
           <AlertTriangle className="h-4 w-4 text-amber-500" />
         ) : (
           <CheckCircle2 className="h-4 w-4 text-slate-300" />
         )}
         <span className={`text-sm ${detected ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>{label}</span>
      </div>
      {detected && <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">{value}</span>}
    </div>
  );
};

export default Dashboard;