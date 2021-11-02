import React from "react";
import FormInput from "./FormInput";
import "./Login.css";

function Login() {
  return (
    <div className="flex-container">
      <div className="content-box">
        <div className="flex-container-inner">
          <div className="form-container">
            <h2 className="page-header">Log In</h2>
            <form>
              <FormInput
                name="Email"
                type="email"
                errorMsg="Email address must be valid."
                label="Email"
                required={true}
              />
              <FormInput
                name="Password"
                type="password"
                errorMsg="Email address must be valid."
                label="Password"
                required={true}
              />
              <div className="sign-up-box">
                <p style={{ fontSize: "14px" }}>Don't have an account? </p>
                <button id="sign-up-btn">Sign Up</button>
              </div>
              <div>
                <button>Log In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
