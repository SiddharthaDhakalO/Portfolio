// Edit these to point at your real handles and resume.
export const CONTACT = {
  email: 'siddharthadhakal0@gmail.com',
  phone: '+977 9742943801',
  location: 'Kathmandu, Nepal',
  resumeUrl: '/resume.pdf',
  socials: [
    {
      name: 'GitHub',
      handle: '@SiddharthaDhakalO',
      url: 'https://github.com/SiddharthaDhakalO',
    },
    {
      name: 'LinkedIn',
      handle: 'Siddhartha Dhakal',
      url: 'https://www.linkedin.com/in/siddhartha-dhakal-778003261',
    },
    {
      name: 'Email',
      handle: 'siddharthadhakal0@gmail.com',
      url: 'mailto:siddharthadhakal0@gmail.com',
    },
    {
      name: 'Phone',
      handle: '+977 9742943801',
      url: 'tel:+9779742943801',
    },
  ] as const,
};

// EmailJS config — set these in .env.local (see .env.local.example).
// All three must be present for the form to actually send; otherwise the form
// renders in a "configure EmailJS to enable sending" state.
export const EMAILJS = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

export const isEmailJSConfigured =
  !!EMAILJS.serviceId && !!EMAILJS.templateId && !!EMAILJS.publicKey;
