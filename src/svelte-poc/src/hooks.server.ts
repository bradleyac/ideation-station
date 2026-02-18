// hooks.server.ts
import getUserId from '$lib/server/getUserId';
import type { HandleFetch, HandleValidationError } from '@sveltejs/kit';

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

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  getUserId(event.platform, true); // Ensure user is authenticated for fetch requests
  // You can modify the request here if needed (e.g., add headers)
  // For example, to add an Authorization header:
  // request.headers.set('Authorization', `Bearer ${token}`);

  // Perform the fetch and return the response
  const response = await fetch(request);
  return response;
}