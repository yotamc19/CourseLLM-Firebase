'use server';

import type { Material } from '@/lib/types';
import { dataConnect } from '@/lib/firebase';
import { createSourceDocument, deleteSourceDocument, upsertCourse, listCourseDocuments, DocumentStatus } from '@dataconnect/generated';

/**
 * Server action to create a material record in Data Connect
 * This is called after the file has been uploaded to Firebase Storage
 */
export async function createMaterialRecord(
  courseId: string,
  courseTitle: string,
  courseDescription: string,
  fileName: string,
  mimeType: string,
  size: number,
  storagePath: string
): Promise<{ success: boolean; material?: Material; error?: string }> {
  console.log('Server Action: createMaterialRecord called with:', { courseId, fileName, mimeType, size, storagePath });
  try {
    // Ensure the course exists in Data Connect
    await upsertCourse(dataConnect, {
      id: courseId,
      title: courseTitle,
      description: courseDescription,
    });

    // Create SourceDocument in Data Connect
    const result = await createSourceDocument(dataConnect, {
      courseId,
      fileName,
      mimeType,
      size,
      storagePath,
    });
    console.log('Server Action: createSourceDocument result:', result);

    const docData = result.data.sourceDocument_insert;

    if (!docData) {
        console.error('Server Action: No docData returned');
        return {
            success: false,
            error: 'Failed to create document record.'
        }
    }

    // Map file extension/mime to material type
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'md', 'txt'];
    
    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      console.warn('Server Action: Invalid file extension:', fileExtension);
      return {
        success: false,
        error: 'Invalid file type. Please upload PDF, PPT, DOC, or MD files.',
      };
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (size > maxSize) {
      console.warn('Server Action: File too large:', size);
      return {
        success: false,
        error: 'File size exceeds 10MB limit.',
      };
    }
    const typeMap: Record<string, Material['type']> = {
      'pdf': 'PDF',
      'ppt': 'PPT',
      'pptx': 'PPT',
      'doc': 'DOC',
      'docx': 'DOC',
      'md': 'MD',
      'txt': 'MD',
    };
    const materialType = typeMap[fileExtension || ''] || 'PDF';

    // Create material object
    const material: Material = {
      id: docData.id, 
      title: fileName.replace(/\.[^/.]+$/, ''), // Remove extension
      type: materialType,
      content: '', // Content is processed asynchronously
      storagePath: storagePath,
      status: 'UPLOADING',
    };

    console.log('Server Action: success', material);
    return {
      success: true,
      material,
    };
  } catch (error) {
    console.error('Error creating material record:', error);
    return {
      success: false,
      error: 'Failed to create material record. Please try again.',
    };
  }
}

/**
 * Server action to delete a material
 */
export async function deleteMaterial(
  courseId: string, // Kept for signature compatibility, though not strictly needed for deleteSourceDocument
  materialId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteSourceDocument(dataConnect, { id: materialId });
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting material:', error);
    return {
      success: false,
      error: 'Failed to delete material. Please try again.',
    };
  }
}

/**
 * Server action to fetch documents for a course
 */
export async function getCourseDocuments(courseId: string): Promise<{ success: boolean; documents?: any[]; error?: string }> {
  try {
    const response = await listCourseDocuments(dataConnect, { courseId });
    return {
      success: true,
      documents: response.data.sourceDocuments,
    };
  } catch (error) {
    console.error('Error fetching course documents:', error);
    return {
      success: false,
      error: 'Failed to fetch course documents.',
    };
  }
}