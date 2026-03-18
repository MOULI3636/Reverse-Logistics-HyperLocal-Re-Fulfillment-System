import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Play,
    RotateCcw,
    Truck,
    RefreshCw,
    Leaf,
    Mail,
    Phone,
    MapPin,
    Github,
    Twitter,
    Linkedin,
    Instagram,
    ChevronRight,
    Package,
    BarChart3,
    Shield,
    Zap,
    Globe,
    CheckCircle2,
    TrendingDown,
    Warehouse,
    MapPinned,
    Clock,
    ShoppingCart,
    ClipboardList,
    Bike,
    CircleCheckBig,
    Undo2,
    Search,
    BoxSelect,
    MapPinPlus,
    ShoppingBag,
    Rocket,
    Timer,
    IndianRupee,
    PartyPopper,
} from 'lucide-react';

/* ===== SIMULATION STEPS DATA ===== */
const SIMULATION_STEPS = [
    { id: 1, phase: 'order', title: 'Customer Places Order', detail: 'Customer orders a clothing item from Bangalore seller. Order ID auto-generated.', Icon: ShoppingCart },
    { id: 2, phase: 'delivery', title: 'Order Placed', detail: 'Order confirmed and payment processed. Preparing for shipment.', Icon: ClipboardList, timeline: true },
    { id: 3, phase: 'delivery', title: 'Shipped from Bangalore', detail: 'Package picked up from Bangalore warehouse and dispatched to Delhi.', Icon: Truck, timeline: true },
    { id: 4, phase: 'delivery', title: 'Out for Delivery', detail: 'Package has arrived in Delhi and is out for delivery to customer.', Icon: Bike, timeline: true },
    { id: 5, phase: 'delivery', title: 'Delivered', detail: 'Package successfully delivered to customer in Delhi. Transit: 5 days, Cost: ₹250.', Icon: CircleCheckBig, timeline: true },
    { id: 6, phase: 'return', title: 'Customer Returns Order', detail: 'Customer initiates return — wrong size. Return request submitted.', Icon: Undo2 },
    { id: 7, phase: 'seller', title: 'Seller Approves Return', detail: 'Seller reviews return request and approves. Assigns nearest warehouse for pickup.', Icon: CheckCircle2 },
    { id: 8, phase: 'admin', title: 'Admin Inspects Product', detail: 'Warehouse admin inspects returned product. Quality check passed — like new condition.', Icon: Search },
    { id: 9, phase: 'admin', title: 'Product Repackaged', detail: 'Product repackaged with new shipping label and added to Delhi warehouse inventory.', Icon: Package },
    { id: 10, phase: 'admin', title: 'Added to Local Inventory', detail: 'Product now available in Delhi Local Inventory Pool for immediate local orders.', Icon: MapPinPlus },
    { id: 11, phase: 'redispatch', title: 'Second Customer Orders Same Item', detail: 'New customer in Delhi orders the same item. System routes to local warehouse.', Icon: ShoppingBag },
    { id: 12, phase: 'redispatch', title: 'Local Redispatch from Delhi WH', detail: 'Product dispatched from Delhi warehouse to Delhi customer. Transit: 1 day, Cost: ₹80.', Icon: Rocket },
];

const PHASE_COLORS = {
    order: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', accent: '#3b82f6', light: 'bg-blue-100' },
    delivery: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', accent: '#10b981', light: 'bg-emerald-100' },
    return: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', accent: '#f59e0b', light: 'bg-amber-100' },
    seller: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', accent: '#a855f7', light: 'bg-purple-100' },
    admin: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100', accent: '#06b6d4', light: 'bg-cyan-100' },
    redispatch: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', accent: '#22c55e', light: 'bg-green-100' },
};

const PHASE_LABELS = {
    order: 'Order Phase',
    delivery: 'Delivery Timeline',
    return: 'Return Initiated',
    seller: 'Seller Panel',
    admin: 'Admin Panel',
    redispatch: 'Local Redispatch',
};

/* ===== Scroll Animation ===== */
const useScrollAnimation = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('anim-visible');
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
        );

        const observeElements = () => {
            document.querySelectorAll('.anim-up, .anim-left, .anim-right, .anim-scale').forEach((el) => {
                if (!el.classList.contains('anim-visible')) {
                    observer.observe(el);
                }
            });
        };

        observeElements();

        const mutationObserver = new MutationObserver(observeElements);
        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);
};

const DemoSimulation = () => {
    useScrollAnimation();
    const [completedSteps, setCompletedSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [running, setRunning] = useState(false);
    const [finished, setFinished] = useState(false);
    const [orderId, setOrderId] = useState('');
    const timelineRef = useRef(null);
    const stepsEndRef = useRef(null);

    const generateOrderId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = 'ORD-';
        for (let i = 0; i < 8; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
        return id;
    };

    const runDemo = async () => {
        setRunning(true);
        setCompletedSteps([]);
        setCurrentStep(0);
        setFinished(false);
        setOrderId(generateOrderId());

        for (let i = 0; i < SIMULATION_STEPS.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1400));
            setCompletedSteps((prev) => [...prev, SIMULATION_STEPS[i]]);
            setCurrentStep(i + 1);
        }

        setFinished(true);
        setRunning(false);
    };

    useEffect(() => {
        if (stepsEndRef.current && completedSteps.length > 0) {
            stepsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [completedSteps]);

    const getStepStatus = (stepIndex) => {
        if (stepIndex < currentStep - 1) return 'completed';
        if (stepIndex === currentStep - 1) return 'active';
        return 'pending';
    };

    const deliverySteps = completedSteps.filter((s) => s.timeline);
    const totalDeliverySteps = SIMULATION_STEPS.filter((s) => s.timeline).length;
    const fillPercent = totalDeliverySteps > 0 ? (deliverySteps.length / totalDeliverySteps) * 100 : 0;

    return (
        <div className="bg-[#fafbfc] min-h-screen text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
            {/* Fonts & Animations */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { font-family: 'Poppins', system-ui, sans-serif; }

        .anim-up {
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .anim-left {
          opacity: 0; transform: translateX(-50px);
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .anim-right {
          opacity: 0; transform: translateX(50px);
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .anim-scale {
          opacity: 0; transform: scale(0.9);
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1);
        }
        .anim-visible {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) scale(1) !important;
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .fade-slide-up {
          animation: fadeSlideUp 0.55s cubic-bezier(0.4,0,0.2,1) forwards;
        }

        .timeline-track {
          position: relative;
          padding-left: 40px;
        }
        .timeline-track::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 8px;
          bottom: 8px;
          width: 3px;
          background: #e2e8f0;
          border-radius: 99px;
        }
        .timeline-track .timeline-fill {
          position: absolute;
          left: 15px;
          top: 8px;
          width: 3px;
          border-radius: 99px;
          background: linear-gradient(180deg, #10b981, #22c55e);
          transition: height 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .timeline-node {
          position: relative;
          padding-bottom: 28px;
        }
        .timeline-node:last-child { padding-bottom: 0; }
        .timeline-dot {
          position: absolute;
          left: -33px;
          top: 4px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #e2e8f0;
          background: white;
          transition: all 0.4s ease;
        }
        .timeline-dot.done {
          border-color: #10b981;
          background: #10b981;
        }
        .timeline-dot.active {
          border-color: #3b82f6;
          background: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.2);
        }
        .timeline-dot .dot-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
        }

        .skeleton-shimmer {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>

            {/* ═══════════════════ HERO HEADER ═══════════════════ */}
            <section className="relative overflow-hidden pt-[72px]">
                {/* Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-green-50" />
                    <div className="absolute top-20 -left-40 w-[600px] h-[600px] bg-emerald-200/25 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-200/20 rounded-full blur-[100px]" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />
                </div>

                <div className="max-w-4xl mx-auto px-5 md:px-10 py-20 lg:py-28 text-center relative z-10">
                    <div className="anim-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold tracking-widest text-emerald-700 uppercase bg-emerald-100/60 backdrop-blur-sm rounded-full border border-emerald-200/60 shadow-sm">
                            <Zap size={14} className="text-emerald-500" />
                            Interactive Demo Simulation
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                            Watch the{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500">
                                Reverse Logistics
                            </span>
                            <br className="hidden md:block" />
                            Flow in Action
                        </h1>

                        <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
                            Experience the complete journey — from order placement to local redispatch — in{' '}
                            <span className="text-emerald-600 font-semibold">12 animated steps</span>. See how returns become instant re-deliveries.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ SIMULATION AREA ═══════════════════ */}
            <section className="pb-24 px-5 md:px-10">
                <div className="max-w-4xl mx-auto">
                    {/* ── Start Card ── */}
                    {!running && completedSteps.length === 0 && (
                        <div className="anim-scale">
                            <div className="bg-white border border-slate-200/60 rounded-3xl p-12 md:p-16 text-center shadow-xl shadow-slate-100/50 max-w-xl mx-auto">
                                <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center border border-emerald-200/50">
                                    <Rocket size={36} className="text-emerald-600" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">Ready to Launch</h2>
                                <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                                    Click below to simulate the complete reverse logistics workflow in real time
                                </p>
                                <button
                                    onClick={runDemo}
                                    className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/35 transition-all hover:-translate-y-1 active:scale-[0.97] cursor-pointer border-none"
                                >
                                    <Play size={22} fill="white" className="group-hover:scale-110 transition-transform" />
                                    Run Reverse Logistics Demo
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Running / Completed ── */}
                    {(running || completedSteps.length > 0) && (
                        <div className="space-y-8">
                            {/* Progress Bar */}
                            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm anim-up">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                                    <div className="flex items-center gap-3">
                                        {orderId && (
                                            <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold">
                                                {orderId}
                                            </span>
                                        )}
                                        <span className="text-sm font-bold text-slate-900">
                                            {currentStep}
                                            <span className="text-slate-400">/{SIMULATION_STEPS.length}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full h-3 rounded-full overflow-hidden bg-slate-100">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: `${(currentStep / SIMULATION_STEPS.length) * 100}%`,
                                            background: 'linear-gradient(90deg, #10b981, #22c55e)',
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2">
                                    {['Order', 'Delivery', 'Return', 'Inspect', 'Redispatch'].map((label, i) => (
                                        <span key={i} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Timeline Card */}
                            {completedSteps.some((s) => s.timeline) && (
                                <div className="bg-white border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-sm anim-up" style={{ transitionDelay: '0.1s' }}>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                            <Truck size={20} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Delivery Timeline</h3>
                                            <p className="text-xs text-slate-400 font-medium">Real-time shipment tracking</p>
                                        </div>
                                    </div>

                                    <div className="timeline-track" ref={timelineRef}>
                                        <div
                                            className="timeline-fill"
                                            style={{ height: fillPercent > 0 ? `min(100%, calc(${fillPercent}% - 8px))` : '0px' }}
                                        />
                                        {SIMULATION_STEPS.filter((s) => s.timeline).map((step) => {
                                            const isCompleted = deliverySteps.find((d) => d.id === step.id);
                                            const isActive = completedSteps.length > 0 && completedSteps[completedSteps.length - 1].id === step.id && step.timeline;
                                            const status = isCompleted ? (isActive && running ? 'active' : 'done') : 'pending';
                                            const StepIcon = step.Icon;

                                            return (
                                                <div
                                                    key={step.id}
                                                    className="timeline-node"
                                                    style={{
                                                        opacity: isCompleted ? 1 : 0.3,
                                                        transition: 'opacity 0.5s ease',
                                                    }}
                                                >
                                                    <div className={`timeline-dot ${status}`}>
                                                        {status === 'done' && (
                                                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                                                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )}
                                                        {status === 'active' && <div className="dot-inner" />}
                                                    </div>
                                                    <div className="flex items-center gap-3 mb-1.5">
                                                        <div
                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${status === 'done'
                                                                ? 'bg-emerald-100 text-emerald-600'
                                                                : status === 'active'
                                                                    ? 'bg-blue-100 text-blue-600'
                                                                    : 'bg-slate-100 text-slate-400'
                                                                }`}
                                                        >
                                                            <StepIcon size={16} />
                                                        </div>
                                                        <h4
                                                            className={`font-bold text-sm ${status === 'done'
                                                                ? 'text-emerald-700'
                                                                : status === 'active'
                                                                    ? 'text-blue-700'
                                                                    : 'text-slate-400'
                                                                }`}
                                                        >
                                                            {step.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-slate-500 text-sm ml-11 leading-relaxed">{step.detail}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Non-Timeline Steps */}
                            <div className="space-y-4">
                                {completedSteps
                                    .filter((s) => !s.timeline)
                                    .map((step) => {
                                        const globalIndex = SIMULATION_STEPS.findIndex((s) => s.id === step.id);
                                        const status = getStepStatus(globalIndex);
                                        const phase = PHASE_COLORS[step.phase];
                                        const isLastCompleted = completedSteps[completedSteps.length - 1]?.id === step.id;
                                        const StepIcon = step.Icon;

                                        return (
                                            <div
                                                key={step.id}
                                                className={`bg-white border rounded-2xl p-6 flex items-start gap-5 fade-slide-up transition-all duration-300 ${isLastCompleted && running
                                                    ? `border-2 shadow-lg`
                                                    : 'border-slate-200/60 shadow-sm'
                                                    }`}
                                                style={{
                                                    borderColor: isLastCompleted && running ? `${phase.accent}40` : undefined,
                                                }}
                                            >
                                                <div
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${phase.light} ${phase.text} transition-all duration-300`}
                                                    style={{
                                                        border: `2px solid ${phase.accent}30`,
                                                    }}
                                                >
                                                    {status === 'completed' && !isLastCompleted ? (
                                                        <CheckCircle2 size={20} />
                                                    ) : (
                                                        <StepIcon size={20} />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                                        <span
                                                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${phase.bg} ${phase.text} ${phase.border} border uppercase tracking-wider`}
                                                        >
                                                            {PHASE_LABELS[step.phase]}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400 font-semibold">Step {step.id}</span>
                                                        {isLastCompleted && running && (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-500">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                                Processing
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 text-base">{step.title}</h3>
                                                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">{step.detail}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* Pending Skeletons */}
                            {running && (
                                <div className="space-y-3">
                                    {Array.from({ length: Math.min(3, SIMULATION_STEPS.length - completedSteps.length) }, (_, i) => (
                                        <div key={`pending-${i}`} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 opacity-50">
                                            <div className="w-10 h-10 rounded-xl skeleton-shimmer flex-shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3 w-48 rounded-lg skeleton-shimmer" />
                                                <div className="h-2.5 w-32 rounded-lg skeleton-shimmer" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Scroll anchor */}
                            <div ref={stepsEndRef} />

                            {/* ── Completion Card ── */}
                            {finished && (
                                <div className="anim-scale">
                                    <div className="relative bg-white border-2 border-emerald-200/60 rounded-3xl p-10 md:p-14 text-center shadow-xl shadow-emerald-100/40 overflow-hidden">
                                        {/* Decorative bg */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-0" />
                                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-50 rounded-full blur-2xl -z-0" />

                                        <div className="relative z-10">
                                            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center border border-emerald-200/50">
                                                <CheckCircle2 size={40} className="text-emerald-600" />
                                            </div>

                                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                                                Simulation{' '}
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                                                    Complete!
                                                </span>
                                            </h2>
                                            <p className="text-slate-500 font-medium mb-2">All 12 steps executed successfully.</p>
                                            <p className="text-slate-400 text-sm mb-10 max-w-lg mx-auto leading-relaxed">
                                                The returned product was intercepted at a local Delhi warehouse and redispatched to a new customer — saving{' '}
                                                <strong className="text-emerald-600">4 days</strong> and{' '}
                                                <strong className="text-emerald-600">₹170</strong> in logistics cost.
                                            </p>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10">
                                                {[
                                                    { icon: <Timer size={20} />, value: '80%', label: 'Time Saved', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', iconBg: 'bg-emerald-100' },
                                                    { icon: <IndianRupee size={20} />, value: '68%', label: 'Cost Saved', bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600', iconBg: 'bg-green-100' },
                                                    { icon: <Globe size={20} />, value: '60%', label: 'Less CO₂', bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-600', iconBg: 'bg-teal-100' },
                                                    { icon: <Zap size={20} />, value: '<24h', label: 'Re-Delivery', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-100' },
                                                ].map((stat, i) => (
                                                    <div
                                                        key={i}
                                                        className={`p-5 rounded-2xl ${stat.bg} border ${stat.border}`}
                                                    >
                                                        <div className={`w-9 h-9 rounded-lg ${stat.iconBg} ${stat.text} flex items-center justify-center mx-auto mb-2`}>
                                                            {stat.icon}
                                                        </div>
                                                        <div className={`text-2xl font-black ${stat.text} mb-0.5`}>{stat.value}</div>
                                                        <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <button
                                                    onClick={runDemo}
                                                    className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-bold text-base shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/35 transition-all hover:-translate-y-1 active:scale-[0.97] cursor-pointer border-none"
                                                >
                                                    <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
                                                    Run Again
                                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                                <Link to="/" className="no-underline">
                                                    <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-base hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-[0.97] shadow-sm cursor-pointer">
                                                        Back to Home
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* ═══════════════════ FOOTER ═══════════════════ */}
            <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

                <div className="max-w-7xl mx-auto px-5 md:px-10 pt-16 pb-12">
                    {/* Main Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-2">
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <RefreshCw className="text-white w-[18px] h-[18px]" strokeWidth={2.5} />
                                </div>
                                <span className="text-xl font-extrabold text-white tracking-tight">
                                    Reverse<span className="text-emerald-400">Logistics</span>
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
                                Smart HyperLocal Re-Fulfillment System. Reducing delivery time, cost, and carbon footprint through intelligent local redispatch of returned products.
                            </p>
                            <div className="flex gap-3">
                                {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:-translate-y-0.5 no-underline"
                                    >
                                        <Icon size={16} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5">Quick Links</h4>
                            <ul className="space-y-3 list-none p-0 m-0">
                                {[
                                    { to: '/', label: 'Home' },
                                    { to: '/demo', label: 'Demo Simulation' },
                                    { to: '/seller', label: 'Seller Panel' },
                                    { to: '/admin', label: 'Admin Panel' },
                                ].map((link) => (
                                    <li key={link.to}>
                                        <Link to={link.to} className="text-sm text-slate-400 hover:text-white transition-colors no-underline">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5">Resources</h4>
                            <ul className="space-y-3 list-none p-0 m-0">
                                {['Documentation', 'API Reference', 'Case Studies', 'Research Paper'].map((item) => (
                                    <li key={item}>
                                        <span className="text-sm text-slate-400">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5">Contact</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2.5 text-sm">
                                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                                        <Mail size={12} className="text-emerald-400" />
                                    </div>
                                    <span className="text-slate-400">support@reverselogistics.com</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm">
                                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                                        <Phone size={12} className="text-emerald-400" />
                                    </div>
                                    <span className="text-slate-400">+91 98765 43210</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm">
                                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                                        <MapPin size={12} className="text-emerald-400" />
                                    </div>
                                    <span className="text-slate-400">New Delhi, India</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800">
                        <p className="text-xs text-slate-500 font-medium">© 2025 ReverseLogistics. All rights reserved.</p>
                        <div className="flex items-center gap-6 text-xs text-slate-500">
                            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy</span>
                            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                All systems operational
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DemoSimulation;