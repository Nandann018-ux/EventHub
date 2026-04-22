import React from 'react';


const EventSkeleton = () => {
  return (
    <div className="bg-slate-800/40 border border-slate-700/30 rounded-3xl p-6 shadow-xl animate-pulse">
      {}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-3 flex-1">
          <div className="h-7 bg-slate-700 rounded-lg w-3/4" />
          <div className="h-4 bg-slate-700/50 rounded-md w-1/2" />
        </div>
        <div className="h-10 w-10 bg-slate-700 rounded-xl" />
      </div>

      {}
      <div className="space-y-2 mb-8">
        <div className="h-4 bg-slate-700/40 rounded-md w-full" />
        <div className="h-4 bg-slate-700/40 rounded-md w-5/6" />
      </div>

      {}
      <div className="pt-6 border-t border-slate-700/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-700/60" />
          <div className="space-y-1.5">
            <div className="h-3.5 bg-slate-700/60 rounded-sm w-20" />
            <div className="h-2.5 bg-slate-700/30 rounded-sm w-24" />
          </div>
        </div>
        <div className="h-5 w-16 bg-slate-700/40 rounded-full" />
      </div>
    </div>
  );
};

export default EventSkeleton;
