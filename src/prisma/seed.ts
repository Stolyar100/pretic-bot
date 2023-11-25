import { PrismaClient, Employee } from '@prisma/client'

const prisma = new PrismaClient()

const testEmployee: Employee[] = [
  { fullName: 'Oleh', phone: null, tabNumber: '8000' },
  { fullName: '<Misha>', phone: null, tabNumber: '8001' },
]

const createManyEmployees = async (employees: Employee[]) =>
  prisma.employee.createMany({ data: employees })

const main = async () => {
  const createdEmployees = await createManyEmployees(testEmployee)
  const testUser = await prisma.user.create({
    data: { id: 480393445, employeeTabNumber: '8000' },
  })
  const users = await prisma.user.findMany()
  console.log(users)
}

void main().then(async () => {
  await prisma.$disconnect()
})
