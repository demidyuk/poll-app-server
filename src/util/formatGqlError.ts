export function formatGqlError(error) {
  return {
    message: error.message,
    extensions: error.extensions,
  };
}
