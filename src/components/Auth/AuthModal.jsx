import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../Toast/ToastContext";
import styles from "./AuthModal.module.css";

/**
 * PRODUCTION PATTERN: Netflix Authentication Modal (OAuth 2.0 & Email/Password)
 *
 * Provides realistic client-side authentication with session persistence
 * without requiring live backend server deployment.
 */
function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    login,
    signup,
    loginWithOAuth,
  } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset state on open/close
    if (isAuthModalOpen) {
      setError("");
      setEmail("");
      setPassword("");
      setName("");
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeAuthModal();
    };

    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      if (authMode === "signin") {
        const logged = login(email, password);
        showToast(`Welcome back, ${logged.name}!`, "success");
      } else {
        const registered = signup(name, email, password);
        showToast(`Account created for ${registered.name}!`, "success");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    }
  };

  const handleOAuth = (provider) => {
    try {
      const user = loginWithOAuth(provider);
      showToast(`Signed in with ${provider} as ${user.name}!`, "success");
    } catch (err) {
      setError("OAuth sign-in failed.");
    }
  };

  return (
    <div
      className={styles.modalBackdrop}
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={closeAuthModal}
          aria-label="Close authentication modal"
        >
          <X size={20} />
        </button>

        <h2 id="auth-title" className={styles.title}>
          {authMode === "signin" ? "Sign In" : "Sign Up"}
        </h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {authMode === "signup" && (
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            {authMode === "signin" ? "Sign In" : "Get Started"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        {/* OAuth 2.0 Social Sign-In Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            type="button"
            className={styles.oauthBtn}
            onClick={() => handleOAuth("Google")}
          >
            <FaGoogle color="#ea4335" />
            <span>Continue with Google</span>
          </button>
          <button
            type="button"
            className={styles.oauthBtn}
            onClick={() => handleOAuth("GitHub")}
          >
            <FaGithub />
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className={styles.togglePrompt}>
          {authMode === "signin" ? (
            <>
              New to Netflix?
              <span
                className={styles.toggleLink}
                onClick={() => {
                  setError("");
                  setAuthMode("signup");
                }}
              >
                Sign up now.
              </span>
            </>
          ) : (
            <>
              Already have an account?
              <span
                className={styles.toggleLink}
                onClick={() => {
                  setError("");
                  setAuthMode("signin");
                }}
              >
                Sign in here.
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
