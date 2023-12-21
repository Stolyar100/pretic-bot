import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const testEmployee: Prisma.EmployeeCreateInput[] = [
  { fullName: 'Oleh', tabNumber: '8000' },
  { fullName: 'Misha', tabNumber: '8001', isAdmin: true },
  { fullName: 'Serhiy', tabNumber: '8002', isAdmin: true },
]

const createManyEmployees = async (employees: Prisma.EmployeeCreateInput[]) =>
  prisma.employee.createMany({ data: employees })

const main = async () => {
  const createdEmployees = await createManyEmployees(testEmployee)

  console.log(createdEmployees)
}

void main().then(async () => {
  await prisma.$disconnect()
})
