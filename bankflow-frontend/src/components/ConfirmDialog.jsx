import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  danger = false,
  loading = false,
}) {
  return (
    <Modal open={open} onClose={loading ? undefined : onClose} title={title} width={400}>
      <p style={{ color: "var(--color-text-muted)", fontSize: 14, lineHeight: 1.5 }}>
        {description}
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button className="btn btn-secondary btn-block" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button
          className={`btn btn-block ${danger ? "btn-danger" : "btn-primary"}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Processing…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
