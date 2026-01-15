/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import * as logger from "firebase-functions/logger";
import {onObjectFinalized, onObjectDeleted} from "firebase-functions/v2/storage";
import * as admin from "firebase-admin";
import { getDataConnect } from 'firebase-admin/data-connect';
import { 
  getSourceDocumentByStoragePath, 
  updateDocumentStatus, 
  DocumentStatus,
  connectorConfig
} from '@dataconnect/admin-generated';

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Configuration for the File Normalization Service
// Use an environment variable for deployment, fallback for local testing
const FILE_CONVERSION_SERVICE_BASE_URL =
  process.env.FILE_CONVERSION_SERVICE_BASE_URL || "http://localhost:8000";


import { StorageEvent } from 'firebase-functions/v2/storage';

/**
 * Helper to parse courseId and fileName from storage path.
 * Expected format: courses/{courseId}/materials/{fileName}.{ext}
 */
function parseStoragePath(filePath: string): { courseId: string, fileName: string, fileExtension: string } | null {
  const pathRegex = /^courses\/([^\/]+)\/materials\/([^\/]+)\.([a-zA-Z0-9]+)$/;
  const match = filePath.match(pathRegex);
  if (match) {
    return {
      courseId: match[1],
      fileName: match[2],
      fileExtension: match[3]
    };
  }
  return null;
}

/**
 * Helper to update document status in Data Connect.
 */
async function updateDocumentStatusToUploaded(dataConnect: any, filePath: string) {
    try {
        const result = await getSourceDocumentByStoragePath(dataConnect, { storagePath: filePath });
        if (result.data.sourceDocuments.length > 0) {
            const doc = result.data.sourceDocuments[0];
            await updateDocumentStatus(dataConnect, {
                id: doc.id,
                status: DocumentStatus.UPLOADED,
                storagePath: filePath
            });
            logger.info(`Updated document status to UPLOADED for ${doc.id}`);
        } else {
             logger.warn(`No SourceDocument found for path: ${filePath}`);
        }
    } catch (dcError) {
        logger.error("Error updating Data Connect status:", dcError);
    }
}

// Triggered when ANY file is finalized (uploaded/created) in the default bucket.
export const onFileUpload = onObjectFinalized(
  { bucket: "se-with-llms.firebasestorage.app" },
  async (event: StorageEvent) => {
    logger.info("onFileUpload function triggered.", { event }); // Added for debugging
    const filePath = event.data?.name;
    const bucketName = event.data?.bucket;

    if (!filePath || !bucketName) {
      console.log("No file path or bucket found.");
      return;
    }

    const dataConnect = getDataConnect(connectorConfig);

    // Parse and validate path
    const pathInfo = parseStoragePath(filePath);
    if (!pathInfo) {
      console.log(`File path ${filePath} does not match the desired pattern. Skipping.`);
      return;
    }

    const { courseId, fileName, fileExtension } = pathInfo;
    console.log(`Processing file: ${fileName}.${fileExtension} for course: ${courseId}`);

    // Construct the Google Cloud Storage path (gs://bucket/path/to/file)
    const gcsPath = `gs://${bucketName}/${filePath}`;
    logger.info(`File uploaded: ${gcsPath}`);

    // Update Document Status in Data Connect
    await updateDocumentStatusToUploaded(dataConnect, filePath);

    // Endpoint for enqueuing files for conversion
    const ingestEndpoint = `${FILE_CONVERSION_SERVICE_BASE_URL}/convert`;

    try {
      logger.info(`Sending convert request for ${gcsPath} to ${ingestEndpoint}...`);

      const response = await fetch(ingestEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_path: gcsPath,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(
          "Convert request failed:",
          response.status,
          response.statusText,
          errorText
        );
        return;
      }

    const jobResponse = await response.json();
    logger.info(
      "Convert request successful, job enqueued.",
      {jobId: jobResponse.id, status: jobResponse.status}
    );

    // TODO: Consider storing the jobResponse in Firestore linked to the uploaded file.
  } catch (error) {
    logger.error("Error sending convert request:", error);
  }
});

// Triggered when a file is deleted.
// Checks if the deleted file has a corresponding .md file and deletes it.
export const onFileDeleted = onObjectDeleted(
  { bucket: "se-with-llms.firebasestorage.app" },
  async (event: StorageEvent) => {
    const filePath = event.data?.name;
    const bucketName = event.data?.bucket;

    if (!filePath || !bucketName) {
      console.log("No file path or bucket found.");
      return;
    }

    // Validate if this is a course material file
    if (!parseStoragePath(filePath)) {
      return;
    }

    // If the deleted file is already a .md file, do nothing to avoid loops or unnecessary checks.
    if (filePath.endsWith(".md")) {
      return;
    }

    const lastDotIndex = filePath.lastIndexOf(".");
    if (lastDotIndex === -1) {
      // File has no extension, assume no corresponding .md file to clean up based on this logic.
      return;
    }

    // Construct the path for the corresponding .md file
    const mdFilePath = filePath.substring(0, lastDotIndex) + ".md";

    try {
      const bucket = admin.storage().bucket(bucketName);
      const file = bucket.file(mdFilePath);
      const [exists] = await file.exists();

      if (exists) {
        await file.delete();
        logger.info(`Deleted corresponding .md file: ${mdFilePath}`);
      } else {
        logger.info(`No corresponding .md file found at: ${mdFilePath}`);
      }
    } catch (error) {
      logger.error("Error deleting corresponding .md file:", error);
    }
  }
);
