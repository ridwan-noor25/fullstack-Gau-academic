// src/mocks/enableMocks.js
import { setupDevApi } from "./devApi";

if (import.meta.env.DEV) {
  setupDevApi();
  // Optional: log once
  // console.log("✅ DEV API mock enabled");
}
