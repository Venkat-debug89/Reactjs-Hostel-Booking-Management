import { useContext } from 'react'
import { HostelContext } from '../context/HostelContext'

export const useHostel = () => useContext(HostelContext)