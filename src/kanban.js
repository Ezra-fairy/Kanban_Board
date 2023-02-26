import React, { useState } from 'react';
// For this project, I use react-beautiful-dnd because it is popular in such task
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Here I add some tasks that are critical to get an interview
const tasks = [
    { id: 'taskOne', content: 'Review React'},
    { id: 'taskTwo', content: 'Send Resume'},
    { id: 'taskThree', content: 'Implement Demo'},
    { id: 'taskFour', content: 'Send Cover Letter'},
]

//Here are columns that we need
const initialData = {
    'toDo':{
        name: 'To Do Tasks',
        items: []
    },
    'inProgress':{
        name: 'In Progress Tasks',
        items: []
    },
    'finished':{
        name: 'Finished Tasks',
        items: tasks
    },
};

// This is the function including the main logic for dragging and dropping
const onDragEnd = (result, columns, setColumns) => {
    // get the source and destination of this dragging operation
    const { source, destination} = result;

    // If dropping to blank space, we just ignore
    if(!destination) return;

    // Else if the user drags the task into another column, we remove it from the orginal one and add it to the target column
    else if(source.droppableId !== destination.droppableId){
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems
            },
            [destination.droppableId]: {
                ...destColumn,
                items: destItems
            }
        });
    }

    // Else if the user drags the task into the same column, we adjust the order of tasks in that column
    else{
        const column = columns[source.droppableId];
        const [removed] = column.items.splice(source.index, 1);
        column.items.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...column,
                items: column.items
            }
        });
    }
};

// JSX Component for kanban board
function KanbanBoard() {
    const [columns, setColumns] = useState(initialData);
    return (
      <div className = "kanban" style={{ display: "flex", justifyContent: "space-evenly", height: "100%" }}>
        <DragDropContext
          onDragEnd={result => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
                key={columnId}
              >
                <h1>{column.name}</h1>
                <div>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "skyblue "
                              : "grey",
                            padding: 10,
                            width: 300,
                            minHeight: 450
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        padding: 16,
                                        margin: "0 0 10px 0",
                                        minHeight: "50px",
                                        lineHeight:"50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "pink"
                                          : "deeppink ",
                                        color: "white",
                                        ...provided.draggableProps.style
                                      }}
                                    >
                                      {item.content}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    );
};
export default KanbanBoard;