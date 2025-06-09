
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Plus, FolderOpen, FileText, TestTube, Image, FileCheck } from "lucide-react";
import { useProjects, useCreateProject } from "@/hooks/useProjects";
import { useModules, useCreateModule } from "@/hooks/useModules";
import { useGenerateTestCases } from "@/hooks/useTestCases";

interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Module {
  id: number;
  project_id: number;
  name: string;
  url: string;
  description: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const Index = () => {
  const [view, setView] = useState<'projects' | 'modules' | 'module-detail'>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createModuleOpen, setCreateModuleOpen] = useState(false);
  const [generateTestCasesOpen, setGenerateTestCasesOpen] = useState(false);

  // API hooks
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: modules = [], isLoading: modulesLoading } = useModules(selectedProject?.id);
  const createProjectMutation = useCreateProject();
  const createModuleMutation = useCreateModule();
  const generateTestCasesMutation = useGenerateTestCases();

  // Form states
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [moduleForm, setModuleForm] = useState({ name: "", url: "", description: "", tags: "" });

  const handleCreateProject = async () => {
    if (!projectForm.name.trim()) return;
    
    try {
      await createProjectMutation.mutateAsync({
        name: projectForm.name,
        description: projectForm.description,
      });
      setProjectForm({ name: "", description: "" });
      setCreateProjectOpen(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleCreateModule = async () => {
    if (!moduleForm.name.trim() || !selectedProject) return;
    
    try {
      await createModuleMutation.mutateAsync({
        project_id: selectedProject.id,
        name: moduleForm.name,
        url: moduleForm.url,
        description: moduleForm.description,
        tags: moduleForm.tags ? moduleForm.tags.split(',').map(tag => tag.trim()) : [],
      });
      setModuleForm({ name: "", url: "", description: "", tags: "" });
      setCreateModuleOpen(false);
    } catch (error) {
      console.error('Failed to create module:', error);
    }
  };

  const handleGenerateTestCases = async (type: 'images' | 'requirements') => {
    if (!selectedModule) return;
    
    try {
      await generateTestCasesMutation.mutateAsync({
        moduleId: selectedModule.id,
        type,
        data: {}, // Additional data can be added here
      });
      setGenerateTestCasesOpen(false);
    } catch (error) {
      console.error('Failed to generate test cases:', error);
    }
  };

  const getBreadcrumbs = () => {
    const items = [];
    
    if (view === 'modules' && selectedProject) {
      items.push({ label: selectedProject.name, onClick: () => setView('projects') });
    }
    
    if (view === 'module-detail' && selectedProject && selectedModule) {
      items.push({ label: selectedProject.name, onClick: () => setView('projects') });
      items.push({ label: selectedModule.name, onClick: () => setView('modules') });
    }
    
    return items;
  };

  if (projectsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              {getBreadcrumbs().map((item, index) => (
                <BreadcrumbItem key={index}>
                  <button 
                    onClick={item.onClick}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </button>
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {view === 'projects' ? 'Dashboard' : 
                   view === 'modules' ? 'Modules' : 'Module'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Dashboard Counts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{modules.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Test Cases</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects View */}
        {view === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-foreground">Projects</h1>
              <Dialog open={createProjectOpen} onOpenChange={setCreateProjectOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Create a new project to organize your modules and test cases.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        value={projectForm.name}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter project name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="project-description">Description</Label>
                      <Textarea
                        id="project-description"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter project description"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleCreateProject}
                      disabled={!projectForm.name.trim() || createProjectMutation.isPending}
                    >
                      {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedProject(project);
                        setView('modules');
                      }}
                    >
                      View Modules
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Modules View */}
        {view === 'modules' && selectedProject && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-foreground">Modules</h1>
              <Dialog open={createModuleOpen} onOpenChange={setCreateModuleOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Module
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Module</DialogTitle>
                    <DialogDescription>
                      Create a new module for {selectedProject.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="module-name">Module Name</Label>
                      <Input
                        id="module-name"
                        value={moduleForm.name}
                        onChange={(e) => setModuleForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter module name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="module-url">URL</Label>
                      <Input
                        id="module-url"
                        value={moduleForm.url}
                        onChange={(e) => setModuleForm(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="Enter module URL"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="module-description">Description</Label>
                      <Textarea
                        id="module-description"
                        value={moduleForm.description}
                        onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter module description"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="module-tags">Tags (comma-separated)</Label>
                      <Input
                        id="module-tags"
                        value={moduleForm.tags}
                        onChange={(e) => setModuleForm(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="Enter tags separated by commas"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleCreateModule}
                      disabled={!moduleForm.name.trim() || createModuleMutation.isPending}
                    >
                      {createModuleMutation.isPending ? 'Creating...' : 'Create Module'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modulesLoading ? (
                <div>Loading modules...</div>
              ) : (
                modules.map((module) => (
                  <Card key={module.id} className="cursor-pointer hover:shadow-lg transition-shadow border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">{module.name}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                      {module.url && (
                        <p className="text-sm text-muted-foreground">{module.url}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {module.tags?.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setSelectedModule(module);
                          setView('module-detail');
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Module Detail View */}
        {view === 'module-detail' && selectedModule && (
          <div>
            <h2 className="text-xl font-semibold text-muted-foreground mb-4">Module</h2>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">{selectedModule.name}</h1>
              <p className="text-muted-foreground mb-4">{selectedModule.description}</p>
              {selectedModule.url && (
                <p className="text-sm text-muted-foreground mb-4">URL: {selectedModule.url}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedModule.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <Dialog open={generateTestCasesOpen} onOpenChange={setGenerateTestCasesOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <TestTube className="mr-2 h-4 w-4" />
                    Generate Test Cases
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Test Cases</DialogTitle>
                    <DialogDescription>
                      Choose how you want to generate test cases for {selectedModule.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center"
                      onClick={() => handleGenerateTestCases('images')}
                      disabled={generateTestCasesMutation.isPending}
                    >
                      <Image className="h-8 w-8 mb-2" />
                      Generate from Images
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center"
                      onClick={() => handleGenerateTestCases('requirements')}
                      disabled={generateTestCasesMutation.isPending}
                    >
                      <FileCheck className="h-8 w-8 mb-2" />
                      Generate from Requirements
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
