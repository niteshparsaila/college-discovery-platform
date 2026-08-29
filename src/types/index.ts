export type CollegeListItem = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  ownershipType: string;
  feesPerYear: number;
  rating: number;
  logoColor: string;
};

export type CollegeListResponse = {
  items: CollegeListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type CollegeDetail = CollegeListItem & {
  establishedIn: number | null;
  overview: string;
  courses: {
    id: string;
    name: string;
    degreeLevel: string;
    durationYears: number;
    feesPerYear: number;
    seats: number | null;
  }[];
  placements: {
    id: string;
    year: number;
    averagePackage: number;
    medianPackage: number;
    highestPackage: number;
    placementRate: number;
    topRecruiters: string;
  }[];
  reviews: {
    id: string;
    authorName: string;
    rating: number;
    course: string | null;
    title: string;
    body: string;
    createdAt: string;
  }[];
};

export type CollegeFilters = {
  q?: string;
  city?: string;
  state?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  ownershipType?: string;
  sort?: 'rating_desc' | 'fees_asc' | 'fees_desc' | 'name_asc';
  page?: number;
  pageSize?: number;
};
