import './App.css';
import React from 'react';

function App() {
  const [list, setList] = React.useState([]);

  const [undoStack, setUndoStack] = React.useState([]);
  const [redoStack, setRedoStack] = React.useState([]);

  const [newTodo, setNewTodo] = React.useState('');
  const [removeTodo, setRemoveTodo] = React.useState('');

  // React.useEffect(() => {
  //   console.log(`${JSON.stringify(undoStack)}`);
  //   console.log(`${JSON.stringify(redoStack)}`);
  // })

  function pushInUndoStack(element) {
    let arr = undoStack;
    arr.push(element);
    setUndoStack(arr);
  }

  function popFromUndoStack() {
    if (undoStack.length == 0)
      return false;
    let arr = undoStack;
    const poppedTriad = arr.pop();
    setUndoStack(arr);
    return poppedTriad;
  }

  function pushInRedoStack(element) {
    let arr = redoStack;
    arr.push(element);
    setRedoStack(arr);
  }

  function popFromRedoStack() {
    if (redoStack.length == 0)
      return false;
    let arr = redoStack;
    const poppedTriad = arr.pop();
    setRedoStack(arr);
    return poppedTriad;
  }

  function undo() {
    let top = popFromUndoStack();
    if (top.operation == "add") {
      top.operation = "rem";
      pushInRedoStack(top);
      remove(top.element, top.index, "implicit");
    } else {
      top.operation = "add";
      pushInRedoStack(top);
      add(top.element, top.index, "implicit");
    }
  }

  function redo() {
    let top = popFromRedoStack();
    if (top.operation == "add") {
      top.operation = "rem";
      pushInUndoStack(top);
      remove(top.element, top.index, "implicit");
    } else {
      top.operation = "add";
      pushInUndoStack(top);
      add(top.element, top.index, "implicit");
    }
  }

  function searchArray(element) {
    return list.indexOf(element);
  }

  function add(ele, index, calledFrom = "explicit") {
    let arr = list;
    if (list.length == 0) {
      arr.push(ele);
      setList(arr);
      let ObjTriad = {
        element: ele,
        index: index,
        operation: "add"
      }
      pushInUndoStack(ObjTriad);
      return;
    }
    let a1 = arr.slice(0, index);
    let a2 = arr.slice(index, arr.length);
    a1.push(ele);
    setList(a1.concat(a2));

    let ObjTriad = {
      element: ele,
      index: index,
      operation: "add"
    }
    if (calledFrom == "explicit")
      pushInUndoStack(ObjTriad);
  }

  function remove(ele, index, calledFrom = "explicit") {
    let arr = list;
    let a1 = arr.slice(0, index);
    let a2 = arr.slice(index + 1, arr.length);
    setList(a1.concat(a2));

    let ObjTriad = {
      element: ele,
      index: index,
      operation: "rem"
    }
    if (calledFrom == "explicit")
      pushInUndoStack(ObjTriad);
  }

  const handleAddClick = () => {
    add(newTodo, list.length);
    setNewTodo('');
  }

  const handleRemoveClick = () => {
    if (list.length == 0)
      return;
    const index = searchArray(removeTodo);
    if (index == -1)
      return;
    remove(removeTodo, index);
    setRemoveTodo('');
  }

  return (
    <div style={{
      position: 'absolute', left: '50%', top: '25%',
      transform: 'translate(-50%, -50%)'
    }} >
      <div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: 50, marginBottom: 40 }} >
          <b>TODO List with undo/redo</b>
        </div>
        <div style={{ display: "flex", flexDirection: "row-reverse", marginTop: -20, marginBottom: 40 }} >
          <b>By Siddharth Koli</b>
        </div>
      </div>
      <div style={{ paddingBottom: 15 }} >
        <label>Enter element to be added: </label>
        <input style={{ height: 30, width: 200, marginLeft: 15 }} onChange={e => setNewTodo(e.target.value)} value={newTodo} />
      </div>
      <div style={{ paddingTop: 25 }}>
        <label>Enter element to be removed: </label>
        <input style={{ height: 30, width: 200 }} onChange={e => setRemoveTodo(e.target.value)} value={removeTodo} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", paddingTop: 25 }} >
        <button style={{ height: 50, width: 70, fontSize: 20, backgroundColor: "#61d467" }} onClick={handleAddClick}>Add</button>
        <button style={{ height: 50, width: 90, fontSize: 20, backgroundColor: "#d11b46" }} onClick={handleRemoveClick} >Remove</button>
        <button style={{ height: 50, width: 70, fontSize: 20, backgroundColor: "#e1ed58" }} onClick={undo}>Undo</button>
        <button style={{ height: 50, width: 70, fontSize: 20, backgroundColor: "#54ace3" }} onClick={redo}>Redo</button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }} >
        {list.map((val, i) => (
          <>
          <p key={i} >{val}<br/></p>
          
          </>
        ))}
      </div>
    </div>
  );
}

export default App;
