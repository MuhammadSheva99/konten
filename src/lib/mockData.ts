export const mockUser = { id: "u1", name: "Admin", role: "ADMIN" };
 
export const mockBrands = [
  { id: "b1", name: "Brand A", isActive: true, akunCount: 14 },
  { id: "b2", name: "Brand B", isActive: true, akunCount: 11 },
  { id: "b3", name: "Brand C", isActive: true, akunCount: 9 },
];
 
export const mockPlatforms = [
  { id: "p1", name: "Instagram", akunCount: 16 },
  { id: "p2", name: "TikTok", akunCount: 13 },
  { id: "p3", name: "YouTube", akunCount: 5 },
  { id: "p4", name: "Threads", akunCount: 4 },
];
 
export const mockPics = [
  { id: "pic1", name: "Dinda", username: "dinda", isActive: true, akunCount: 2 },
  { id: "pic2", name: "Rafi", username: "rafi", isActive: true, akunCount: 2 },
  { id: "pic3", name: "Sari", username: "sari", isActive: true, akunCount: 1 },
];
 
export const mockAkun = [
  { id: "a1", username: "brandaofficial", brand: "Brand A", platform: "Instagram", pic: "Dinda", status: "ACTIVE", apiConnected: false, lastPostAt: "2026-08-10" },
  { id: "a2", username: "brandb.id", brand: "Brand B", platform: "TikTok", pic: "Rafi", status: "ACTIVE", apiConnected: false, lastPostAt: "2026-08-10" },
  { id: "a3", username: "brandcofficial", brand: "Brand C", platform: "YouTube", pic: "Sari", status: "INACTIVE", apiConnected: false, lastPostAt: "2026-07-28" },
];
 
export const mockTargetKpi = [
  { id: "t1", period: "Agu 2026", pic: "Dinda", brand: "Brand A", targetPosting: 20, targetViews: 500000, targetLeads: 50 },
  { id: "t2", period: "Agu 2026", pic: "Rafi", brand: "Brand B", targetPosting: 18, targetViews: 400000, targetLeads: 40 },
];
 
export const mockContentPlans = [
  { id: "c1", title: "Promo Ramadan Ep.3", brand: "Brand A", platform: "Instagram", akun: "brandaofficial", pic: "Dinda", scheduledDate: "2026-08-12", status: "APPROVAL" },
  { id: "c2", title: "Tips Skincare Malam", brand: "Brand B", platform: "TikTok", akun: "brandb.id", pic: "Rafi", scheduledDate: "2026-08-13", status: "SCHEDULED" },
  { id: "c3", title: "Behind The Scene Produksi", brand: "Brand A", platform: "Instagram", akun: "brandaofficial", pic: "Dinda", scheduledDate: "2026-08-14", status: "EDITING" },
  { id: "c4", title: "Testimoni Customer #12", brand: "Brand C", platform: "YouTube", akun: "brandcofficial", pic: "Sari", scheduledDate: "2026-08-15", status: "POSTED" },
  { id: "c5", title: "Giveaway Akhir Bulan", brand: "Brand B", platform: "TikTok", akun: "brandb.id", pic: "Rafi", scheduledDate: "2026-08-09", status: "DRAFT" },
];
 
export const mockPostings = [
  { id: "po1", link: "https://instagram.com/p/xxz1", brand: "Brand A", platform: "Instagram", akun: "brandaofficial", postedAt: "2026-08-10" },
  { id: "po2", link: "https://youtube.com/watch?v=abc", brand: "Brand C", platform: "YouTube", akun: "brandcofficial", postedAt: "2026-08-10" },
  { id: "po3", link: "https://tiktok.com/@brandb/video/1", brand: "Brand B", platform: "TikTok", akun: "brandb.id", postedAt: "2026-08-09" },
  { id: "po4", link: "https://instagram.com/p/xxz0", brand: "Brand A", platform: "Instagram", akun: "brandaofficial", postedAt: "2026-08-09" },
];
 
export const mockPerformance = [
  { id: "pf1", akun: "brandaofficial", platform: "Instagram", date: "2026-08-10", views: 120400, likes: 8200, comments: 340, shares: 210, saves: 190, profileVisit: 1240, websiteClick: 210, follows: 60, leadsWaDm: 18, source: "MANUAL" },
  { id: "pf2", akun: "brandb.id", platform: "TikTok", date: "2026-08-10", views: 89200, likes: 6100, comments: 210, shares: 150, saves: 130, profileVisit: 980, websiteClick: 150, follows: 40, leadsWaDm: 12, source: "MANUAL" },
  { id: "pf3", akun: "brandcofficial", platform: "YouTube", date: "2026-08-09", views: 44100, likes: 2100, comments: 90, shares: 40, saves: 30, profileVisit: 410, websiteClick: 60, follows: 15, leadsWaDm: 4, source: "MANUAL" },
  { id: "pf4", akun: "brandaofficial", platform: "Threads", date: "2026-08-08", views: 15200, likes: 900, comments: 40, shares: 20, saves: 10, profileVisit: 120, websiteClick: 20, follows: 8, leadsWaDm: 2, source: "MANUAL" },
];
 
export const mockDashboardStats = {
  totalAkunAktif: 34,
  postingHariIni: 7,
  postingMingguIni: 41,
  postingBulanIni: 156,
  totalViews: 2400000,
  totalProfileVisit: 38900,
  totalWebsiteClick: 6210,
  totalLeads: 412,
  achievementPosting: 87,
  achievementViews: 64,
  chartData14d: [40,55,48,70,65,80,60,90,75,110,95,130,100,120].map((v, i) => ({
    date: `Day ${i + 1}`,
    views: v * 1000,
  })),
};
 
export const mockFunnel = [
  { label: "Views", value: 2400000 },
  { label: "Profile Visit", value: 38900 },
  { label: "Website Click", value: 6210 },
  { label: "Leads (WA/DM)", value: 412 },
  { label: "Leads Qualified", value: 210 },
  { label: "Closing (opsional)", value: 87 },
];
 
export const mockKpiRows = [
  { pic: "Dinda", brand: "Brand A", achPosting: 112, achViews: 78, achProfileVisit: 65, achWebsiteClick: 70, achLeads: 45, engagementRate: 4.2 },
  { pic: "Rafi", brand: "Brand B", achPosting: 90, achViews: 131, achProfileVisit: 88, achWebsiteClick: 95, achLeads: 108, engagementRate: 6.7 },
  { pic: "Sari", brand: "Brand C", achPosting: 55, achViews: 62, achProfileVisit: 40, achWebsiteClick: 38, achLeads: 30, engagementRate: 3.1 },
];
 
export const mockPendingApprovals = [
  { id: "ap1", title: "Promo Ramadan Ep.3", brand: "Brand A", akun: "brandaofficial", submittedBy: "Dinda", revision: 1 },
  { id: "ap2", title: "Unboxing Produk Baru", brand: "Brand B", akun: "brandb.id", submittedBy: "Rafi", revision: 2 },
];
 
export const mockApprovalHistory = [
  { id: "ah1", title: "Testimoni Customer #12", status: "APPROVED", note: "Oke, lanjut jadwalkan", decidedBy: "Admin", date: "2026-08-08" },
  { id: "ah2", title: "Giveaway Draft 1", status: "REJECTED", note: "Caption perlu direvisi", decidedBy: "Admin", date: "2026-08-07" },
];
 
export const mockReminders = {
  belumUpload: [
    { title: "Giveaway Akhir Bulan", brand: "Brand B", pic: "Rafi", scheduledDate: "2026-08-09", daysLate: 2 },
  ],
  deadlineDekat: [
    { title: "Promo Ramadan Ep.3", brand: "Brand A", pic: "Dinda", scheduledDate: "2026-08-12" },
    { title: "Tips Skincare Malam", brand: "Brand B", pic: "Rafi", scheduledDate: "2026-08-13" },
  ],
  belumInputPerforma: [
    { akun: "brandb.id", brand: "Brand B" },
  ],
};
 
export const mockUsers = [
  { id: "u1", name: "Admin", email: "admin@kontenmanager.local", role: "ADMIN", isActive: true },
  { id: "pic1", name: "Dinda", email: "dinda@brand.com", role: "PIC", isActive: true },
  { id: "pic2", name: "Rafi", email: "rafi@brand.com", role: "PIC", isActive: true },
];
 
export const mockActivityLog = [
  { id: "l1", time: "11 Agu 09:14", user: "Dinda", action: "CREATE", entity: "ContentPlan", detail: "Promo Ramadan Ep.3" },
  { id: "l2", time: "11 Agu 08:52", user: "Admin", action: "UPDATE_STATUS", entity: "ContentPlan", detail: "SCHEDULED" },
  { id: "l3", time: "10 Agu 17:30", user: "Rafi", action: "CREATE", entity: "PostingTracker", detail: "tiktok.com/@brandb/video/1" },
];
 
export const mockLeaderboardPic = [
  { name: "Rafi", views: 890400, posting: 22, leads: 108 },
  { name: "Dinda", views: 760100, posting: 25, leads: 45 },
  { name: "Sari", views: 412900, posting: 12, leads: 30 },
];
 
export const mockLeaderboardAkun = [
  { name: "brandb.id", brand: "Brand B", views: 890400 },
  { name: "brandaofficial", brand: "Brand A", views: 760100 },
  { name: "brandcofficial", brand: "Brand C", views: 412900 },
];
 
export const mockDraftStock = [
  {
    brand: "Nyeskoffie",
    pic: "Nadia",
    weeks: [
      { label: "W3 24/7", count: 12 },
      { label: "W4 31/7", count: 12 },
      { label: "W5 7/8", count: 12 },
      { label: "W6 14/8", count: 0 },
      { label: "W7 21/8", count: 0 },
      { label: "W8 28/8", count: 0 },
    ],
    linkDraft: "https://drive.google.com/drive/folders/nyeskoffie-juli",
  },
  {
    brand: "Spesialistboothkoper",
    pic: "Nadia",
    weeks: [
      { label: "W3 24/7", count: 14 },
      { label: "W4 31/7", count: 14 },
      { label: "W5 7/8", count: 14 },
      { label: "W6 14/8", count: 5 },
      { label: "W7 21/8", count: 8 },
      { label: "W8 28/8", count: 10 },
    ],
    linkDraft: "https://drive.google.com/drive/folders/spesialistboothkoper-juli",
  },
  {
    brand: "Chicktop id",
    pic: "Nadia",
    weeks: [
      { label: "W3 24/7", count: 5 },
      { label: "W4 31/7", count: 5 },
      { label: "W5 7/8", count: 5 },
      { label: "W6 14/8", count: 3 },
      { label: "W7 21/8", count: 3 },
      { label: "W8 28/8", count: 4 },
    ],
    linkDraft: "https://drive.google.com/drive/folders/chicktopid-juli",
  },
  {
    brand: "Mozzy coin",
    pic: "Nadia",
    weeks: [
      { label: "W3 24/7", count: 3 },
      { label: "W4 31/7", count: 3 },
      { label: "W5 7/8", count: 3 },
      { label: "W6 14/8", count: 1 },
      { label: "W7 21/8", count: 10 },
      { label: "W8 28/8", count: 13 },
    ],
    linkDraft: "https://drive.google.com/drive/folders/mozzycoin-juli",
  },
];