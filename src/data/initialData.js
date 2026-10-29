const today = new Date()
const dateOffset = (days) => new Date(today.getTime() + days * 86400000).toISOString().slice(0, 10)

const students = [
  { id: 'STU-2401', name: 'Aarav Sharma', email: 'student@gmail.com', password: 'student123', role: 'student', phone: '+91 98765 43210', course: 'Computer Science', year: '2nd Year', hostel: 'A Block' },
  { id: 'STU-2402', name: 'Diya Patel', email: 'diya.patel@campus.edu', password: 'student123', role: 'student', phone: '+91 98765 43211', course: 'Mechanical Engineering', year: '3rd Year', hostel: 'B Block' },
  { id: 'STU-2403', name: 'Ishaan Reddy', email: 'ishaan.reddy@campus.edu', password: 'student123', role: 'student', phone: '+91 98765 43212', course: 'Electrical Engineering', year: '1st Year', hostel: 'C Block' },
  { id: 'STU-2404', name: 'Ananya Iyer', email: 'ananya.iyer@campus.edu', password: 'student123', role: 'student', phone: '+91 98765 43213', course: 'Business Administration', year: '2nd Year', hostel: 'A Block' },
  { id: 'STU-2405', name: 'Kabir Singh', email: 'kabir.singh@campus.edu', password: 'student123', role: 'student', phone: '+91 98765 43214', course: 'Civil Engineering', year: '4th Year', hostel: 'D Block' },
  { id: 'STU-2406', name: 'Meera Nair', email: 'meera.nair@campus.edu', password: 'student123', role: 'student', phone: '+91 98765 43215', course: 'Computer Science', year: '3rd Year', hostel: 'B Block' },
  { id: 'STU-2407', name: 'Arjun Verma', email: 'arjun.verma@campus.edu', password: 'student123', role: 'student', phone: '+91 98765 43216', course: 'Data Science', year: '1st Year', hostel: 'C Block' },
  { id: 'STU-2408', name: 'Sara Khan', email: 'sara.khan@campus.edu', password: 'student123', role: 'student', phone: '+91 98765 43217', course: 'Psychology', year: '2nd Year', hostel: 'D Block' },
  { id: 'STU-2409', name: 'Rohan Das', email: 'rohan.das@campus.edu', password: 'student123', role: 'student', phone: '+91 98765 43218', course: 'Commerce', year: '3rd Year', hostel: 'A Block' },
  { id: 'STU-2410', name: 'Priya Joshi', email: 'priya.joshi@campus.edu', password: 'student123', role: 'student', phone: '+91 98765 43219', course: 'Biotechnology', year: '4th Year', hostel: 'B Block' },
]

export const initialData = {
  users: [
    ...students,
    { id: 'ADM-001', name: 'Hostel Administrator', email: 'admin@hostelhub.com', password: 'admin123', role: 'admin', phone: '+91 90000 00000' },
  ],
  rooms: Array.from({ length: 20 }, (_, index) => {
    const blocks = ['A Block', 'B Block', 'C Block', 'D Block']
    const block = blocks[Math.floor(index / 5)]
    const number = `${String.fromCharCode(65 + Math.floor(index / 5))}-${Math.floor(index / 5 + 1)}${String(index % 5 + 1).padStart(2, '0')}`
    const capacity = [1, 2, 3, 4][index % 4]
    const occupied = [0, 1, capacity - 1, capacity][index % 4]
    return {
      id: `room-${index + 1}`, number, hostel: block, floor: Math.floor(index % 5 / 2) + 1,
      type: ['Single', 'Double', 'Triple', 'Four Sharing'][capacity - 1], capacity, occupied,
      fee: 6500 + capacity * 1250, facilities: ['WiFi', 'Bed', 'Study Table', 'Chair', 'Cupboard', 'Fan', ...(index % 3 ? [] : ['Attached Bathroom'])],
      description: 'Bright, well-maintained accommodation with study-friendly lighting and secure access.',
    }
  }),
  bookings: Array.from({ length: 10 }, (_, index) => ({
    id: `BK-2026-${String(index + 101).padStart(4, '0')}`, userId: students[index].id, roomId: `room-${index + 1}`,
    bookingDate: dateOffset(-12 + index), checkInDate: dateOffset(8 + index), status: ['Approved', 'Pending', 'Approved', 'Pending', 'Rejected'][index % 5],
  })),
  fees: Array.from({ length: 20 }, (_, index) => ({
    id: `FEE-${String(index + 501).padStart(4, '0')}`, userId: students[index % students.length].id,
    type: ['Hostel Rent', 'Mess Fee', 'Maintenance Fee', 'Electricity Fee'][index % 4], amount: [9000, 3200, 750, 480][index % 4],
    dueDate: dateOffset(index % 5 === 0 ? -12 : 12 + index), status: ['Paid', 'Pending', 'Overdue', 'Pending'][index % 4], paidDate: index % 4 === 0 ? dateOffset(-5) : null,
  })),
  complaints: Array.from({ length: 10 }, (_, index) => ({
    id: `CMP-2026-${String(index + 201).padStart(4, '0')}`, userId: students[index].id,
    category: ['WiFi', 'Water', 'Cleaning', 'Electricity', 'Maintenance'][index % 5], subject: ['WiFi signal is weak', 'Bathroom tap needs repair', 'Common area cleaning', 'Desk light not working', 'Wardrobe hinge is loose'][index % 5],
    description: 'Please review this issue when the maintenance team is available.', priority: ['Medium', 'High', 'Low'][index % 3], date: dateOffset(-index - 1), status: ['Pending', 'In Progress', 'Resolved'][index % 3],
  })),
}