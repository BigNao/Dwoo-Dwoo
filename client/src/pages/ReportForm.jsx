import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/api.js";
import { INCIDENT_CATEGORIES } from "../utils/constants.js";
import LocationPicker from "../components/LocationPicker.jsx";

const STEPS = ["Submission Type", "Incident Type", "Description", "Location", "Photo"];
const STORAGE_KEY = "dwoo_report_draft";

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    return draft;
  } catch { return null; }
}

function saveDraft(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* quota exceeded — silently ignore */ }
}

function clearDraft() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

export default function ReportForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const draft = useRef(loadDraft());

  const [step, setStep] = useState(draft.current?.step ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  const [submissionType, setSubmissionType] = useState(draft.current?.submissionType ?? "");
  const [incidentType, setIncidentType] = useState(draft.current?.incidentType ?? "");
  const [description, setDescription] = useState(draft.current?.description ?? "");
  const [position, setPosition] = useState(draft.current?.position ?? null);
  const [locationConfirmed, setLocationConfirmed] = useState(draft.current?.locationConfirmed ?? false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [draftRestored, setDraftRestored] = useState(!!draft.current);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && INCIDENT_CATEGORIES.includes(typeParam)) {
      setIncidentType(typeParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (confirmation) { clearDraft(); return; }
    const data = { step, submissionType, incidentType, description, position, locationConfirmed };
    saveDraft(data);
  }, [step, submissionType, incidentType, description, position, locationConfirmed, confirmation]);

  function discardDraft() {
    clearDraft();
    setStep(0);
    setSubmissionType("");
    setIncidentType("");
    setDescription("");
    setPosition(null);
    setLocationConfirmed(false);
    setDraftRestored(false);
  }

  const progressPercent = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  function goNext() {
    const errors = validateStep(step);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setFieldErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function validateStep(currentStep) {
    const errors = {};

    if (currentStep === 0) {
      if (!submissionType) errors.submissionType = "Choose how you'd like to report.";
      if (submissionType === "registered" && !currentUser) {
        errors.submissionType = "Please log in first, then return to this form.";
      }
    }

    if (currentStep === 1) {
      if (!incidentType) errors.incidentType = "Select an incident type.";
    }

    if (currentStep === 2) {
      if (description.trim().length < 20) {
        errors.description = "Description must be at least 20 characters.";
      }
    }

    if (currentStep === 3) {
      if (!position) errors.location = "Place a pin on the map.";
      else if (!locationConfirmed) errors.location = "Click 'Confirm Location' to confirm the pin position.";
    }

    return errors;
  }

  function handleSelectAnonymous() {
    setSubmissionType("anonymous");
    setFieldErrors({});
  }

  function handleSelectRegistered() {
    if (currentUser) {
      navigate("/citizen/new-report");
      return;
    }
    navigate("/login", { state: { from: "/citizen/new-report" } });
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm", "video/quicktime"];
    if (!ACCEPTED_TYPES.some((t) => file.type.startsWith(t))) {
      setFieldErrors((prev) => ({ ...prev, photo: "Only JPG, PNG, WEBP images or MP4/WEBM/MOV videos are allowed." }));
      return;
    }

    setFieldErrors((prev) => ({ ...prev, photo: undefined }));
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit() {
    setSubmitError("");
    setSubmitting(true);

    try {
      let photoData = null;
      let photoName = null;

      if (photoFile) {
        photoData = await fileToBase64(photoFile);
        photoName = photoFile.name;
      }

      const payload = {
        submission_type: submissionType,
        incident_type: incidentType,
        description: description.trim(),
        latitude: position[0],
        longitude: position[1],
        photo_data: photoData,
        photo_name: photoName,
        user_id: submissionType === "registered" ? currentUser?.uid : null,
      };

      const { data } = await api.post("/reports", payload);
      setConfirmation(data);
    } catch (err) {
      console.error("Report submission failed:", err);
      setSubmitError(
        err.response?.data?.message || "Something went wrong submitting your report. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  if (confirmation) {
    return <ConfirmationScreen confirmation={confirmation} navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="font-display text-3xl font-semibold mb-2">Report an Incident</h1>
        <p className="text-sm text-muted mb-8">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>

        <div className="h-1.5 w-full bg-border rounded-full mb-10 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {draftRestored && (
          <div className="mb-6 flex items-center justify-between rounded-sign border border-accent/30 bg-accent/5 px-4 py-3">
            <p className="text-sm text-ink">
              Draft restored from your last session.
            </p>
            <button
              type="button"
              onClick={discardDraft}
              className="text-xs font-semibold text-danger hover:text-danger-dark underline"
            >
              Discard draft
            </button>
          </div>
        )}

        {step === 0 && (
          <StepSubmissionType
            submissionType={submissionType}
            onAnonymous={handleSelectAnonymous}
            onRegistered={handleSelectRegistered}
            error={fieldErrors.submissionType}
            currentUser={currentUser}
          />
        )}

        {step === 1 && (
          <StepIncidentType
            incidentType={incidentType}
            setIncidentType={setIncidentType}
            error={fieldErrors.incidentType}
          />
        )}

        {step === 2 && (
          <StepDescription
            description={description}
            setDescription={setDescription}
            error={fieldErrors.description}
          />
        )}

        {step === 3 && (
          <LocationPicker
            position={position}
            setPosition={(pos) => {
              setPosition(pos);
              setLocationConfirmed(false);
            }}
            onConfirm={() => setLocationConfirmed(true)}
            error={fieldErrors.location}
          />
        )}

        {step === 4 && (
          <StepPhoto
            photoPreview={photoPreview}
            photoFile={photoFile}
            onChange={handlePhotoChange}
            onRemove={removePhoto}
            fileInputRef={fileInputRef}
            error={fieldErrors.photo}
          />
        )}

        {submitError && (
          <p className="mt-6 text-sm text-danger font-medium" role="alert">
            {submitError}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="px-4 sm:px-5 py-2.5 rounded-sign border border-border font-medium disabled:opacity-30 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="px-4 sm:px-6 py-2.5 rounded-sign bg-primary text-white font-medium hover:bg-primary-hover transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 sm:px-6 py-2.5 rounded-sign bg-primary text-white font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
            >
              {submitting ? "Submitting…" : "Submit Report"}
            </button>
          )}
        </div>
      </main>
    </div>
  );

}

function OptionCard({ selected, title, body, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-5 rounded-sign border-2 transition-colors ${
        selected ? "border-primary bg-primary/5" : "border-border hover:border-border"
      }`}
    >
      <p className="font-display font-semibold text-lg">{title}</p>
      <p className="text-sm text-muted mt-1">{body}</p>
    </button>
  );
}

function StepIncidentType({ incidentType, setIncidentType, error }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" htmlFor="incident-type">
        Incident type
      </label>
      <select
        id="incident-type"
        value={incidentType}
        onChange={(e) => setIncidentType(e.target.value)}
        className="w-full rounded-sign border border-border px-4 py-3 bg-card focus:border-primary"
      >
        <option value="">Select a category…</option>
        {INCIDENT_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-danger font-medium">{error}</p>}
    </div>
  );
}

function StepDescription({ description, setDescription, error }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" htmlFor="description">
        What happened?
      </label>
      <textarea
        id="description"
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the incident: what you saw, when, and anything else responders should know…"
        className="w-full rounded-sign border border-border px-4 py-3 bg-card focus:border-primary resize-none"
      />
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-muted/80">Minimum 20 characters.</p>
        <p className="text-xs font-mono text-muted/80">{description.trim().length} chars</p>
      </div>
      {error && <p className="mt-2 text-sm text-danger font-medium">{error}</p>}
    </div>
  );
}



function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function StepPhoto({ photoPreview, photoFile, onChange, onRemove, fileInputRef, error }) {
  const isVideo = photoFile?.type?.startsWith("video/");
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [cameraMode, setCameraMode] = useState("photo");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [facingMode, setFacingMode] = useState("environment");

  useEffect(() => {
    if (!recording) { setElapsed(0); return; }
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [recording]);

  useEffect(() => {
    if (!showCamera) return;
    let active = true;
    (async () => {
      try {
        if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: cameraMode === "video" });
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        setCameraStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraError(null);
      } catch (err) {
        if (active) setCameraError("Could not access camera. Please allow camera permission or use Browse Files instead.");
      }
    })();
    return () => { active = false; };
  }, [showCamera, facingMode, cameraMode]);

  useEffect(() => {
    if (!cameraStream || !videoRef.current) return;
    videoRef.current.srcObject = cameraStream;
  }, [cameraStream]);

  useEffect(() => {
    if (!showCamera) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    }
  }, [showCamera]);

  function stopCamera() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    setCameraStream(null);
    setRecording(false);
    setShowCamera(false);
    setCameraError(null);
    recordedChunksRef.current = [];
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `camera_${Date.now()}.jpg`, { type: "image/jpeg" });
      stopCamera();
      onChange({ target: { files: [file] } });
    }, "image/jpeg");
  }

  function startRecording() {
    recordedChunksRef.current = [];
    const stream = cameraStream;
    if (!stream) return;
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : "video/mp4";
    try {
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType });
        const ext = recorder.mimeType.includes("mp4") ? "mp4" : "webm";
        const file = new File([blob], `camera_${Date.now()}.${ext}`, { type: recorder.mimeType });
        recordedChunksRef.current = [];
        stopCamera();
        onChange({ target: { files: [file] } });
      };
      recorder.start(1000);
      setRecording(true);
    } catch {
      setCameraError("Video recording is not supported on this device.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Photo or Video <span className="text-muted/70 font-normal">(optional)</span>
      </label>

      {showCamera ? (
        <div className="space-y-3">
          <div className="relative rounded-sign overflow-hidden bg-black">
            <video ref={videoRef} autoPlay playsInline muted={cameraMode === "video"} className="w-full h-64 object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            {recording && (
              <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                {formatTime(elapsed)}
              </span>
            )}
          </div>
          {cameraError && <p className="text-sm text-danger font-medium">{cameraError}</p>}
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCameraMode("photo")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${cameraMode === "photo" ? "bg-primary text-white" : "bg-muted/20 text-ink hover:bg-muted/40"}`}
            >
              Photo
            </button>
            <button
              type="button"
              onClick={() => setCameraMode("video")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${cameraMode === "video" ? "bg-primary text-white" : "bg-muted/20 text-ink hover:bg-muted/40"}`}
            >
              Video
            </button>
            <button
              type="button"
              onClick={() => setFacingMode((m) => (m === "environment" ? "user" : "environment"))}
              className="p-2 rounded-full hover:bg-muted/20 transition-colors"
              title="Switch camera"
            >
              <svg className="h-5 w-5 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </button>
          </div>
          <div className="flex gap-3">
            {cameraMode === "photo" ? (
              <button
                type="button"
                onClick={capturePhoto}
                disabled={!cameraStream}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                Capture Photo
              </button>
            ) : recording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-white" />
                  Stop Recording
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                disabled={!cameraStream}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-white" />
                  Start Recording
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : !photoPreview ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              if (navigator.mediaDevices?.getUserMedia) {
                setShowCamera(true);
              } else {
                cameraInputRef.current?.click();
              }
            }}
            className="flex flex-col items-center justify-center gap-2 h-32 rounded-sign border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <svg className="h-8 w-8 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            <span className="text-sm font-medium text-muted">Open Camera</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 h-32 rounded-sign border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <svg className="h-8 w-8 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
            <span className="text-sm font-medium text-muted">Browse Files</span>
          </button>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            capture="environment"
            onChange={onChange}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            onChange={onChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative">
          {isVideo ? (
            <video src={photoPreview} controls className="w-full h-56 object-cover rounded-sign" />
          ) : (
            <img src={photoPreview} alt="Incident preview" className="w-full h-56 object-cover rounded-sign" />
          )}
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 px-3 py-1.5 text-xs font-mono uppercase bg-black/50 text-white rounded-sign"
          >
            Remove
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-danger font-medium">{error}</p>}
    </div>
  );
}

function StepSubmissionType({ submissionType, onAnonymous, onRegistered, error }) {
  return (
    <div className="space-y-4">
      <OptionCard
        selected={submissionType === "anonymous"}
        title="Report Anonymously"
        body="No account needed. Submit now, keep your reference number to track it."
        onClick={onAnonymous}
      />
      <OptionCard
        selected={submissionType === "registered"}
        title="Report as Registered User"
        body="Log in so this report appears in your My Reports list."
        onClick={onRegistered}
      />
      {error && <p className="text-sm text-danger font-medium">{error}</p>}
    </div>
  );
}



function ConfirmationScreen({ confirmation, navigate }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white text-2xl mb-6">
            ✓
          </div>
          <h1 className="font-display text-3xl font-semibold mb-3">Report submitted</h1>
          <p className="text-muted mb-8">Save this reference number to track your report.</p>

          <div className="rounded-sign border-2 border-dashed border-accent px-6 py-5 mb-8">
            <p className="text-xs font-mono uppercase tracking-widest text-muted/80 mb-1">
              Reference Number
            </p>
            <p className="font-mono text-2xl font-semibold tracking-widest">
              {confirmation.reference_number}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate("/track")}
              className="px-6 py-3 rounded-sign bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
            >
              Track this report
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-sign border border-border font-semibold hover:bg-primary/5 transition-colors"
            >
              Back home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
