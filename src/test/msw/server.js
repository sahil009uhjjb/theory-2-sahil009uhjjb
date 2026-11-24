// This is the fake server that MSW runs during tests.
// It catches network requests so our tests never hit the real weather API.
import { setupServer } from "msw/node";

export const server = setupServer();
