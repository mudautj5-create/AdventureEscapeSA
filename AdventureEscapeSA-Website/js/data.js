/*
 * Adventure Escape SA sample catalogue (XHAW5112 project).
 * Fees reflect the demonstration wireframes in the supplied presentation.
 * Change this file if the project's final prices or descriptions change.
 */
window.ADVENTURE_DATA = Object.freeze({
  packages: [
    {
      id: 'ultimate', type: 'package', category: 'adventure',
      name: 'Ultimate Adventure Day', eyebrow: 'Best for adventure lovers',
      subtitle: 'A full day. Countless memories.', price: 1500,
      image: 'assets/ultimate-adventure.jpg', duration: 'Full day', level: 'All experience levels',
      description: 'A full-day outdoor adventure featuring several experiences and unforgettable scenery across the Western Cape.',
      included: ['Professionally guided hiking trail', 'Ziplining activity', 'Kayaking experience', 'Lunch break', 'Safety briefing and equipment'],
      tags: ['Guided', 'Full day', 'Popular']
    },
    {
      id: 'family', type: 'package', category: 'family',
      name: 'Family Explorer Package', eyebrow: 'Perfect for families',
      subtitle: 'Discover the outdoors together.', price: 1500,
      image: 'assets/family-explorer.jpg', duration: 'Full day', level: 'Family-friendly group',
      description: 'A relaxed, guided introduction to the outdoors with a variety of family-focused experiences and shared discoveries.',
      included: ['Guided nature experiences', 'Family-oriented activities', 'Equipment and safety briefing', 'Planned rest breaks', 'Support from experienced guides'],
      tags: ['Family', 'Guided', 'Scenic']
    },
    {
      id: 'mountain', type: 'package', category: 'mountain',
      name: 'Mountain Adventure Package', eyebrow: 'Take the scenic route',
      subtitle: 'Great views, greater stories.', price: 1500,
      image: 'assets/mountain-package.jpg', duration: 'Multi-activity package', level: 'Guide-supported group',
      description: 'Discover beautiful mountain landscapes on a guided experience featuring outdoor exploration and remarkable views.',
      included: ['Guided scenic hike', 'Mountain-view stops', 'Planned outdoor activities', 'Briefing and equipment guidance', 'Group guide support'],
      tags: ['Mountain', 'Nature', 'Guided']
    },
    {
      id: 'corporate', type: 'package', category: 'corporate',
      name: 'Corporate Team Challenge', eyebrow: 'Built for great teams',
      subtitle: 'Make teamwork an adventure.', price: 1500,
      image: 'assets/corporate-challenge.jpg', duration: 'Group experience', level: 'Organised teams',
      description: 'A guided day of shared outdoor experiences designed to help groups connect, collaborate, and create memories.',
      included: ['Facilitated team challenges', 'Guided group activities', 'Group planning support', 'Safety briefing', 'Equipment for scheduled activities'],
      tags: ['Corporate', 'Teams', 'Guided']
    }
  ],
  activities: [
    {
      id: 'ziplining', type: 'activity', category: 'air',
      name: 'Ziplining Adventure', eyebrow: 'A different perspective',
      subtitle: 'See the landscape from above.', price: 750,
      image: 'assets/ziplining.jpg', duration: 'Guided session', level: 'Instructor-supervised',
      description: 'Take in wide mountain and forest views during a supervised experience with qualified outdoor instructors.',
      included: ['Safety briefing', 'Equipment hire', 'Professional instructors'],
      tags: ['Guided', 'Views', 'Equipment']
    },
    {
      id: 'kayaking', type: 'activity', category: 'water',
      name: 'Kayaking Experience', eyebrow: 'Paddle into the moment',
      subtitle: 'Calm water, open horizons.', price: 750,
      image: 'assets/kayaking.jpg', duration: 'Guided session', level: 'Instructor-supervised',
      description: 'Enjoy beautiful waterside scenery on a calm, organised kayaking experience with guidance throughout.',
      included: ['Kayak and paddle hire', 'Safety equipment', 'Guided route'],
      tags: ['Water', 'Scenic', 'Guided']
    },
    {
      id: 'climbing', type: 'activity', category: 'mountain',
      name: 'Rock Climbing Session', eyebrow: 'Find your next view',
      subtitle: 'Explore a new perspective.', price: 750,
      image: 'assets/rock-climbing.jpg', duration: 'Guided session', level: 'Instructor-supervised',
      description: 'An organised climbing session in a scenic outdoor environment with professional supervision and a safety briefing.',
      included: ['Climbing equipment', 'Safety instruction', 'Professional supervision'],
      tags: ['Climbing', 'Equipment', 'Guided']
    }
  ]
});
