import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/api.js";
import { INCIDENT_CATEGORIES } from "../utils/constants.js";

// Default Leaflet marker icons don't load correctly under bundlers unless
// explicitly re-pointed at the CDN assets.
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const STEPS = ["Submission Type", "Incident Type", "Description", "Location", "Photo"];
const GHANA_DEFAULT_CENTER = [7.9465, -1.0232]; // rough geographic centre of Ghana

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function DraggableMarker({ position, onChange }) {
  return (
    <Marker
      position={position}
      draggable
      icon={markerIcon}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          onChange([lat, lng]);
        },
      }}
    />
  );
}

export default function ReportForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  const [submissionType, setSubmissionType] = useState(currentUser ? "registered" : "");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState(null);
  const [locatingGps, setLocatingGps] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && INCIDENT_CATEGORIES.includes(typeParam)) {
      setIncidentType(typeParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (!position) errors.location = "Confirm a location on the map.";
    }

    return errors;
  }

  function handleSelectAnonymous() {
    setSubmissionType("anonymous");
    setFieldErrors({});
  }

  function handleSelectRegistered() {
    if (!currentUser) {
      navigate("/login", { state: { from: "/report" } });
      return;
    }
    setSubmissionType("registered");
    setFieldErrors({});
  }

  function detectGps() {
    setLocatingGps(true);
    setFieldErrors((prev) => ({ ...prev, location: undefined }));

    if (!navigator.geolocation) {
      setFieldErrors((prev) => ({ ...prev, location: "Geolocation isn't supported on this device." }));
      setLocatingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setLocatingGps(false);
      },
      () => {
        setFieldErrors((prev) => ({
          ...prev,
          location: "Couldn't detect your location. Tap the map to drop a pin instead.",
        }));
        setLocatingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFieldErrors((prev) => ({ ...prev, photo: "Only JPG, PNG, or WEBP images are allowed." }));
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
          <StepLocation
            position={position}
            setPosition={setPosition}
            detectGps={detectGps}
            locatingGps={locatingGps}
            error={fieldErrors.location}
          />
        )}

        {step === 4 && (
          <StepPhoto
            photoPreview={photoPreview}
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



function StepPhoto({ photoPreview, onChange, onRemove, fileInputRef, error }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Photo <span className="text-muted/70 font-normal">(optional)</span>
      </label>

      {!photoPreview ? (
        <label className="flex flex-col items-center justify-center gap-2 h-40 rounded-sign border-2 border-dashed border-border cursor-pointer hover:border-ink/40 transition-colors">
          <span className="text-sm text-muted">Tap to choose a photo</span>
          <span className="text-xs text-muted/70">JPG, PNG, or WEBP</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative">
          <img src={photoPreview} alt="Incident preview" className="w-full h-56 object-cover rounded-sign" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 px-3 py-1.5 text-xs font-mono uppercase bg-primary-hover text-white rounded-sign"
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

function StepLocation({ position, setPosition, detectGps, locatingGps, error }) {
  const center = position || GHANA_DEFAULT_CENTER;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium">Incident location</label>
        <button
          type="button"
          onClick={detectGps}
          disabled={locatingGps}
          className="text-xs font-mono uppercase tracking-wide px-3 py-1.5 rounded-sign border border-border hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
        >
          {locatingGps ? "Locating…" : "Use My Location"}
        </button>
      </div>

      <div className="h-56 sm:h-72 w-full rounded-sign overflow-hidden border border-border">
        <MapContainer center={center} zoom={position ? 15 : 7} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onClick={setPosition} />
          {position && <DraggableMarker position={position} onChange={setPosition} />}
        </MapContainer>
      </div>

      <p className="mt-2 text-xs text-muted/80">
        Tap the map or drag the pin to fine-tune the exact spot.
      </p>

      {position && (
        <p className="mt-2 font-mono text-xs text-muted">
          {position[0].toFixed(5)}, {position[1].toFixed(5)}
        </p>
      )}

      {error && <p className="mt-2 text-sm text-danger font-medium">{error}</p>}
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
