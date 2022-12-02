export const showSuccessMessage = (success: string) => (
  <div className="alert alert-success">{success}</div>
);

export const showErrorMessage = (error: string) => (
  <div className="alert alert-danger">{error}</div>
);
