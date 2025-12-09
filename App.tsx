
import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Menu, 
  X, 
  Settings, 
  MessageSquare, 
  Home, 
  FileText, 
  AlertTriangle,
  User,
  ShieldCheck,
  LogOut,
  HeartHandshake,
  History,
  CreditCard,
  LifeBuoy,
  Shield,
  Phone,
  MessageCircle,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Copy,
  Camera,
  Sparkles,
  Loader2,
  Mail,
  QrCode,
  Lock,
  Moon,
  Quote,
  Star,
  Send,
  ArrowRight
} from 'lucide-react';
import { MaurelloAvatar } from './components/MaurelloAvatar';
import { Notepad } from './components/Notepad';
import { Language, ViewState, Note } from './types';
import { LiveSessionService } from './services/liveService';
import { decodeAudioData } from './audioUtils';

// --- CUSTOM BRAND ICONS FOR AUTHENTIC COLORS ---
const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26-.19-.58z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleLogo = ({ isDark, className }: { isDark: boolean; className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill={isDark ? '#FFF' : '#000'} d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
  </svg>
);

const THINKING_PHRASES = [
  "absorvendo...",
  "refletindo...",
  "sentindo...",
  "compreendendo...",
  "conectando...",
  "analisando..."
];

// --- TRANSLATIONS (Shortened for brevity, mostly same as previous) ---
const TRANSLATIONS = {
    PT: {
        menu_home: "Início",
        menu_history: "Histórico",
        menu_crisis: "Ajuda em Crise",
        menu_testimonials: "Depoimentos",
        menu_plans: "Planos e Assinatura",
        menu_support: "Suporte",
        menu_legal: "Privacidade e Termos",
        menu_settings: "Configurações",
        menu_report: "Reportar Erro",
        menu_psychologist: "Trabalhe com Angel",
        menu_logout: "Sair",
        
        home_greeting: "Olá, sou a",
        home_subtitle: "A cura pela fala!",
        home_btn_start: "Iniciar Conversa",
        home_connecting: "conectando à Angel...",
        home_mic_access: "acessando dispositivos...",
        
        session_end: "Encerrar Sessão",
        
        cam_modal_title: "Habilitar Câmera?",
        cam_modal_desc: "Para que eu possa te acompanhar de forma mais humana e sensível, você pode me permitir acessar sua câmera?\nNão armazeno nada, não faço gravação, e tudo acontece apenas no seu dispositivo.\nIsso me ajuda a perceber sua expressão, sua energia e seu estado do momento — sempre com muito respeito.",
        cam_btn_enable: "Ativar Câmera",
        cam_btn_skip: "Continuar sem Câmera",

        crisis_title: "Ajuda em Crise",
        crisis_desc: "Se você estiver se sentindo em risco, você pode ligar gratuitamente para o CVV pelo número 188 ou clicar para falar com um psicólogo.",
        crisis_cvv_title: "Ligar para o CVV (188)",
        crisis_cvv_sub: "Atendimento 24h, gratuito e sigiloso.",
        crisis_psy_title: "Fale com um Psicólogo",
        crisis_psy_sub: "Converse via WhatsApp com um parceiro.",
        crisis_btn_partner: "Trabalhe com Angel: Sou Psicólogo",
        
        history_title: "Prontuário Emocional",
        history_desc: "Aqui está o seu histórico emocional. Você pode rever suas sessões anteriores e acessar suas anotações importantes.",
        history_sessions: "Sessões Anteriores",
        history_notes: "Anotações Salvas",
        history_empty: "Nenhuma anotação registrada ainda.",
        
        plans_title: "Plano Premium",
        plans_desc: "Você está aproveitando um valor promocional. Por R$ 9,90/mês você terá acesso ilimitado.",
        plans_offer: "Oferta Limitada",
        plans_cancel: "Cancele quando quiser.",
        plans_btn: "Assinar Agora",
        
        support_title: "Suporte",
        support_desc: "Como posso te ajudar? Descreva sua dúvida e eu ou nossa equipe retornaremos o mais rápido possível.",
        support_placeholder: "Digite sua mensagem aqui...",
        support_btn: "Enviar Mensagem",
        
        legal_title: "Privacidade e Termos",
        
        settings_title: "Configurações",
        settings_profile: "Perfil",
        settings_appearance: "Aparência e Voz",
        settings_dark: "Tema Escuro",
        settings_voice_label: "Voz de Angel",
        settings_voice_fem: "Feminina",
        settings_voice_male: "Masculina",
        
        auth_login: "Login",
        auth_signup: "Criar Conta",
        auth_email: "E-mail",
        auth_pass: "Senha",
        auth_name: "Nome Completo (Mínimo 2 nomes)",
        auth_confirm_pass: "Confirmar Senha",
        auth_terms: "Aceito os Termos de Uso e Privacidade",
        auth_read_terms: "Ler Termos",
        auth_forgot: "Esqueci minha senha",
        auth_or: "ou continuar com",
        auth_btn_login: "Entrar",
        auth_btn_signup: "Cadastrar",
        auth_verify_title: "Verifique seu E-mail",
        auth_verify_desc: "Enviamos um código de cadastro para o seu e-mail. Insira-o abaixo.",
        auth_verify_btn: "Confirmar Cadastro",
        
        visit_title: "Visitante",
        visit_desc: "Plano Gratuito",
        visit_error_limit: "O uso gratuito diário já foi utilizado. Faça sua assinatura para continuar.",
        
        trial_timer: "Sessão Gratuita:",
    },
    EN: {
        menu_home: "Home",
        menu_history: "History",
        menu_crisis: "Crisis Help",
        menu_testimonials: "Testimonials",
        menu_plans: "Plans & Subscription",
        menu_support: "Support",
        menu_legal: "Privacy & Terms",
        menu_settings: "Settings",
        menu_report: "Report Error",
        menu_psychologist: "Work with Angel",
        menu_logout: "Logout",
        
        home_greeting: "Hello, I am",
        home_subtitle: "Healing through speech!",
        home_btn_start: "Start Conversation",
        home_connecting: "connecting to Angel...",
        home_mic_access: "accessing devices...",
        
        session_end: "End Session",
        
        cam_modal_title: "Enable Camera?",
        cam_modal_desc: "To help me accompany you in a more human and sensitive way, may I access your camera?\nI store nothing, record nothing, and everything happens only on your device.\nThis helps me perceive your expression, energy, and state of the moment — always with great respect.",
        cam_btn_enable: "Enable Camera",
        cam_btn_skip: "Continue without Camera",

        crisis_title: "Crisis Help",
        crisis_desc: "If you feel at risk, call 188 (CVV) for free or click to talk to a psychologist.",
        crisis_cvv_title: "Call CVV (188)",
        crisis_cvv_sub: "24h service, free and confidential.",
        crisis_psy_title: "Talk to a Psychologist",
        crisis_psy_sub: "Chat via WhatsApp with a partner.",
        crisis_btn_partner: "Work with Angel: I am a Psychologist",
        
        history_title: "Emotional Record",
        history_desc: "Here is your emotional history. You can review previous sessions and access important notes.",
        history_sessions: "Previous Sessions",
        history_notes: "Saved Notes",
        history_empty: "No notes recorded yet.",
        
        plans_title: "Premium Plan",
        plans_desc: "You are enjoying a promotional price. For R$ 9.90/month you get unlimited access.",
        plans_offer: "Limited Offer",
        plans_cancel: "Cancel anytime.",
        plans_btn: "Subscribe Now",
        
        support_title: "Support",
        support_desc: "How can I help? Describe your question and our team will reply ASAP.",
        support_placeholder: "Type your message here...",
        support_btn: "Send Message",
        
        legal_title: "Privacy & Terms",
        
        settings_title: "Settings",
        settings_profile: "Profile",
        settings_appearance: "Appearance & Voice",
        settings_dark: "Dark Mode",
        settings_voice_label: "Voice of Angel",
        settings_voice_fem: "Feminina",
        settings_voice_male: "Masculina",
        
        auth_login: "Login",
        auth_signup: "Create Account",
        auth_email: "Email",
        auth_pass: "Senha",
        auth_name: "Full Name (At least 2 names)",
        auth_confirm_pass: "Confirm Password",
        auth_terms: "I accept Terms and Privacy",
        auth_read_terms: "Read Terms",
        auth_forgot: "I forgot my password",
        auth_or: "or continue with",
        auth_btn_login: "Login",
        auth_btn_signup: "Sign Up",
        auth_verify_title: "Verify your Email",
        auth_verify_desc: "We sent a signup code to your email. Enter it below.",
        auth_verify_btn: "Confirm Signup",
        
        visit_title: "Visitor",
        visit_desc: "Free Plan",
        visit_error_limit: "Daily free usage has been used. Subscribe to continue.",
        
        trial_timer: "Free Session:",
    },
    ES: {
        menu_home: "Inicio",
        menu_history: "Historial",
        menu_crisis: "Ayuda en Crisis",
        menu_testimonials: "Testimonios",
        menu_plans: "Planes y Suscripción",
        menu_support: "Soporte",
        menu_legal: "Privacidad y Términos",
        menu_settings: "Configuración",
        menu_report: "Reportar Error",
        menu_psychologist: "Trabaja con Angel",
        menu_logout: "Cerrar Sesión",
        
        home_greeting: "Hola, soy",
        home_subtitle: "¡La cura a través del habla!",
        home_btn_start: "Iniciar Conversación",
        home_connecting: "conectando a Angel...",
        home_mic_access: "accediendo a dispositivos...",
        
        session_end: "Terminar Sesión",
        
        cam_modal_title: "¿Habilitar Cámara?",
        cam_modal_desc: "Para ayudarme a acompañarte de una manera más humana y sensible, ¿puedo acceder a tu cámara?\nNo guardo nada, no grabo nada, y todo sucede solo en tu dispositivo.\nEsto me ayuda a percibir tu expresión, energía y estado del momento — siempre con mucho respeto.",
        cam_btn_enable: "Activar Cámara",
        cam_btn_skip: "Continuar sin Cámara",

        crisis_title: "Ayuda en Crisis",
        crisis_desc: "Si te sientes en riesgo, llama gratis al 188 (CVV) o haz clic para hablar con un psicólogo.",
        crisis_cvv_title: "Llamar al CVV (188)",
        crisis_cvv_sub: "Atención 24h, gratuita y confidencial.",
        crisis_psy_title: "Hablar con un Psicólogo",
        crisis_psy_sub: "Chatea por WhatsApp con un socio.",
        crisis_btn_partner: "Trabaja con Angel: Soy Psicólogo",
        
        history_title: "Registro Emocional",
        history_desc: "Aquí está tu historial emocional. Puedes revisar sesiones anteriores y acceder a notas importantes.",
        history_sessions: "Sesiones Anteriores",
        history_notes: "Notas Guardadas",
        history_empty: "Aún no hay notas registradas.",
        
        plans_title: "Plan Premium",
        plans_desc: "Estás aprovechando un precio promocional. Por R$ 9,90/mes tendrás acceso ilimitado.",
        plans_offer: "Oferta Limitada",
        plans_cancel: "Cancela cuando quieras.",
        plans_btn: "Suscribirse Ahora",
        
        support_title: "Soporte",
        support_desc: "¿Cómo puedo ayudarte? Describe tu duda y nuestro equipo responderá lo antes posible.",
        support_placeholder: "Escribe tu mensaje aquí...",
        support_btn: "Enviar Mensaje",
        
        legal_title: "Privacidad y Términos",
        
        settings_title: "Configuración",
        settings_profile: "Perfil",
        settings_appearance: "Apariencia y Voz",
        settings_dark: "Modo Oscuro",
        settings_voice_label: "Voz de Angel",
        settings_voice_fem: "Femenina",
        settings_voice_male: "Masculina",
        
        auth_login: "Iniciar Sesión",
        auth_signup: "Crear Cuenta",
        auth_email: "Correo",
        auth_pass: "Contraseña",
        auth_name: "Nombre Completo (Mínimo 2 nombres)",
        auth_confirm_pass: "Confirmar Contraseña",
        auth_terms: "Acepto los Términos y Privacidad",
        auth_read_terms: "Leer Términos",
        auth_forgot: "Olvidé mi contraseña",
        auth_or: "o continuar con",
        auth_btn_login: "Entrar",
        auth_btn_signup: "Registrarse",
        auth_verify_title: "Verifique su Correo",
        auth_verify_desc: "Enviamos un código de registro a su correo. Ingréselo abajo.",
        auth_verify_btn: "Confirmar Registro",
        
        visit_title: "Visitante",
        visit_desc: "Plan Gratuito",
        visit_error_limit: "El uso gratuito diario ya se ha utilizado. Suscríbete para continuar.",
        
        trial_timer: "Sesión Gratuita:",
    }
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const App: React.FC = () => {
  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [language, setLanguage] = useState<Language>(Language.PT);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  
  // Camera State
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  // Settings State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  // Removed AI Volume State as it's now system controlled
  
  // Auth & Trial State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [authStep, setAuthStep] = useState<'FORM' | 'VERIFY'>('FORM');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialTimeLeft, setTrialTimeLeft] = useState(180); 
  const [authForm, setAuthForm] = useState({ name: '', email: '', pass: '', confirmPass: '', terms: false });
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Social Redirect State
  const [socialRedirect, setSocialRedirect] = useState<{provider: 'google' | 'apple', active: boolean}>({provider: 'google', active: false});
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  // Payment, Recovery, Psych Forms...
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'PIX'>('CARD');
  const [cardForm, setCardForm] = useState({ name: '', number: '', expiry: '', cvv: '', cpf: '' });
  const [paymentStep, setPaymentStep] = useState<'FORM' | 'VERIFY' | 'SUCCESS'>('FORM');
  const [verificationCode, setVerificationCode] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [resetForm, setResetForm] = useState({ newPass: '', confirmPass: '' });
  const [resetSuccess, setResetSuccess] = useState(false);
  const [psychForm, setPsychForm] = useState({ name: '', crp: '', phone: '', email: '', specialty: '', link: '' });
  const [psychErrors, setPsychErrors] = useState<Record<string, boolean>>({});
  const [psychStep, setPsychStep] = useState<'INTRO_FORM' | 'PAYMENT_LINK'>('INTRO_FORM');

  // New Forms State (Support, Report, Testimonial)
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ name: '', message: '' });
  const [testimonialSent, setTestimonialSent] = useState(false);

  // Notepad State
  const [notes, setNotes] = useState<Note[]>([]);
  const [isNoteVisible, setIsNoteVisible] = useState(false);

  // Audio Playback State
  const liveService = useRef<LiveSessionService>(new LiveSessionService());
  const playbackCtx = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null); 
  const nextStartTime = useRef<number>(0);
  const speakTimeout = useRef<number | null>(null);
  const sources = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
      let interval: number | undefined;
      if (isTrialActive && isSessionActive && trialTimeLeft > 0) {
          interval = window.setInterval(() => {
              setTrialTimeLeft((prev) => prev - 1);
          }, 1000);
      } else if (isTrialActive && isSessionActive && trialTimeLeft <= 0) {
          handleStopSession();
          localStorage.setItem('angel_visitor_usage', Date.now().toString());
          setCurrentView('PAYMENT');
          setIsTrialActive(false);
      }
      return () => clearInterval(interval);
  }, [isTrialActive, isSessionActive, trialTimeLeft]);

  useEffect(() => {
    let interval: number;
    if (isAiThinking) {
      let i = 0;
      setThinkingText(THINKING_PHRASES[0]);
      interval = window.setInterval(() => {
        i = (i + 1) % THINKING_PHRASES.length;
        setThinkingText(THINKING_PHRASES[i]);
      }, 1500);
    } else {
      setThinkingText("");
    }
    return () => clearInterval(interval);
  }, [isAiThinking]);

  const handleNavigation = (view: ViewState) => {
    setCurrentView(view);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleStopSession = () => {
      liveService.current.stop();
      setIsSessionActive(false);
      setIsAiSpeaking(false);
      setIsAiThinking(false);
      setIsConnecting(false);
      setCameraStream(null); 

      if (playbackCtx.current) {
          try {
              sources.current.forEach(s => {
                  try { s.stop(); } catch(e){}
              });
              sources.current.clear();
              playbackCtx.current.suspend();
          } catch(e) {}
      }
      setCurrentView('HOME');
  };

  const handleLogout = () => {
      handleStopSession();
      setIsAuthenticated(false);
      setAuthForm({ name: '', email: '', pass: '', confirmPass: '', terms: false });
      setAuthStep('FORM');
      setAuthCode('');
      setCurrentView('HOME');
      if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const addNote = (title: string, items: string[]) => {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        items,
        date: new Date()
      };
      setNotes(prev => [newNote, ...prev]);
      setIsNoteVisible(true);
  };

  const handleStartRequest = () => {
      setError(null);
      setShowCameraModal(true);
  };

  const handleCameraDecision = async (enable: boolean) => {
      setShowCameraModal(false);
      await startSessionLogic(enable);
  };

  const startSessionLogic = async (useCamera: boolean) => {
      setIsConnecting(true);
      setConnectionStatus(t.home_mic_access);
      setError(null);

      // Init Playback
      if (!playbackCtx.current || playbackCtx.current.state === 'closed') {
        playbackCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (playbackCtx.current.state === 'suspended') {
        await playbackCtx.current.resume();
      }

      if (!gainNode.current && playbackCtx.current) {
          gainNode.current = playbackCtx.current.createGain();
          gainNode.current.gain.value = 1.0; // Fixed gain, user uses device volume
          gainNode.current.connect(playbackCtx.current.destination);
      }

      nextStartTime.current = playbackCtx.current.currentTime + 0.1;

      try {
          await liveService.current.prepare(useCamera);
          
          if (useCamera) {
             const stream = liveService.current.getStream();
             // Only set camera stream if video tracks exist (fallback might have removed them)
             if (stream && stream.getVideoTracks().length > 0) {
                 setCameraStream(stream);
             } else {
                 setCameraStream(null);
             }
          }

          setConnectionStatus(t.home_connecting);
          
          await liveService.current.connect({
              language,
              voiceGender,
              onAudioData: (data) => {
                  if (!playbackCtx.current || !gainNode.current) return;
                  
                  setIsAiThinking(false);
                  setIsAiSpeaking(true);
                  if (speakTimeout.current) clearTimeout(speakTimeout.current);
                  speakTimeout.current = window.setTimeout(() => {
                      setIsAiSpeaking(false);
                  }, 1000);

                  decodeAudioData(data, playbackCtx.current).then(buffer => {
                      if (!playbackCtx.current || !gainNode.current) return;
                      const source = playbackCtx.current.createBufferSource();
                      source.buffer = buffer;
                      source.connect(gainNode.current);
                      
                      const now = playbackCtx.current.currentTime;
                      nextStartTime.current = Math.max(nextStartTime.current, now);
                      
                      source.start(nextStartTime.current);
                      nextStartTime.current += buffer.duration;

                      sources.current.add(source);
                      source.onended = () => {
                          sources.current.delete(source);
                          if (sources.current.size === 0) {
                              setIsAiSpeaking(false);
                          }
                      };
                  });
              },
              onClose: () => {
                  setIsSessionActive(false);
                  setCurrentView('HOME');
                  setCameraStream(null);
              },
              onError: (e) => {
                  console.error(e);
                  let msg = "Erro de conexão.";
                  if (e.toString().includes("Network") || e.toString().includes("fetch")) {
                    msg = "Erro de rede. Verifique sua internet.";
                  } else if (e.toString().includes("403")) {
                    msg = "Acesso negado. Verifique a chave de API.";
                  }
                  setError(msg);
                  handleStopSession();
              },
              onInterrupted: () => {
                  if (playbackCtx.current) {
                      sources.current.forEach(source => {
                          try { source.stop(); } catch(e) {}
                      });
                      sources.current.clear();
                      nextStartTime.current = playbackCtx.current.currentTime;
                      setIsAiSpeaking(false);
                      setIsAiThinking(false);
                  }
              },
              onTurnComplete: () => {
                  setIsAiThinking(true);
              },
              onCreateNote: addNote,
              videoStream: useCamera ? liveService.current.getStream() : null
          });

          setIsConnecting(false);
          setIsSessionActive(true);
          setCurrentView('SESSION');

      } catch (e: any) {
          console.error(e);
          // Use specific error message if available, otherwise generic
          const msg = e.message || "Falha ao iniciar. Verifique permissões e conexão.";
          setError(msg);
          setIsConnecting(false);
      }
  };

  // --- Mock Handlers for Forms ---
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCardForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitPayment = () => {
      setIsProcessingPayment(true);
      setTimeout(() => {
          setIsProcessingPayment(false);
          setPaymentStep('VERIFY');
      }, 2000);
  };

  const verifyPaymentCode = () => {
      setIsProcessingPayment(true);
      setTimeout(() => {
          setIsProcessingPayment(false);
          setPaymentStep('SUCCESS');
          setTimeout(() => {
             setIsAuthenticated(true);
             setCurrentView('SESSION');
             setPaymentStep('FORM'); 
          }, 2000);
      }, 1500);
  };

  const submitRecovery = () => { setRecoverySuccess(true); };
  const handlePsychChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPsychForm(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  
  const validatePsychForm = () => {
      const errs: any = {};
      if(!psychForm.name) errs.name = true;
      if(!/^\d{2}\/\d{6}$/.test(psychForm.crp)) errs.crp = true;
      if(!/\(\d{2}\)\s\d{5}-\d{4}/.test(psychForm.phone)) errs.phone = true;
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(psychForm.email)) errs.email = true;
      setPsychErrors(errs);
      return Object.keys(errs).length === 0;
  };
  const handlePsychSubmit = () => { 
      if(validatePsychForm()) {
          // Go to payment step instead of immediate success
          setPsychStep('PAYMENT_LINK');
      } 
  };
  
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateFullName = (name: string) => {
    return name.trim().indexOf(' ') !== -1;
  };

  const handleAuthSubmit = () => {
      setAuthError('');
      
      // Basic Validation
      if (!authForm.email || !authForm.pass) { 
          setAuthError("Preencha todos os campos."); return; 
      }
      if (!validateEmail(authForm.email)) {
          setAuthError("E-mail inválido."); return;
      }

      if (authMode === 'SIGNUP') {
          // Signup Specific Validation
          if (!validateFullName(authForm.name)) {
              setAuthError("Digite seu nome completo (pelo menos 2 nomes)."); return;
          }
          if (!authForm.terms) { 
              setAuthError("É necessário aceitar os termos de uso."); return; 
          }
          
          setIsProcessingAuth(true);
          setTimeout(() => {
              setIsProcessingAuth(false);
              setAuthStep('VERIFY');
          }, 1500);
          return;
      }

      completeAuth();
  };

  const completeAuth = () => {
      setIsAuthenticated(true); 
      setShowAuthModal(false);
      setAuthStep('FORM');
      if (isTrialActive) handleStartRequest(); else setCurrentView('HOME');
  }

  const handleSignupVerification = () => {
      if (authCode.length < 3) return;
      setIsProcessingAuth(true);
      setTimeout(() => {
          setIsProcessingAuth(false);
          completeAuth();
      }, 1500);
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
      // Simulate redirection to external provider
      setSocialRedirect({ provider, active: true });
      
      setTimeout(() => {
          // Return from redirection and complete auth
          completeAuth();
          setSocialRedirect({ provider: 'google', active: false });
      }, 3500); // 3.5 seconds to simulate user logging in on external page
  };

  const handleSupportSubmit = () => {
      if (!supportMessage) return;
      setSupportSent(true);
      setTimeout(() => {
          setSupportMessage('');
          setSupportSent(false);
      }, 3000);
  };

  const handleReportSubmit = () => {
      if (!reportText) return;
      setReportSent(true);
      setTimeout(() => {
          setReportText('');
          setReportSent(false);
      }, 3000);
  };

  const handleTestimonialSubmit = () => {
      if (!testimonialForm.name || !testimonialForm.message) return;
      setTestimonialSent(true);
      setTimeout(() => {
          setTestimonialForm({ name: '', message: '' });
          setTestimonialSent(false);
      }, 3000);
  };

  // --- RENDER CAMERA MODAL ---
  const renderCameraModal = () => {
      if (!showCameraModal) return null;
      return (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
              <div className={`max-w-md w-full rounded-2xl shadow-2xl overflow-hidden p-8 text-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
                  <div className="w-16 h-16 bg-maurello-blue/10 text-maurello-blue rounded-full flex items-center justify-center mx-auto mb-6">
                      <Camera size={32} />
                  </div>
                  <h3 className="text-2xl font-serif mb-4">{t.cam_modal_title}</h3>
                  <p className={`text-sm mb-8 whitespace-pre-line leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t.cam_modal_desc}
                  </p>
                  <div className="space-y-3">
                      <button onClick={() => handleCameraDecision(true)} className="w-full py-4 bg-maurello-blue text-white rounded-xl font-medium shadow-lg hover:bg-blue-600 transition-colors">
                          {t.cam_btn_enable}
                      </button>
                      <button onClick={() => handleCameraDecision(false)} className={`w-full py-4 rounded-xl font-medium transition-colors ${isDarkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-800'}`}>
                          {t.cam_btn_skip}
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  // Legal content used in Modal and Legal View
  const legalContent = (
      <div className="space-y-6 text-sm leading-relaxed opacity-90">
          <section>
              <h3 className="text-lg font-bold mb-2 text-maurello-blue">1. Bem-vindo à Angel</h3>
              <p>
                  Agradecemos por usar a Angel. Estes Termos de Serviço ("Termos") regem o uso da nossa assistente de inteligência artificial focada em apoio emocional. 
                  Ao criar uma conta ou usar a Angel, você concorda com estes Termos.
              </p>
          </section>

          <section>
              <h3 className="text-lg font-bold mb-2 text-maurello-blue">2. Isenção de Responsabilidade Médica</h3>
              <p className="font-semibold text-red-500 mb-2">Atenção: A Angel não é um profissional de saúde, médico ou psicólogo humano.</p>
              <p>
                  Os serviços prestados são baseados em inteligência artificial e destinam-se apenas a apoio emocional, bem-estar e autoconhecimento. 
                  A Angel <strong>não fornece diagnósticos médicos, prescrições ou tratamentos</strong>. 
                  Em situações de emergência médica ou risco de vida, contate imediatamente os serviços de emergência (190, 192) ou o CVV (188).
              </p>
          </section>

          <section>
              <h3 className="text-lg font-bold mb-2 text-maurello-blue">3. Sua Privacidade e Dados</h3>
              <p className="mb-2">
                  Sua privacidade é fundamental para nós. Esta seção explica como tratamos seus dados:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Coleta de Informações:</strong> Coletamos o conteúdo, áudio e vídeo que você fornece voluntariamente durante as interações para permitir o funcionamento do serviço.</li>
                  <li><strong>Processamento de IA:</strong> Suas interações são processadas por modelos avançados de linguagem para gerar respostas coerentes e empáticas.</li>
              </ul>
          </section>

          <section className={`p-4 rounded-lg border-l-4 border-maurello-gold ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
              <h3 className="text-lg font-bold mb-2 text-maurello-gold flex items-center gap-2">
                  <ShieldCheck size={20}/> 4. Compartilhamento com Parceiros
              </h3>
              <p className="font-medium">
                  Ao aceitar estes termos, você concorda expressamente e autoriza a Angel a compartilhar seus dados pessoais, dados de uso e registros de interação com nossos Parceiros Comerciais e Afiliados.
              </p>
              <p className="mt-2 text-xs opacity-80">
                  Este compartilhamento tem como finalidade: (i) a melhoria contínua dos modelos de inteligência artificial; (ii) a oferta de serviços complementares de saúde mental por psicólogos parceiros; e (iii) a segurança e monitoramento de situações de risco. Nossos parceiros estão sujeitos a rigorosas obrigações de confidencialidade.
              </p>
          </section>

          <section>
              <h3 className="text-lg font-bold mb-2 text-maurello-blue">5. Uso Aceitável</h3>
              <p>
                  Você concorda em não usar a Angel para promover atividades ilegais, gerar conteúdo de ódio, assédio, ou explorar menores. 
                  O serviço é estritamente destinado a maiores de 18 anos. Violações resultarão na suspensão imediata da conta.
              </p>
          </section>

          <section>
              <h3 className="text-lg font-bold mb-2 text-maurello-blue">6. Alterações nos Termos</h3>
              <p>
                  Podemos atualizar estes Termos periodicamente. Se as alterações forem significativas, notificaremos você. 
                  O uso contínuo da Angel após tais alterações constitui aceitação dos novos Termos.
              </p>
          </section>
      </div>
  );

  const renderTermsModal = () => {
      if (!showTermsModal) return null;
      return (
          <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className={`w-full max-w-2xl bg-white rounded-2xl flex flex-col max-h-[90vh] shadow-2xl ${isDarkMode ? 'bg-gray-900 text-white' : 'text-gray-800'}`}>
                  <div className={`flex-none flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <h2 className="text-2xl font-serif font-bold">Termos de Serviço e Privacidade Angel</h2>
                      <button onClick={() => setShowTermsModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><X size={24} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8">
                      {legalContent}
                  </div>
                  <div className={`flex-none p-6 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <button 
                          onClick={() => setShowTermsModal(false)} 
                          className="w-full py-4 bg-maurello-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg"
                      >
                          Li, Compreendi e Aceito os Termos
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  const renderAuthModal = () => {
      if (!showAuthModal) return null;
      return (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
               {renderTermsModal()}
               <div className={`w-full max-w-md bg-white rounded-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] ${isDarkMode ? 'bg-gray-900 text-white' : ''}`}>
                   <div className="flex justify-between mb-6">
                       <h2 className="text-2xl font-serif">{authMode === 'LOGIN' ? t.auth_login : t.auth_signup}</h2>
                       <button onClick={() => {setShowAuthModal(false); setAuthStep('FORM');}}><X /></button>
                   </div>

                   {/* AUTH STEP 2: VERIFICATION CODE */}
                   {authStep === 'VERIFY' ? (
                       <div className="space-y-6 animate-fade-in">
                           <div className="text-center">
                               <div className="w-16 h-16 bg-blue-100 text-maurello-blue rounded-full flex items-center justify-center mx-auto mb-4">
                                   <Mail size={32} />
                               </div>
                               <h3 className="text-xl font-bold">{t.auth_verify_title}</h3>
                               <p className="text-sm opacity-70 mt-2">{t.auth_verify_desc}</p>
                           </div>
                           <div className="space-y-2">
                               <input 
                                   type="text" 
                                   placeholder="000-000" 
                                   className="w-full p-4 text-center text-2xl tracking-[0.5em] border rounded-xl font-mono text-black"
                                   value={authCode}
                                   onChange={(e) => setAuthCode(e.target.value)}
                               />
                           </div>
                           <button 
                               onClick={handleSignupVerification} 
                               disabled={isProcessingAuth || authCode.length < 3}
                               className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center"
                           >
                               {isProcessingAuth ? <Loader2 className="animate-spin" /> : t.auth_verify_btn}
                           </button>
                           <button onClick={() => setAuthStep('FORM')} className="w-full text-center text-sm opacity-60 hover:opacity-100">Voltar</button>
                       </div>
                   ) : (
                       /* AUTH STEP 1: FORM */
                       <div className="space-y-4">
                           <button 
                             onClick={() => handleSocialLogin('google')}
                             className="w-full py-3 border rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-800"
                           >
                               <GoogleLogo />
                               <span className="text-gray-700 dark:text-gray-200 font-medium">Continuar com Google</span>
                           </button>
                           <button 
                             onClick={() => handleSocialLogin('apple')}
                             className="w-full py-3 border rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-800"
                           >
                               <AppleLogo isDark={isDarkMode} />
                               <span className="text-gray-700 dark:text-gray-200 font-medium">Continuar com Apple</span>
                           </button>
                           
                           <div className="border-t my-4 relative"><span className={`absolute top-[-10px] left-1/2 -translate-x-1/2 px-2 text-xs text-gray-400 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>OU</span></div>
                           
                           {authMode === 'SIGNUP' && (
                               <input 
                                   placeholder={t.auth_name} 
                                   className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-maurello-blue outline-none transition-all" 
                                   value={authForm.name} 
                                   onChange={e=>setAuthForm({...authForm, name:e.target.value})} 
                               />
                           )}
                           <input 
                               type="email"
                               placeholder={t.auth_email} 
                               className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-maurello-blue outline-none transition-all" 
                               value={authForm.email} 
                               onChange={e=>setAuthForm({...authForm, email:e.target.value})} 
                           />
                           <input 
                               type="password" 
                               placeholder={t.auth_pass} 
                               className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-maurello-blue outline-none transition-all" 
                               value={authForm.pass} 
                               onChange={e=>setAuthForm({...authForm, pass:e.target.value})} 
                           />
                           
                           {authMode === 'SIGNUP' && (
                               <div className="flex items-start text-sm text-gray-500">
                                   <input type="checkbox" className="mr-2 mt-1" checked={authForm.terms} onChange={e=>setAuthForm({...authForm, terms:e.target.checked})} />
                                   <span>
                                       Eu aceito os <button onClick={() => setShowTermsModal(true)} className="text-maurello-blue underline font-medium">{t.auth_read_terms}</button> e a Política de Privacidade.
                                   </span>
                               </div>
                           )}
                           
                           {authError && <p className="text-red-500 text-sm animate-shake bg-red-50 p-2 rounded border border-red-100">{authError}</p>}
                           
                           <button 
                               onClick={handleAuthSubmit} 
                               disabled={isProcessingAuth}
                               className="w-full py-4 bg-maurello-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg flex items-center justify-center"
                           >
                               {isProcessingAuth ? <Loader2 className="animate-spin" /> : (authMode === 'LOGIN' ? t.auth_btn_login : t.auth_btn_signup)}
                           </button>
                       </div>
                   )}

                   {authMode === 'LOGIN' && authStep === 'FORM' && <button onClick={()=>{setShowAuthModal(false); setCurrentView('FORGOT_PASSWORD')}} className="mt-4 text-sm text-maurello-blue underline w-full text-center">{t.auth_forgot}</button>}
               </div>
          </div>
      )
  };

  const renderContent = () => {
    // --- PAYWALL / PAYMENT VIEW ---
    if (currentView === 'PAYMENT') {
        return (
            <div className={`flex-1 w-full overflow-auto animate-fade-in p-8 flex flex-col items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                 <h2 className="text-3xl font-serif mb-8">{t.plans_title}</h2>
                 <div className={`w-full max-w-lg p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    
                    {paymentStep === 'SUCCESS' ? (
                         <div className="text-center py-8">
                             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                 <CheckCircle2 size={40} />
                             </div>
                             <h3 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h3>
                             <p className="opacity-70 mb-4">Sua assinatura foi ativada com sucesso.</p>
                             <p className="text-sm">Iniciando sua sessão...</p>
                         </div>
                    ) : paymentStep === 'VERIFY' ? (
                        <div className="space-y-6 animate-fade-in">
                             <div className="text-center">
                                 <div className="w-16 h-16 bg-blue-100 text-maurello-blue rounded-full flex items-center justify-center mx-auto mb-4">
                                     <Mail size={32} />
                                 </div>
                                 <h3 className="text-xl font-bold">Verifique seu E-mail</h3>
                                 <p className="text-sm opacity-70 mt-2">Enviamos um código de confirmação para o seu e-mail cadastrado. Insira-o abaixo para concluir.</p>
                             </div>
                             <div className="space-y-2">
                                 <label className="text-xs font-bold uppercase tracking-wider opacity-60">Código de Confirmação</label>
                                 <input 
                                     type="text" 
                                     placeholder="000-000" 
                                     className="w-full p-4 text-center text-2xl tracking-[0.5em] border rounded-xl font-mono text-black"
                                     value={verificationCode}
                                     onChange={(e) => setVerificationCode(e.target.value)}
                                 />
                             </div>
                             <button 
                                 onClick={verifyPaymentCode} 
                                 disabled={isProcessingPayment || verificationCode.length < 3}
                                 className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center"
                             >
                                 {isProcessingPayment ? <Loader2 className="animate-spin" /> : 'Confirmar e Ativar'}
                             </button>
                             <button onClick={() => setPaymentStep('FORM')} className="w-full text-center text-sm opacity-60 hover:opacity-100">Voltar</button>
                        </div>
                    ) : (
                        // FORM STEP
                        <>
                            <div className="text-center mb-8">
                                <span className="text-red-400 line-through text-lg">R$ 49,90</span>
                                <div className="text-4xl font-bold text-maurello-blue my-2">R$ 9,90<span className="text-base text-gray-500 font-normal">/mês</span></div>
                                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{t.plans_offer}</span>
                            </div>

                            <div className="flex justify-center space-x-4 mb-8">
                                <button onClick={()=>setPaymentMethod('CARD')} className={`flex-1 py-3 rounded-lg border flex items-center justify-center space-x-2 ${paymentMethod==='CARD' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-transparent'}`}><CreditCard size={18}/><span>Cartão</span></button>
                                <button onClick={()=>setPaymentMethod('PIX')} className={`flex-1 py-3 rounded-lg border flex items-center justify-center space-x-2 ${paymentMethod==='PIX' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-transparent'}`}><QrCode size={18}/><span>Pix</span></button>
                            </div>

                            {paymentMethod === 'CARD' ? (
                                <div className="space-y-4">
                                    <input name="name" placeholder="Nome no Cartão" className="w-full p-3 border rounded-lg text-black" value={cardForm.name} onChange={handleCardChange} />
                                    <input name="number" placeholder="Número do Cartão" className="w-full p-3 border rounded-lg text-black" value={cardForm.number} onChange={handleCardChange} />
                                    <div className="flex space-x-4">
                                        <input name="expiry" placeholder="MM/AA" className="w-1/2 p-3 border rounded-lg text-black" value={cardForm.expiry} onChange={handleCardChange} />
                                        <input name="cvv" placeholder="CVV" className="w-1/2 p-3 border rounded-lg text-black" value={cardForm.cvv} onChange={handleCardChange} />
                                    </div>
                                    <input name="cpf" placeholder="CPF do Titular" className="w-full p-3 border rounded-lg text-black" value={cardForm.cpf} onChange={handleCardChange} />
                                    <button 
                                        onClick={submitPayment} 
                                        disabled={isProcessingPayment}
                                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg mt-4 flex items-center justify-center"
                                    >
                                        {isProcessingPayment ? <Loader2 className="animate-spin" /> : 'Pagar R$ 9,90'}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center space-y-6">
                                    <div className="w-48 h-48 bg-gray-200 mx-auto rounded-lg flex items-center justify-center text-gray-500"><QrCode size={64}/></div>
                                    <p className="text-sm text-gray-500">Escaneie o QR Code ou copie o código abaixo.</p>
                                    <div className="flex items-center justify-center space-x-2 bg-gray-100 p-3 rounded-lg"><span className="font-mono text-sm text-black">00020126360014BR.GOV.BCB.PIX...</span><Copy size={16} className="text-gray-600"/></div>
                                    <p className="text-xs text-green-600 font-semibold">O plano será ativado automaticamente após a confirmação.</p>
                                </div>
                            )}
                        </>
                    )}
                 </div>
            </div>
        );
    }

    // --- CRISIS VIEW ---
    if (currentView === 'CRISIS') {
        return (
            <div className={`flex-1 w-full overflow-auto animate-fade-in p-8 flex flex-col items-center justify-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6"><AlertTriangle size={40} /></div>
                <h2 className="text-3xl font-serif mb-4 text-center">{t.crisis_title}</h2>
                <p className="text-center max-w-md mb-10 text-lg opacity-80">{t.crisis_desc}</p>
                
                <div className="grid gap-4 w-full max-w-md mb-12">
                    <a href="tel:188" className="flex items-center p-6 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mr-4"><Phone size={24}/></div>
                        <div><h3 className="font-bold text-red-700 text-xl">{t.crisis_cvv_title}</h3><p className="text-red-600 text-sm">{t.crisis_cvv_sub}</p></div>
                    </a>
                    <a href="https://wa.me/" target="_blank" rel="noreferrer" className="flex items-center p-6 bg-green-50 hover:bg-green-100 border border-green-200 rounded-2xl transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mr-4"><MessageCircle size={24}/></div>
                        <div><h3 className="font-bold text-green-700 text-xl">{t.crisis_psy_title}</h3><p className="text-green-600 text-sm">{t.crisis_psy_sub}</p></div>
                    </a>
                </div>
                
                <button onClick={() => setCurrentView('PSYCHOLOGIST_FORM')} className="text-gray-500 hover:text-maurello-blue font-medium text-sm flex items-center space-x-2 transition-colors">
                    <Briefcase size={16} /><span>{t.crisis_btn_partner}</span>
                </button>
            </div>
        );
    }

    // --- HISTORY VIEW ---
    if (currentView === 'HISTORY') {
        return (
            <div className={`flex-1 w-full overflow-auto animate-fade-in p-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                <h2 className="text-3xl font-serif mb-2">{t.history_title}</h2>
                <p className="opacity-70 mb-8">{t.history_desc}</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-xl flex items-center space-x-2"><MessageSquare size={20} className="text-maurello-blue"/><span>{t.history_sessions}</span></h3>
                        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex justify-between mb-2"><span className="font-semibold">Sessão de Acolhimento</span><span className="text-xs opacity-60">Hoje, 10:00</span></div>
                            <p className="text-sm opacity-70">Resumo indisponível no modo visitante.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold text-xl flex items-center space-x-2"><FileText size={20} className="text-maurello-gold"/><span>{t.history_notes}</span></h3>
                        {notes.length === 0 ? (
                            <div className={`p-8 text-center rounded-xl border border-dashed ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'}`}>{t.history_empty}</div>
                        ) : (
                            notes.map(note => (
                                <div key={note.id} className={`p-4 rounded-xl border mb-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <h4 className="font-bold">{note.title}</h4>
                                    <p className="text-xs opacity-60 mb-2">{new Date(note.date).toLocaleDateString()}</p>
                                    <ul className="list-disc list-inside text-sm opacity-80">{note.items.map((it,i)=><li key={i}>{it}</li>)}</ul>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- PLANS VIEW ---
    if (currentView === 'PLANS') {
        return (
            <div className={`flex-1 w-full overflow-auto animate-fade-in p-8 flex flex-col items-center text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className="w-24 h-24 bg-gradient-to-br from-maurello-gold to-yellow-600 rounded-full flex items-center justify-center mb-6 shadow-xl text-white"><Sparkles size={48}/></div>
                <h2 className="text-4xl font-serif mb-4">{t.plans_title}</h2>
                <p className="text-xl max-w-lg mb-8 opacity-80">{t.plans_desc}</p>
                <div className={`w-full max-w-sm p-8 rounded-3xl shadow-2xl border-2 border-maurello-gold relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-maurello-gold text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">{t.plans_offer}</div>
                    <div className="text-red-400 line-through text-lg mt-4">R$ 49,90</div>
                    <div className="text-5xl font-bold text-maurello-blue mb-2">R$ 9,90</div>
                    <div className="text-gray-500 mb-8">/mês</div>
                    <button onClick={()=>setCurrentView('PAYMENT')} className="w-full py-4 bg-maurello-blue text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-600 transition-all">{t.plans_btn}</button>
                    <p className="mt-4 text-xs opacity-60">{t.plans_cancel}</p>
                </div>
            </div>
        );
    }

    // --- TESTIMONIALS VIEW ---
    if (currentView === 'TESTIMONIALS') {
        return (
            <div className={`flex-1 w-full overflow-auto animate-fade-in p-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <h2 className="text-3xl font-serif mb-8 text-center">{t.menu_testimonials}</h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Simulated Psychologist Testimonial */}
                    <div className={`p-6 rounded-2xl border relative overflow-hidden ${isDarkMode ? 'bg-blue-900/10 border-blue-800' : 'bg-blue-50 border-blue-100'}`}>
                         <div className="absolute top-0 right-0 p-4 opacity-10"><Quote size={64}/></div>
                         <div className="flex items-center space-x-1 text-maurello-gold mb-3"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                         <p className="text-sm italic opacity-80 mb-4 leading-relaxed">"Como psicólogo clínico, vejo a Angel como uma ferramenta complementar fantástica. Meus pacientes que utilizam o app entre as sessões demonstram maior regulação emocional e chegam mais preparados para a terapia."</p>
                         <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 rounded-full bg-maurello-blue text-white flex items-center justify-center font-bold">RM</div>
                             <div>
                                 <p className="font-bold text-sm">Dr. Ricardo M.</p>
                                 <p className="text-xs opacity-60">Psicólogo Clínico - CRP 06/12345</p>
                             </div>
                         </div>
                    </div>

                    {/* Simulated User Testimonials */}
                    <div className={`p-6 rounded-2xl border relative ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                         <div className="flex items-center space-x-1 text-maurello-gold mb-3"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                         <p className="text-sm italic opacity-80 mb-4 leading-relaxed">"Me sinto ouvida sem julgamentos. Mudou minhas noites de insônia, agora consigo desabafar antes de dormir."</p>
                         <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">AP</div>
                             <div>
                                 <p className="font-bold text-sm">Ana Paula S.</p>
                                 <p className="text-xs opacity-60">Usuária há 3 meses</p>
                             </div>
                         </div>
                    </div>

                    <div className={`p-6 rounded-2xl border relative ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                         <div className="flex items-center space-x-1 text-maurello-gold mb-3"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                         <p className="text-sm italic opacity-80 mb-4 leading-relaxed">"A sensação de presença é real. A tecnologia de voz é impressionante e me acalma instantaneamente."</p>
                         <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">CS</div>
                             <div>
                                 <p className="font-bold text-sm">Carlos S.</p>
                                 <p className="text-xs opacity-60">Usuário Premium</p>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Submission Form */}
                <div className={`max-w-xl mx-auto p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageSquare size={20}/> Compartilhe sua experiência</h3>
                    {testimonialSent ? (
                        <div className="flex items-center space-x-2 text-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <CheckCircle2 size={24} />
                            <span>Seu depoimento foi enviado para análise do administrador. Obrigado!</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <input 
                                className="w-full p-3 border rounded-lg text-black" 
                                placeholder="Seu Nome (ou Iniciais)" 
                                value={testimonialForm.name}
                                onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})}
                            />
                            <textarea 
                                className="w-full p-3 border rounded-lg h-24 text-black" 
                                placeholder="Escreva como a Angel tem te ajudado..."
                                value={testimonialForm.message}
                                onChange={e => setTestimonialForm({...testimonialForm, message: e.target.value})}
                            ></textarea>
                            <button 
                                onClick={handleTestimonialSubmit} 
                                className="px-6 py-3 bg-maurello-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                <Send size={16} /> Enviar Depoimento
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- PSYCHOLOGIST FORM ---
    if (currentView === 'PSYCHOLOGIST_FORM') {
        if (psychStep === 'PAYMENT_LINK') {
             return (
                <div className={`flex-1 w-full flex flex-col items-center justify-center p-8 text-center animate-fade-in ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                     <h2 className="text-2xl font-serif mb-6">Cadastro Realizado com Sucesso!</h2>
                     <p className="mb-8 max-w-md opacity-80">Para finalizar sua adesão à rede de parceiros e ter acesso aos benefícios exclusivos, ative sua assinatura profissional.</p>
                     
                     <div className={`p-8 rounded-2xl shadow-xl border mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <span className="text-red-400 line-through mr-2">R$ 109,90</span>
                        <span className="text-4xl font-bold text-maurello-blue">R$ 99,90 <span className="text-sm text-gray-500 font-normal">/ mês</span></span>
                        <p className="text-xs mt-4 opacity-60">Cobrança recorrente. Cancele quando quiser.</p>
                     </div>

                     <button 
                        onClick={() => {
                             setPsychStep('INTRO_FORM'); // Reset for demo
                             setCurrentView('HOME'); // Go home or mock payment success view
                             // In real app, this goes to Stripe/Payment Gateway
                        }}
                        className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
                     >
                        Ir para Pagamento Seguro <ArrowRight size={20}/>
                     </button>
                </div>
             );
        }

        return (
            <div className={`flex-1 w-full overflow-auto animate-fade-in p-8 flex flex-col items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className="max-w-2xl w-full text-center mb-10">
                    <h2 className="text-3xl font-serif mb-4">Trabalhe com Angel</h2>
                    <p className="text-lg opacity-80 mb-6">Potencialize sua clínica e ofereça suporte contínuo aos seus pacientes.</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-left">
                        <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                            <Briefcase className="text-maurello-blue mb-2" />
                            <h3 className="font-bold mb-1">Expansão</h3>
                            <p className="text-xs opacity-70">Receba encaminhamento de pacientes qualificados diretamente pelo app.</p>
                        </div>
                        <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                            <HeartHandshake className="text-maurello-blue mb-2" />
                            <h3 className="font-bold mb-1">Suporte 24h</h3>
                            <p className="text-xs opacity-70">Use a Angel como ferramenta de apoio emocional para seus pacientes entre sessões.</p>
                        </div>
                        <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                            <ShieldCheck className="text-maurello-blue mb-2" />
                            <h3 className="font-bold mb-1">Visibilidade</h3>
                            <p className="text-xs opacity-70">Tenha seu perfil destacado na rede de parceiros Angel.</p>
                        </div>
                    </div>
                </div>

                <div className={`w-full max-w-lg p-8 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1 opacity-70">Nome Completo</label>
                            <input name="name" className={`w-full p-3 border rounded-lg ${psychErrors.name ? 'border-red-500' : ''} text-black`} value={psychForm.name} onChange={handlePsychChange} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 opacity-70">CRP (00/000000)</label>
                            <input name="crp" className={`w-full p-3 border rounded-lg ${psychErrors.crp ? 'border-red-500' : ''} text-black`} value={psychForm.crp} onChange={handlePsychChange} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 opacity-70">WhatsApp ((99) 99999-9999)</label>
                            <input name="phone" className={`w-full p-3 border rounded-lg ${psychErrors.phone ? 'border-red-500' : ''} text-black`} value={psychForm.phone} onChange={handlePsychChange} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 opacity-70">E-mail Profissional</label>
                            <input name="email" className={`w-full p-3 border rounded-lg ${psychErrors.email ? 'border-red-500' : ''} text-black`} value={psychForm.email} onChange={handlePsychChange} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 opacity-70">Especialidade (Opcional)</label>
                            <input name="specialty" className="w-full p-3 border rounded-lg text-black" value={psychForm.specialty} onChange={handlePsychChange} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 opacity-70">Link Profissional (Opcional)</label>
                            <input name="link" className="w-full p-3 border rounded-lg text-black" value={psychForm.link} onChange={handlePsychChange} />
                        </div>

                        <button onClick={handlePsychSubmit} className="w-full py-4 bg-maurello-blue text-white rounded-xl font-bold mt-4 shadow-lg hover:bg-blue-600 transition-colors">
                            Continuar para Assinatura
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- SUPPORT & LEGAL ---
    if (currentView === 'SUPPORT') {
        return (
            <div className={`flex-1 w-full overflow-auto animate-fade-in p-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <h2 className="text-3xl font-serif mb-4">{t.support_title}</h2>
                <p className="opacity-70 mb-8">{t.support_desc}</p>
                <div className={`max-w-xl p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                     {supportSent ? (
                         <div className="flex flex-col items-center justify-center h-48 text-center text-green-500">
                             <CheckCircle2 size={48} className="mb-4"/>
                             <h3 className="text-xl font-bold">Mensagem Enviada!</h3>
                             <p className="text-sm opacity-80 mt-2">Nossa equipe administrativa entrará em contato em breve.</p>
                         </div>
                     ) : (
                        <>
                            <textarea 
                                className="w-full h-32 p-4 border rounded-lg mb-4 text-black" 
                                placeholder={t.support_placeholder}
                                value={supportMessage}
                                onChange={e => setSupportMessage(e.target.value)}
                            ></textarea>
                            <button 
                                onClick={handleSupportSubmit}
                                className="px-8 py-3 bg-maurello-blue text-white rounded-lg font-bold flex items-center gap-2"
                            >
                                <Send size={18}/> {t.support_btn}
                            </button>
                        </>
                     )}
                </div>
            </div>
        );
    }
    
    // --- LEGAL VIEW ---
    if (currentView === 'LEGAL') {
        return (
            <div className={`flex-1 w-full overflow-auto animate-fade-in p-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <h2 className="text-3xl font-serif mb-8">{t.legal_title}</h2>
                <div className={`max-w-3xl p-8 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    {legalContent}
                </div>
            </div>
        );
    }

    // --- REPORT ERROR VIEW ---
    if (currentView === 'REPORT') {
        return (
            <div className={`flex-1 w-full overflow-auto animate-fade-in p-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <h2 className="text-3xl font-serif mb-4 flex items-center gap-2 text-red-500"><AlertTriangle /> {t.menu_report}</h2>
                <p className="opacity-70 mb-8">Encontrou algum problema? Descreva abaixo para que nossa equipe técnica possa corrigir.</p>
                
                <div className={`max-w-xl p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                     {reportSent ? (
                         <div className="flex flex-col items-center justify-center h-48 text-center text-green-500">
                             <CheckCircle2 size={48} className="mb-4"/>
                             <h3 className="text-xl font-bold">Reporte Enviado!</h3>
                             <p className="text-sm opacity-80 mt-2">Obrigado por ajudar a melhorar a Angel. O administrador foi notificado.</p>
                         </div>
                     ) : (
                        <>
                            <textarea 
                                className="w-full h-48 p-4 border rounded-lg mb-4 text-black resize-none" 
                                placeholder="Descreva o erro encontrado..."
                                value={reportText}
                                onChange={e => setReportText(e.target.value)}
                            ></textarea>
                            <button 
                                onClick={handleReportSubmit}
                                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Send size={18}/> Enviar Reporte
                            </button>
                        </>
                     )}
                </div>
            </div>
        );
    }

    // --- SETTINGS ---
    if (currentView === 'SETTINGS') {
        return (
            <div className={`flex-1 w-full overflow-auto animate-fade-in p-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <h2 className="text-3xl font-serif mb-8">{t.settings_title}</h2>
                <div className="grid gap-6 max-w-2xl">
                    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2"><User size={20}/><span>{t.settings_profile}</span></h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100/10">
                                <span className="opacity-70">{t.auth_name}</span>
                                <span className="font-medium">{isAuthenticated ? "Usuário Angel" : "Visitante"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100/10">
                                <span className="opacity-70">{t.auth_email}</span>
                                <span className="font-medium">{isAuthenticated ? "usuario@email.com" : "-"}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2"><Settings size={20}/><span>{t.settings_appearance}</span></h3>
                        
                        <div className="flex items-center justify-between mb-6">
                            <span className="flex items-center space-x-2 opacity-80"><Moon size={18}/><span>{t.settings_dark}</span></span>
                            <button onClick={()=>setIsDarkMode(!isDarkMode)} className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-maurello-blue' : 'bg-gray-300'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : ''}`}></div>
                            </button>
                        </div>

                        <div className="mb-6">
                            <span className="block mb-3 opacity-80">{t.settings_voice_label}</span>
                            <div className="flex space-x-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                                <button onClick={()=>setVoiceGender('female')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${voiceGender==='female' ? 'bg-white text-maurello-blue shadow-sm' : 'text-gray-500'}`}>{t.settings_voice_fem}</button>
                                <button onClick={()=>setVoiceGender('male')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${voiceGender==='male' ? 'bg-white text-maurello-blue shadow-sm' : 'text-gray-500'}`}>{t.settings_voice_male}</button>
                            </div>
                        </div>
                        
                        <div className="text-xs opacity-50 italic">
                            O volume da voz é controlado pelos botões físicos do seu dispositivo.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RECOVERY VIEWS ---
    if (currentView === 'FORGOT_PASSWORD') {
        return (
            <div className={`flex-1 w-full overflow-auto animate-fade-in p-8 flex flex-col items-center justify-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <h2 className="text-2xl font-serif mb-6">{t.auth_forgot}</h2>
                {recoverySuccess ? (
                    <div className="text-center"><CheckCircle2 size={48} className="mx-auto text-green-500 mb-4"/><p>Enviamos um link para redefinir sua senha.</p><button onClick={()=>setCurrentView('HOME')} className="mt-4 text-maurello-blue underline">Voltar</button></div>
                ) : (
                    <div className="w-full max-w-sm space-y-4">
                        <input className="w-full p-3 border rounded-lg text-black" placeholder={t.auth_email} value={recoveryEmail} onChange={e=>setRecoveryEmail(e.target.value)} />
                        <button onClick={submitRecovery} className="w-full py-3 bg-maurello-blue text-white rounded-lg font-bold">Enviar Link</button>
                        <button onClick={()=>setCurrentView('HOME')} className="w-full text-center text-sm opacity-60">Voltar</button>
                    </div>
                )}
            </div>
        );
    }

    // --- SESSION VIEW ---
    if (currentView === 'SESSION') {
      return (
        <div className="flex-1 w-full min-w-full h-full flex flex-col items-center justify-center relative overflow-hidden animate-fade-in">
          <div className="flex-1 w-full flex flex-col items-center justify-center relative">
             <div className="w-full max-w-[90vw] flex items-center justify-center">
                <MaurelloAvatar 
                    isActive={isSessionActive} 
                    isAiSpeaking={isAiSpeaking} 
                    isAiThinking={isAiThinking}
                    size="lg"
                    videoStream={cameraStream}
                />
             </div>
             
             {/* Thinking Text */}
             <div className="h-8 mt-6 flex items-center justify-center">
                {isAiThinking && (
                  <span className={`text-sm tracking-widest uppercase font-light animate-pulse ${isDarkMode ? 'text-maurello-gold' : 'text-gray-500'}`}>
                    {thinkingText}
                  </span>
                )}
             </div>
          </div>
          
          <div className="w-full p-8 flex flex-col items-center justify-center bg-transparent relative z-20">
            {isTrialActive && (
                <div className="mb-4 px-4 py-2 bg-gray-100 rounded-full text-sm font-mono text-gray-600 border border-gray-200 shadow-sm flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span>{t.trial_timer} {formatTime(trialTimeLeft)}</span>
                </div>
            )}
            <button 
              onClick={handleStopSession}
              className="group relative px-8 py-4 bg-red-50 text-red-600 rounded-full font-medium transition-all hover:bg-red-100 hover:pr-10 hover:pl-6 border border-red-100 shadow-sm"
            >
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse group-hover:bg-red-600"></span>
                <span>{t.session_end}</span>
              </span>
            </button>
          </div>
        </div>
      );
    }
    
    // --- HOME VIEW ---
    return (
      <div className={`flex-1 w-full overflow-y-auto overflow-x-hidden p-6 animate-fade-in ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
         {/* Container set to min-h-full to ensure centering but allow scrolling on small screens */}
         <div className="min-h-full flex flex-col items-center justify-center w-full max-w-4xl mx-auto pb-20">
            <div className="mb-8 relative group">
                <div className="absolute inset-0 bg-maurello-gold/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <MaurelloAvatar isActive={false} isAiSpeaking={false} isAiThinking={false} size="lg" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-maurello-blue to-blue-400 mb-2 tracking-tight text-center">
            ANGEL
            </h1>
            <p className="text-lg md:text-xl font-light opacity-60 max-w-md mx-auto mb-10 text-center">
            {t.home_subtitle}
            </p>

            <div className="flex flex-col items-center space-y-4 w-full max-w-xs relative z-10 pb-8">
                {isConnecting ? (
                <div className="flex flex-col items-center space-y-3">
                    <div className="w-6 h-6 border-2 border-maurello-blue border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-light text-maurello-blue animate-pulse">{connectionStatus}</span>
                </div>
                ) : (
                    <button 
                    onClick={handleStartRequest}
                    className="w-full py-4 bg-gradient-to-r from-maurello-blue to-blue-600 text-white rounded-full font-medium shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group"
                    >
                        <Mic className="group-hover:animate-bounce" size={20} />
                        <span>{t.home_btn_start}</span>
                    </button>
                )}
                
                {error && (
                    <div className="flex items-center space-x-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg text-sm mt-4 animate-shake text-center">
                        <AlertTriangle size={16} className="flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className={`flex h-[100dvh] w-full relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#050505]' : 'bg-gray-50'}`}>
      {renderAuthModal()}
      {renderCameraModal()}

      {/* --- FULL SCREEN REDIRECT OVERLAY --- */}
      {socialRedirect.active && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center animate-fade-in ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
            <div className="scale-150 mb-8 p-4 bg-white rounded-2xl shadow-xl">
                {socialRedirect.provider === 'google' ? <GoogleLogo /> : <AppleLogo isDark={false} className="text-black" />}
            </div>
            <h3 className="text-2xl font-serif font-bold mb-4">
                {socialRedirect.provider === 'google' ? 'Google' : 'Apple'}
            </h3>
            <div className="flex items-center space-x-3 text-gray-500">
                <Loader2 className="animate-spin text-maurello-blue" size={24} />
                <span className="text-lg font-light">Redirecionando...</span>
            </div>
            <p className="mt-12 text-sm text-gray-400 max-w-xs text-center leading-relaxed">
                Você está sendo encaminhado para a página de login segura do provedor.
            </p>
        </div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 backdrop-blur-xl border-r transform transition-transform duration-500 ease-out flex flex-col ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDarkMode ? 'bg-[#0a0a0a]/90 border-white/5' : 'bg-white/90 border-gray-100'}`}
      >
        <div className="p-8 flex items-center justify-between">
           <div className="flex items-center space-x-3">
               <MaurelloAvatar isActive={false} isAiSpeaking={false} isAiThinking={false} size="sm" />
               <span className={`font-serif text-xl tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ANGEL</span>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400">
             <X />
           </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar flex flex-col">
           {[
             { id: 'HOME', icon: Home, label: t.menu_home },
             { id: 'SESSION', icon: MessageSquare, label: "Sessão" }, // Kept internal for logic, usually hidden if not active
             { id: 'HISTORY', icon: History, label: t.menu_history },
             { id: 'CRISIS', icon: HeartHandshake, label: t.menu_crisis },
             { id: 'TESTIMONIALS', icon: Quote, label: t.menu_testimonials },
             { id: 'PLANS', icon: CreditCard, label: t.menu_plans },
             { id: 'SUPPORT', icon: LifeBuoy, label: t.menu_support },
             { id: 'LEGAL', icon: Shield, label: t.menu_legal },
             { id: 'PSYCHOLOGIST_FORM', icon: Briefcase, label: t.menu_psychologist },
             { id: 'SETTINGS', icon: Settings, label: t.menu_settings },
             { id: 'REPORT', icon: AlertTriangle, label: t.menu_report }, // Last item
           ].filter(item => item.id !== 'SESSION').map((item) => (
             <button
               key={item.id}
               onClick={() => handleNavigation(item.id as ViewState)}
               className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                 currentView === item.id 
                   ? 'bg-maurello-blue text-white shadow-lg shadow-maurello-blue/20' 
                   : isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-blue-50 hover:text-maurello-blue'
               }`}
             >
               <item.icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${currentView === item.id ? 'text-white' : ''}`} />
               <span className="font-medium">{item.label}</span>
               {currentView === item.id && <ChevronRight size={16} className="ml-auto opacity-60" />}
             </button>
           ))}

           {isAuthenticated && (
               <button 
                onClick={handleLogout}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group mt-auto border-t border-transparent ${isDarkMode ? 'text-red-400 hover:bg-white/5 border-t-white/5' : 'text-red-500 hover:bg-red-50 border-t-gray-100'}`}
               >
                   <LogOut size={20} />
                   <span className="font-medium">{t.menu_logout}</span>
               </button>
           )}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col h-full relative transition-all duration-500 ${isSidebarOpen ? 'md:ml-72' : ''} overflow-x-hidden`}>
        
        {/* Header */}
        <header className={`h-20 px-4 md:px-6 flex items-center justify-between z-40 backdrop-blur-sm sticky top-0 ${isDarkMode ? 'bg-[#050505]/80' : 'bg-gray-50/80'}`}>
           <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-gray-800'}`}
              >
                <Menu size={24} />
              </button>
           </div>
           
           <div className="flex items-center space-x-2 md:space-x-4">
              {/* Language Switcher - Hidden on small mobile to prevent overlap */}
              <div className={`hidden md:flex items-center rounded-lg p-1 space-x-1 ${isDarkMode ? 'bg-white/5' : 'bg-white border border-gray-200'}`}>
                  {(['PT', 'EN', 'ES'] as Language[]).map(lang => (
                      <button 
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                            language === lang 
                              ? 'bg-maurello-blue text-white shadow-sm' 
                              : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                          {lang}
                      </button>
                  ))}
              </div>
              
              {!isAuthenticated ? (
                  <div className="flex space-x-2">
                      <button onClick={()=>{setAuthMode('LOGIN'); setShowAuthModal(true)}} className={`px-3 py-2 md:px-4 rounded-full text-xs md:text-sm font-bold transition-colors ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200'}`}>{t.auth_login}</button>
                      <button onClick={()=>{setAuthMode('SIGNUP'); setShowAuthModal(true)}} className="px-3 py-2 md:px-4 bg-maurello-blue text-white rounded-full text-xs md:text-sm font-bold shadow-lg hover:bg-blue-600 transition-colors whitespace-nowrap">{t.auth_signup}</button>
                  </div>
              ) : (
                  <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          <User size={16} />
                      </div>
                      <button 
                        onClick={handleLogout}
                        className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                        title={t.menu_logout}
                      >
                          <LogOut size={20} />
                      </button>
                  </div>
              )}
           </div>
        </header>

        {/* Dynamic Content */}
        {renderContent()}

      </div>

      {/* Notepad Overlay - Only visible when setIsNoteVisible(true) called by AI */}
      <Notepad isOpen={isNoteVisible} onClose={() => setIsNoteVisible(false)} notes={notes} />
      
    </div>
  );
};

export default App;
