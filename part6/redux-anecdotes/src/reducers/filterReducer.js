import { createSlice } from "@reduxjs/toolkit"

// const filterReducer = (state = 'ALL', action) => {
//     switch (action.type) {
//         case 'SET_FILTER':
//           return action.filter
//         default:
//           return state
//       }
//   }
  
//   export const filterChange = filter => {
//     return {
//       type: 'SET_FILTER',
//       filter,
//     }
//   }

  /*************************************************************/
  const initialState = 'ALL'
  
  const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
      filterReducer(state, action) {
        return action.payload
      }
    }
  })

  export const { filterReducer } = filterSlice.actions
  export default filterSlice.reducer