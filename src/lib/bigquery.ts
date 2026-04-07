import { BigQuery } from "@google-cloud/bigquery";

// Default configuration based on user requirement
export const projectId = "webapplications-492600";
export const datasetId = "rangeBookingApp";

// Initialize the BigQuery client
export const bigquery = new BigQuery({ projectId });

/**
 * Helper method to access the primary dataset
 */
export const getDataset = () => {
  return bigquery.dataset(datasetId);
};
