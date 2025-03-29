"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useReactMediaRecorder } from "react-media-recorder";
import { useRef, useEffect } from "react";

export default function SoundPage() {
  const { sound } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);

  // Get the video file name from the sound parameter (e.g., "B Sound" -> "B.webm")
  const videoFile = `${sound?.toString().split("%20")[0]}.webm`;

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream,
    clearBlobUrl,
  } = useReactMediaRecorder({
    video: {
      width: 1080,
      height: 1920,
      facingMode: "user",
    },
    audio: true,
    blobPropertyBag: { type: "video/mp4" },
    mediaRecorderOptions: {
      mimeType: MediaRecorder.isTypeSupported("video/mp4")
        ? "video/mp4"
        : MediaRecorder.isTypeSupported("video/webm;codecs=h264")
        ? "video/webm;codecs=h264"
        : "video/webm",
    },
  });

  // Handle video preview
  useEffect(() => {
    if (previewRef.current && previewStream) {
      previewRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  return (
    <div className="fixed inset-0 bg-[#0A0A12] flex flex-col items-center p-8 overflow-hidden">
      {/* Back button */}
      <Link
        href="/"
        className="absolute top-8 left-8 px-8 py-4 bg-[rgb(var(--first-color))] hover:brightness-110 rounded-full text-white font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
      >
        ← Back to Sounds
      </Link>

      {/* Title */}
      <h1 className="text-6xl font-bold text-white mb-12">
        {sound?.toString().replace("%20", " ")}
      </h1>

      {/* Main content */}
      <div className="flex items-center justify-center gap-8">
        {/* Video player */}
        <div className="w-[400px] aspect-[9/16] rounded-2xl overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            controls
            autoPlay
          >
            <source src={`/videos/${videoFile}`} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Webcam */}
        <div className="w-[400px] aspect-[9/16] rounded-2xl overflow-hidden bg-black">
          {status === "stopped" && mediaBlobUrl ? (
            <video
              key={mediaBlobUrl}
              src={mediaBlobUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={previewRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Recording controls */}
        <div className="flex items-center">
          {status === "stopped" ? (
            <button
              onClick={() => {
                clearBlobUrl();
              }}
              className="px-6 py-4 bg-[rgb(var(--first-color))] hover:brightness-110 rounded-full text-white font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
            >
              Record Again
            </button>
          ) : (
            <button
              onClick={status === "recording" ? stopRecording : startRecording}
              className={`px-6 py-4 ${
                status === "recording"
                  ? "bg-red-500 hover:brightness-110"
                  : "bg-[rgb(var(--first-color))] hover:brightness-110"
              } rounded-full text-white font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform`}
            >
              {status === "recording" ? "Stop Recording" : "Start Recording"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
