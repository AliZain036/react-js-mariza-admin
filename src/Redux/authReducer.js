import { LOGIN, LOGOUT } from "./ActionTypes";

const initialState = {
    user: null,
    role: null
};

export const User = (state = initialState, action) => {

    switch (action.type) {

        case (LOGIN): {
            return ({
                ...state,
                user: action.payload.id,
                role: action.payload.role
            })
        }

        case (LOGOUT): {
            return ({
                ...state,
                user: null,
                role: null
                
            })
        }

        default: {
            return state;
        }
    }
};