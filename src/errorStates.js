export const STATUS = {
  successful: "successful",
  failed: "failed",
};

export const didFail = (result) => {
  return result.errorStatus.status === STATUS.failed;
};

export const wasSuccessful = (result) => {
  return result.errorStatus.status === STATUS.successful;
};
