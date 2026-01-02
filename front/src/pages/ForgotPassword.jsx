import React, { useState } from "react";
import { apiFetch } from "../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  async function sendReset() {
    await apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email })
    });
    alert("Reset token sent (check email / backend log)");
    setStep(2);
  }

  async function resetPassword() {
    await apiFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword })
    });
    alert("Password reset successful");
  }

  return (
    <div className="container max-w-md py-10">
      <div className="card p-5">
        <h1 className="text-xl font-bold mb-3">Forgot Password</h1>

        {step === 1 && (
          <>
            <input
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary w-full mt-3" onClick={sendReset}>
              Send Reset Token
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              className="input"
              placeholder="Reset Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <input
              className="input mt-2"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className="btn btn-primary w-full mt-3"
              onClick={resetPassword}
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
