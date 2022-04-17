import { Types } from '../constants/actionTypes';

const initialState = {
  profile: {
    access_token: '',
    token_type: '',
    id: '',
    name: '',
    email: '',
    phone: ''
  },
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.LOGIN:
      return {
        ...state,
        profile: action.payload.user,
        formSubmitted: false
      }
    case Types.REGISTER:
      return {
        ...state,
        profile: action.payload.user,
        formSubmitted: false
      }
    default:
      return state;
  }
}

export default reducer;