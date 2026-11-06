"use client";

import { apiFetch } from "@/lib/api";
import React, { useState } from "react";

type FormFields = "name" | "email" | "comment";
type FieldErrors = Partial<Record<FormFields, string[]>>;

export default function BlogCommentForm({ id }: { id: number }) {
  const [form, setForm] = useState({ name: "", email: "", comment: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // clear the error for this field as the user types
    if (errors[name as FormFields]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setErrors({});
    setLoading(true);

    try {
      const data = await apiFetch(`blogs/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          comment: form.comment.trim(),
        }),
      });

      console.log('form-data', data);

      if (data?.error) {
        setErrors(data?.error as FieldErrors);
        return;
      }

      setStatus({ type: "success", message: `${data?.data?.message || "Comment submitted successfully!"}` });
      setForm({ name: "", email: "", comment: "" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-comment-form" aria-labelledby="leave-a-reply">
      <h3 id="leave-a-reply" className="mb-4">
        Leave a Reply
      </h3>
      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-4">
          <div className="col-md-6">
            <label className="form-label" htmlFor="comment-name">Name*</label>
            <input
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="comment-name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "comment-name-error" : undefined}
            />
            {errors.name && (
              <div id="comment-name-error" className="invalid-feedback">
                {errors.name[0]}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="comment-email">Email*</label>
            <input
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="comment-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "comment-email-error" : undefined}
            />
            {errors.email && (
              <div id="comment-email-error" className="invalid-feedback">
                {errors.email[0]}
              </div>
            )}
          </div>

          <div className="col-12">
            <label className="form-label" htmlFor="comment-text">Comment*</label>
            <textarea
              className={`form-control ${errors.comment ? "is-invalid" : ""}`}
              id="comment-text"
              name="comment"
              rows={5}
              value={form.comment}
              onChange={handleChange}
              aria-invalid={!!errors.comment}
              aria-describedby={errors.comment ? "comment-text-error" : undefined}
            />
            {errors.comment && (
              <div id="comment-text-error" className="invalid-feedback">
                {errors.comment[0]}
              </div>
            )}
          </div>

          {status && (
            <div className="col-12">
              <div
                className={`alert ${status.type === "success" ? "alert-success" : "alert-danger"}`}
                role="alert"
              >
                {status.message}
              </div>
            </div>
          )}

          <div className="col-12">
            <button className="btn btn-dark" type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}