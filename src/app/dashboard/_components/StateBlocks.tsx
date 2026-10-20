"use client";

import { PRIMARY_BTN } from "../_lib/booking";

export function LoadingBlock({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-sm text-text-muted">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        {text}
      </div>
    </div>
  );
}

export function ErrorBlock({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-error/30 bg-surface px-6 py-12 text-center">
      <p className="mb-4 text-sm text-error">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={PRIMARY_BTN}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyBlock({
  title,
  message,
  children,
}: {
  title: string;
  message?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border-main bg-surface px-6 py-14 text-center">
      <h3 className="mb-1 text-base font-semibold text-text-heading">
        {title}
      </h3>
      {message && <p className="mb-4 text-sm text-text-muted">{message}</p>}
      {children}
    </div>
  );
}

export function Pager({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-center gap-4 text-sm">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border border-border-main px-4 py-2 text-text-heading disabled:opacity-40 cursor-pointer"
      >
        Previous
      </button>
      <span className="text-text-muted">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border border-border-main px-4 py-2 text-text-heading disabled:opacity-40 cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}
