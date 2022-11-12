import {
  FETCH_PROMOS,
  FETCH_PROMOS_SUCCESS,
  FETCH_PROMOS_FAILED,
  EDIT_PROMOS
} from "../store/types";

export const fetchPromos = () => (dispatch) => (firebase) => {

  const {
    promoRef
  } = firebase;

  dispatch({
    type: FETCH_PROMOS,
    payload: null
  });
  promoRef.on("value", snapshot => {
    if (snapshot.val()) {
      const data = snapshot.val();
      const arr = Object.keys(data).map(i => {
        data[i].id = i;
        return data[i]
      });
      dispatch({
        type: FETCH_PROMOS_SUCCESS,
        payload: arr
      });
    } else {
      dispatch({
        type: FETCH_PROMOS_FAILED,
        payload: "No promos available."
      });
    }
  });
};

export const editPromo = (promo, method) => (dispatch) => (firebase) => {
  const {
    promoRef, 
    promoEditRef
  } = firebase;
  dispatch({
    type: EDIT_PROMOS,
    payload: { method, promo }
  });
  if (method === 'Add') {
    promoRef.push(promo);
  } else if (method === 'Delete') {
    promoEditRef(promo.id).remove();
  } else {
    promoEditRef(promo.id).set(promo);
  }
}