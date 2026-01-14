// GROQ queries for Sanity

export const testimonialsQuery = `*[_type == "testimonials"] | order(order asc) {
  _id,
  title,
  quote,
  author,
  company,
  role,
  order,
  companyLogo
}`;

export const caseStudiesQuery = `*[_type == "caseStudy"] | order(order asc) {
  _id,
  title,
  category,
  problem,
  solution,
  outcomes,
  image,
  order
}`;

export const servicesQuery = `*[_type == "service"] | order(order asc) {
  _id,
  title,
  description,
  icon,
  order
}`;

export const benefitsQuery = `*[_type == "benefit"] | order(order asc) {
  _id,
  title,
  description,
  icon,
  order
}`;

export const pricingQuery = `*[_type == "pricingPlan"] | order(order asc) {
  _id,
  name,
  price,
  billingPeriod,
  tagline,
  highlighted,
  features,
  ctaText,
  order
}`;

export const faqQuery = `*[_type == "faq"] | order(order asc) {
  _id,
  question,
  answer,
  order
}`;

export const processStepsQuery = `*[_type == "processStep"] | order(order asc) {
  _id,
  title,
  description,
  icon,
  order
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  _id,
  siteName,
  tagline,
  heroTitle,
  heroSubtitle,
  stats
}`;

// Combined query for homepage
export const homePageQuery = `{
  "testimonials": ${testimonialsQuery},
  "caseStudies": ${caseStudiesQuery},
  "services": ${servicesQuery},
  "benefits": ${benefitsQuery},
  "pricing": ${pricingQuery},
  "faqs": ${faqQuery},
  "processSteps": ${processStepsQuery},
  "settings": ${siteSettingsQuery}
}`;
