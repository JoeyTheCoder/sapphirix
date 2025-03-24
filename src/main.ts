import './style.css'

// Define project interface based on your data structure
interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  thumbnail: string;
  images: string[];
  technologies: string[];
  colorTheme?: string;
  stats: {
    devTime: string;
    role: string;
    lastUpdated: string;
    status: string;
  };
  links: {
    live: string;
    github: string;
  };
}

// Fetch projects data from JSON files in the projects directory
async function fetchProjects(): Promise<Project[]> {
  try {
    // First, fetch the index file that contains the list of project files
    const indexResponse = await fetch('./project-index.json');
    if (!indexResponse.ok) {
      throw new Error(`HTTP error! Status: ${indexResponse.status}`);
    }
    const projectFiles = await indexResponse.json();
    
    // Fetch each project file listed in the index
    const projectPromises = projectFiles.map(async (filename: string) => {
      const response = await fetch(`/src/projects/${filename}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    });
    
    // Wait for all fetches to complete
    return await Promise.all(projectPromises);
  } catch (error) {
    console.error('Error loading projects:', error);
    
    // Fallback to use the hardcoded data if fetch fails
    // This is temporary until you create the JSON file
    return [
      {
        id: 1,
        title: "StackMaker",
        description: "StackMaker is a responsive portfolio website built with React and Tailwind CSS. It features smooth animations, dark mode support, and a modern design that showcases developer skills effectively.",
        fullDescription: "StackMaker is a responsive portfolio website built with React and Tailwind CSS. It features smooth animations, dark mode support, and a modern design that showcases developer skills effectively.",
        thumbnail: "/src/img/stackmaker-preview.PNG",
        images: [
          "/src/img/stackmaker-preview.PNG",
          "/src/img/project2.jpg",
          "/src/img/project3.jpg",
          "/src/img/project4.jpg",
          "/src/img/project5.jpg"
        ],
        technologies: ["React", "Tailwind CSS", "JavaScript", "Responsive Design", "Firebase"],
        stats: {
          devTime: "2 months",
          role: "Full Stack Developer",
          lastUpdated: "Jan 2023",
          status: "Active"
        },
        links: {
          live: "https://example.com/stackmaker",
          github: "https://github.com/yourusername/stackmaker"
        }
      },
      // You can add more fallback projects here
    ];
  }
}

// Function to create a project card element
function createProjectCard(project: Project, index: number): HTMLElement {
  const delay = 100 * (index + 1);
  
  // Get project color based on category or use a rotating palette
  const colors = ['emerald', 'amber', 'violet', 'rose', 'cyan', 'sapphire'];
  const colorTheme = project.colorTheme || colors[index % colors.length];
  
  const card = document.createElement('div');
  card.className = `project-card project-${index + 1} rounded-xl overflow-hidden shadow-lg animate-fadeInUp group 
                    transition-all duration-300 hover:-translate-y-2 cursor-pointer`;
  card.style.backgroundColor = `var(--${colorTheme}-700)`;
  card.dataset.projectId = project.id.toString();
  card.style.animationDelay = `${delay}ms`;
  
  // Create card content
  card.innerHTML = `
    <div class="screenshot-container relative bg-black/20 overflow-hidden aspect-[16/9] flex items-center justify-center">
      <img src="${project.thumbnail}" alt="${project.title} Screenshot" class="w-full h-full object-cover">
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/60 transition-opacity duration-300">
        <button class="px-4 py-2 bg-white/90 text-black rounded-full text-sm font-medium transform transition">
          View Details
        </button>
      </div>
    </div>
    <div class="p-6" style="background-color: var(--${colorTheme}-800);">
      <h4 class="font-bold text-xl mb-2">${project.title}</h4>
      <p class="text-gray-300 mb-4 text-sm">${project.description.substring(0, 120)}${project.description.length > 120 ? '...' : ''}</p>
      <div class="flex flex-wrap gap-2 mb-4">
        ${project.technologies.slice(0, 3).map(tech => 
          `<span class="px-2 py-1 text-xs rounded-full" style="background-color: var(--${colorTheme}-600);">${tech}</span>`
        ).join('')}
      </div>
    </div>
  `;
  
  // Add click event listener
  card.addEventListener('click', () => openProjectModal(project.id));
  
  return card;
}

// Function to render projects on the page
async function renderProjects(): Promise<void> {
  const projectsGrid = document.querySelector('#projects .grid');
  if (!projectsGrid) {
    console.error('Projects grid container not found');
    return;
  }
  
  try {
    const projects = await fetchProjects();
    
    // Clear any existing content
    projectsGrid.innerHTML = '';
    
    // Add project cards to the grid
    projects.forEach((project, index) => {
      const card = createProjectCard(project, index);
      projectsGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error rendering projects:', error);
  }
}

// Function to open the project modal
async function openProjectModal(projectId: number): Promise<void> {
  try {
    const projects = await fetchProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      console.error(`Project with ID ${projectId} not found`);
      return;
    }
    
    // Get project color theme for badges only, but use sapphire for modal
    const colorTheme = project.colorTheme || 'sapphire';
    
    // Get project modal element once at the beginning
    const projectModal = document.getElementById('project-modal');
    
    // Always use sapphire theme for the modal background
    const modalContent = projectModal?.querySelector('.bg-gradient-to-br');
    if (modalContent) {
      modalContent.className = `bg-gradient-to-br from-sapphire-800 to-sapphire-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-auto mx-4 animate-scaleIn`;
    }
    
    // Populate modal with project data
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalDevTime = document.getElementById('modal-dev-time');
    const modalRole = document.getElementById('modal-role');
    const modalUpdated = document.getElementById('modal-updated');
    const modalStatus = document.getElementById('modal-status');
    const modalTechnologies = document.getElementById('modal-technologies');
    const modalLiveLink = document.getElementById('modal-live-link') as HTMLAnchorElement;
    const modalGithubLink = document.getElementById('modal-github-link') as HTMLAnchorElement;
    const modalMainImage = document.getElementById('modal-main-image')?.querySelector('img');
    const modalGallery = document.getElementById('modal-gallery');
    
    if (modalTitle) modalTitle.textContent = project.title;
    if (modalDescription) modalDescription.textContent = project.fullDescription || project.description;
    if (modalDevTime) modalDevTime.textContent = project.stats.devTime;
    if (modalRole) modalRole.textContent = project.stats.role;
    if (modalUpdated) modalUpdated.textContent = project.stats.lastUpdated;
    if (modalStatus) modalStatus.textContent = project.stats.status;
    
    // Add technologies
    if (modalTechnologies) {
      modalTechnologies.innerHTML = '';
      project.technologies.forEach(tech => {
        const techBadge = document.createElement('span');
        techBadge.className = 'px-2 py-1 text-xs rounded-full';
        techBadge.style.backgroundColor = `var(--${colorTheme}-600)`;
        techBadge.textContent = tech;
        modalTechnologies.appendChild(techBadge);
      });
    }
    
    // Set links
    if (modalLiveLink) modalLiveLink.href = project.links.live;
    if (modalGithubLink) modalGithubLink.href = project.links.github;
    
    // Set main image
    if (modalMainImage) {
      modalMainImage.src = project.thumbnail;
      modalMainImage.alt = `${project.title} Screenshot`;
    }
    
    // Build image gallery
    if (modalGallery) {
      modalGallery.innerHTML = '';
      project.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'gallery-thumbnail h-20 rounded-lg overflow-hidden cursor-pointer';
        thumbnail.innerHTML = `<img src="${image}" alt="${project.title} Gallery Image ${index + 1}" class="w-full h-full object-cover">`;
        
        // Set first image as active
        if (index === 0) {
          thumbnail.classList.add('active');
        }
        
        // Change main image when thumbnail is clicked
        thumbnail.addEventListener('click', function() {
          if (modalMainImage) modalMainImage.src = image;
          
          // Update active thumbnail
          document.querySelectorAll('.gallery-thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
          });
          this.classList.add('active');
        });
        
        modalGallery.appendChild(thumbnail);
      });
    }
    
    // Show the modal (reusing the projectModal variable)
    if (projectModal) {
      projectModal.classList.remove('hidden');
      projectModal.classList.add('modal-open');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Setup fullscreen image viewing
    setupFullscreenImageViewing();
  } catch (error) {
    console.error('Error opening project modal:', error);
  }
}

// Function to handle fullscreen image viewing
function setupFullscreenImageViewing(): void {
  const modalMainImage = document.getElementById('modal-main-image');
  
  if (modalMainImage) {
    modalMainImage.addEventListener('click', function() {
      const img = this.querySelector('img');
      
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (img) {
        // Create a temporary div for better fullscreen display
        const fullscreenContainer = document.createElement('div');
        fullscreenContainer.className = 'fixed inset-0 bg-black flex items-center justify-center z-[100]';
        fullscreenContainer.innerHTML = `
          <div class="absolute top-4 right-4">
            <button class="text-white hover:text-blue-300 transition-colors p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <img src="${img.src}" alt="${img.alt}" class="max-w-full max-h-[90vh] object-contain">
        `;
        
        document.body.appendChild(fullscreenContainer);
        
        // Handle close button
        const closeButton = fullscreenContainer.querySelector('button');
        if (closeButton) {
          closeButton.addEventListener('click', function() {
            document.body.removeChild(fullscreenContainer);
          });
        }
        
        // Close on escape key
        const escListener = function(e: KeyboardEvent) {
          if (e.key === 'Escape') {
            document.body.removeChild(fullscreenContainer);
            document.removeEventListener('keydown', escListener);
          }
        };
        document.addEventListener('keydown', escListener);
        
        // Close on click outside image
        fullscreenContainer.addEventListener('click', function(e) {
          if (e.target === fullscreenContainer) {
            document.body.removeChild(fullscreenContainer);
          }
        });
      }
    });
  }
}

// Set up modal close functionality
function setupModalClose(): void {
  const projectModal = document.getElementById('project-modal');
  const closeModal = document.getElementById('close-modal');
  
  if (closeModal && projectModal) {
    // Close modal when X button is clicked
    closeModal.addEventListener('click', function() {
      projectModal.classList.add('hidden');
      projectModal.classList.remove('modal-open');
      document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    // Close modal when clicking outside
    projectModal.addEventListener('click', function(event) {
      if (event.target === projectModal) {
        closeModal.click();
      }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && !projectModal.classList.contains('hidden')) {
        closeModal.click();
      }
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  renderProjects();
  setupModalClose();
});

