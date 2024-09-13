import React, {useEffect, useState, useCallback} from 'react';
import axios from 'axios';

import './App.css';

import List from './Components/List/List';
import Navbar from './Components/Navbar/Navbar';

function App() {
  const statusList = ['In progress', 'Backlog', 'Todo', 'Done', 'Cancelled']
  const userList = ['Anoop sharma', 'Yogesh', 'Shankar Kumar', 'Ramesh', 'Suresh']
  const priorityList = [{name:'No priority', priority: 0},
     {name:'Urgent', priority: 4},
      {name:'High', priority: 3}, 
      {name:'Medium', priority: 2},
       {name:'Low', priority: 1}]

  const [groupValue, setgroupValue] = useState(getStateFromLocalStorage() || 'status')
  const [orderValue, setorderValue] = useState('title')
  const [ticketDetails, setticketDetails] = useState([]);


  const orderDataByValue = useCallback(async (cardsArry) => {
    // Sorting by priority descending
    if (orderValue === 'priority') {
      cardsArry.sort((a, b) => b.priority - a.priority);
    } 
    // Sorting by title alphabetically
    else if (orderValue === 'title') {
      cardsArry.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
    }
  

    setticketDetails(cardsArry);
  }, [orderValue, setticketDetails]);
  

  function saveStateToLocalStorage(state) {
    localStorage.setItem('groupValue', JSON.stringify(state));
  }
  
  function getStateFromLocalStorage() {
    return JSON.parse(localStorage.getItem('groupValue')) || null;
  }
  
  useEffect(() => {
    saveStateToLocalStorage(groupValue);
  
    const fetchData = async () => {
      try {
        const { data, status } = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
        if (status === 200) {
          const ticketArray = data.tickets.map(ticket => {
            const user = data.users.find(user => user.id === ticket.userId);
            return user ? { ...ticket, userObj: user } : null;
          }).filter(ticket => ticket !== null);
  
          setticketDetails(ticketArray);
          orderDataByValue(ticketArray);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [orderDataByValue, groupValue]);
  

  function handleGroupValue(value){
    setgroupValue(value);
  }

  function handleOrderValue(value){
    setorderValue(value);
  }
  
 return (
  <>
    <Navbar
      groupValue={groupValue}
      orderValue={orderValue}
      handleGroupValue={handleGroupValue}
      handleOrderValue={handleOrderValue}
    />
    <section className="board-info">
      <div className="board-list">
        {
          {
            'status': statusList.map(listItem => (
              <List
                key={listItem}
                groupValue='status'
                orderValue={orderValue}
                listTitle={listItem}
                listIcon=''
                statusList={statusList}
                ticketDetails={ticketDetails}
              />
            )),
            
            'user': userList.map(listItem => (
              <List
                key={listItem}
                groupValue='user'
                orderValue={orderValue}
                listTitle={listItem}
                listIcon=''
                userList={userList}
                ticketDetails={ticketDetails}
              />
            )),
            
            'priority': priorityList.map(listItem => (
              <List
                key={listItem.priority}
                groupValue='priority'
                orderValue={orderValue}
                listTitle={listItem.priority}
                listIcon=''
                priorityList={priorityList}
                ticketDetails={ticketDetails}
              />
            ))
          }[groupValue]
        }
      </div>
    </section>
  </>
);
}


export default App;
