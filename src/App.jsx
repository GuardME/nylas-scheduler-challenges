import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { NylasSchedulerEditor, NylasScheduling } from "@nylas/react";
import "./App.css";

function App() {
  const [createdConfigId, setCreatedConfigId] = useState('');

  // Get the configuration ID from the URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const configId = urlParams.get("config_id") || "";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Link to="/scheduler-editor" className="button">
                Login
              </Link>
              {configId ? (
                <NylasScheduling
                  configurationId={configId}
                  schedulerApiUrl="https://api.us.nylas.com"
                  clientId="453995621555-6hqanqi6rp14b2jp5si1pda1qh9h2lua.apps.googleusercontent.com"
                />
              ) : (
                <p>No configuration ID provided. Please create a new configuration or provide a config_id in the URL.</p>
              )}
            </div>
          }
        />
        <Route
          path="/scheduler-editor"
          element={
            <div>
              <NylasSchedulerEditor
                schedulerPreviewLink={`${window.location.origin}/?config_id={config.id}`}
                nylasSessionsConfig={{
                  clientId: import.meta.env.REACT_APP_NYLAS_CLIENT_ID, 
                  redirectUri: `${window.location.origin}/scheduler-editor`,
                  domain: "https://api.us.nylas.com/v3",
                  hosted: true,
                  accessType: "offline",
                }}
                defaultSchedulerConfigState={{
                  selectedConfiguration: {
                    requires_session_auth: false,
                    scheduler: {
                      rescheduling_url: `${window.location.origin}/reschedule/:booking_ref`,
                      cancellation_url: `${window.location.origin}/cancel/:booking_ref`,
                    },
                    configurationId: configId,
                  },
                }}
                onConfigCreated={(config) => {
                  setCreatedConfigId(config.id);
                }}
              />
              {createdConfigId && (
                <div>
                  <p>Configuration created! Config ID: {createdConfigId}</p>
                  <Link to={`/?config_id=${createdConfigId}`}>
                    Go to Scheduling Page
                  </Link>
                </div>
              )}
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
