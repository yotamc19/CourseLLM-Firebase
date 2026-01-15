import { getCourseById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { CourseManagementClient } from './_components/course-management-client';
import { getCourseDocuments } from './actions';
import type { Material } from '@/lib/types';

export default async function ManageCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = getCourseById(courseId);

  if (!course) {
    notFound();
  }

  // Fetch real documents from Data Connect
  const result = await getCourseDocuments(courseId);
  const realMaterials: Material[] = [];

  if (result.success && result.documents) {
    result.documents.forEach(doc => {
      // Map file extension/mime to material type (reusing logic from actions.ts ideally, but simple map here works)
      const fileExtension = doc.fileName.split('.').pop()?.toLowerCase();
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

      realMaterials.push({
        id: doc.id,
        title: doc.fileName.replace(/\.[^/.]+$/, ''), // Remove extension
        type: materialType,
        content: '', // Content is not stored in SQL for now
        storagePath: doc.storagePath,
        status: doc.status as Material['status'],
      });
    });
  }

  // Merge mock materials with real materials
  // You might want to prefer real data if IDs collide, or just append. 
  // Since mock IDs are 'mat-1' etc. and real are UUIDs, simple concatenation is fine.
  const mergedCourse = {
    ...course,
    materials: [...course.materials, ...realMaterials]
  };

  return <CourseManagementClient course={mergedCourse} />;
}
