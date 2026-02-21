/**
 * PWAInstallBanner - Always-visible PWA install CTA for the Auth page.
 * Works in both direct-URL and Hugging Face iframe contexts.
 *
 * Strategy:
 *  - If `beforeinstallprompt` fires (direct Chrome/Edge access): show a
 *    one-click "Install" button that triggers the native OS install flow.
 *  - If the event does NOT fire (e.g. inside a HF iframe): show clear,
 *    friendly instructions on how to open the app in a new tab and install
 *    it from the browser's address-bar menu.
 *  - If the app is already installed: show a green "Already installed ✓" badge.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Smartphone, Monitor, X, CheckCircle, ExternalLink, Info } from 'lucide-react';

const HF_SPACE_URL = 'https://huggingface.co/spaces/ibadatali/walmart-sales-forecasting-saas';

function isStandalone() {
    return (
        window.navigator.standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches
    );
}

export default function PWAInstallBanner() {
    const [installReady, setInstallReady] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [installed, setInstalled] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        // Already installed as a native app?
        if (isStandalone()) {
            setInstalled(true);
            return;
        }

        // Previously dismissed in this session?
        if (sessionStorage.getItem('pwa-banner-dismissed')) {
            setDismissed(true);
            return;
        }

        // Listen for the native install prompt (Chrome/Edge direct URL context)
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setInstallReady(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', () => setInstalled(true));

        // After 2 s, if no prompt fired (HF iframe / Safari / Firefox), show
        // the manual-instructions variant automatically so the banner is always visible.
        const timer = setTimeout(() => {
            if (!window._pwaPromptFired) {
                setInstallReady(true); // show banner in fallback mode
            }
        }, 2000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            clearTimeout(timer);
        };
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            // Native one-click install
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') setInstalled(true);
            setDeferredPrompt(null);
        } else {
            // Fallback: open app in a top-level tab where install works
            setShowInstructions(true);
        }
    };

    const handleDismiss = () => {
        setDismissed(true);
        sessionStorage.setItem('pwa-banner-dismissed', 'true');
    };

    if (installed) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold mt-4">
                <CheckCircle className="w-4 h-4" />
                App Installed ✓
            </div>
        );
    }

    if (dismissed || !installReady) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full mt-4 relative"
            >
                {/* ── Main install card ── */}
                <div className="relative rounded-2xl overflow-hidden border border-[rgba(74,158,255,0.25)] bg-[rgba(10,14,26,0.85)] backdrop-blur-xl shadow-[0_0_30px_rgba(74,158,255,0.1)]">
                    {/* Gradient edge glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4A9EFF]/10 via-transparent to-[#B794F6]/10 pointer-events-none" />

                    <div className="relative p-4">
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                {/* Animated app icon */}
                                <motion.div
                                    animate={{ rotate: [0, 8, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                    className="w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4A9EFF] to-[#B794F6] flex items-center justify-center shadow-lg"
                                >
                                    <Download className="w-5 h-5 text-white" />
                                </motion.div>

                                <div>
                                    <p className="text-white font-semibold text-sm leading-tight">
                                        Install AdaptIQ
                                    </p>
                                    <p className="text-[#A3ADBF] text-xs mt-0.5">
                                        Desktop &amp; Mobile — works offline
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleDismiss}
                                className="text-[#A3ADBF] hover:text-white transition-colors flex-shrink-0 mt-0.5"
                                aria-label="Dismiss install banner"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Feature pills */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {[
                                { icon: Monitor, label: 'Desktop App' },
                                { icon: Smartphone, label: 'Mobile App' },
                                { icon: CheckCircle, label: 'Works Offline' },
                            ].map(({ icon: Icon, label }) => (
                                <span key={label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#A3ADBF]">
                                    <Icon className="w-3 h-3" /> {label}
                                </span>
                            ))}
                        </div>

                        {/* Action button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleInstall}
                            className="mt-3 w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#4A9EFF] to-[#B794F6] shadow-[0_4px_20px_rgba(74,158,255,0.3)] hover:shadow-[0_6px_24px_rgba(74,158,255,0.45)] transition-shadow"
                        >
                            {deferredPrompt ? '⬇ Install Now — One Click' : '⬇ How to Install'}
                        </motion.button>
                    </div>
                </div>

                {/* ── Manual instructions panel (shown when no native prompt) ── */}
                <AnimatePresence>
                    {showInstructions && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 rounded-2xl border border-[rgba(74,158,255,0.2)] bg-[rgba(10,14,26,0.9)] backdrop-blur-xl overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="w-4 h-4 text-[#4A9EFF]" />
                                    <span className="text-white font-semibold text-sm">Install Instructions</span>
                                </div>

                                <ol className="space-y-2.5 text-xs text-[#A3ADBF]">
                                    <li className="flex gap-2">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4A9EFF]/20 text-[#4A9EFF] flex items-center justify-center font-bold text-[10px]">1</span>
                                        <span>Open the app in a <strong className="text-white">new browser tab</strong> (not inside the HuggingFace embed)</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4A9EFF]/20 text-[#4A9EFF] flex items-center justify-center font-bold text-[10px]">2</span>
                                        <span><strong className="text-white">Desktop:</strong> Click the install icon (⊕) in the browser address bar</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4A9EFF]/20 text-[#4A9EFF] flex items-center justify-center font-bold text-[10px]">3</span>
                                        <span><strong className="text-white">Mobile:</strong> Tap the Share button → "Add to Home Screen"</span>
                                    </li>
                                </ol>

                                <a
                                    href={HF_SPACE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white border border-[rgba(74,158,255,0.4)] hover:bg-[rgba(74,158,255,0.1)] transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Open App in New Tab
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}
