export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'whole-spice' | 'powder-spice';
  price: number;
  views: number;
  images: string[];
  weight: string;
  benefits: string[];
  usage: string;
  isActive: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
}

export interface Analytics {
  totalUsersVisited: number;
  newUsers: number;
  websiteTraffic: number;
  categoryStats: {
    wholeSvice: number;
    powderSpice: number;
  };
  trendingProducts: Array<{
    id: string;
    name: string;
    views: number;
  }>;
}
