export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Table {
  id: number;
  name: string;
  capacity: number;
}

export interface AddOnOption {
  id?: string;
  name: string;
  price: number;
}

export interface AddOn {
  id?: string;
  name: string;
  minSelect: number;
  maxSelect?: number;
  options: AddOnOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  addOns?: AddOn[];
}

export interface MenuCategory {
  id: string;
  name: string;
  image: string;
  items: MenuItem[];
}
