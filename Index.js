import React, { useReducer, useContext } from 'react'
import DropDown from './DropDown'

export const _Selected = React.createContext()

const initialValue = ['Select...']
function reducer(selected, action) {
  switch (action.type) {
    case 'item':
      return action.payload
  }
}

export default function index() {
  const [selected, dispatch] = useReducer(reducer, initialValue)
  //const [selected, setSelected] = useState('Select..')
  return (
    <div>
      <_Selected.Provider value={{ selected: selected, dispatch: dispatch }}>
        <DropDown />
      </_Selected.Provider>
    </div>
  )
}
