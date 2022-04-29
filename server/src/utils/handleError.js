// Return generic error message

const handleError = (field, message) => ({
  errors: [{ field, message }],
});

export { handleError };
