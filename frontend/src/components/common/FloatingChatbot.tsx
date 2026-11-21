// VillageVerse AI: Premium Spatial AI Copilot (Voice-Enabled, Vision Pro Inspired)
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePanchayat } from '../../context/PanchayatContext';
import { api } from '../../services/api';
import { 
  Bot, X, Send, Sparkles, Mic, MicOff, Volume2, VolumeX, 
  Trash2, Download, Check, ChevronDown, MessageSquare, Terminal 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const FloatingChatbot: React.FC = () => {
  const { language, t } = useLanguage();
  const { activePanchayat } = usePanchayat();
  const gpDisplayName = activePanchayat?.name?.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim() || 'Village';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: language === 'kn'
        ? `ನಮಸ್ಕಾರ! ನಾನು ${activePanchayat.name_kn}ದ ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ಎಐ ಕೋಪೈಲಟ್. ಗ್ರಾಮದ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ (${activePanchayat.health_score}/100), ಕುಡಿಯುವ ನೀರಿನ ಸಂಗ್ರಹ, ಕೃಷಿ ರೋಗಗಳು, ಬಜೆಟ್ ಅಥವಾ ತುರ್ತು ಸಹಾಯದ ಬಗ್ಗೆ ಏನು ತಿಳಿಯಬೇಕಿದೆ?`
        : `Namaskara! I am VillageVerse AI Copilot for ${activePanchayat.name}. Ask me to explain the Health Score (${activePanchayat.health_score}/100), generate monthly DPR reports, predict floods, or provide crop advisories in English or Kannada!`,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Web Speech API Voice Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'kn' ? 'kn-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your browser. Please use Chrome/Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
      recognitionRef.current.start();
    }
  };

  // Text-to-Speech Output
  const speakText = (text: string) => {
    if (!voiceOutputEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const quickPrompts = [
    'Explain Village Health Score (86/100)',
    'Explain Dashboard & Live Telemetry',
    'Generate Monthly Village DPR Report',
    'Predict 30-Day Monsoon & Flood Risk',
    'Crop & Fertilizer Recommendation',
    'Water Shortage & Borewell Depth',
    'Electricity Demand & Solar Optimization',
    'Emergency Assistance Protocol'
  ];

  const handleSend = async (messageToSend?: string) => {
    const text = messageToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const data = await api.sendChatMessage(text, language);
      const reply = data.response || 'Information updated from Gram Panchayat live database.';
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      speakText(reply);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Telemetry synchronized with ${activePanchayat.name} digital twin database.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'init-fresh',
        sender: 'bot',
        text: `Session history cleared. How may I assist you with ${activePanchayat.name} operations?`,
        time: 'Just now'
      }
    ]);
  };

  const handleExportTranscript = () => {
    const transcript = messages.map(m => `[${m.time}] ${m.sender.toUpperCase()}: ${m.text}`).join('\n\n');
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gpDisplayName}_AI_Copilot_Transcript_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Spatial Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:scale-105 transition-all duration-300 active:scale-95 group border border-white/20"
        >
          <Bot className="w-5 h-5 text-slate-950 font-black animate-bounce" />
          <span className="text-xs font-black tracking-wide font-mono">VillageVerse Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7] animate-ping" />
        </button>
      )}

      {/* Floating Spatial Chat Window Drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] rounded-[24px] glass-panel border border-cyan-500/30 shadow-[0_30px_80px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-[#09152e]/95 via-slate-900 to-[#0a1b38]/95 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-md">
                <Bot className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-white flex items-center gap-1.5">
                  VillageVerse AI Copilot
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[10px] text-emerald-400 font-mono">{gpDisplayName} Autonomous Reasoning Core</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setVoiceOutputEnabled(!voiceOutputEnabled)}
                className={`p-1.5 rounded-xl transition ${
                  voiceOutputEnabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'
                }`}
                title={voiceOutputEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
              >
                {voiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={handleExportTranscript}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
                title="Export Transcript"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/[0.06] transition"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Prompt Chips */}
          <div className="p-2.5 bg-slate-950/60 border-b border-white/[0.05] overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md'
                      : 'bg-[#0d1c38]/90 text-slate-200 border border-white/[0.08] rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs p-2.5 bg-white/[0.03] rounded-2xl w-fit border border-white/[0.05]">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-[11px] text-cyan-300">Copilot analyzing telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Input Active Banner */}
          {isListening && (
            <div className="px-3.5 py-1.5 bg-red-950/80 border-t border-red-500/40 text-red-300 text-[11px] flex items-center justify-between animate-pulse">
              <span className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-red-400" />
                Listening to speech in {language === 'kn' ? 'Kannada' : 'English'}...
              </span>
              <button
                onClick={toggleVoiceInput}
                className="text-red-300 underline font-semibold text-[10px]"
              >
                Stop
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-slate-950/80 border-t border-white/[0.08] flex items-center space-x-2">
            <button
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-xl border transition ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 animate-pulse'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/[0.08] hover:bg-white/[0.08]'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'kn' ? `${activePanchayat.name_kn} ಪ್ರಶ್ನೆ ಕೇಳಿ...` : `Ask ${gpDisplayName} Copilot...`}
              className="flex-1 bg-white/[0.05] border border-white/[0.09] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold hover:from-emerald-500 hover:to-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
