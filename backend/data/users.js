import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true
  },
  {
    name: 'Fernando Mancevich',
    email: 'fmancevich@mainit.com.ar',
    password: bcrypt.hashSync('mega08ne', 10),
    isAdmin: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10)
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10)
  },
  {
    name: "Leila Andrea Mancevich",
    email: "leimancevich@gmail.com",
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false
  },
  {
    name: "Rosana Andrea Martínez",
    email: "rosmartinez@gmail.com",
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false
  },
  {
    name: "Hernán Sixto Ojeda",
    email: "hernan.ojeda@gmail.com.py",
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false
  }
]

export default users
