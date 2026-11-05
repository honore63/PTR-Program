const pageHeadingVariants: Record<string, string[]> = {
  home: [
    "Celebrating Excellence in Teacher Education",
    "Connecting Resident Teachers Across Rwanda",
    "Inspiring Excellence in Every Classroom",
    "A Community Built on Learning and Leadership",
    "Supporting Teachers. Strengthening Education.",
  ],
  about: [
    "A 12-Month Residency for Rwanda's Classrooms",
    "Learning Through Guided Classroom Practice",
    "Preparing Teachers with Real-World Experience",
    "Mentorship at the Heart of Teacher Development",
    "A Residency That Builds Lasting Impact",
  ],
  network: [
    "17 Model Schools Across Rwanda",
    "Where Residents Learn Through Teaching",
    "Classroom Practice with Mentor Support",
    "A Network of Demonstration Schools",
    "Connecting Schools and Resident Teachers",
  ],
  impact: [
    "From Residents to Education Leaders",
    "Building Skills for Rwanda's Classrooms",
    "Growing Through Practice and Mentorship",
    "Teachers Making a Difference in Education",
    "A Stronger Future Through Teacher Learning",
  ],
  news: [
    "Stories and Updates from the PTR Alumni Network",
    "Training, Events, and Community News",
    "Sharing the Work of Resident Teachers",
    "Updates from Schools and Alumni",
    "The Latest from the PTR Community",
  ],
  gallery: [
    "Our Journey in Pictures and Videos",
    "Moments from the Residency Year",
    "Learning, Teaching, and Growing Together",
    "A Visual Story of the PTR Community",
    "Celebrating Teachers and Their Communities",
  ],
  alumni: [
    "Meet Our Alumni",
    "A Community of Practising Teachers",
    "Connecting PTRP Graduates Across Rwanda",
    "Sharing Experience and Professional Growth",
    "The People Behind the Alumni Network",
  ],
  resources: [
    "Resources for Teaching and Learning",
    "Practical Ideas for the Classroom",
    "Tools to Support Teacher Growth",
    "Learning Materials for PTR Alumni",
    "Explore and Share Professional Resources",
  ],
  partners: [
    "Together, We Make Teachers Matter",
    "Partners in Teacher Development",
    "A Shared Commitment to Better Learning",
    "Working Together for Rwanda's Teachers",
    "Building Stronger Classrooms Through Partnership",
  ],
  contact: [
    "Join the PTR Alumni Network",
    "Connect with Fellow Resident Teachers",
    "Be Part of the PTR Community",
    "Share Ideas and Find Support",
    "Get in Touch with the Network",
  ],
  team: [
    "Meet Our Program Coordinators and Mentors",
    "Guiding Resident Teachers Through Practice",
    "The People Supporting Teacher Growth",
    "Mentorship for Professional Development",
    "Meet the PTRP Program Team",
  ],
  residents: [
    "Meet Our Resident Teachers",
    "Teachers Learning Through Classroom Practice",
    "Discover Resident Teacher Profiles",
    "Sharing Professional Growth and Best Practice",
    "The People Strengthening Primary Education",
  ],
  "register-resident": [
    "Register as a Resident Teacher",
    "Join the PTR Alumni Network",
    "Share Your Resident Teacher Profile",
    "Connect with the PTR Community",
    "Take Part in the Resident Teacher Directory",
  ],
  "resident-teacher": [
    "Resident Teacher Profile",
    "Classroom Practice and Professional Growth",
    "Teaching Experience in the PTR Community",
    "Learning Through Practice and Mentorship",
    "Meet a Member of the Resident Teacher Network",
  ],
};

export function getBannerHeadings(slug: string, defaultTitle: string, managedTitle?: string) {
  const pageKey = slug.startsWith("resident-teacher/") ? "resident-teacher" : slug;
  const variants = pageHeadingVariants[pageKey] ?? [
    defaultTitle,
    `Discover ${defaultTitle}`,
    `Explore ${defaultTitle}`,
    `Connecting the PTR community through ${defaultTitle}`,
    `Learning and growth through ${defaultTitle}`,
  ];
  const firstHeading = managedTitle?.trim() || defaultTitle;
  return [firstHeading, ...variants.filter((heading) => heading !== firstHeading)].slice(0, 5);
}
