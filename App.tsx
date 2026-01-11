
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import { generateCinematicImage, startChatSession, ImageModel, AspectRatio, ImageSize } from './services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
  type: 'text' | 'image';
  imageData?: string;
  sources?: { title: string; uri: string }[];
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assistant' | 'imaging' | 'social'>('assistant');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [model, setModel] = useState<ImageModel>('gemini-2.5-flash-image');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [quality, setQuality] = useState<ImageSize>('1K');
  
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { 
      role: 'model', 
      text: 'Arun AI Studio initialized. System operational. I am your high-fidelity intelligence partner. Use the "Social" tab to promote this studio on your channel!', 
      type: 'text' 
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  useEffect(() => { scrollToBottom(); }, [chatHistory]);
  const scrollToBottom = () => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const handleAssistantSend = async () => {
    if (!prompt.trim()) return;
    const userMessage: Message = { role: 'user', text: prompt, type: 'text' };
    setChatHistory(prev => [...prev, userMessage]);
    setPrompt('');
    setIsProcessing(true);
    setError(null);
    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = startChatSession("You are Arun AI Studio. High-performance, professional, technical.");
      }
      const response = await chatSessionRef.current.sendMessageStream({ message: userMessage.text });
      let assistantMessage: Message = { role: 'model', text: '', type: 'text' };
      setChatHistory(prev => [...prev, assistantMessage]);
      let fullText = '';
      for await (const chunk of response) {
        fullText += chunk.text;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { ...assistantMessage, text: fullText };
          return newHistory;
        });
      }
    } catch (err: any) { setError(err.message); } finally { setIsProcessing(false); }
  };

  const handleImagingGenerate = async () => {
    if (!prompt.trim() && !originalImage) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await generateCinematicImage({ model, prompt, image: originalImage || undefined, aspectRatio, imageSize: quality });
      setChatHistory(prev => [...prev, 
        { role: 'user', text: `Render: ${prompt}`, type: 'text' }, 
        { role: 'model', text: `Vision Rendered.`, type: 'image', imageData: result }
      ]);
      setPrompt('');
    } catch (err: any) { setError(err.message); } finally { setIsProcessing(false); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard! Ready to post on your channel.");
  };

  return (
    <div className="min-h-screen bg-[#000] text-white flex flex-col font-sans selection:bg-blue-500/30">
      <div className="flex-shrink-0 px-4 pt-4 border-b border-white/5">
        <Header />
      </div>

      <div className="flex-1 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row h-[calc(100vh-140px)] overflow-hidden">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 p-4 border-r border-white/5 flex flex-col gap-4">
          <div className="glass-panel p-4 rounded-2xl space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2">Systems</h3>
            <button onClick={() => setActiveTab('assistant')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'assistant' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
              <div className={`w-2 h-2 rounded-full ${activeTab === 'assistant' ? 'bg-emerald-400' : 'bg-gray-700'}`}></div>
              <span className="text-xs font-bold uppercase">AI Core</span>
            </button>
            <button onClick={() => setActiveTab('imaging')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'imaging' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
              <div className={`w-2 h-2 rounded-full ${activeTab === 'imaging' ? 'bg-blue-400' : 'bg-gray-700'}`}></div>
              <span className="text-xs font-bold uppercase">Vision Lab</span>
            </button>
            <button onClick={() => setActiveTab('social')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'social' ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(236,72,153,0.2)]' : 'text-gray-500 hover:text-white'}`}>
              <div className={`w-2 h-2 rounded-full ${activeTab === 'social' ? 'bg-pink-500 animate-pulse' : 'bg-gray-700'}`}></div>
              <span className="text-xs font-bold uppercase">Social & Promote</span>
            </button>
          </div>

          <div className="mt-auto p-4 flex items-center justify-between border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-gray-600 uppercase">App Status</span>
              <span className="text-[10px] font-black text-emerald-500">PRODUCTION READY</span>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {activeTab === 'social' ? (
            <div className="flex-1 overflow-y-auto p-8 space-y-12 animate-in fade-in slide-in-from-right duration-500">
              <section className="max-w-3xl mx-auto space-y-6">
                <h2 className="text-3xl font-black tracking-tighter uppercase text-gradient">Promote Your Studio</h2>
                <p className="text-gray-400 text-sm leading-relaxed">Boost your channel visibility. Share these assets to tell your audience about the new Arun AI Studio experience.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PWA Card */}
                  <div className="glass-panel p-6 rounded-[2rem] border-blue-500/20">
                    <div className="text-blue-400 text-3xl mb-4">📱</div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-2">Install as App</h4>
                    <p className="text-[11px] text-gray-500 mb-4">Open this link on your phone and select "Add to Home Screen" to use Arun AI Studio as a native app.</p>
                  </div>
                  
                  {/* Share Card */}
                  <div className="glass-panel p-6 rounded-[2rem] border-pink-500/20">
                    <div className="text-pink-400 text-3xl mb-4">🌍</div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-2">Social Reach</h4>
                    <p className="text-[11px] text-gray-500 mb-4">Ready to be deployed on Vercel or Netlify for instant global access.</p>
                  </div>
                </div>
              </section>

              <section className="max-w-3xl mx-auto space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Copy Posts for Your Channel</h3>
                <div className="space-y-4">
                  {[
                    "🔥 Just launched my new AI Studio! Create cinematic 8K visuals and chat with my custom Technical Assistant. Try it now at Arun AI Studio!",
                    "🚀 Arun AI Studio v2.0 is HERE! The most realistic image generation engine I've ever shared. Check out the Vision Lab!",
                    "💻 Technical problem? Ask the Arun AI Core. Immediate, detailed answers for developers and creators."
                  ].map((post, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
                      <p className="text-[11px] text-gray-300 italic">"{post}"</p>
                      <button onClick={() => copyToClipboard(post)} className="ml-4 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase transition-all">Copy</button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="max-w-3xl mx-auto pb-12">
                <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-pink-600/20 mix-blend-overlay"></div>
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-black/60 backdrop-blur-sm">
                      <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">ARUN AI STUDIO</h2>
                      <div className="h-1 w-20 bg-blue-500 mb-6"></div>
                      <p className="text-xs font-bold uppercase tracking-[0.5em] text-gray-400">Cinematic Generation • Advanced Intelligence</p>
                   </div>
                   <div className="absolute bottom-6 w-full text-center">
                     <span className="text-[8px] font-black text-gray-600 tracking-widest uppercase opacity-50">PROMOTIONAL COVER CARD</span>
                   </div>
                </div>
                <button 
                  onClick={() => alert("Right click image and 'Save as' to download your cover card!")}
                  className="mt-6 w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-blue-500 hover:text-white transition-all"
                >
                  Download Channel Header
                </button>
              </section>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-8 scrollbar-hide">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                    <span className={`text-[9px] font-black uppercase tracking-widest mb-2 px-1 ${msg.role === 'user' ? 'text-blue-500' : 'text-emerald-500'}`}>
                      {msg.role === 'user' ? 'USER_PROMPT' : 'STUDIO_RESPONSE'}
                    </span>
                    <div className={`max-w-[90%] md:max-w-[75%] rounded-3xl ${msg.role === 'user' ? 'bg-blue-600/10 border border-blue-500/20 px-6 py-4' : 'bg-white/5 border border-white/10 px-6 py-5'}`}>
                      {msg.type === 'text' ? <p className="text-sm md:text-[15px] leading-relaxed text-gray-300 font-light tracking-wide">{msg.text}</p> : (
                        <div className="space-y-4">
                          <img src={msg.imageData} className="rounded-2xl w-full border border-white/10 shadow-2xl" alt="Studio Render" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 md:p-8 bg-black">
                <div className="max-w-4xl mx-auto w-full relative">
                  <div className="relative flex items-end gap-3 glass-panel rounded-2xl p-2 border-white/10">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); activeTab === 'assistant' ? handleAssistantSend() : handleImagingGenerate(); }}}
                      placeholder={activeTab === 'assistant' ? "Ask the AI Core..." : "Describe the cinematic vision..."}
                      className="flex-1 bg-transparent border-none rounded-xl py-3 px-4 text-sm text-gray-200 outline-none resize-none h-12 md:h-14"
                    />
                    <button
                      onClick={activeTab === 'assistant' ? handleAssistantSend : handleImagingGenerate}
                      disabled={isProcessing || !prompt.trim()}
                      className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-all ${isProcessing || !prompt.trim() ? 'bg-white/5 text-gray-700' : 'bg-white text-black hover:bg-blue-500 hover:text-white'}`}
                    >
                      {isProcessing ? <div className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div> : <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
