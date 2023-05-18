import React, { useState, useEffect } from 'react';
import './keypad.css'

function Calculator() {
  const [name, setName] = useState('');
  const [calculation, setCalculation] = useState('');
  const [result, setResult] = useState('');
  const [data, setData] = useState([]);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);


  const handleClick = (event) => {
    if (event.target.name === "+/-") {
      // Toggle the sign of the current calculation
      if (calculation.charAt(0) === "-") {
        setCalculation(calculation.slice(1));
      } else {
        setCalculation("-" + calculation);
      }
    } else {
      setCalculation(calculation.concat(event.target.name));
    }
  }

  const handleClear = () => {
    setCalculation('');
    setResult('');
  }

  const handleEqual = () => {
    try {
      const calculatedResult = eval(calculation);
      setResult(calculatedResult.toString());
    } catch (error) {
      setResult('Error');
    }
  };


  const handleChange = (e) => {
    const { value } = e.target;
    setName(value);
  };


  useEffect(() => {
    fetchData();
  }, [data]);
  async function fetchData() {
    try {
      const response = await fetch('http://localhost:4000/api/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const responseData = await response.json();
      setData(responseData.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleEdit = (itemId) => {
    // Find the selected item based on the item ID
    const selectedItem = data.find((item) => item._id === itemId);
    if (selectedItem) {
      setName(selectedItem.name);
      setCalculation(selectedItem.calculation);
      setResult(selectedItem.result);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    handleEqual()

    try {
      const response = await fetch("http://localhost:4000/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, calculation, result }),
      });
      if (response.status) {
        alert("Data saved successfully!");
        setName('')
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      alert("An error occurred while saving data.");
    }
  }


  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/delete/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status) {
        // Remove the deleted item from the data array
        const updatedData = data.filter((item) => item.id !== itemId);
        setData(updatedData);
        alert("Data deleted successfully!");
      } else {
        alert("Failed to delete data.");
      }
    } catch (error) {
      alert("An error occurred while deleting data.");
    }
  };


  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((_id) => _id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };


  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allItemIds = data.map((item) => item._id);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
    }
  };


  return (
    <div className="calculator">
      <div className="calculator-content">
        <div id="heading">
          <h1>Calculator</h1>
        </div>
        <div className="result">
          <input id="keypad_input" type="text" value={calculation} readOnly />
        </div>
        <div className="keypad">
          <div className="row">
            <button className="button button-gray" onClick={handleClear}>AC</button>
            <button className="button button-gray" onClick={handleClick} name="+/-">+/-</button>
            <button className="button button-gray" onClick={handleClick} name="%">%</button>
            <button className="button operator" onClick={handleClick} name="/">/</button>
          </div>
          <div className="row">
            <button className="button digit" onClick={handleClick} name="7">7</button>
            <button className="button digit" onClick={handleClick} name="8">8</button>
            <button className="button digit" onClick={handleClick} name="9">9</button>
            <button className="button operator" onClick={handleClick} name="*">*</button>
          </div>
          <div className="row">
            <button className="button digit" onClick={handleClick} name="4">4</button>
            <button className="button digit" onClick={handleClick} name="5">5</button>
            <button className="button digit" onClick={handleClick} name="6">6</button>
            <button className="button operator" onClick={handleClick} name="-">-</button>
          </div>
          <div className="row">
            <button className="button digit" onClick={handleClick} name="1">1</button>
            <button className="button digit" onClick={handleClick} name="2">2</button>
            <button className="button digit" onClick={handleClick} name="3">3</button>
            <button className="button operator" onClick={handleClick} name="+">+</button>
          </div>
          <div className="row">
            <button className="button zero digit" onClick={handleClick} name="0">0</button>
            <button className="button digit" onClick={handleClick} name=".">.</button>
            <button className="button operator" onClick={handleEqual} name="=">=</button>
          </div>
        </div>

        <div className="calculation-wrapper">
          <div id="cal_heading">
            <h3>Calculation Name</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <input type="text" id="input" placeholder="Enter Name" name='name' value={name} onChange={handleChange}></input>
            <button id="input_button" type="submit" >Save</button>
          </form>
        </div>

      </div>

      <div className="calculations">
        <div>
          <h1>Your Calculations</h1>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
                <th>Name</th>
                <th>Calculation</th>
                <th>Result</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td>
                    <input type="checkbox" checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)} />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.calculation}</td>
                  <td>{item.result}</td>
                  <td>
                    {selectedItems.includes(item._id) ? (
                      <>
                        <button className="edit-btn" onClick={() => handleEdit(item._id)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                          Delete
                        </button>
                      </>
                    ) : null}
                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}


export default Calculator;





