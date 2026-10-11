import React, { useState } from 'react';
import { INTERVIEW_PLAYBOOK } from '../data/retailDataset';
import { InterviewQA } from '../types/retail';
import { GraduationCap, ShieldCheck, ThumbsDown, ThumbsUp, AlertTriangle, Lightbulb } from 'lucide-react';

export const InterviewDefenseView: React.FC = () => {
  const [activeQAId, setActiveQAId] = useState<string>('QA-01');

  const activeQA: InterviewQA =
    INTERVIEW_PLAYBOOK.find((item) => item.id === activeQAId) || INTERVIEW_PLAYBOOK[0];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
          <span>Career Mentorship</span>
          <span aria-hidden="true">·</span>
          <span>Technical Interview Defense Playbook</span>
          <span aria-hidden="true">·</span>
          <span className="text-blue-600 font-semibold">Senior Analytics Engineer Coaching</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          How to Defend RetailIQ in Technical Interviews
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Hiring managers test whether you actually understand data tradeoffs or just ran cookie-cutter scripts. Below is senior-level guidance on how to defend data cleaning decisions, statistical methods, and business conclusions.
        </p>
      </div>

      {/* Question Selector Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {INTERVIEW_PLAYBOOK.map((qa) => {
          const isActive = activeQAId === qa.id;
          return (
            <button
              key={qa.id}
              onClick={() => setActiveQAId(qa.id)}
              className={`p-3.5 rounded-lg border text-left transition-all ${
                isActive
                  ? 'border-slate-900 ring-2 ring-slate-900 bg-slate-50/70 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40'
              }`}
            >
              <div className="text-3xs font-mono font-bold text-slate-400 mb-1">
                {qa.category} · {qa.id}
              </div>
              <div className="text-xs font-bold text-slate-900 line-clamp-2">
                {qa.question}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Defense Deep Dive */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        <div>
          <div className="text-xs font-mono text-blue-700 font-bold mb-1">
            Category: {activeQA.category} · {activeQA.id}
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            "{activeQA.question}"
          </h2>
        </div>

        {/* Weak vs Strong Response Contrast Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Junior Response */}
          <div className="p-4 bg-rose-50/40 rounded-lg border border-rose-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
              <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
              <span>Junior / Weak Response (High Rejection Hazard)</span>
            </div>
            <p className="text-xs text-rose-900/90 leading-relaxed italic bg-white/70 p-3 rounded border border-rose-100">
              "{activeQA.juniorWeakResponse}"
            </p>
            <div className="text-2xs text-rose-800 pt-1">
              <strong>Why this fails:</strong> Demonstrates a lack of awareness about financial reconciliation, data loss consequences, or stakeholder communication.
            </div>
          </div>

          {/* Senior Response */}
          <div className="p-4 bg-emerald-50/40 rounded-lg border border-emerald-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Senior Data Analyst Response (What Interviewers Want)</span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed bg-white/80 p-3 rounded border border-emerald-100 font-medium">
              "{activeQA.seniorStrongResponse}"
            </p>
            <div className="text-2xs text-emerald-800 pt-1">
              <strong>Why this succeeds:</strong> Demonstrates systems thinking, Kimball dimensional discipline, and business acumen.
            </div>
          </div>
        </div>

        {/* Mentor Key Takeaway */}
        <div className="p-4 bg-blue-50/60 rounded-lg border border-blue-200 text-xs text-blue-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-blue-700" />
            <span>Mentor Strategic Principle:</span>
          </div>
          <p className="text-blue-900/90 leading-relaxed">
            {activeQA.mentorTakeaway}
          </p>
        </div>

        {/* Red Flags to Avoid */}
        <div className="p-4 bg-amber-50/60 rounded-lg border border-amber-200 text-xs text-amber-950 space-y-2">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Red Flags to Avoid During the Interview:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-amber-900">
            {activeQA.redFlagsToAvoid.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
