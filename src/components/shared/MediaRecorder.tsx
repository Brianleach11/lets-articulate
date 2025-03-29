"use client";

import { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const MediaRecorder = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStart: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      },
    });

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const drawWaveform = () => {
    if (!canvasRef.current || !analyzerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyzer = analyzerRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyzer.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgb(0, 0, 0)";
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  useEffect(() => {
    if (status === "recording" && !analyzerRef.current) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const audioContext = new AudioContext();
          const source = audioContext.createMediaStreamSource(stream);
          const analyzer = audioContext.createAnalyser();
          analyzer.fftSize = 2048;

          source.connect(analyzer);
          sourceRef.current = source;
          analyzerRef.current = analyzer;

          drawWaveform();
        })
        .catch((err) => console.error("Error accessing microphone:", err));
    }
  }, [status]);

  const handlePlayback = () => {
    if (!audioRef.current || !mediaBlobUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-white/80 p-6 backdrop-blur-sm">
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        className="rounded-lg border border-gray-200"
      />

      <div className="flex gap-4">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={status === "recording" ? stopRecording : startRecording}
            variant={status === "recording" ? "destructive" : "default"}
          >
            {status === "recording" ? "Stop Recording" : "Start Recording"}
          </Button>
        </motion.div>

        {mediaBlobUrl && (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button onClick={handlePlayback} variant="outline">
              {isPlaying ? "Pause" : "Play Recording"}
            </Button>
          </motion.div>
        )}
      </div>

      <audio
        ref={audioRef}
        src={mediaBlobUrl}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
};
