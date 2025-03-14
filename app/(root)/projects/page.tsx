/* "use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProjectsHeader from "@/components/projects/ProjectsHeader";
import ProjectsList from "@/components/projects/ProjectsList";
import ProjectsFilter from "@/components/projects/ProjectsFilter";
import LocalSearchbar from "@/components/shared/search/LocalSearch";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/search/Pagination";
import { getMockProjects } from "@/lib/actions/project.action";

import { useToast } from "@/components/ui/use-toast";
import ProjectCreateModal from "@/components/projects/ProjectCreateModal";

// Loading fallbacks
function SearchbarLoading() {
  return (
    <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
  );
}

function FilterLoading() {
  return (
    <div className="h-10 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
  );
}

function ProjectsLoading() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="h-64 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const q = searchParams.get("q") || "";
  const filter = searchParams.get("filter") || "";
  const page = searchParams.get("page") || "1";
  const view = searchParams.get("view") || "grid";
  const sort = searchParams.get("sort") || "newest";

  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);

        // Fetch projects from mock data
        const result = await getMockProjects({
          userId: "user-1",
          searchQuery: q,
          filter,
          sort: sort as string,
          page: Number.parseInt(page),
          pageSize: 6,
        });

        setProjects(result.projects);
        setFeatured(result.featured);
        // Set hasMore based on the number of projects returned
        setHasMore(result.projects.length >= 6);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [q, filter, page, sort, toast]);

  const handleCreateProject = (newProject: any) => {
    // Add the new project to the projects list
    setProjects((prevProjects) => [newProject, ...prevProjects]);

    // Close the modal
    setIsCreateModalOpen(false);

    // Show success toast
    toast({
      title: "Repository created!",
      description: `${newProject.name} has been created successfully.`,
    });

    // Navigate to the new project
    setTimeout(() => {
      router.push(`/projects/${newProject.id}`);
    }, 500);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <ProjectsHeader
        totalProjects={projects.length}
        view={view as string}
        featured={featured}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      <div className="mt-6 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/projects"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for projects..."
          otherClasses="flex-1"
        />

        <div className="flex items-center gap-3">
          <ProjectsFilter />
        </div>
      </div>

      {isLoading ? (
        <ProjectsLoading />
      ) : projects.length > 0 ? (
        <>
          <ProjectsList
            projects={projects}
            view={view as string}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />

          <div className="mt-10">
            <Pagination pageNumber={Number.parseInt(page)} isNext={hasMore} />
          </div>
        </>
      ) : (
        <NoResult
          title="No Repositories Found"
          description="We couldn't find any repositories matching your criteria. Try different keywords or create a new repository."
          link="/projects"
          linktitle="View All Repositories"
        />
      )}

      <ProjectCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateProject}
        userId={""}
      />
    </div>
  );
}
 */