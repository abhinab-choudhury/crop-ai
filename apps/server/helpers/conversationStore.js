const conversations = {};

/**
 * Get conversation for a session, or create a new one
 */
export function getConversation(sessionId) {
  if (!sessionId) throw new Error('Session ID is required');
  if (!conversations[sessionId]) {
    conversations[sessionId] = {
      history: [],
    };
  }
  return conversations[sessionId];
}

/**
 * Clear a session (optional)
 */
export function clearConversation(sessionId) {
  delete conversations[sessionId];
}
