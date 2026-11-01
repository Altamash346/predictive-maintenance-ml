import React, { useState, useEffect } from 'react';
import { fetchEtlStatus, triggerEtlRun } from '../services/api';
import { 
  Workflow, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Database, 
  FileText, 
  Filter, 
  Sparkles, 
  Clock, 
  ShieldAlert,
  Cpu,
  Layers,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function PipelineView() {
  const [pipelineStatus, setPipelineStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [latestRunResult, setLatestRunResult] = useState(null);
  const [activeStep, setActiveStep] = useState(null);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const res = await fetchEtlStatus();
      setPipelineStatus(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleRunPipeline = async () => {
    try {
      setRunning(true);
      const result = await triggerEtlRun();
      setLatestRunResult(result);
      await loadStatus();
    } catch (err) {
      console.error(err);
      alert('Pipeline execution failed: ' + err.message);
    } finally {
      setRunning(false);
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Telemetry Ingestion & Quality Audit',
      badge: 'Ingestion & Validation',
      color: 'blue',
      icon: Database,
      desc: 'Ingests 10,000 raw sensor records from the AI4I 2020 dataset. Verifies 0 null values, column types, and checks physical telemetry boundary constraints.',
      stats: [
        { label: 'Raw Observations', value: '10,000' },
        { label: 'Missing Values Imputed', value: '0 (100% Complete)' },
        { label: 'Sensor Channels', value: '5 Physical Feeds' }
      ]
    },
    {
      num: '02',
      title: 'Target Leakage Prevention',
      badge: 'Leakage Elimination',
      color: 'rose',
      icon: ShieldAlert,
      desc: 'Strictly removes synthetic IDs (UDI, Product ID) and specific failure mode flags (TWF, HDF, PWF, OSF, RNF) from feature matrix X. Ensures the model trains strictly on operational telemetry available before failure.',
      stats: [
        { label: 'Dropped IDs', value: 'UDI, Product ID' },
        { label: 'Isolated Targets', value: 'TWF, HDF, PWF, OSF, RNF' },
        { label: 'Evaluation Set Integrity', value: 'Strict Zero-Leakage' }
      ]
    },
    {
      num: '03',
      title: 'Physics-Informed Feature Engineering',
      badge: 'Derived Physical Features',
      color: 'amber',
      icon: Sparkles,
      desc: 'Computes derived mechanical indicators: Temperature Differential (ΔT = T_proc - T_air), Mechanical Power Output (P = 2πN·τ/60), and Tool Fatigue Interaction Index (Wear × Torque).',
      stats: [
        { label: 'Thermal Gradient (ΔT)', value: 'T_process - T_air (K)' },
        { label: 'Mechanical Power (P)', value: 'P = (2πN/60) × τ (Watts)' },
        { label: 'Stress Factor', value: 'Tool Wear × Torque' }
      ]
    },
    {
      num: '04',
      title: 'Encoding & Stratified Train/Test Split',
      badge: 'Dataset Preparation',
      color: 'emerald',
      icon: Layers,
      desc: 'Encodes categorical product grade (L: 50%, M: 30%, H: 20%), normalizes numeric features, and partitions data into an 80:20 stratified split preserving the 3.4% failure class ratio.',
      stats: [
        { label: 'Train Set (80%)', value: '8,000 Instances' },
        { label: 'Test Holdout (20%)', value: '2,000 Instances' },
        { label: 'Failure Imbalance Ratio', value: '96.6% : 3.4% Preserved' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Data Preprocessing & Feature Engineering Pipeline
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Automated sensor ingestion, target leakage prevention, domain feature derivation, and train/test dataset preparation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadStatus}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium border border-gray-200 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>

          <button
            onClick={handleRunPipeline}
            disabled={running}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-sm transition disabled:opacity-50"
          >
            {running ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Pipeline...</span>
              </>
            ) : (
              <>
                <Workflow className="w-4 h-4" />
                <span>Run Feature Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Latest Run Alert */}
      {latestRunResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="font-bold">Pipeline Executed Successfully!</span> {latestRunResult.message || 'All stages completed.'}
              {latestRunResult.duration_seconds && ` (Duration: ${latestRunResult.duration_seconds.toFixed(2)}s)`}
            </div>
          </div>
          <button onClick={() => setLatestRunResult(null)} className="text-emerald-600 hover:text-emerald-800 font-bold">✕</button>
        </div>
      )}

      {/* Pipeline Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Pipeline Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-gray-900">
            {pipelineStatus?.pipeline_healthy !== false ? 'Operational' : 'Degraded'}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">Feature store synced</p>
        </div>

        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Total Observations</span>
            <Database className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-bold text-gray-900">10,000</div>
          <p className="text-[11px] text-gray-400 mt-0.5">100% verified sensor cycles</p>
        </div>

        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Feature Dimensions</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-gray-900">14 Columns</div>
          <p className="text-[11px] text-gray-400 mt-0.5">6 raw + 3 physics + target label</p>
        </div>

        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] font-semibold uppercase">Leakage Prevention</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-lg font-bold text-rose-600">Active (Protected)</div>
          <p className="text-[11px] text-gray-400 mt-0.5">IDs and failure flags excluded</p>
        </div>
      </div>

      {/* 4-Stage Visual Pipeline */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
              End-to-End Machine Learning Feature Pipeline
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Click any stage to view feature transformation logic, input/output schemas, and domain mathematics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStep === idx;
            return (
              <div
                key={s.num}
                onClick={() => setActiveStep(isSelected ? null : idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/40 shadow-md ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400 font-mono">Stage {s.num}</span>
                  <div className={`p-1.5 rounded-lg bg-${s.color}-50 text-${s.color}-600 border border-${s.color}-200`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 inline-block mb-2">
                  {s.badge}
                </div>

                <h4 className="text-xs font-bold text-gray-800 mb-2 leading-tight">
                  {s.title}
                </h4>

                <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                  {s.desc}
                </p>

                <div className="border-t border-gray-100 pt-3 space-y-1.5 text-[10px]">
                  {s.stats.map((st, i) => (
                    <div key={i} className="flex justify-between text-gray-600">
                      <span className="text-gray-400">{st.label}:</span>
                      <span className="font-semibold">{st.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physics & Feature Engineering Formula Box */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h3 className="text-sm font-bold tracking-wide">Domain Mathematics & Physics Formulations</h3>
        </div>
        <p className="text-xs text-blue-200 mb-4 max-w-3xl leading-relaxed">
          Predictive maintenance models achieve higher generalization when raw sensor signals are combined with physics-informed domain indicators rather than raw inputs alone:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-white/10 rounded-lg p-3 border border-white/10 backdrop-blur-sm">
            <div className="text-amber-300 font-bold mb-1">Thermal Gradient (ΔT)</div>
            <div className="text-sm font-semibold mb-1">ΔT = T_process - T_air</div>
            <p className="text-[10px] text-blue-200 font-sans">
              Measures machine heat dissipation efficiency. ΔT &lt; 8.6 K indicates heat dissipation failure (HDF).
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-3 border border-white/10 backdrop-blur-sm">
            <div className="text-amber-300 font-bold mb-1">Mechanical Power (P)</div>
            <div className="text-sm font-semibold mb-1">P = (2π · N / 60) × τ</div>
            <p className="text-[10px] text-blue-200 font-sans">
              Mechanical power output in Watts. P &lt; 3500 W or &gt; 9000 W indicates power failure (PWF).
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-3 border border-white/10 backdrop-blur-sm">
            <div className="text-amber-300 font-bold mb-1">Tool Fatigue Interaction</div>
            <div className="text-sm font-semibold mb-1">S = Tool Wear × Torque</div>
            <p className="text-[10px] text-blue-200 font-sans">
              Stress product on cutting tool. Values exceeding 11,000 min·Nm lead to catastrophic overstrain failure (OSF).
            </p>
          </div>
        </div>
      </div>

      {/* Target Leakage Prevention Callout */}
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-2">
        <div className="flex items-center gap-2 font-bold text-rose-700">
          <ShieldAlert className="w-4 h-4" />
          <span>Strict Target Leakage Safeguard in Supervised Learning</span>
        </div>
        <p className="leading-relaxed text-gray-700">
          The dataset includes failure mode indicators (<code className="bg-rose-100 text-rose-800 px-1 py-0.5 rounded font-mono">TWF, HDF, PWF, OSF, RNF</code>). While useful for post-mortem diagnostics, using these features to predict <code className="bg-rose-100 text-rose-800 px-1 py-0.5 rounded font-mono">Machine failure</code> constitutes <strong>target leakage</strong> because in production manufacturing, these failure causes are unknown prior to machine breakdown. Our pipeline strictly isolates these columns to evaluate true predictive telemetry performance.
        </p>
      </div>
    </div>
  );
}
