import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useAuth } from '@clerk/clerk-react'

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

  const { getToken } = useAuth()
  const [colorTheme, setColorTheme] = useState('dark')
  const url = 'https://task-master-ten-beta.vercel.app/api'
  const [tasks, setTasks] = useState([])


  const getAllTasks = async () => {
    const token = await getToken()
    if (!token) {
      return
    }
    try {
      const response = await axios.get(url + '/task/getAll', { headers: { token } })
      if (response.data.success) {
        setTasks(response.data.tasks)
        console.log(response.data.tasks)
      }
      else {
        console.log(response.data.message)
      }

    } catch (error) {
      console.log('Error : ', error)
    }
  }


  useEffect(() => {
    getAllTasks()
  }, [])

  const contextValue = {
    url,
    tasks,
    setTasks,
    colorTheme,
    setColorTheme,
    refreshTasks: () => { getAllTasks() }
  }

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider;
