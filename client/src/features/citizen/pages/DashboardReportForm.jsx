import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useAuth } from "../../../context/AuthContext.jsx";
import api from "../../../utils/api.js";
import { INCIDENT_CATEGORIES } from "../../../utils/constants.js";

// Default Leaflet marker icons don't load correctly under bundlers unless
// explicitly re-pointed at the CDN assets.
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const STEPS = ["Incident Type", "Description", "Location", "Photo"];
const GHANA_DEFAULT_CENTER = [7.9465, -1.0232]; // rough geographic centre of Ghana

function DraggableMarker({ position, onChange }) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });

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

export default function DashboardReportForm() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  const [submissionType] = useState("registered"); // Always registered for dashboard users
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState(null);
  const [locatingGps, setLocatingGps] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

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

    // Step 0 is now Incident Type (was step 1 in original)
    if (currentStep === 0) {
      if (!incidentType) errors.incidentType = "Select an incident type.";
    }

    // Step 1 is now Description (was step 2 in original)
    if (currentStep === 1) {
      if (description.trim().length < 20) {
        errors.description = "Description must be at least 20 characters.";
      }
    }

    // Step 2 is now Location (was step 3 in original)
    if (currentStep === 2) {
      if (!position) errors.location = "Confirm a location on the map.";
    }

    return errors;
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
      let photoUrl = null;

      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);

        const uploadResponse = await api.post("/upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        photoUrl = uploadResponse.data.url;
      }

      const payload = {
        submission_type: submissionType,
        incident_type: incidentType,
        description: description.trim(),
        latitude: position[0],
        longitude: position[1],
        photo_url: photoUrl,
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

  if (confirmation) {
    return <ConfirmationScreen confirmation={confirmation} navigate={navigate} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-ink dark:text-white">Report an Incident</h2>
        <p className="text-sm text-muted dark:text-white/60 mb-6">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>

        <div className="h-1.5 w-full bg-border dark:bg-white/10 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-primary dark:bg-accent transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <StepIncidentType
          incidentType={incidentType}
          setIncidentType={setIncidentType}
          error={fieldErrors.incidentType}
        />
      )}

      {step === 1 && (
        <StepDescription
          description={description}
          setDescription={setDescription}
          error={fieldErrors.description}
        />
      )}

      {step === 2 && (
        <StepLocation
          position={position}
          setPosition={setPosition}
          detectGps={detectGps}
          locatingGps={locatingGps}
          error={fieldErrors.location}
        />
      )}

      {step === 3 && (
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

      <div className="flex items-center justify-between gap-3 pt-4">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="px-4 sm:px-5 py-2.5 rounded-sign border border-border dark:border-white/20 font-medium disabled:opacity-30 disabled:cursor-not-allowed text-sm sm:text-base text-ink dark:text-white"
        >
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="px-4 sm:px-6 py-2.5 rounded-sign bg-primary dark:bg-accent text-white dark:text-ink font-medium hover:bg-primary-hover dark:hover:bg-accent-dark transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 sm:px-6 py-2.5 rounded-sign bg-primary dark:bg-accent text-white dark:text-ink font-semibold hover:bg-primary-hover dark:hover:bg-accent-dark transition-colors disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
          >
            {submitting ? "Submitting…" : "Submit Report"}
          </button>
        )}
      </div>
    </div>
  );
}

function StepIncidentType({ incidentType, setIncidentType, error }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-ink dark:text-white" htmlFor="incident-type">
        Incident type
      </label>
      <select
        id="incident-type"
        value={incidentType}
        onChange={(e) => setIncidentType(e.target.value)}
        className="w-full rounded-sign border border-border dark:border-white/10 px-4 py-3 bg-card dark:bg-asphalt-light text-ink dark:text-white focus:border-primary dark:focus:border-accent"
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
      <label className="block text-sm font-medium mb-2 text-ink dark:text-white" htmlFor="description">
        What happened?
      </label>
      <textarea
        id="description"
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the incident: what you saw, when, and anything else responders should know…"
        className="w-full rounded-sign border border-border dark:border-white/10 px-4 py-3 bg-card dark:bg-asphalt-light text-ink dark:text-white focus:border-primary dark:focus:border-accent resize-none"
      />
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-muted/80 dark:text-white/40">Minimum 20 characters.</p>
        <p className="text-xs font-mono text-muted/80 dark:text-white/40">{description.trim().length} chars</p>
      </div>
      {error && <p className="mt-2 text-sm text-danger font-medium">{error}</p>}
    </div>
  );
}

function StepLocation({ position, setPosition, detectGps, locatingGps, error }) {
  const center = position || GHANA_DEFAULT_CENTER;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-ink dark:text-white">Incident location</label>
        <button
          type="button"
          onClick={detectGps}
          disabled={locatingGps}
          className="text-xs font-mono uppercase tracking-wide px-3 py-1.5 rounded-sign border border-border dark:border-white/20 hover:bg-primary dark:hover:bg-accent hover:text-white dark:hover:text-ink transition-colors disabled:opacity-50 text-muted dark:text-white/60"
        >
          {locatingGps ? "Locating…" : "Use My Location"}
        </button>
      </div>

      <div className="h-56 sm:h-72 w-full rounded-sign overflow-hidden border border-border dark:border-white/10">
        <MapContainer center={center} zoom={position ? 15 : 7} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position && <DraggableMarker position={position} onChange={setPosition} />}
        </MapContainer>
      </div>

      <p className="mt-2 text-xs text-muted/80 dark:text-white/40">
        Tap the map or drag the pin to fine-tune the exact spot.
      </p>

      {position && (
        <p className="mt-2 font-mono text-xs text-muted dark:text-white/60">
          {position[0].toFixed(5)}, {position[1].toFixed(5)}
        </p>
      )}

      {error && <p className="mt-2 text-sm text-danger font-medium">{error}</p>}
    </div>
  );
}

function StepPhoto({ photoPreview, onChange, onRemove, fileInputRef, error }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-ink dark:text-white">
        Photo <span className="text-muted/70 dark:text-white/40 font-normal">(optional)</span>
      </label>

      {!photoPreview ? (
        <label className="flex flex-col items-center justify-center gap-2 h-40 rounded-sign border-2 border-dashed border-border dark:border-white/20 cursor-pointer hover:border-ink/40 dark:hover:border-white/40 transition-colors">
          <span className="text-sm text-muted dark:text-white/60">Tap to choose a photo</span>
          <span className="text-xs text-muted/70 dark:text-white/40">JPG, PNG, or WEBP</span>
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

function ConfirmationScreen({ confirmation, navigate }) {
  return (
    <div className="text-center py-8">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white text-2xl mb-6">
        ✓
      </div>
      <h2 className="text-2xl font-semibold mb-3 text-ink dark:text-white">Report submitted</h2>
      <p className="text-muted dark:text-white/60 mb-8">Save this reference number to track your report.</p>

      <div className="rounded-sign border-2 border-dashed border-accent px-6 py-5 mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-muted/80 dark:text-white/40 mb-1">
          Reference Number
        </p>
        <p className="font-mono text-2xl font-semibold tracking-widest text-accent">
          {confirmation.reference_number}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={() => navigate("/citizen/reports")}
          className="px-6 py-3 rounded-sign bg-primary dark:bg-accent text-white dark:text-ink font-semibold hover:bg-primary-hover dark:hover:bg-accent-dark transition-colors"
        >
          View My Reports
        </button>
        <button
          type="button"
          onClick={() => navigate("/citizen")}
          className="px-6 py-3 rounded-sign border border-border dark:border-white/20 font-semibold hover:bg-muted/20 dark:hover:bg-white/5 transition-colors text-ink dark:text-white"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
