
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, History, FolderOpen, MoreVertical, Edit, Trash2, ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    name: "E-commerce Website Testing",
    description: "Comprehensive testing for online shopping platform",
    url: "https://example-shop.com",
    tags: ["e-commerce", "web", "critical"],
    modules: 5,
    testCases: 23,
    lastUpdated: "2024-01-15"
  },
  {
    id: 2,
    name: "Mobile Banking App",
    description: "Security and functionality testing for banking application",
    url: "https://bank-app.com",
    tags: ["banking", "mobile", "security"],
    modules: 8,
    testCases: 45,
    lastUpdated: "2024-01-12"
  },
  {
    id: 3,
    name: "Social Media Platform",
    description: "User interaction and performance testing",
    url: "https://social-platform.com",
    tags: ["social", "performance", "ui"],
    modules: 12,
    testCases: 67,
    lastUpdated: "2024-01-10"
  }
];

const Index = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({ 
    name: '', 
    description: '', 
    url: '', 
    tags: '' 
  });
  const { toast } = useToast();

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }

    const project = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      url: newProject.url,
      tags: newProject.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      modules: 0,
      testCases: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setProjects([...projects, project]);
    setNewProject({ name: '', description: '', url: '', tags: '' });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Project created successfully"
    });
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
    toast({
      title: "Success",
      description: "Project deleted successfully"
    });
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  // If a project is selected, show modules view
  if (selectedProject) {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation Bar */}
        <header className="border-b bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-blue-600">AI</div>
                <div className="text-xl font-semibold text-red-600">QA COPILOT</div>
              </div>
            </div>
            
            <nav className="flex items-center space-x-8">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <FolderOpen className="h-4 w-4" />
                <span>Projects</span>
              </Button>
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <span className="text-yellow-500">⚡</span>
                <span>Test Runs</span>
              </Button>
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <History className="h-4 w-4" />
                <span>History</span>
              </Button>
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={handleBackToProjects}
                  className="cursor-pointer hover:text-blue-600"
                >
                  Projects
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{selectedProject.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Project Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{selectedProject.name}</h1>
              <p className="text-muted-foreground mb-4">{selectedProject.description}</p>
              {selectedProject.url && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                  <ExternalLink className="h-4 w-4" />
                  <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    {selectedProject.url}
                  </a>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </div>

          {/* Modules Grid */}
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">No modules yet</h3>
            <p className="text-muted-foreground mb-6">Create your first module to start generating test cases</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Module
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <header className="border-b bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600">AI</div>
              <div className="text-xl font-semibold text-red-600">QA COPILOT</div>
            </div>
          </div>
          
          <nav className="flex items-center space-x-8">
            <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <FolderOpen className="h-4 w-4" />
              <span>Projects</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <span className="text-yellow-500">⚡</span>
              <span>Test Runs</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <History className="h-4 w-4" />
              <span>History</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Test Projects</h1>
            <p className="text-muted-foreground">
              Manage your AI-powered test case generation projects
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create New Project</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder="Describe your testing project"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="project-url">URL</Label>
                  <Input
                    id="project-url"
                    value={newProject.url}
                    onChange={(e) => setNewProject({...newProject, url: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="project-tags">Tags</Label>
                  <Input
                    id="project-tags"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({...newProject, tags: e.target.value})}
                    placeholder="e-commerce, web, critical (comma separated)"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject}>
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first test project to get started</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold mb-1">
                      {project.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  {project.url && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                      <ExternalLink className="h-4 w-4" />
                      <span className="truncate">{project.url}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">{project.modules}</span>
                      <div className="text-muted-foreground">Modules</div>
                    </div>
                    <div>
                      <span className="font-medium">{project.testCases}</span>
                      <div className="text-muted-foreground">Test Cases</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      Last updated: {project.lastUpdated}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {projects.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {projects.reduce((sum, p) => sum + p.modules, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Modules</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {projects.reduce((sum, p) => sum + p.testCases, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Test Cases</div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
