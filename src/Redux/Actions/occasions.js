import { GET_OCCASIONS } from '../ActionTypes'
import { firebase } from '../../Firebase/config'
import { message } from 'antd'

export const fetchOccasions = () => async (dispatch) => {
  let arr = []
  await firebase
    .firestore()
    .collection('occasions')
    .get()
    .then((allDocs) => {
      allDocs.forEach((doc) => {
        let obj = doc.data()
        obj.id = doc.id
        arr.push(obj)
      })
      dispatch({
        type: GET_OCCASIONS,
        payload: arr,
      })
    })
    .catch((e) => console.log(e))
}

export const addColors = (val) => async (dispatch) => {
  const values = {
    name: val,
  }
  const stats = {
    liked: 0,
    shared: 0,
    saved: 0,
    won: 0,
    clicked: 0,
  }
  values.stats = stats // setting default values to each product
  await firebase
    .firestore()
    .collection('colors')
    .add(values)
    .then(async () => {
      message.success('Color Created!')
      await dispatch(fetchOccasions())
      return 200
    })
    .catch((error) => {
      console.log(error)
      message.error('Error Creating Occasion!')
    })
}
