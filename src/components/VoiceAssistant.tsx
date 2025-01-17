import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { Button } from '@tremor/react';
import { MicIcon, MicOffIcon } from 'lucide-react';
import { Assistant } from '../pages/Vapi';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceAssistantProps {
  config?: Assistant;
  className?: string;
}

let vapi: any = null;
try {
  vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY || '');
} catch (error) {
  console.error('Failed to initialize Vapi:', error);
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ config, className }) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<string>('');
  const currentCallRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      setHasPermission(false);
      setCallStatus('Please enable microphone access');
      return false;
    }
  };

  const startCall = async (isReconnect = false) => {
    if (!vapi || !config) {
      setCallStatus('Voice assistant not initialized');
      return;
    }

    try {
      const hasMicPermission = await checkMicrophonePermission();
      if (!hasMicPermission) return;

      if (!isReconnect) {
        setConnecting(true);
        setCallStatus('Connecting...');
        reconnectAttemptsRef.current = 0;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      const assistantConfig = {
        transcriber: {
          provider: config.transcriber.provider,
          language: config.transcriber.language,
          model: "nova-2",
        },
        voice: {
          provider: config.voice.provider,
          voiceId: config.voice.voiceId,
        },
        model: {
          provider: config.model.provider,
          model: config.model.model,
          temperature: config.model.temperature,
          systemPrompt: config.model.systemPrompt,
          emotionRecognitionEnabled: config.model.emotionRecognitionEnabled,
          maxTokens: 8000,
        },
        name: config.name,
        firstMessage: isReconnect ? undefined : config.firstMessage,
        firstMessageMode: "assistant-speaks-first",
        silenceTimeoutSeconds: 300,
        maxDurationSeconds: 7200,
        backgroundSound: config.backgroundSound,
        backgroundDenoisingEnabled: config.backgroundDenoisingEnabled,
        backchannelingEnabled: config.backchannelingEnabled,
        startSpeakingPlan: {
          waitSeconds: config.startSpeakingPlan.waitSeconds,
          smartEndpointingEnabled: true,
        }
      };

      currentCallRef.current = await vapi.start(assistantConfig);
      return currentCallRef.current;
    } catch (error: any) {
      console.error('Error starting voice call:', error);
      handleReconnection(error);
      throw error;
    }
  };

  const handleReconnection = async (error: any) => {
    setConnecting(false);
    setConnected(false);
    setAssistantIsSpeaking(false);
    currentCallRef.current = null;

    if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttemptsRef.current++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
      setCallStatus(`Reconnecting... Attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}`);
      
      reconnectTimeoutRef.current = setTimeout(async () => {
        try {
          await startCall(true);
        } catch (e) {
          console.error('Reconnection attempt failed:', e);
          handleReconnection(e);
        }
      }, delay);
    } else {
      setCallStatus('Connection lost. Please try again.');
    }
  };

  useEffect(() => {
    if (!vapi) {
      setCallStatus('Failed to initialize voice assistant');
      return;
    }

    checkMicrophonePermission();

    const handleCallStart = () => {
      setConnecting(false);
      setConnected(true);
      setCallStatus('Connected');
      reconnectAttemptsRef.current = 0;
    };

    const handleCallEnd = () => {
      cleanup();
    };

    const handleError = async (error: any) => {
      console.error('Call error:', error);
      if (error.error?.type === 'no-room' || error.errorMsg === 'Meeting has ended') {
        handleReconnection(error);
      } else {
        cleanup();
        setCallStatus(`Error: ${error.message || 'Unknown error'}`);
      }
    };

    const cleanup = () => {
      setConnecting(false);
      setConnected(false);
      setAssistantIsSpeaking(false);
      currentCallRef.current = null;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('speech-start', () => setAssistantIsSpeaking(true));
    vapi.on('speech-end', () => setAssistantIsSpeaking(false));
    vapi.on('error', handleError);

    return () => {
      cleanup();
      if (currentCallRef.current) {
        try {
          vapi.stop();
        } catch (e) {
          console.error('Error stopping call on unmount:', e);
        }
      }
    };
  }, []);

  const handleVoiceCall = async () => {
    if (!vapi || !config) {
      setCallStatus('Voice assistant not initialized');
      return;
    }

    if (connected && currentCallRef.current) {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      reconnectAttemptsRef.current = 0;

      try {
        await vapi.stop();
        currentCallRef.current = null;
      } catch (error) {
        console.error('Error stopping call:', error);
      }
      return;
    }

    try {
      await startCall(false);
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <motion.button
        onClick={handleVoiceCall}
        disabled={!config || !hasPermission || !vapi || connecting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          ${className}
          flex items-center justify-center
          px-4 py-2.5 
          bg-teal-50 
          border border-teal-200 
          text-teal-700 
          rounded-xl 
          shadow-sm 
          hover:bg-teal-100 
          hover:border-teal-300 
          transition-all duration-200
          disabled:opacity-50 
          disabled:cursor-not-allowed
          disabled:hover:bg-teal-50
          disabled:hover:border-teal-200
          min-w-[180px]
          ${assistantIsSpeaking ? 'bg-teal-100 border-teal-300' : ''}
          ${connected ? 'bg-teal-100 border-teal-300' : ''}
        `}
      >
        <div className="flex items-center justify-center space-x-2 relative w-full">
          {connected ? (
            <MicOffIcon className="w-5 h-5 text-teal-600 flex-shrink-0" />
          ) : (
            <MicIcon className="w-5 h-5 text-teal-600 flex-shrink-0" />
          )}
          <AnimatePresence mode="wait">
            <motion.span
              key={connected ? 'connected' : 'disconnected'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.2,
                ease: "easeOut"
              }}
              className="font-medium whitespace-nowrap text-center"
            >
              {!vapi ? 'Initializing...' :
               !hasPermission ? 'Enable Mic' : 
               connecting ? 'Connecting...' : 
               connected ? (assistantIsSpeaking ? 'AI Speaking' : 'End Call') : 
               'Talk to AI Agent'}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Ripple effect when speaking */}
      {assistantIsSpeaking && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            border: '2px solid #0d9488',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Status indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1"
      >
        <div className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
          assistantIsSpeaking ? 'bg-teal-500' :
          connected ? 'bg-teal-500' :
          connecting ? 'bg-teal-400' :
          'bg-teal-300'
        } ${(connected || connecting) ? 'animate-pulse' : ''}`} />
      </motion.div>
    </motion.div>
  );
};

export default VoiceAssistant;
