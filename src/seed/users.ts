import bcrypt from "bcrypt";

const users: {
  name: string;
  email: string;
  password: string;
  verified: boolean;
}[] = [
  {
    name: "John Doe",
    email: "john@email.com",
    password: bcrypt.hashSync("123456", 10),
    verified: true,
  },
];

export default users;
