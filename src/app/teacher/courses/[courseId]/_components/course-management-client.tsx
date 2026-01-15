"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Course, Material } from "@/lib/types";
import { FileText, Presentation, Upload, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { createMaterialRecord, deleteMaterial, getCourseDocuments } from '../actions';
import { useParams } from 'next/navigation';
import { ref, uploadBytes, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";

export function CourseManagementClient({ course: initialCourse }: { course: Course }) {
  const [course, setCourse] = useState(initialCourse);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const params = useParams();
  const courseId = params.courseId as string;

  // Poll for document status updates
  // This effect fetches the latest document statuses from Data Connect every 5 seconds
  // and updates the local state to reflect changes (e.g., UPLOADING -> UPLOADED -> ANALYZED).
  useEffect(() => {
    const fetchDocuments = async () => {
      const result = await getCourseDocuments(courseId);
      if (result.success && result.documents) {
        setCourse(prev => {
          const updatedMaterials = [...prev.materials];
          let hasChanges = false;

          result.documents!.forEach((doc: any) => {
             const existingIndex = updatedMaterials.findIndex(m => m.id === doc.id);
             if (existingIndex !== -1) {
               // Update existing material status
               if (updatedMaterials[existingIndex].status !== doc.status) {
                 updatedMaterials[existingIndex] = {
                   ...updatedMaterials[existingIndex],
                   status: doc.status
                 };
                 hasChanges = true;
               }
             } else {
                 // Add new material found in DB but not in state (e.g. from another session/upload)
                 // Note: We need to map DB doc to Material type. 
                 // Simple mapping as we might miss 'content' or exact 'type' if not inferred correctly.
                 // For now, let's only update status of known materials to avoid duplicates or issues with mock data.
                 // If we strictly wanted to sync, we would replace the list, but we have mock data mixed in.
             }
          });
          
          return hasChanges ? { ...prev, materials: updatedMaterials } : prev;
        });
      }
    };

    // Initial fetch
    fetchDocuments();

    // Poll every 5 seconds
    const intervalId = setInterval(fetchDocuments, 5000);

    return () => clearInterval(intervalId);
  }, [courseId]);

  const handleSaveChanges = () => {
    // Here you would typically make an API call to save the changes.
    console.log("Saving changes:", course);
    toast({
      title: "Changes Saved",
      description: `Your changes to "${course.title}" have been saved.`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  /**
   * Handle file upload process
   * 1. Checks for duplicates and deletes existing files if necessary.
   * 2. Creates a record in Data Connect (status: UPLOADING).
   * 3. Uploads the file to Firebase Storage.
   * 4. Updates local state.
   * 5. Handles errors and cleans up orphaned records.
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    console.log("Starting upload process...");
    let materialIdToDelete: string | null = null;

    try {
      const fileName = selectedFile.name;
      const storagePath = `courses/${courseId}/materials/${fileName}`;
      const storageRef = ref(storage, storagePath);

      // Check for existing material with the same storage path
      const existingMaterial = course.materials.find(m => m.storagePath === storagePath);
      if (existingMaterial) {
        console.log("Found existing material with same path, deleting...", existingMaterial.id);
        
        // Delete the existing material (DB and Storage)
        // We use handleDeleteMaterial logic but inline or reuse it. 
        // Reusing logic is better but handleDeleteMaterial updates state.
        // We want to update state *after* upload is done, or just let the sequence happen.
        // If we call handleDeleteMaterial, it will remove it from UI. That's fine.
        await handleDeleteMaterial(existingMaterial.id);
        
        toast({
          title: "Overwriting existing file",
          description: "The previous version of this file has been deleted.",
        });
      }

      // 1. Create record in Data Connect FIRST (to avoid race condition with trigger)
      console.log("Creating material record in Data Connect...");
      const result = await createMaterialRecord(
        courseId,
        course.title,
        course.description || "",
        fileName,
        selectedFile.type,
        selectedFile.size,
        storagePath
      );
      console.log("Material record creation result:", result);

      if (result.success && result.material) {
        materialIdToDelete = result.material.id; // Track ID in case upload fails

        // 2. Upload file to Firebase Storage
        console.log("Uploading to Firebase Storage...");
        await uploadBytes(storageRef, selectedFile);
        console.log("Uploaded to Firebase Storage successfully.");
        
        // Add the new material to the course
        setCourse(prev => ({
          ...prev,
          materials: [...prev.materials, result.material!],
        }));
        
        // Reset file input
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        toast({
          title: "Upload successful",
          description: `"${result.material.title}" has been added to the course materials.`,
        });
      } else {
        toast({
          title: "Record creation failed",
          description: result.error || "Failed to create material record.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Cleanup: Delete the record if it was created but upload failed
      if (materialIdToDelete) {
          console.log("Cleaning up orphaned record:", materialIdToDelete);
          await deleteMaterial(courseId, materialIdToDelete);
      }

      toast({
        title: "Upload failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    setIsDeleting(materialId);
    try {
      const materialToDelete = course.materials.find(m => m.id === materialId);
      
      // 1. Delete from Firebase Storage (if path exists)
      if (materialToDelete?.storagePath) {
          try {
            const storageRef = ref(storage, materialToDelete.storagePath);
            await deleteObject(storageRef);
          } catch (storageError: any) {
              console.warn("Error deleting file from storage (might be already missing):", storageError);
              // We continue to delete the record even if storage delete fails (e.g. file not found)
          }
      }

      // 2. Delete record from Data Connect
      const result = await deleteMaterial(courseId, materialId);
      
      if (result.success) {
        // Remove the material from the course
        setCourse(prev => ({
          ...prev,
          materials: prev.materials.filter(m => m.id !== materialId),
        }));

        toast({
          title: "Material deleted",
          description: "The material has been removed from the course.",
        });
      } else {
        toast({
          title: "Delete failed",
          description: result.error || "Failed to delete material record.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'UPLOADED': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'CONVERTING': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'CONVERTED': return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100';
      case 'CHUNKING': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'CHUNKED': return 'bg-pink-100 text-pink-800 hover:bg-pink-100';
      case 'ANALYZING': return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'ANALYZED': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'ERROR': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>

      <Tabs defaultValue="materials">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="materials">Course Materials</TabsTrigger>
          <TabsTrigger value="objectives">Learning Objectives</TabsTrigger>
        </TabsList>
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Manage Materials</CardTitle>
              <CardDescription>Upload and manage course files.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Current Materials</h3>
                <div className="space-y-2">
                  {course.materials.map(material => (
                    <div key={material.id} className="flex items-center gap-4 p-2 border rounded-lg">
                      {material.type === 'PDF' || material.type === 'DOC' ? <FileText className="h-5 w-5 text-primary"/> : <Presentation className="h-5 w-5 text-primary"/>}
                      <div className="flex-1 flex flex-col">
                        <span className="font-medium">{material.title}</span>
                        <div className="flex gap-2 mt-1">
                             <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full w-fit">{material.type}</span>
                             {material.status && (
                                <Badge variant="secondary" className={`text-xs px-2 py-0.5 h-auto ${getStatusColor(material.status)}`}>
                                    {material.status}
                                </Badge>
                             )}
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteMaterial(material.id)}
                        disabled={isDeleting === material.id}
                      >
                        {isDeleting === material.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                   {course.materials.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No materials uploaded yet.</p>}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                 <h3 className="font-semibold">Upload New Material</h3>
                 <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="material-file">File (PDF, PPT, DOC, MD)</Label>
                    <div className="flex gap-2">
                        <Input 
                          id="material-file" 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".pdf,.ppt,.pptx,.doc,.docx,.md,.txt"
                        />
                        <Button 
                          variant="secondary" 
                          onClick={handleUpload}
                          disabled={!selectedFile || isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload
                            </>
                          )}
                        </Button>
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="objectives">
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Definition</CardTitle>
              <CardDescription>Define the objectives, skills, and trajectories for this course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objectives">Learning Objectives</Label>
                <Textarea
                  id="objectives"
                  placeholder="e.g., 1. Understand basic Python syntax..."
                  value={course.learningObjectives}
                  onChange={(e) => setCourse(prev => ({...prev, learningObjectives: e.target.value}))}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Learning Skills</Label>
                <Input
                  id="skills"
                  placeholder="e.g., Problem-solving, Algorithmic thinking"
                  value={course.learningSkills}
                  onChange={(e) => setCourse(prev => ({...prev, learningSkills: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trajectories">Learning Trajectories</Label>
                <Input
                  id="trajectories"
                  placeholder="e.g., Beginner -> Intermediate"
                  value={course.learningTrajectories}
                  onChange={(e) => setCourse(prev => ({...prev, learningTrajectories: e.target.value}))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}