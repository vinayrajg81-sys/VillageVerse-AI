import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('VillageVerse AI Uncaught Component Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-rose-500/30 text-center space-y-5 bg-gradient-to-b from-slate-900/90 to-rose-950/20 backdrop-blur-xl shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">Module Telemetry Encountered an Issue</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                A temporary rendering exception was caught. The system has prevented an application crash.
              </p>
              {this.state.error?.message && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Module</span>
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-300 font-bold text-xs flex items-center gap-2 transition"
              >
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span>Command Center</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
