// Project data - replace with your actual project information
const projectsData = [
  {
    id: 1,
    title: "StackMaker",
    description: "StackMaker is a responsive portfolio website built with React and Tailwind CSS. It features smooth animations, dark mode support, and a modern design that showcases developer skills effectively. The site includes sections for projects, skills, experience, and contact information, all with a consistent design language.",
    devTime: "2 months",
    role: "Full Stack Developer",
    lastUpdated: "Jan 2023",
    status: "Active",
    technologies: ["React", "Tailwind CSS", "JavaScript", "Responsive Design", "Firebase"],
    liveLink: "https://example.com/stackmaker",
    githubLink: "https://github.com/yourusername/stackmaker",
    mainImage: "/src/img/stackmaker-preview.PNG",
    gallery: [
      "/src/img/stackmaker-preview.PNG",
      "/src/img/project2.jpg",
      "/src/img/project3.jpg",
      "/src/img/project4.jpg",
      "/src/img/project5.jpg"
    ]
  },
  // Add more projects following the same structure
];

document.addEventListener('DOMContentLoaded', function() {
  const projectCards = document.querySelectorAll('.project-card');
  const projectModal = document.getElementById('project-modal');
  const closeModal = document.getElementById('close-modal');
  
  // Modal elements
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalDevTime = document.getElementById('modal-dev-time');
  const modalRole = document.getElementById('modal-role');
  const modalUpdated = document.getElementById('modal-updated');
  const modalStatus = document.getElementById('modal-status');
  const modalTechnologies = document.getElementById('modal-technologies');
  const modalLiveLink = document.getElementById('modal-live-link');
  const modalGithubLink = document.getElementById('modal-github-link');
  const modalMainImage = document.getElementById('modal-main-image').querySelector('img');
  const modalGallery = document.getElementById('modal-gallery');
  
  // Open modal when a project card is clicked
  projectCards.forEach(card => {
    card.addEventListener('click', function() {
      const projectId = parseInt(this.getAttribute('data-project-id'));
      const project = projectsData.find(p => p.id === projectId);
      
      if (project) {
        // Populate modal with project data
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description;
        modalDevTime.textContent = project.devTime;
        modalRole.textContent = project.role;
        modalUpdated.textContent = project.lastUpdated;
        modalStatus.textContent = project.status;
        
        // Add technologies
        modalTechnologies.innerHTML = '';
        project.technologies.forEach(tech => {
          const techBadge = document.createElement('span');
          techBadge.className = 'px-2 py-1 text-xs rounded-full';
          techBadge.style.backgroundColor = 'var(--sapphire-600)';
          techBadge.textContent = tech;
          modalTechnologies.appendChild(techBadge);
        });
        
        // Set links
        modalLiveLink.href = project.liveLink;
        modalGithubLink.href = project.githubLink;
        
        // Set main image
        modalMainImage.src = project.mainImage;
        modalMainImage.alt = `${project.title} Screenshot`;
        
        // Build image gallery
        modalGallery.innerHTML = '';
        project.gallery.forEach((image, index) => {
          const thumbnail = document.createElement('div');
          thumbnail.className = 'gallery-thumbnail h-20 rounded-lg overflow-hidden cursor-pointer';
          thumbnail.innerHTML = `<img src="${image}" alt="${project.title} Gallery Image ${index + 1}" class="w-full h-full object-cover">`;
          
          // Set first image as active
          if (index === 0) {
            thumbnail.classList.add('active');
          }
          
          // Change main image when thumbnail is clicked
          thumbnail.addEventListener('click', function() {
            modalMainImage.src = image;
            
            // Update active thumbnail
            document.querySelectorAll('.gallery-thumbnail').forEach(thumb => {
              thumb.classList.remove('active');
            });
            this.classList.add('active');
          });
          
          modalGallery.appendChild(thumbnail);
        });
        
        // Show modal
        projectModal.classList.remove('hidden');
        projectModal.classList.add('modal-open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Setup fullscreen image viewing
        setupFullscreenImageViewing();
      }
    });
  });
  
  // Close modal
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
});

// Function to handle fullscreen image viewing
function setupFullscreenImageViewing() {
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
        fullscreenContainer.querySelector('button').addEventListener('click', function() {
          document.body.removeChild(fullscreenContainer);
        });
        
        // Close on escape key
        const escListener = function(e) {
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
