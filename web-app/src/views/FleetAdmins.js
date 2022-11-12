import React,{ useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { 
  features ,
  dateStyle,
  language
} from 'config';
import { FirebaseContext } from 'common';

export default function Users() {
  const { api } = useContext(FirebaseContext);
  const {
    addUser,
    editUser, 
    deleteUser,
    checkUserExists
  } = api;
  const [data, setData] = useState([]);
  const usersdata = useSelector(state => state.usersdata);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(usersdata.users){
        setData(usersdata.users.filter(user => user.usertype ==='fleetadmin'));
    }else{
      setData([]);
    }
  },[usersdata.users]);

  const columns = [
    { title: language.createdAt, field: 'createdAt', editable:'never', defaultSort:'desc',render: rowData => rowData.createdAt?new Date(rowData.createdAt).toLocaleString(dateStyle):null},
    { title: language.first_name, field: 'firstName', initialEditValue: '' },
    { title: language.last_name, field: 'lastName', initialEditValue: '' },
    { title: language.email, field: 'email', editable:'onAdd',render: rowData => features.AllowCriticalEditsAdmin ? rowData.email : "Hidden for Demo"},
    { title: language.mobile, field: 'mobile', editable:'onAdd',render: rowData => features.AllowCriticalEditsAdmin ? rowData.mobile : "Hidden for Demo"},
    { title: language.profile_image,  field: 'profile_image', render: rowData => rowData.profile_image?<img alt='Profile' src={rowData.profile_image} style={{width: 50,borderRadius:'50%'}}/>:null, editable:'never'},
    { title: language.account_approve,  field: 'approved', type:'boolean', initialEditValue: true }
  ];

  return (
    usersdata.loading? <CircularLoading/>:
    <MaterialTable
      title={language.fleetadmins}
      columns={columns}
      data={data}
      options={{
        exportButton: true,
        sorting: true,
      }}
      editable={{
        onRowAdd: newData =>
        new Promise((resolve,reject) => {
          setTimeout(() => {
            checkUserExists(newData).then((res) => {
              if (res.users && res.users.length > 0) {
                alert(language.user_exists);
                reject();
              }
              else if(res.error){
                alert(language.email_or_mobile_issue);
                reject();
              }
              else{
                newData['createdByAdmin'] = true;
                newData['usertype'] = 'fleetadmin';
                newData['createdAt'] = new Date().toISOString();
                newData['referralId'] = newData.firstName.toLowerCase() + Math.floor(1000 + Math.random() * 9000).toString();
                dispatch(addUser(newData));
                resolve();
              }
            });
          }, 600);
        }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(editUser(oldData.id,newData));
            }, 600);
          }),
        onRowDelete: oldData =>
          features.AllowCriticalEditsAdmin?
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(deleteUser(oldData.id));
            }, 600);
          })
          :
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              alert(language.demo_mode);
            }, 600);
          })
          , 
      }}
    />
  );
}
