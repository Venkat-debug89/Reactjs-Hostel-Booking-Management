import { createContext, useMemo, useState } from 'react'
import { initialData } from '../data/initialData'
import { getData, setData } from '../utils/storage'
import { isActiveBooking } from '../utils/helpers'

export const HostelContext = createContext(null)
const keys = ['users', 'rooms', 'bookings', 'fees', 'complaints', 'notifications']
const loadInitialData = () => Object.fromEntries(keys.map((key) => {
  const stored = getData(key)
  if (stored !== null) return [key, stored]
  const value = initialData[key] ?? []
  setData(key, value)
  return [key, value]
}))

export function HostelProvider({ children }) {
  const [data, setState] = useState(loadInitialData)
  const change = (key, next) => setState((current) => {
    const value = typeof next === 'function' ? next(current[key]) : next
    setData(key, value)
    return { ...current, [key]: value }
  })
  const updateRoom = (id, patch) => change('rooms', (items) => items.map((room) => room.id === id ? { ...room, ...patch } : room))
  const value = useMemo(() => ({
    ...data,
    addUser: (user) => change('users', (items) => [...items, user]),
    updateUser: (id, patch) => change('users', (items) => items.map((user) => user.id === id ? { ...user, ...patch } : user)),
    addRoom: (room) => change('rooms', (items) => [...items, { ...room, id: `room-${crypto.randomUUID()}`, occupied: 0 }]),
    updateRoom,
    deleteRoom: (id) => change('rooms', (items) => items.filter((room) => room.id !== id)),
    addBooking: (booking) => {
      const current = data.bookings
      if (current.some((item) => item.userId === booking.userId && isActiveBooking(item.status))) throw new Error('You already have an active booking.')
      const room = data.rooms.find((item) => item.id === booking.roomId)
      if (!room || room.occupied >= room.capacity) throw new Error('This room has no available beds.')
      updateRoom(room.id, { occupied: room.occupied + 1 })
      const saved = { ...booking, id: `BK-${Date.now()}`, status: 'Pending', bookingDate: new Date().toISOString().slice(0, 10) }
      change('bookings', (items) => [saved, ...items])
      return saved
    },
    updateBooking: (id, status) => {
      const booking = data.bookings.find((item) => item.id === id)
      if (booking && status === 'Approved' && booking.status !== 'Approved') {
        const room = data.rooms.find((item) => item.id === booking.roomId)
        if (room && !data.fees.some((fee) => fee.bookingId === booking.id)) {
          change('fees', (items) => [{
            id: `FEE-${Date.now()}-${booking.id}`,
            bookingId: booking.id,
            userId: booking.userId,
            type: 'Hostel Rent',
            amount: room.fee,
            dueDate: booking.checkInDate || new Date().toISOString().slice(0, 10),
            status: 'Pending',
            paidDate: null,
          }, ...items])
        }
      }
      if (booking && isActiveBooking(booking.status) && !isActiveBooking(status)) {
        const room = data.rooms.find((item) => item.id === booking.roomId)
        if (room) updateRoom(room.id, { occupied: Math.max(0, room.occupied - 1) })
      }
      change('bookings', (items) => items.map((item) => item.id === id ? { ...item, status } : item))
    },
    cancelBooking: (id) => value.updateBooking(id, 'Cancelled'),
    addComplaint: (complaint) => change('complaints', (items) => [{ ...complaint, id: `CMP-${Date.now()}`, date: new Date().toISOString().slice(0, 10), status: 'Pending' }, ...items]),
    updateComplaint: (id, status) => change('complaints', (items) => items.map((item) => item.id === id ? { ...item, status } : item)),
    updateFee: (id, patch) => change('fees', (items) => items.map((item) => item.id === id ? { ...item, ...(typeof patch === 'string' ? { status: patch, paidDate: patch === 'Paid' ? new Date().toISOString().slice(0, 10) : item.paidDate } : patch) } : item)),
    deleteFee: (id) => change('fees', (items) => items.filter((item) => item.id !== id)),
    addFee: (fee) => change('fees', (items) => [...items, { ...fee, id: `FEE-${Date.now()}` }]),
    sendNotification: (notification) => change('notifications', (items) => [{
      ...notification,
      id: `NTF-${Date.now()}`,
      sentAt: new Date().toISOString(),
      readBy: [],
    }, ...items]),
    markNotificationRead: (id, userId) => change('notifications', (items) => items.map((item) => (
      item.id === id && !item.readBy.includes(userId)
        ? { ...item, readBy: [...item.readBy, userId] }
        : item
    ))),
    markAllNotificationsRead: (userId) => change('notifications', (items) => items.map((item) => (
      item.readBy.includes(userId) ? item : { ...item, readBy: [...item.readBy, userId] }
    ))),
  }), [data])
  return <HostelContext.Provider value={value}>{children}</HostelContext.Provider>
}