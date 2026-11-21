export interface SkillItem {
  name: string
  icon: string
  title: string
}

export interface SkillCategory {
  titleKey: 'skills_cat1' | 'skills_cat2' | 'skills_cat3'
  accent: string
  items: SkillItem[]
}

export const navSections = [
  { id: 'about', code: '01', labelKey: 'nav_about' as const },
  { id: 'experience', code: '02', labelKey: 'nav_experience' as const },
  { id: 'education', code: '03', labelKey: 'nav_education' as const },
  { id: 'skills', code: '04', labelKey: 'nav_skills' as const },
  { id: 'interests', code: '05', labelKey: 'nav_interests' as const },
  { id: 'awards', code: '06', labelKey: 'nav_awards' as const },
  { id: 'contact', code: '07', labelKey: 'nav_contact' as const, isHot: true },
]

export const skillCategories: SkillCategory[] = [
  {
    titleKey: 'skills_cat1',
    accent: 'text-cyan-400',
    items: [
      { name: 'ASP.NET', icon: '/assets/img/asp.png', title: 'ASP.NET Core Framework' },
      { name: 'Django', icon: '/assets/img/django.png', title: 'Django Python Framework' },
      { name: 'Python', icon: '/assets/img/python.png', title: 'Python Programming' },
      { name: 'SQL', icon: '/assets/img/sql.png', title: 'SQL Database' },
      { name: 'PHP', icon: '/assets/img/php.png', title: 'PHP Web Development' },
    ],
  },
  {
    titleKey: 'skills_cat2',
    accent: 'text-purple-400',
    items: [
      { name: 'VS Code', icon: '/assets/img/vscode.png', title: 'Visual Studio Code' },
      { name: 'Visual Studio', icon: '/assets/img/vs.svg', title: 'Visual Studio IDE' },
    ],
  },
  {
    titleKey: 'skills_cat3',
    accent: 'text-emerald-400',
    items: [
      { name: 'Git', icon: '/assets/img/git.png', title: 'Git Version Control' },
      { name: 'GitHub', icon: '/assets/img/github.png', title: 'GitHub Repository' },
    ],
  },
]

export const experienceList = [
  {
    titleKey: 'exp_1_title' as const,
    dateKey: 'exp_1_date' as const,
    roleKey: 'exp_1_role' as const,
    descKey: 'exp_1_desc' as const,
    tags: ['AI', 'Text-to-Image', 'Python', 'Computer Vision', 'NLP', 'Cloud Deployment'],
  },
  {
    titleKey: 'exp_2_title' as const,
    dateKey: 'exp_2_date' as const,
    roleKey: 'exp_2_role' as const,
    descKey: 'exp_2_desc' as const,
    tags: ['ASP.NET Core MVC', 'C# .NET', 'SQL Server', 'Web Security', 'AuthN & AuthZ'],
  },
  {
    titleKey: 'exp_3_title' as const,
    dateKey: 'exp_3_date' as const,
    roleKey: 'exp_3_role' as const,
    descKey: 'exp_3_desc' as const,
    tags: ['WPF', 'WinForms', 'C#', 'RESTful API Integration'],
  },
]

export const interestsList = [
  { emoji: '🏃', titleKey: 'interest_1_title' as const, descKey: 'interest_1_desc' as const },
  { emoji: '⚡', titleKey: 'interest_2_title' as const, descKey: 'interest_2_desc' as const },
  { emoji: '🎮', titleKey: 'interest_3_title' as const, descKey: 'interest_3_desc' as const },
  { emoji: '🎬', titleKey: 'interest_4_title' as const, descKey: 'interest_4_desc' as const },
]

export const awardsList = [
  { badgeKey: 'award_1_badge' as const, titleKey: 'award_1_title' as const, descKey: 'award_1_desc' as const, accent: 'text-amber-400' },
  { badgeKey: 'award_2_badge' as const, titleKey: 'award_2_title' as const, descKey: 'award_2_desc' as const, accent: 'text-cyan-400' },
  { badgeKey: 'award_3_badge' as const, titleKey: 'award_3_title' as const, descKey: 'award_3_desc' as const, accent: 'text-purple-400' },
  { badgeKey: 'award_4_badge' as const, titleKey: 'award_4_title' as const, descKey: 'award_4_desc' as const, accent: 'text-emerald-400' },
]

export const contactInfo = {
  email: 'ae12cnamcao@gmail.com',
  phone: '0347726501',
  phoneDisplay: '(+84) 3477-26501',
  socials: {
    facebook: 'https://www.facebook.com/TrongMin2k2',
    github: 'https://github.com/trongminne',
    youtube: 'https://www.youtube.com/channel/UCG2AfXQ9zIggntyjNa9_z5w',
    tiktok: 'https://www.tiktok.com/@trongmin111',
  },
}
