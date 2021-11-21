import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import styles from './drop.module.css'
import OutsideClickHandler from 'react-outside-click-handler'
import { _Selected } from './Index'

function setCountries(countries, action) {
  switch (action.type) {
    case 'data':
      return action.payload
  }
}

const initialState = false
function reducer(isActive, action) {
  switch (action.type) {
    case 'false':
      return false
    case 'true':
      return true
  }
}

function setInput(input, action) {
  switch (action.type) {
    case 'reset':
      return ''
    case 'input':
      return action.payload
  }
}

export default function dropDown() {
  const Select = useContext(_Selected)
  // const [selected, setSelected] = useState('Select....')
  //const [isActive, setIsActive] = useState(false) //loading
  const [countries, Dispatch] = useReducer(setCountries, '')
  const [isActive, dispatch] = useReducer(reducer, initialState)
  const [input, _dispatch] = useReducer(setInput, '')
  //const [input, setInput] = useState('') //search
  // const [countries, setCountries] = useState('')

  // const [filteredCountries, setFilteredCountries] = useState([])
  const inputRef = useRef()
  function focus() {
    inputRef.current.focus()
  }

  useEffect(() => {
    //if (input.length === 0) return
    const controller = new AbortController()
    const url = `https://jsonplaceholder.typicode.com/posts`
    const options = {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        search: input,
      }),
      signal: controller.signal,
    }
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data)
        Dispatch({ type: 'data', payload: data.data })
      })
      .catch((err) => {
        console.log(err)
      })
    return () => {
      controller.abort()
    }
  }, [input])
  // useEffect(() => {
  //   setFilteredCountries(countries.filter((country) => country.city_name.toLowerCase().includes(input.toLowerCase())))
  // }, [input, countries])

  useEffect(() => {
    if (isActive) focus()
  }, [isActive])
  return (
    <div className={styles.dropdown}>
      <OutsideClickHandler
        onOutsideClick={() => {
          dispatch({ type: 'false' })
        }}
      >
        {!isActive ? (
          <div className={styles.span}>
            <span
              onClick={() => {
                dispatch({ type: 'true' })
              }}
            >
              {Select.selected && Select.selected.length > 0 ? Select.selected : 'Select a value'}
            </span>
            <button
              className={styles.reset}
              onClick={(e) => {
                Select.dispatch({ type: 'reset' })
                _dispatch({ type: 'reset' })
              }}
            >
              Reset
            </button>
          </div>
        ) : (
          <div>
            <input
              className={styles.dropdown_input}
              value={input}
              type="text"
              ref={inputRef}
              placeholder="Select a value"
              onChange={(e) => {
                _dispatch({ type: 'input', payload: e.target.value })
              }}
            />
          </div>
        )}

        {isActive && input && input.length > 0 ? (
          <div className={styles.dropdown_content}>
            {countries.map((item, i) => {
              return (
                <div
                  key={i}
                  className={styles.dropdown_item}
                  onClick={(e) => {
                    dispatch({ type: 'false' })
                    Select.dispatch({ type: 'item', payload: [item.country_name, '_', item.city_code] })
                    //  setSelected([item.country, '-', item.region])
                  }}
                >
                  <div>
                    <div>
                      {' '}
                      {item.city_name}
                      <div className={styles.city_code}>{item.city_code}</div>
                      <div>
                        {item.airport_name}
                        <div className={styles.city_code}>{item.country_name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : isActive ? (
          <div className={styles.dropdown_div}>Please enter city</div>
        ) : (
          ''
        )}
      </OutsideClickHandler>
    </div>
  )
}
