/* "use server";

import { connectToDatabase } from "../mongoose";
import Project from "../models/project.model";
import User from "../models/user.model";
import Issue from "../models/issue.model";
import PullRequest from "../models/pull-request.model";
import Activity from "../models/activity.model";
import { revalidatePath } from "next/cache";

// Types
export interface Contributor {
  id: string;
  name: string;
  image: string;
}

export interface ProjectInterface {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  isStarred: boolean;
  isForked: boolean;
  stars: number;
  forks: number;
  watchers: number;
  technologies: string[];
  contributors: Contributor[];
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  languageColor?: string;
  completionPercentage?: number;
}

export interface FeaturedProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  contributors: Contributor[];
  stars: number;
  lastUpdated: string;
}

export interface ProjectParams {
  name: string;
  description: string;
  isPrivate: boolean;
  technologies: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  completionPercentage?: number;
}

interface GetProjectsParams {
  userId: string;
  searchQuery?: string;
  filter?: string;
  sort?: string;
}

// Add this type definition to the top of the file, after the existing imports
export interface IProject {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  isStarred: boolean;
  isForked: boolean;
  stars: number;
  forks: number;
  watchers: number;
  technologies: string[];
  contributors: {
    id: string;
    name: string;
    image: string;
  }[];
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  languageColor?: string;
  completionPercentage?: number;
}

// Mock data function
export async function getMockProjects(params: GetProjectsParams) {
  try {
    // In a real app, this would connect to your database
    await connectToDatabase();

    const { searchQuery, sort } = params;

    // Mock projects data
    let projects: ProjectInterface[] = [
      {
        id: "project-1",
        name: "DevOverflow Clone",
        description:
          "A Stack Overflow clone built with Next.js, TypeScript, and MongoDB",
        isPrivate: false,
        isStarred: true,
        isForked: false,
        stars: 42,
        forks: 12,
        watchers: 8,
        technologies: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
        contributors: [
          {
            id: "user-1",
            name: "John Doe",
            image: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "user-2",
            name: "Jane Smith",
            image: "/placeholder.svg?height=32&width=32",
          },
        ],
        lastUpdated: "2 days ago",
        createdAt: "2023-10-15T12:00:00Z",
        updatedAt: "2023-10-25T14:30:00Z",
        languageColor: "bg-blue-500/20",
        completionPercentage: 85,
      },
      {
        id: "project-2",
        name: "AI Image Generator",
        description:
          "An AI-powered image generation tool using OpenAI's DALL-E API",
        isPrivate: false,
        isStarred: false,
        isForked: true,
        stars: 28,
        forks: 5,
        watchers: 15,
        technologies: ["React", "Node.js", "OpenAI API", "Express"],
        contributors: [
          {
            id: "user-1",
            name: "John Doe",
            image: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "user-3",
            name: "Alex Johnson",
            image: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "user-4",
            name: "Sam Wilson",
            image: "/placeholder.svg?height=32&width=32",
          },
        ],
        lastUpdated: "1 week ago",
        createdAt: "2023-09-05T10:15:00Z",
        updatedAt: "2023-10-18T09:45:00Z",
        languageColor: "bg-green-500/20",
        completionPercentage: 72,
      },
      {
        id: "project-3",
        name: "E-commerce Platform",
        description:
          "A full-featured e-commerce platform with payment processing and inventory management",
        isPrivate: true,
        isStarred: true,
        isForked: false,
        stars: 15,
        forks: 2,
        watchers: 7,
        technologies: ["Next.js", "Prisma", "PostgreSQL", "Stripe", "Redux"],
        contributors: [
          {
            id: "user-1",
            name: "John Doe",
            image: "/placeholder.svg?height=32&width=32",
          },
        ],
        lastUpdated: "3 days ago",
        createdAt: "2023-08-20T15:30:00Z",
        updatedAt: "2023-10-22T11:20:00Z",
        languageColor: "bg-purple-500/20",
        completionPercentage: 60,
      },
      {
        id: "project-4",
        name: "Weather Dashboard",
        description:
          "A real-time weather dashboard with interactive maps and forecasts",
        isPrivate: false,
        isStarred: false,
        isForked: false,
        stars: 8,
        forks: 1,
        watchers: 3,
        technologies: ["React", "OpenWeatherMap API", "Leaflet", "Chart.js"],
        contributors: [
          {
            id: "user-1",
            name: "John Doe",
            image: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "user-5",
            name: "Emily Chen",
            image: "/placeholder.svg?height=32&width=32",
          },
        ],
        lastUpdated: "2 weeks ago",
        createdAt: "2023-07-10T09:00:00Z",
        updatedAt: "2023-10-12T16:45:00Z",
        languageColor: "bg-yellow-500/20",
        completionPercentage: 95,
      },
      {
        id: "project-5",
        name: "Task Management App",
        description:
          "A collaborative task management application with real-time updates",
        isPrivate: false,
        isStarred: true,
        isForked: false,
        stars: 32,
        forks: 8,
        watchers: 12,
        technologies: ["Vue.js", "Firebase", "Vuex", "Tailwind CSS"],
        contributors: [
          {
            id: "user-1",
            name: "John Doe",
            image: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "user-2",
            name: "Jane Smith",
            image: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "user-6",
            name: "Michael Brown",
            image: "/placeholder.svg?height=32&width=32",
          },
        ],
        lastUpdated: "5 days ago",
        createdAt: "2023-06-15T14:20:00Z",
        updatedAt: "2023-10-20T10:30:00Z",
        languageColor: "bg-emerald-500/20",
        completionPercentage: 88,
      },
      {
        id: "project-6",
        name: "Fitness Tracker",
        description:
          "A mobile-first fitness tracking application with workout plans and progress analytics",
        isPrivate: false,
        isStarred: false,
        isForked: true,
        stars: 19,
        forks: 4,
        watchers: 6,
        technologies: ["React Native", "GraphQL", "Apollo", "MongoDB"],
        contributors: [
          {
            id: "user-1",
            name: "John Doe",
            image: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "user-7",
            name: "Lisa Wang",
            image: "/placeholder.svg?height=32&width=32",
          },
        ],
        lastUpdated: "1 month ago",
        createdAt: "2023-05-05T11:45:00Z",
        updatedAt: "2023-09-25T13:15:00Z",
        languageColor: "bg-red-500/20",
        completionPercentage: 75,
      },
    ];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      projects = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(query)
          )
      );
    }

    // Sort projects
    if (sort) {
      switch (sort) {
        case "newest":
          projects.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "oldest":
          projects.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "most-stars":
          projects.sort((a, b) => b.stars - a.stars);
          break;
        case "most-forks":
          projects.sort((a, b) => b.forks - a.forks);
          break;
        case "recently-updated":
          projects.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          break;
        case "most-complete":
          projects.sort(
            (a, b) =>
              (b.completionPercentage || 0) - (a.completionPercentage || 0)
          );
          break;
        default:
          break;
      }
    }

    // Featured project (in a real app, this could be selected based on various criteria)
    const featured: FeaturedProject = {
      id: "project-1",
      name: "DevOverflow Clone",
      description:
        "A Stack Overflow clone built with Next.js, TypeScript, and MongoDB. Features include user authentication, question asking and answering, voting, tagging, and search functionality.",
      technologies: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
      contributors: [
        {
          id: "user-1",
          name: "John Doe",
          image: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "user-2",
          name: "Jane Smith",
          image: "/placeholder.svg?height=32&width=32",
        },
      ],
      stars: 42,
      lastUpdated: "2 days ago",
    };

    return { projects, featured };
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

// Add this function after the getMockProjects function

export async function getMockProjectDetails(projectId: string) {
  try {
    // First get the basic project info
    const { projects } = await getMockProjects({ userId: "user-1" });
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    // Mock detailed project data
    const detailedProject = {
      ...project,
      readme: `# ${project.name}\n\n${project.description}\n\n## Features\n\n- Feature 1: Amazing functionality\n- Feature 2: Incredible performance\n- Feature 3: Outstanding design\n\n## Installation\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Contributing\n\nContributions are welcome!`,
      license: "MIT",
      codeQuality: 87,
      testCoverage: 72,
      performance: 94,
      security: 81,
      accessibility: 68,
      commitActivity: [25, 15, 30, 22, 18, 35, 42, 30, 25, 20, 15, 28],
      openIssues: 8,
      closedIssues: 24,
      openPullRequests: 3,
      mergedPullRequests: 15,
      closedPullRequests: 2,
      languages: [
        { name: "TypeScript", percentage: 65, color: "bg-blue-500" },
        { name: "JavaScript", percentage: 20, color: "bg-yellow-500" },
        { name: "CSS", percentage: 10, color: "bg-purple-500" },
        { name: "HTML", percentage: 5, color: "bg-orange-500" },
      ],
      branches: [
        { name: "main", isDefault: true, lastCommit: "2 days ago" },
        { name: "develop", isDefault: false, lastCommit: "1 day ago" },
        { name: "feature/auth", isDefault: false, lastCommit: "3 days ago" },
        { name: "feature/ui", isDefault: false, lastCommit: "5 days ago" },
      ],
      releases: [
        {
          version: "v1.2.0",
          date: "1 week ago",
          description: "Added new features",
        },
        {
          version: "v1.1.0",
          date: "1 month ago",
          description: "Bug fixes and improvements",
        },
        {
          version: "v1.0.0",
          date: "2 months ago",
          description: "Initial release",
        },
      ],
    };

    // Mock activities
    const activities = [
      {
        id: 1,
        user: {
          name: "John Doe",
          image: "/placeholder.svg?height=40&width=40",
        },
        action: "created the project",
        time: "2 days ago",
      },
      {
        id: 2,
        user: {
          name: "Jane Smith",
          image: "/placeholder.svg?height=40&width=40",
        },
        action: "updated README.md",
        time: "1 day ago",
      },
      {
        id: 3,
        user: {
          name: "Alex Johnson",
          image: "/placeholder.svg?height=40&width=40",
        },
        action: "fixed login bug",
        time: "12 hours ago",
      },
      {
        id: 4,
        user: {
          name: "John Doe",
          image: "/placeholder.svg?height=40&width=40",
        },
        action: "merged pull request #5",
        time: "6 hours ago",
      },
      {
        id: 5,
        user: {
          name: "Emily Chen",
          image: "/placeholder.svg?height=40&width=40",
        },
        action: "opened issue #12",
        time: "3 hours ago",
      },
      {
        id: 6,
        user: {
          name: "Michael Brown",
          image: "/placeholder.svg?height=40&width=40",
        },
        action: "commented on issue #10",
        time: "5 hours ago",
      },
      {
        id: 7,
        user: {
          name: "Sarah Wilson",
          image: "/placeholder.svg?height=40&width=40",
        },
        action: "reviewed pull request #6",
        time: "1 day ago",
      },
      {
        id: 8,
        user: {
          name: "David Lee",
          image: "/placeholder.svg?height=40&width=40",
        },
        action: "created branch feature/notifications",
        time: "2 days ago",
      },
    ];

    // Mock issues
    const issues = [
      {
        id: 1,
        title: "Fix authentication bug on mobile",
        status: "open",
        priority: "high",
        assignee: project.contributors[0],
        createdAt: "3 days ago",
        comments: 5,
        description:
          "Users are unable to log in using the mobile app on iOS devices. This is a critical issue affecting 30% of our user base.",
        labels: ["bug", "mobile", "critical"],
      },
      {
        id: 2,
        title: "Improve loading performance",
        status: "open",
        priority: "medium",
        assignee:
          project.contributors.length > 1
            ? project.contributors[1]
            : project.contributors[0],
        createdAt: "1 week ago",
        comments: 3,
        description:
          "The initial load time is too slow. We need to implement lazy loading and optimize asset delivery.",
        labels: ["enhancement", "performance"],
      },
      {
        id: 3,
        title: "Update documentation",
        status: "closed",
        priority: "low",
        assignee: project.contributors[0],
        createdAt: "2 weeks ago",
        comments: 2,
        description:
          "The API documentation is outdated and needs to be updated to reflect recent changes.",
        labels: ["documentation"],
      },
      {
        id: 4,
        title: "Add dark mode support",
        status: "open",
        priority: "medium",
        assignee:
          project.contributors.length > 1
            ? project.contributors[1]
            : project.contributors[0],
        createdAt: "5 days ago",
        comments: 7,
        description:
          "Implement a dark mode theme option for better user experience in low-light environments.",
        labels: ["enhancement", "ui"],
      },
      {
        id: 5,
        title: "Fix responsive layout on small screens",
        status: "closed",
        priority: "high",
        assignee: project.contributors[0],
        createdAt: "1 day ago",
        comments: 0,
        description:
          "The layout breaks on screens smaller than 320px width. Need to fix the responsive design.",
        labels: ["bug", "ui"],
      },
    ];

    // Mock pull requests
    const pullRequests = [
      {
        id: 1,
        title: "Add dark mode support",
        status: "open",
        author: project.contributors[0],
        createdAt: "3 days ago",
        comments: 8,
        commits: 5,
        changedFiles: 12,
        description:
          "This PR adds dark mode support with a toggle in the user settings. It includes new color variables and theme switching logic.",
        sourceBranch: "feature/dark-mode",
        targetBranch: "main",
        reviewers: [
          project.contributors.length > 1
            ? project.contributors[1]
            : project.contributors[0],
        ],
      },
      {
        id: 2,
        title: "Fix responsive layout issues",
        status: "merged",
        author:
          project.contributors.length > 1
            ? project.contributors[1]
            : project.contributors[0],
        createdAt: "1 week ago",
        comments: 3,
        commits: 2,
        changedFiles: 4,
        description:
          "Fixes the layout issues on mobile devices by implementing a more flexible grid system.",
        sourceBranch: "fix/responsive-layout",
        targetBranch: "main",
        reviewers: [project.contributors[0]],
        mergedBy: project.contributors[0],
        mergedAt: "5 days ago",
      },
      {
        id: 3,
        title: "Implement authentication with OAuth",
        status: "open",
        author: project.contributors[0],
        createdAt: "2 days ago",
        comments: 5,
        commits: 7,
        changedFiles: 15,
        description:
          "Adds support for OAuth authentication with Google, GitHub, and Twitter.",
        sourceBranch: "feature/oauth-auth",
        targetBranch: "develop",
        reviewers: [
          project.contributors.length > 1
            ? project.contributors[1]
            : project.contributors[0],
        ],
      },
      {
        id: 4,
        title: "Update dependencies to latest versions",
        status: "merged",
        author:
          project.contributors.length > 1
            ? project.contributors[1]
            : project.contributors[0],
        createdAt: "2 weeks ago",
        comments: 1,
        commits: 1,
        changedFiles: 1,
        description:
          "Updates all dependencies to their latest versions to fix security vulnerabilities.",
        sourceBranch: "chore/update-deps",
        targetBranch: "main",
        reviewers: [project.contributors[0]],
        mergedBy: project.contributors[0],
        mergedAt: "1 week ago",
      },
    ];

    // Mock files
    const files = [
      { name: "src", type: "directory", lastUpdated: "2 days ago", items: 12 },
      {
        name: "public",
        type: "directory",
        lastUpdated: "1 week ago",
        items: 5,
      },
      {
        name: "components",
        type: "directory",
        lastUpdated: "3 days ago",
        items: 24,
      },
      { name: "pages", type: "directory", lastUpdated: "4 days ago", items: 8 },
      {
        name: "styles",
        type: "directory",
        lastUpdated: "5 days ago",
        items: 3,
      },
      {
        name: "package.json",
        type: "file",
        lastUpdated: "3 days ago",
        size: "2.4 KB",
      },
      {
        name: "README.md",
        type: "file",
        lastUpdated: "2 days ago",
        size: "4.1 KB",
      },
      {
        name: "tsconfig.json",
        type: "file",
        lastUpdated: "2 weeks ago",
        size: "1.2 KB",
      },
      {
        name: ".env.example",
        type: "file",
        lastUpdated: "1 month ago",
        size: "0.5 KB",
      },
      {
        name: ".gitignore",
        type: "file",
        lastUpdated: "1 month ago",
        size: "0.3 KB",
      },
    ];

    // Mock related projects
    const relatedProjects = projects
      .filter((p) => p.id !== projectId)
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        languageColor: p.languageColor || "bg-primary/20",
      }));

    return {
      project: detailedProject,
      activities,
      issues,
      pullRequests,
      files,
      relatedProjects,
    };
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
}

// Create a new project
export async function createProject(params: ProjectParams, userId: string) {
  try {
    await connectToDatabase();

    // Find the user in the database
    const mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      throw new Error("User not found");
    }

    // Create the project
    const newProject = await Project.create({
      ...params,
      owner: mongoUser._id,
      contributors: [mongoUser._id],
    });

    // Create activity record
    await Activity.create({
      user: mongoUser._id,
      project: newProject._id,
      action: "created project",
    });

    revalidatePath("/projects");

    return JSON.parse(JSON.stringify(newProject));
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

// Get all projects for a user
export async function getProjects(params: GetProjectsParams) {
  try {
    await connectToDatabase();

    const {
      userId,
      searchQuery,
      filter,
      sort = "newest",
      page = 1,
      pageSize = 6,
    } = params;

    // Find the user in the database
    const mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      throw new Error("User not found");
    }

    // Base query conditions
    const baseConditions = [
      { owner: mongoUser._id },
      { contributors: { $in: [mongoUser._id] } },
    ];

    // Search query conditions
    const searchConditions = searchQuery
      ? [
          { name: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { technologies: { $in: [new RegExp(searchQuery, "i")] } },
        ]
      : [];

    // Filter conditions
    let filterCondition = {};
    if (filter === "starred") {
      filterCondition = { stars: { $in: [mongoUser._id] } };
    } else if (filter === "forked") {
      filterCondition = { parentProject: { $exists: true } };
    }

    // Combine all conditions
    let query = {};

    // First, handle the base conditions (user is owner or contributor)
    query = { $or: baseConditions };

    // Then add search conditions if they exist
    if (searchConditions.length > 0) {
      query = {
        $and: [query, { $or: searchConditions }],
      };
    }

    // Finally, add filter condition if it exists
    if (Object.keys(filterCondition).length > 0) {
      query = {
        $and: [query, filterCondition],
      };
    }

    // Calculate pagination
    const skipAmount = (page - 1) * pageSize;

    // Create sort options
    let sortOptions = {};
    switch (sort) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most-stars":
        sortOptions = { "stars.length": -1 };
        break;
      case "most-forks":
        sortOptions = { "forks.length": -1 };
        break;
      case "recently-updated":
        sortOptions = { updatedAt: -1 };
        break;
      case "most-complete":
        sortOptions = { completionPercentage: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Get projects
    const projects = await Project.find(query)
      .populate({
        path: "owner",
        model: User,
        select: "_id name picture clerkId",
      })
      .populate({
        path: "contributors",
        model: User,
        select: "_id name picture clerkId",
      })
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Get total count for pagination
    const totalProjects = await Project.countDocuments(query);

    // Get featured project (most starred)
    const featuredProject = await Project.findOne({
      $or: baseConditions,
    })
      .populate({
        path: "owner",
        model: User,
        select: "_id name picture clerkId",
      })
      .populate({
        path: "contributors",
        model: User,
        select: "_id name picture clerkId",
      })
      .sort({ "stars.length": -1 })
      .limit(1);

    // Check if there are more projects
    const isNext = totalProjects > skipAmount + projects.length;

    return {
      projects: JSON.parse(JSON.stringify(projects)),
      featured: featuredProject
        ? JSON.parse(JSON.stringify(featuredProject))
        : null,
      isNext,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

// Get a single project by ID
export async function getProjectById(projectId: string, userId: string) {
  try {
    await connectToDatabase();

    // Find the user in the database
    const mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      throw new Error("User not found");
    }

    // Get the project with populated fields
    const project = await Project.findById(projectId)
      .populate({
        path: "owner",
        model: User,
        select: "_id name picture clerkId",
      })
      .populate({
        path: "contributors",
        model: User,
        select: "_id name picture clerkId",
      })
      .populate({
        path: "issues",
        model: Issue,
        options: { sort: { createdAt: -1 }, limit: 5 },
        populate: {
          path: "creator assignees",
          model: User,
          select: "_id name picture clerkId",
        },
      })
      .populate({
        path: "pullRequests",
        model: PullRequest,
        options: { sort: { createdAt: -1 }, limit: 5 },
        populate: {
          path: "creator reviewers",
          model: User,
          select: "_id name picture clerkId",
        },
      });

    if (!project) {
      throw new Error("Project not found");
    }

    // Get recent activities
    const activities = await Activity.find({ project: project._id })
      .populate({
        path: "user",
        model: User,
        select: "_id name picture clerkId",
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get related projects (same owner or similar technologies)
    const relatedProjects = await Project.find({
      _id: { $ne: project._id },
      $or: [
        { owner: project.owner._id },
        { technologies: { $in: project.technologies } },
      ],
    }).limit(3);

    // Check if the current user has starred the project
    const isStarred = project.stars.some(
      (star: any) => star.toString() === mongoUser._id.toString()
    );

    // Check if the current user has forked the project
    const hasForked = await Project.exists({
      parentProject: project._id,
      owner: mongoUser._id,
    });

    // Check if the current user is watching the project
    const isWatching = project.watchers.some(
      (watcher: any) => watcher.toString() === mongoUser._id.toString()
    );

    return {
      project: JSON.parse(JSON.stringify(project)),
      activities: JSON.parse(JSON.stringify(activities)),
      relatedProjects: JSON.parse(JSON.stringify(relatedProjects)),
      userInteractions: {
        isStarred,
        hasForked,
        isWatching,
      },
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}

// Star or unstar a project
export async function toggleProjectStar(projectId: string, userId: string) {
  try {
    await connectToDatabase();

    // Find the user in the database
    const mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      throw new Error("User not found");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user has already starred the project
    const isStarred = project.stars.includes(mongoUser._id);

    // Update the project
    if (isStarred) {
      // Remove star
      await Project.findByIdAndUpdate(projectId, {
        $pull: { stars: mongoUser._id },
      });

      // Create activity
      await Activity.create({
        user: mongoUser._id,
        project: project._id,
        action: "unstarred project",
      });
    } else {
      // Add star
      await Project.findByIdAndUpdate(projectId, {
        $addToSet: { stars: mongoUser._id },
      });

      // Create activity
      await Activity.create({
        user: mongoUser._id,
        project: project._id,
        action: "starred project",
      });
    }

    revalidatePath(`/projects/${projectId}`);

    return { success: true, isStarred: !isStarred };
  } catch (error) {
    console.error("Error toggling project star:", error);
    throw error;
  }
}

// Fork a project
export async function forkProject(projectId: string, userId: string) {
  try {
    await connectToDatabase();

    // Find the user in the database
    const mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      throw new Error("User not found");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user has already forked the project
    const existingFork = await Project.findOne({
      parentProject: project._id,
      owner: mongoUser._id,
    });

    if (existingFork) {
      throw new Error("You have already forked this project");
    }

    // Create a new project as a fork
    const forkedProject = await Project.create({
      name: `${project.name}-fork`,
      description: project.description,
      isPrivate: project.isPrivate,
      owner: mongoUser._id,
      contributors: [mongoUser._id],
      technologies: project.technologies,
      repositoryUrl: project.repositoryUrl,
      demoUrl: project.demoUrl,
      completionPercentage: project.completionPercentage,
      parentProject: project._id,
    });

    // Update the original project's forks array
    await Project.findByIdAndUpdate(projectId, {
      $addToSet: { forks: mongoUser._id },
    });

    // Create activity records
    await Activity.create({
      user: mongoUser._id,
      project: project._id,
      action: "forked project",
    });

    await Activity.create({
      user: mongoUser._id,
      project: forkedProject._id,
      action: "created fork from",
      details: project.name,
    });

    revalidatePath(`/projects`);
    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      forkedProject: JSON.parse(JSON.stringify(forkedProject)),
    };
  } catch (error) {
    console.error("Error forking project:", error);
    throw error;
  }
}

// Toggle watching a project
export async function toggleProjectWatch(projectId: string, userId: string) {
  try {
    await connectToDatabase();

    // Find the user in the database
    const mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      throw new Error("User not found");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user is already watching the project
    const isWatching = project.watchers.includes(mongoUser._id);

    // Update the project
    if (isWatching) {
      // Remove watcher
      await Project.findByIdAndUpdate(projectId, {
        $pull: { watchers: mongoUser._id },
      });

      // Create activity
      await Activity.create({
        user: mongoUser._id,
        project: project._id,
        action: "unwatched project",
      });
    } else {
      // Add watcher
      await Project.findByIdAndUpdate(projectId, {
        $addToSet: { watchers: mongoUser._id },
      });

      // Create activity
      await Activity.create({
        user: mongoUser._id,
        project: project._id,
        action: "started watching project",
      });
    }

    revalidatePath(`/projects/${projectId}`);

    return { success: true, isWatching: !isWatching };
  } catch (error) {
    console.error("Error toggling project watch:", error);
    throw error;
  }
}

// Update a project
export async function updateProject(
  projectId: string,
  params: Partial<ProjectParams>,
  userId: string
) {
  try {
    await connectToDatabase();

    // Find the user in the database
    const mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      throw new Error("User not found");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user is the owner or a contributor
    const isOwner = project.owner.toString() === mongoUser._id.toString();
    const isContributor = project.contributors.some(
      (contributor: any) => contributor.toString() === mongoUser._id.toString()
    );

    if (!isOwner && !isContributor) {
      throw new Error("You don't have permission to update this project");
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        ...params,
        updatedAt: new Date(),
      },
      { new: true }
    );

    // Create activity
    await Activity.create({
      user: mongoUser._id,
      project: project._id,
      action: "updated project",
    });

    revalidatePath(`/projects/${projectId}`);

    return JSON.parse(JSON.stringify(updatedProject));
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

// Delete a project
export async function deleteProject(projectId: string, userId: string) {
  try {
    await connectToDatabase();

    // Find the user in the database
    const mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      throw new Error("User not found");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user is the owner
    const isOwner = project.owner.toString() === mongoUser._id.toString();

    if (!isOwner) {
      throw new Error("Only the project owner can delete this project");
    }

    // Delete related issues and pull requests
    await Issue.deleteMany({ project: project._id });
    await PullRequest.deleteMany({ project: project._id });

    // Delete activities related to this project
    await Activity.deleteMany({ project: project._id });

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    revalidatePath("/projects");

    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

// Create an issue
export async function createIssue(
  projectId: string,
  {
    title,
    description,
    priority,
  }: { title: string; description: string; priority: string },
  userId: string
) {
  try {
    await connectToDatabase();

    // Find the user in the database
    const mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      throw new Error("User not found");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    // Create the issue
    const newIssue = await Issue.create({
      title,
      description,
      priority,
      project: project._id,
      creator: mongoUser._id,
      assignees: [mongoUser._id],
    });

    // Update the project with the new issue
    await Project.findByIdAndUpdate(projectId, {
      $addToSet: { issues: newIssue._id },
      updatedAt: new Date(),
    });

    // Create activity
    await Activity.create({
      user: mongoUser._id,
      project: project._id,
      action: "created issue",
      details: title,
    });

    revalidatePath(`/projects/${projectId}`);

    return JSON.parse(JSON.stringify(newIssue));
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
}

// Create a pull request
export async function createPullRequest(
  projectId: string,
  {
    title,
    description,
    sourceBranch,
    targetBranch,
  }: {
    title: string;
    description: string;
    sourceBranch: string;
    targetBranch: string;
  },
  userId: string
) {
  try {
    await connectToDatabase();

    // Find the user in the database
    const mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      throw new Error("User not found");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    // Create the pull request
    const newPR = await PullRequest.create({
      title,
      description,
      sourceBranch,
      targetBranch,
      project: project._id,
      creator: mongoUser._id,
      reviewers: [project.owner],
    });

    // Update the project with the new pull request
    await Project.findByIdAndUpdate(projectId, {
      $addToSet: { pullRequests: newPR._id },
      updatedAt: new Date(),
    });

    // Create activity
    await Activity.create({
      user: mongoUser._id,
      project: project._id,
      action: "created pull request",
      details: title,
    });

    revalidatePath(`/projects/${projectId}`);

    return JSON.parse(JSON.stringify(newPR));
  } catch (error) {
    console.error("Error creating pull request:", error);
    throw error;
  }
}

// Get project activities
export async function getProjectActivities(projectId: string, userId: string) {
  try {
    await connectToDatabase();

    // Find the user in the database
    const mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      throw new Error("User not found");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    // Get activities
    const activities = await Activity.find({ project: project._id })
      .populate({
        path: "user",
        model: User,
        select: "_id name picture clerkId",
      })
      .sort({ createdAt: -1 })
      .limit(20);

    return JSON.parse(JSON.stringify(activities));
  } catch (error) {
    console.error("Error fetching project activities:", error);
    throw error;
  }
}
 */