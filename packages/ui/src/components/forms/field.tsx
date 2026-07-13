import * as React from "react";

import { cn } from "#lib/utils";
import { Input } from "#components/input";
import { Label } from "#components/label";

type FieldProps = React.ComponentProps<typeof Input> & {
  /** Unique id, used to wire the label, input and error together. */
  id: string;
  label: React.ReactNode;
  /** Validation error message. When set, the field is marked invalid. */
  error?: string;
  /** Extra class names for the field wrapper. */
  containerClassName?: string;
};

/**
 * A labelled text input with accessible error messaging.
 *
 * Generic form primitive: it owns the label/input/error wiring
 * (`htmlFor`, `aria-invalid`, `aria-describedby`) so feature forms don't have
 * to repeat it. Business-specific composition stays in the consuming feature.
 */
function Field({
  id,
  label,
  error,
  containerClassName,
  ...inputProps
}: FieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div
      data-slot='field'
      className={cn("flex flex-col gap-1.5", containerClassName)}
    >
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...inputProps}
      />
      {error ? (
        <p id={errorId} className='text-xs text-destructive'>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Field, type FieldProps };
