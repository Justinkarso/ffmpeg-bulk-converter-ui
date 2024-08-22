import API_ENDPOINTS from "./endpoints";

const openFileLocation = async (filename) => {
  try {
    await fetch(`${API_ENDPOINTS.OPEN_FILE}/${filename}`);
  } catch (error) {
    console.error("Error opening file location:", error);
  }
};

export { openFileLocation };
