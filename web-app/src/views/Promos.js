import React, { useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import {
  features,
  dateStyle,
  language
} from 'config';
import { FirebaseContext } from 'common';

export default function Promos() {
  const { api } = useContext(FirebaseContext);
  const {
    editPromo
  } = api;

  const columns = [
    { title: language.promo_name, field: 'promo_name' },
    { title: language.description, field: 'promo_description' },
    {
      title: language.title,
      field: 'promo_discount_type',
      lookup: { flat: language.flat, percentage: language.percentage },
    },
    { title: language.promo_discount_value, field: 'promo_discount_value', type: 'numeric' },
    { title: language.max_limit, field: 'max_promo_discount_value', type: 'numeric' },
    { title: language.min_limit, field: 'min_order', type: 'numeric' },
    { title: language.end_date, field: 'promo_validity', render: rowData => rowData.promo_validity ? new Date(rowData.promo_validity).toLocaleDateString(dateStyle) : null },
    { title: language.promo_usage, field: 'promo_usage_limit', type: 'numeric' },
    { title: language.promo_used_by, field: 'user_avail', editable: 'never' }
  ];

  const [data, setData] = useState([]);
  const promodata = useSelector(state => state.promodata);
  const dispatch = useDispatch();

  useEffect(() => {
    if (promodata.promos) {
      setData(promodata.promos);
    } else {
      setData([]);
    }
  }, [promodata.promos]);

  return (
    promodata.loading ? <CircularLoading /> :
      <MaterialTable
        title={language.promo_offer}
        columns={columns}
        data={data}
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                  newData['createdAt'] = new Date().toISOString();
                  dispatch(editPromo(newData,"Add"));
                  resolve();
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            features.AllowCriticalEditsAdmin?
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                dispatch(editPromo(newData,"Update"));
              }, 600);
            })
            :
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                alert(language.demo_mode);
              }, 600);
            }),
          onRowDelete: oldData =>
            features.AllowCriticalEditsAdmin?
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                dispatch(editPromo(oldData,"Delete"));
              }, 600);
            })
            :
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                alert(language.demo_mode);
              }, 600);
            })
        }}
      />
  );
}

