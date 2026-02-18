// hooks.server.ts
import type { HandleValidationError } from '@sveltejs/kit';

export const handleValidationError: HandleValidationError = ({ issues, event }) => {
  // Log the detailed error on the server for debugging
  console.error('Schema validation failed for request:', event.url.pathname, issues);

  // Return a custom error shape to the client
  return {
    message: 'Invalid input data provided.',
    // You can add more specific details if needed
    // details: error.details, 
  };
};