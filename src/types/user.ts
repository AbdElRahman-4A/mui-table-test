export type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
  address: Address;
};

export type Address = {
  city: string;
  street_name: string;
  street_address: string;
  zip_code: string;
  state: string;
  country: string;
};
