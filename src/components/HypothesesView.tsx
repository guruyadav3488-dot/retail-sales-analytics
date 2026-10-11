import React, { useState } from 'react';
import { BUSINESS_HYPOTHESES } from '../data/retailDataset';
import { BusinessHypothesis } from '../types/retail';
import { FlaskConical, ShieldAlert, CheckCircle2, AlertCircle, ArrowRight, Gauge } from 'lucide-react';

export const HypothesesView: React.FC = () => {
  const [activeHypId, setActiveHypId] = useState<string>('HYP-01');

  const activeHypothesis: BusinessHypothesis =
    BUSINESS_HYPOTHESES.find((h) => h.id === activeHypId) || BUSINESS_HYPOTHESES[0];

  return (
    <div className="space-y-8">
      {/* Editorial Header & Positioning Statement */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
          <span>Experimentation &amp; Strategy</span>
          <span aria-hidden="true">·</span>
          <span>Scientific Hypothesis Testing</span>
          <span aria-hidden="true">·</span>
          <span className="text-blue-600 font-semibold">Causal vs Observational Rigor</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Actionable Business Hypotheses &amp; Test Designs
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          In professional analytics engineering, observational patterns are formulated as <strong>controlled hypotheses to test with a business</strong> rather than unverified claims of historical ROI. Every proposal below includes randomized test protocols, Minimum Detectable Effects (MDE), and metric guardrails.
        </p>

        {/* Positioning Box */}
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
          <FlaskConical className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900">Academic &amp; Portfolio Position:</strong> This product transforms the public UCI "Online Retail II" dataset. It was not deployed in active live commerce and did not resolve proprietary commercial operations. We frame all conclusions as testable business hypotheses to demonstrate rigorous experimentation thinking to hiring managers.
          </div>
        </div>
      </div>

      {/* Hypothesis Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {BUSINESS_HYPOTHESES.map((hyp) => {
          const isActive = activeHypId === hyp.id;
          return (
            <button
              key={hyp.id}
              onClick={() => setActiveHypId(hyp.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                isActive
                  ? 'border-slate-900 ring-2 ring-slate-900 bg-slate-50/60 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40'
              }`}
            >
              <div className="flex items-center justify-between text-2xs font-mono font-semibold text-slate-400 mb-1">
                <span>{hyp.id}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-3xs ${
                    hyp.feasibility === 'High'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {hyp.feasibility} Feasibility
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 line-clamp-2">
                {hyp.title}
              </div>
              <div className="text-2xs text-slate-500 mt-2 font-mono">
                {hyp.expectedImpact}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Hypothesis Full Specification */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-700 font-bold mb-1">
            <span>{activeHypothesis.id}</span>
            <span aria-hidden="true">·</span>
            <span>Feasibility: {activeHypothesis.feasibility}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {activeHypothesis.title}
          </h2>
        </div>

        {/* Observed Signal vs Hypothesis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              1. Observed Quantitative Signal
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {activeHypothesis.observedSignal}
            </p>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200 space-y-2">
            <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              2. Testable Business Hypothesis
            </div>
            <p className="text-xs text-blue-900/90 leading-relaxed font-medium">
              "{activeHypothesis.hypothesisStatement}"
            </p>
          </div>
        </div>

        {/* Experimental Test Protocol */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Experimental Design &amp; Statistical Power
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <div className="text-2xs text-slate-500">Methodology</div>
              <div className="text-xs font-bold text-slate-900 mt-1">
                {activeHypothesis.testDesign.methodology}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <div className="text-2xs text-slate-500">Sample Size per Variant</div>
              <div className="text-xs font-bold font-mono text-slate-900 mt-1">
                {activeHypothesis.testDesign.sampleSizePerVariant}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <div className="text-2xs text-slate-500">Min. Detectable Effect (MDE)</div>
              <div className="text-xs font-bold font-mono text-blue-700 mt-1">
                {activeHypothesis.testDesign.mde}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <div className="text-2xs text-slate-500">Recommended Duration</div>
              <div className="text-xs font-bold font-mono text-slate-900 mt-1">
                {activeHypothesis.testDesign.durationDays} Days
              </div>
            </div>
          </div>

          {/* Primary Metric vs Guardrail Metric */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 bg-emerald-50/50 rounded border border-emerald-200">
              <div className="text-2xs font-semibold text-emerald-800 uppercase">Primary Evaluation Metric</div>
              <div className="text-xs font-bold text-emerald-950 mt-1 font-mono">
                {activeHypothesis.testDesign.primaryMetric}
              </div>
              <div className="text-2xs text-emerald-700 mt-1">Evaluated at α = 0.05 two-tailed statistical significance.</div>
            </div>
            <div className="p-3.5 bg-rose-50/50 rounded border border-rose-200">
              <div className="text-2xs font-semibold text-rose-800 uppercase">Mandatory Guardrail Metric</div>
              <div className="text-xs font-bold text-rose-950 mt-1 font-mono">
                {activeHypothesis.testDesign.guardrailMetric}
              </div>
              <div className="text-2xs text-rose-700 mt-1">Halts the test if guardrail threshold is violated to prevent business harm.</div>
            </div>
          </div>
        </div>

        {/* Operational Steps & Limitations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Implementation Steps:</h4>
            <div className="space-y-2">
              {activeHypothesis.recommendedPlaybook.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              Dataset Boundary &amp; Limitation:
            </h4>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-900 leading-relaxed">
              {activeHypothesis.limitations}
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Limitations & Data Boundaries Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-slate-700" />
          <h2 className="text-base font-bold text-slate-900">
            Comprehensive Analytical Limitations &amp; Governance
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Every mature analytics engineering portfolio must explicitly acknowledge its data constraints:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900">1. Unregistered Guest Checkouts (22.8%)</div>
            <p className="text-slate-600 leading-relaxed">
              Missing customer IDs prevent tracking repeat behavior for guest users. We preserve them in financial ledgers while filtering them in cohort and RFM analyses.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900">2. Cost of Goods Sold (COGS) Proxy</div>
            <p className="text-slate-600 leading-relaxed">
              The public dataset provides unit selling prices without wholesale acquisition costs. Gross margin calculations utilize an explicit 40% margin proxy with sensitivity controls.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900">3. Cancellation Reason Ambiguity</div>
            <p className="text-slate-600 leading-relaxed">
              Invoices starting with 'C' capture returns, cancellations, and damaged goods without reason taxonomy codes. Transit damage cannot be formally segregated from buyer remorse.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900">4. Retrospective Observational Nature</div>
            <p className="text-slate-600 leading-relaxed">
              Data originates from UK giftware transactions between 2009 and 2011. Economic conditions, wholesale channels, and e-commerce buyer behaviors reflect that historical timeframe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
