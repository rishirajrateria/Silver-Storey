'use client';

import React from 'react';

/**
 * Submits a delete server action after an explicit confirmation, so a
 * mis-click cannot destroy content.
 */
export default function DeleteButton({
  action,
  id,
  label,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm font-medium text-red-700 underline-offset-2 hover:underline"
      >
        Delete
      </button>
    </form>
  );
}
