import React, { useCallback } from 'react'

const CommonContext = React.createContext()
export const useCommonProvider = () => React.useContext(CommonContext)

const CommonProvider = ({ children }) => {
  const handleOnChange = useCallback((e, setState) => {
    setState(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  })
  
  return (
    <CommonContext.Provider value={{
      handleOnChange
    }}>
      {children}
    </CommonContext.Provider>
  )
}

export default CommonProvider